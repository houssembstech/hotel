import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Room from '../models/Room';
import Booking from '../models/Booking';
import Folio from '../models/Folio';
import ShiftSession from '../models/ShiftSession';
import LogbookEntry from '../models/LogbookEntry';
import User from '../models/User';

const router = Router();

// ========================
// Main Courante (Logbook)
// ========================
router.get('/logbook', async (req, res): Promise<any> => {
  try {
    const logs = await LogbookEntry.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logbook', async (req, res): Promise<any> => {
  try {
    const entry = await LogbookEntry.create(req.body);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/logbook/:id/resolve', async (req, res): Promise<any> => {
  try {
    const entry = await LogbookEntry.findByIdAndUpdate(
       req.params.id, 
       { isResolved: true, resolvedBy: req.body.agentName },
       { new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create shift session if needed for testing (since they are generated on agent login usually)
router.post('/shift', async (req, res): Promise<any> => {
  try {
    const shift = await ShiftSession.create(req.body);
    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: 'Failed to open shift' });
  }
});

router.get('/shift', async (req, res): Promise<any> => {
  try {
    const query: any = req.query.all ? {} : { status: 'OPEN' };
    const shifts = await ShiftSession.find(query).sort({ startTime: -1 });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});

router.put('/shift/:id/close', async (req, res): Promise<any> => {
  try {
    const { actualCashCount, signature } = req.body;
    const closedShift = await ShiftSession.findByIdAndUpdate(
      req.params.id,
      {
        status: 'CLOSED',
        endTime: new Date(),
        actualCashCount,
        closingSignature: signature
      },
      { new: true }
    );
    res.json(closedShift);
  } catch (err) {
    res.status(500).json({ error: 'Failed to close shift' });
  }
});

// Bookings
router.get('/bookings', async (req, res): Promise<any> => {
  try {
    const bookings = await Booking.find().populate('roomId').sort({ checkInDate: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

// Locking Mechanism
router.post('/rooms/:id/lock', async (req, res): Promise<any> => {
  try {
    const { agentName } = req.body;
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 mins lock
    
    // Find room which is AVAILABLE and (lock is null OR lock expired)
    const room = await Room.findOneAndUpdate(
      { 
        _id: req.params.id,
        $or: [
            { "currentLock.expiresAt": null },
            { "currentLock.expiresAt": { $lt: new Date() } }
        ]
      },
      {
        $set: { currentLock: { agentName, expiresAt } }
      },
      { new: true }
    );
    
    if (!room) {
      return res.status(409).json({ error: 'Chambre occupée ou déjà verrouillée par un agent.' });
    }
    
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Unlocking Mechanism
router.delete('/rooms/:id/unlock', async (req, res): Promise<any> => {
  try {
    await Room.findByIdAndUpdate(req.params.id, {
      $set: { "currentLock.agentName": null, "currentLock.expiresAt": null }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Check-in Route
router.post('/check-in', async (req, res): Promise<any> => {
  try {
    const { bookingId, roomId, guestData, stayDetails, payment } = req.body;
    const agentName = payment.agentName || 'System';

    // 1. Assign room atomically
    const room = await Room.findOneAndUpdate(
      {
         _id: roomId,
         status: { $in: ['AVAILABLE', 'CLEANING_NEEDED'] } // Assuming front-desk can override cleaning for early-checkin etc. we allow both for now, but usually it should be AVAILABLE
      },
      {
        $set: {
          status: 'OCCUPIED',
          "currentLock.agentName": null,
          "currentLock.expiresAt": null
        }
      },
      { new: true }
    );

    if (!room) {
      return res.status(409).json({ error: "Conflit: La chambre n'est plus disponible." });
    }

    // 2. Create Booking (Walk-in standard logic since there's no pre-existing booking setup for this MVP route)
    // We update Booking model if necessary, or just create it.
    
    const checkInDate = new Date(stayDetails.checkInDate);
    checkInDate.setHours(15, 0, 0, 0);
    const checkOutDate = new Date(stayDetails.checkOutDate);
    checkOutDate.setHours(12, 0, 0, 0);
    
    // We don't have a structured Guest Model yet, so we just pass ObjectId if we have it, or null.
    // For simplicity of MVP without Guest collection setup, we modify Booking bypass.
    // Actually, Booking requires guestId. We will just mock an ObjectId if none exists.
    
    // Calculate nights 
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = (room.pricePerNight * nights).toFixed(2);

    let booking;
    if (bookingId) {
       booking = await Booking.findByIdAndUpdate(
         bookingId,
         {
           status: 'CHECKED_IN',
           assignedRoom: roomId,
         },
         { new: true }
       );
       
       if (!booking) {
         return res.status(404).json({ error: "Réservation introuvable." });
       }
    } else {
       // Création automatique du compte GUEST avec le numéro d'identité comme mot de passe (demandera changement au 1er login)
       const idNumber = guestData.identityNumber || `GUEST_${Math.floor(Math.random()*10000)}`;
       const passwordHash = await bcrypt.hash(idNumber, 10);
       
       const guestUser = await User.findOneAndUpdate(
         { idNumber },
         { 
            $setOnInsert: {
               name: guestData.fullName,
               email: guestData.email || `${idNumber.toLowerCase()}@lumina.guest`,
               role: 'GUEST',
               passwordHash,
               needsPasswordChange: true,
               phone: guestData.phone,
               identityDocumentUrl: guestData.identityDocumentUrl
            }
         },
         { upsert: true, new: true }
       );

       booking = await Booking.create({
         guestId: guestUser._id, // Real linked Guest ID
         roomId: room._id,
         checkInDate,
         checkOutDate,
         status: 'CHECKED_IN',
         totalPrice: Number(totalPrice),
         paymentStatus: payment.amountPaidNow > 0 ? 'PARTIAL' : 'UNPAID'
       });
    }

    // 3. Create Folio (Billing Account)
    const folio = await Folio.create({
      bookingId: booking._id,
      guestName: guestData.fullName,
      roomId: room._id,
      items: [
        {
          label: `Nuitées (${room.roomNumber})`,
          category: 'ROOM',
          amount: room.pricePerNight * nights,
          quantity: 1,
          date: new Date()
        }
      ],
      payments: payment.amountPaidNow > 0 ? [{
        amount: payment.amountPaidNow,
        method: payment.paymentMethod,
        agentName: agentName,
        shiftId: payment.shiftCashDrawerId,
        date: new Date()
      }] : []
    });

    // 4. Update Shift Session Cash Drawer if CASH
    if (payment.amountPaidNow > 0 && payment.paymentMethod === 'CASH' && payment.shiftCashDrawerId) {
      await ShiftSession.findByIdAndUpdate(
        payment.shiftCashDrawerId,
        { $inc: { currentCashTotal: payment.amountPaidNow } }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Check-in réussi pour la chambre ${room.roomNumber}`,
      booking,
      folio
    });

  } catch (error: any) {
    console.error("Erreur Check-In :", error);
    return res.status(500).json({ error: error.message || "Erreur serveur lors du check-in" });
  }
});

// Get Active Folio for an Occupied Room
router.get('/folios/room/:roomId', async (req, res): Promise<any> => {
  try {
    const folio = await Folio.findOne({ roomId: req.params.roomId, isClosed: false })
      .populate('roomId');
      
    if (!folio) {
      return res.status(404).json({ error: 'Aucun Folio actif trouvé pour cette chambre.' });
    }
    res.json(folio);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========================
// Resident Portal Data
// ========================
router.get('/my-stay', async (req, res): Promise<any> => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const booking: any = await Booking.findOne({ guestId: userId as string, status: 'CHECKED_IN' });
    if (!booking) {
      return res.status(404).json({ error: 'No active stay found' });
    }

    const folio: any = await Folio.findOne({ bookingId: booking._id });
    const room: any = await Room.findById(booking.roomId);

    res.json({
       booking,
       folio,
       room
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving stay data' });
  }
});

// Check-out Route
router.post('/check-out', async (req, res): Promise<any> => {
  try {
    const { folioId, payment } = req.body;
    const agentName = payment?.agentName || 'System';

    const folio = await Folio.findById(folioId);
    if (!folio) return res.status(404).json({ error: 'Folio introuvable' });

    if (folio.isClosed) return res.status(400).json({ error: 'Ce folio est déjà clôturé.' });

    // 1. Add final payment to folio
    if (payment && payment.amountPaidNow > 0) {
       folio.payments.push({
         amount: payment.amountPaidNow,
         method: payment.paymentMethod,
         agentName: agentName,
         shiftId: payment.shiftCashDrawerId,
         date: new Date()
       });
       
       // Update shift drawer if cash
       if (payment.paymentMethod === 'CASH' && payment.shiftCashDrawerId) {
         await ShiftSession.findByIdAndUpdate(
            payment.shiftCashDrawerId,
            { $inc: { currentCashTotal: payment.amountPaidNow } }
         );
       }
    }

    folio.isClosed = true;
    await folio.save();

    // 2. Change Room Status to CLEANING
    const room = await Room.findByIdAndUpdate(
       folio.roomId,
       { status: 'CLEANING_NEEDED' },
       { new: true }
    );

    // 3. Update Booking Status
    if (folio.bookingId) {
       await Booking.findByIdAndUpdate(
         folio.bookingId,
         { status: 'CHECKED_OUT', paymentStatus: 'PAID' }
       );
    }

    return res.status(200).json({ success: true, message: `Check-out validé. La chambre ${room?.roomNumber} doit être nettoyée.`, folio });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Erreur serveur lors du check-out" });
  }
});

export default router;
