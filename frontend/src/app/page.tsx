import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="Luxury Hotel at Twilight" 
            layout="fill" 
            objectFit="cover" 
            priority
            className="opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <p className="text-gold-400 font-serif tracking-[0.2em] text-sm uppercase mb-4 text-[#D4AF37]">Welcome to Lumina</p>
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight drop-shadow-xl">
            Where Tranquility <br/> Meets Luxury
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            Indulge in a world-class experience at our beachfront resort. Discover perfectly harmonized elegance and exceptional service.
          </p>
          
          {/* Booking Widget */}
          <div className="glass-card p-4 md:p-6 rounded-3xl mx-auto max-w-5xl animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
              <div className="flex flex-col flex-1 pl-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Check-in</span>
                <input type="date" className="bg-transparent border-none text-slate-200 outline-none w-full" />
              </div>
              <div className="hidden md:block w-px h-12 bg-slate-800"></div>
              <div className="flex flex-col flex-1 pl-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Check-out</span>
                <input type="date" className="bg-transparent border-none text-slate-200 outline-none w-full" />
              </div>
              <div className="hidden md:block w-px h-12 bg-slate-800"></div>
              <div className="flex flex-col flex-1 pl-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">Guests</span>
                <select className="bg-transparent border-none text-slate-200 outline-none w-full appearance-none">
                  <option className="bg-slate-900">1 Adult, 0 Children</option>
                  <option className="bg-slate-900">2 Adults, 0 Children</option>
                  <option className="bg-slate-900">2 Adults, 1 Child</option>
                  <option className="bg-slate-900">2 Adults, 2 Children</option>
                </select>
              </div>
              <button className="bg-[#D4AF37] hover:bg-[#B5952F] text-slate-950 px-8 py-4 rounded-xl font-bold w-full md:w-auto transition-all">
                Check Availability
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites */}
      <section id="rooms" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">Our Signature Suites</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Experience comfort beyond imagination with our carefully curated rooms designed for relaxation and sophistication.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Suite Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-gold-500/10 h-[500px]">
              <div className="absolute inset-0">
                <Image src="/room-1.png" alt="Oceanfront Deluxe" layout="fill" objectFit="cover" className="transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform transition-transform group-hover:-translate-y-2">
                <h3 className="text-2xl font-serif mb-2">Oceanfront Deluxe</h3>
                <div className="flex gap-4 text-sm text-slate-400 mb-4">
                  <span>King Bed</span>
                  <span>•</span>
                  <span>45 m²</span>
                  <span>•</span>
                  <span>Sea View</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg">From <span className="font-bold text-[#D4AF37]">$280</span> <span className="text-sm text-slate-500">/night</span></div>
                  <button className="text-slate-200 border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors">Details</button>
                </div>
              </div>
            </div>

             {/* Suite Card 2 */}
             <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-gold-500/10 h-[500px]">
              <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform transition-transform group-hover:-translate-y-2">
                <h3 className="text-2xl font-serif mb-2">Premium Suite</h3>
                <div className="flex gap-4 text-sm text-slate-400 mb-4">
                  <span>Super King Bed</span>
                  <span>•</span>
                  <span>65 m²</span>
                  <span>•</span>
                  <span>Balcony</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg">From <span className="font-bold text-[#D4AF37]">$450</span> <span className="text-sm text-slate-500">/night</span></div>
                  <button className="text-slate-200 border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors">Details</button>
                </div>
              </div>
            </div>

             {/* Suite Card 3 */}
             <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-gold-500/10 h-[500px]">
              <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform transition-transform group-hover:-translate-y-2">
                <h3 className="text-2xl font-serif mb-2">Presidential Villa</h3>
                <div className="flex gap-4 text-sm text-slate-400 mb-4">
                  <span>2 Bedrooms</span>
                  <span>•</span>
                  <span>120 m²</span>
                  <span>•</span>
                  <span>Private Pool</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg">From <span className="font-bold text-[#D4AF37]">$1,200</span> <span className="text-sm text-slate-500">/night</span></div>
                  <button className="text-slate-200 border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors">Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
