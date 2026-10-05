import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Book your stay | Lumina Respite",
  description: "Reserve your luxury suite today.",
};

interface BookingPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  
  // Format dates securely
  const checkinStr = params.checkin || "";
  const checkoutStr = params.checkout || "";
  
  const checkinDate = checkinStr ? new Date(checkinStr) : new Date();
  
  // Default to 1 night later if missing or invalid
  let checkoutDate = checkoutStr ? new Date(checkoutStr) : new Date(checkinDate.getTime() + 86400000);
  
  if (checkoutDate <= checkinDate) {
      checkoutDate = new Date(checkinDate.getTime() + 86400000); // force at least 1 night
  }

  const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format for display (e.g. Sat, 20 Oct 2026)
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  const displayCheckin = checkinDate.toLocaleDateString('en-US', dateOptions);
  const displayCheckout = checkoutDate.toLocaleDateString('en-US', dateOptions);

  // Guests parser
  const guestsRaw = params.guests || "2"; // default 2
  let guestText = "2 Adults";
  if (guestsRaw === "1") guestText = "1 Adult";
  else if (guestsRaw === "2") guestText = "2 Adults";
  else if (guestsRaw === "2_1") guestText = "2 Adults, 1 Child";
  else if (guestsRaw === "2_2") guestText = "2 Adults, 2 Children";

  // Calculate prices
  const roomRate = 280; // Hardcoded Oceanfront Deluxe rate for now
  const roomTotal = nights * roomRate;
  const taxes = roomTotal * 0.10; // 10% tax
  const finalTotal = roomTotal + taxes;

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Complete your Reservation</h1>
          <p className="text-slate-400">Please provide your details below to secure your experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2 glass-card p-8 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <h2 className="text-xl font-medium text-white mb-6 border-b border-slate-800 pb-4">Guest Information</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="john.doe@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Special Requests</label>
                <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Any specific needs or preferences..."></textarea>
              </div>

              <div className="pt-6">
                <button type="button" className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20">
                  Confirm & Pay Securely
                </button>
              </div>
            </form>
          </div>

          {/* Summary Section */}
          <div className="glass-card p-6 bg-slate-900 border border-slate-800 rounded-2xl h-fit sticky top-32">
            <h2 className="text-lg font-medium text-white mb-4 border-b border-slate-800 pb-2">Reservation Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-slate-400">Check-in</p>
                <p className="text-white font-medium">{displayCheckin}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Check-out</p>
                <p className="text-white font-medium">{displayCheckout}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Room</p>
                <p className="text-white font-medium">Oceanfront Deluxe</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Guests</p>
                <p className="text-white font-medium">{guestText}</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 mb-4">
              <div className="flex justify-between text-slate-300 mb-2">
                <span>{nights} {nights > 1 ? 'Nights' : 'Night'} (${roomRate})</span>
                <span>${roomTotal}</span>
              </div>
              <div className="flex justify-between text-slate-300 mb-2">
                <span>Taxes & Fees (10%)</span>
                <span>${Math.round(taxes)}</span>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xl">
              <span className="font-serif">Total</span>
              <span className="font-bold text-[#D4AF37]">${Math.round(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
