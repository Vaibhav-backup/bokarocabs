
import React, { useState } from 'react';
import { TripType, BookingState } from '../types';
import { ROUTES_PRICING, WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
  const [booking, setBooking] = useState<BookingState>({
    from: 'Bokaro',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    tripType: 'One Way'
  });

  const tripTypes: TripType[] = ['One Way', 'Round Trip', 'Local Rental', 'Event Cabs'];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.to) {
      alert("Please select a destination");
      return;
    }
    const text = `Hi Go Bokaro Cabs, I want to book a ${booking.tripType} from ${booking.from} to ${booking.to} on ${booking.date} at ${booking.time}.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative min-h-screen lg:min-h-[90vh] flex items-center pt-24 md:pt-32 pb-12 overflow-hidden">
      {/* Background with Optimized Overlay for Readability */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Road" 
          className="w-full h-full object-cover object-center"
        />
        {/* Deep gradient for mobile to ensure text stays legible */}
        <div className="absolute inset-0 bg-black/70 sm:bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 lg:bg-gradient-to-r lg:from-black lg:via-black/60 lg:to-transparent"></div>
      </div>

      <div className="container mx-auto z-10 px-4 md:px-8 xl:px-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Text Content - Highly Responsive Typography */}
          <div className="lg:col-span-5 text-white text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-[#A3E635] text-black px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-black tracking-widest mb-4 md:mb-6 shadow-xl shadow-lime-500/20">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              PROUDLY LOCAL • PROUDLY INDIAN
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl xl:text-7xl font-black mb-4 md:mb-6 leading-[1.1] tracking-tight">
              Premium <br className="hidden sm:block"/>
              <span className="text-[#A3E635]">Intercity</span> Voyage
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-md lg:max-w-lg font-medium leading-relaxed">
              Experience the comfort of a private flight on the road. Seamless intercity travel from Bokaro starting at just <span className="text-white font-bold">₹999</span>.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-6 opacity-90">
              {['Verified Drivers', 'Clean Vehicles', '24/7 Support'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <i className="fas fa-check-circle text-[#A3E635] text-[10px] md:text-xs"></i>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Interface - Flight Style Card */}
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:mx-0">
            <div className="glass rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 transform lg:rotate-1">
              
              {/* Trip Type Tabs - Responsive Horizontal Scroll */}
              <div className="flex overflow-x-auto scrollbar-hide bg-gray-100/50 border-b border-gray-100">
                {tripTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setBooking(prev => ({ ...prev, tripType: type }))}
                    className={`flex-1 min-w-[100px] md:min-w-[120px] px-4 md:px-6 py-4 md:py-5 text-[9px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      booking.tripType === type 
                      ? 'bg-white text-black shadow-lg z-10 border-b-2 border-[#A3E635]' 
                      : 'text-gray-500 hover:text-black hover:bg-white/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Form Body */}
              <form onSubmit={handleBooking} className="bg-white p-5 md:p-8 lg:p-10 space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  
                  {/* Departure (Fixed to Bokaro) */}
                  <div className="relative group">
                    <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase absolute top-2.5 left-10 md:left-12 z-10 tracking-widest">Departure</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-4 pt-7 md:pt-8 bg-gray-50 group-focus-within:border-black transition-all">
                      <i className="fas fa-location-arrow text-[#A3E635] w-5 md:w-6 text-base md:text-lg"></i>
                      <input 
                        type="text" 
                        value={booking.from}
                        readOnly
                        className="w-full bg-transparent focus:outline-none font-black text-gray-800 text-base md:text-xl"
                      />
                    </div>
                  </div>

                  {/* Arrival Selection */}
                  <div className="relative group">
                    <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase absolute top-2.5 left-10 md:left-12 z-10 tracking-widest">Arrival</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-4 pt-7 md:pt-8 focus-within:border-black focus-within:bg-white transition-all shadow-sm">
                      <i className="fas fa-map-marker-alt text-red-500 w-5 md:w-6 text-base md:text-lg"></i>
                      <select 
                        value={booking.to}
                        onChange={(e) => setBooking(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full bg-transparent focus:outline-none font-black text-gray-800 text-base md:text-xl cursor-pointer appearance-none pr-4"
                        required
                      >
                        <option value="">Select City</option>
                        {ROUTES_PRICING.map(route => (
                          <option key={route.destination} value={route.destination}>
                            {route.destination}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="relative group">
                    <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase absolute top-2.5 left-10 md:left-12 z-10 tracking-widest">Travel Date</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-4 pt-7 md:pt-8 focus-within:border-black focus-within:bg-white transition-all">
                      <i className="far fa-calendar-alt text-blue-500 w-5 md:w-6 text-base md:text-lg"></i>
                      <input 
                        type="date" 
                        value={booking.date}
                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-transparent focus:outline-none font-black text-gray-800 text-sm md:text-lg"
                      />
                    </div>
                  </div>

                  {/* Time Input */}
                  <div className="relative group">
                    <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase absolute top-2.5 left-10 md:left-12 z-10 tracking-widest">Time</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-xl md:rounded-2xl p-3 md:p-4 pt-7 md:pt-8 focus-within:border-black focus-within:bg-white transition-all">
                      <i className="far fa-clock text-orange-500 w-5 md:w-6 text-base md:text-lg"></i>
                      <input 
                        type="time" 
                        value={booking.time}
                        onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-transparent focus:outline-none font-black text-gray-800 text-sm md:text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer and Submit */}
                <div className="pt-4 md:pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                  <div className="flex items-start gap-3 w-full md:max-w-[280px]">
                    <div className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-info-circle text-[#A3E635] text-[10px]"></i>
                    </div>
                    <p className="text-[9px] md:text-xs text-gray-400 font-medium leading-relaxed">
                      Transparent pricing inclusive of base fare & driver allowance. Toll & taxes extra.
                    </p>
                  </div>
                  <button 
                    type="submit"
                    className="w-full md:w-auto primary-gradient text-black px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black tracking-widest shadow-2xl shadow-lime-500/30 transform hover:-translate-y-1 active:scale-95 transition-all text-xs md:text-sm uppercase whitespace-nowrap"
                  >
                    SEARCH CABS <i className="fas fa-search ml-2 text-xs"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
