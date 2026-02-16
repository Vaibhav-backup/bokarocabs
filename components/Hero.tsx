
import React, { useState } from 'react';
import { TripType, BookingState } from '../types';
import { ROUTES_PRICING, WHATSAPP_LINK } from '../constants';

const Hero: React.FC = () => {
  const [booking, setBooking] = useState<BookingState>({
    from: 'Bokaro Steel City',
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
    const text = `Namaste Go Bokaro Cabs! I'd like to book a ${booking.tripType} from ${booking.from} to ${booking.to} on ${booking.date} around ${booking.time}. Please provide details.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Highway Journey" 
          className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-black/60 md:bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 lg:bg-gradient-to-r lg:from-black lg:via-black/50 lg:to-transparent"></div>
      </div>

      <div className="container mx-auto z-10 px-4 md:px-8 xl:px-12">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Branding */}
          <div className="lg:col-span-5 text-white text-center lg:text-left flex flex-col items-center lg:items-start animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#A3E635] text-black px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-[0.2em] mb-8 shadow-xl">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              STEEL CITY'S PREMIUM CHOICE
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl font-black mb-6 leading-[1] tracking-tighter">
              Bokaro's <br className="hidden sm:block"/>
              <span className="text-[#A3E635]">Elite</span> Way <br className="hidden sm:block"/>
              to Travel.
            </h1>
            
            <p className="text-base md:text-xl text-gray-200 mb-10 max-w-lg font-medium leading-relaxed">
              Why settle for less? Experience intercity travel redefined with professional pilots and spotless vehicles.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md">
                <i className="fas fa-shield-check text-[#A3E635]"></i>
                <span className="text-xs font-bold uppercase tracking-widest">Verified Pilots</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md">
                <i className="fas fa-clock text-[#A3E635]"></i>
                <span className="text-xs font-bold uppercase tracking-widest">On-Time Always</span>
              </div>
            </div>
          </div>

          {/* Booking Engine */}
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto lg:mx-0 stagger-1 animate-fade-in">
            <div className="glass rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-white/30">
              
              {/* Trip Selection Tabs */}
              <div className="flex overflow-x-auto scrollbar-hide bg-black/5 backdrop-blur-md">
                {tripTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setBooking(prev => ({ ...prev, tripType: type }))}
                    className={`flex-1 min-w-[120px] px-6 py-5 text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                      booking.tripType === type 
                      ? 'bg-white text-black shadow-lg z-10 border-b-4 border-[#A3E635]' 
                      : 'text-gray-500 hover:text-black hover:bg-white/40'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBooking} className="bg-white p-6 md:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  
                  {/* From Field */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase absolute top-3 left-12 z-10 tracking-widest">Departure</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-2xl p-4 pt-8 bg-gray-50/50 group">
                      <i className="fas fa-location-arrow text-[#A3E635] w-6 text-xl"></i>
                      <input 
                        type="text" 
                        value={booking.from}
                        readOnly
                        className="w-full bg-transparent focus:outline-none font-black text-gray-900 text-lg md:text-xl"
                      />
                    </div>
                  </div>

                  {/* To Field */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase absolute top-3 left-12 z-10 tracking-widest">Arrival</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-2xl p-4 pt-8 focus-within:border-black focus-within:bg-white transition-all shadow-sm">
                      <i className="fas fa-map-marker-alt text-red-500 w-6 text-xl"></i>
                      <select 
                        value={booking.to}
                        onChange={(e) => setBooking(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full bg-transparent focus:outline-none font-black text-gray-900 text-lg md:text-xl cursor-pointer appearance-none pr-4"
                        required
                      >
                        <option value="">Destination City</option>
                        {ROUTES_PRICING.map(route => (
                          <option key={route.destination} value={route.destination}>
                            {route.destination}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase absolute top-3 left-12 z-10 tracking-widest">Departure Date</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-2xl p-4 pt-8 focus-within:border-black transition-all">
                      <i className="far fa-calendar-check text-blue-500 w-6 text-xl"></i>
                      <input 
                        type="date" 
                        value={booking.date}
                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-transparent focus:outline-none font-black text-gray-900 text-base md:text-lg"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {/* Time Picker */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase absolute top-3 left-12 z-10 tracking-widest">Time Slot</label>
                    <div className="flex items-center border-2 border-gray-100 rounded-2xl p-4 pt-8 focus-within:border-black transition-all">
                      <i className="far fa-clock text-orange-500 w-6 text-xl"></i>
                      <input 
                        type="time" 
                        value={booking.time}
                        onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-transparent focus:outline-none font-black text-gray-900 text-base md:text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-start gap-4 w-full md:max-w-[320px]">
                    <div className="w-6 h-6 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <i className="fas fa-info text-[#A3E635] text-[10px]"></i>
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                      Instant confirmation. All prices include base fare. Tolls, state taxes, and parking are separate.
                    </p>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full md:w-auto primary-gradient text-black px-12 py-5 rounded-2xl font-black tracking-widest shadow-2xl shadow-lime-500/30 transform hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase whitespace-nowrap flex items-center justify-center gap-3"
                  >
                    CONFIRM RIDE <i className="fas fa-chevron-right text-xs"></i>
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
