import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// POST /api/auth/register (Public for guests, Admin for staff)
router.post('/register', async (req, res): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user (force generic guest if public route, but let's allow role passing for now)
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'GUEST'
    });

    res.status(201).json({ message: 'User created effectively' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find user by email OR idNumber (since the field on frontend might be labeled identifiant or email)
    const user = await User.findOne({ 
      $or: [ { email: email }, { idNumber: email } ] 
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Identifiant invalide' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash as string);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // Generate JWT specific to the role
    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        needsPasswordChange: user.needsPasswordChange || false
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/auth/change-password (For first-time guest login)
router.post('/change-password', async (req, res): Promise<any> => {
   try {
      const { userId, newPassword } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      
      user.passwordHash = passwordHash;
      user.needsPasswordChange = false;
      await user.save();
      
      res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
   } catch (error) {
      res.status(500).json({ error: 'Server error during password update' });
   }
});

export default router;
