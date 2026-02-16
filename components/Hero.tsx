
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

  const tripTypes: { id: TripType; icon: string; label: string }[] = [
    { id: 'One Way', icon: 'fa-arrow-right', label: 'One Way' },
    { id: 'Round Trip', icon: 'fa-exchange-alt', label: 'Round Trip' },
    { id: 'Local Rental', icon: 'fa-clock', label: 'Rentals' },
    { id: 'Event Cabs', icon: 'fa-users', label: 'Events' }
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.to) {
      alert("Please select your destination city.");
      return;
    }
    const text = `Namaste Go Bokaro Cabs! I'd like to book a ${booking.tripType} from ${booking.from} to ${booking.to} on ${booking.date} at ${booking.time}. Please provide a quote.`;
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Highway Travel" 
          className="w-full h-full object-cover object-center scale-110 animate-[pulse_15s_infinite_alternate]"
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto z-20 px-4 md:px-6 lg:px-8">
        
        {/* Title Area - Flight Portal Style */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 shadow-2xl">
            <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-ping"></span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-white uppercase">Steel City's #1 Choice</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-tight mb-4">
            Fly on Road with <br/>
            <span className="text-[#A3E635]">Go Bokaro Cabs.</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-xl max-w-2xl mx-auto font-medium">
            Premium intercity travel at the price of a local ride. <br className="hidden md:block"/> Professional pilots, spotless cars, guaranteed safety.
          </p>
        </div>

        {/* The Flight-Style Booking Engine */}
        <div className="w-full max-w-6xl mx-auto stagger-1 animate-fade-in">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-100">
            
            {/* Trip Type Tabs - Simplified for UI/UX */}
            <div className="flex flex-wrap md:flex-nowrap border-b border-gray-100 bg-gray-50/50">
              {tripTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBooking(prev => ({ ...prev, tripType: type.id }))}
                  className={`flex-1 min-w-[120px] px-6 py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all relative ${
                    booking.tripType === type.id 
                    ? 'bg-white text-black' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                  }`}
                >
                  <i className={`fas ${type.icon} ${booking.tripType === type.id ? 'text-[#A3E635]' : 'text-gray-300'}`}></i>
                  {type.label}
                  {booking.tripType === type.id && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#A3E635]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Main Booking Form */}
            <form onSubmit={handleBooking} className="p-4 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                
                {/* From Section */}
                <div className="lg:col-span-3 space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">From</label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black transition-all">
                    <i className="fas fa-plane-departure text-gray-300 mr-4 text-lg"></i>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-lime-600 leading-none mb-1">CITY CENTER</span>
                      <input 
                        type="text" 
                        value={booking.from}
                        readOnly
                        className="bg-transparent font-black text-gray-900 text-lg w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Swap Icon (Visual Only) */}
                <div className="hidden lg:flex lg:col-span-1 items-center justify-center pb-5">
                   <div className="w-10 h-10 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-300 hover:text-black transition-colors cursor-pointer rotate-0 hover:rotate-180 duration-500">
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                </div>

                {/* To Section */}
                <div className="lg:col-span-3 space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">To</label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black transition-all">
                    <i className="fas fa-plane-arrival text-gray-300 mr-4 text-lg"></i>
                    <div className="flex flex-col w-full">
                      <span className="text-[9px] font-bold text-gray-400 leading-none mb-1 uppercase tracking-tighter">Choose Destination</span>
                      <select 
                        value={booking.to}
                        onChange={(e) => setBooking(prev => ({ ...prev, to: e.target.value }))}
                        className="bg-transparent font-black text-gray-900 text-lg w-full focus:outline-none cursor-pointer appearance-none"
                        required
                      >
                        <option value="">Select City</option>
                        {ROUTES_PRICING.map(route => (
                          <option key={route.destination} value={route.destination}>{route.destination}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Date/Time Section */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black transition-all h-[70px]">
                      <input 
                        type="date" 
                        value={booking.date}
                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-transparent font-black text-gray-900 text-sm w-full focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black transition-all h-[70px]">
                      <input 
                        type="time" 
                        value={booking.time}
                        onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                        className="bg-transparent font-black text-gray-900 text-sm w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="lg:col-span-2 pt-4 lg:pt-0">
                  <button 
                    type="submit"
                    className="w-full h-[70px] primary-gradient text-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_20px_40px_-10px_rgba(163,230,53,0.4)] transition-all transform active:scale-95 group"
                  >
                    SEARCH <i className="fas fa-search text-sm group-hover:scale-125 transition-transform"></i>
                  </button>
                </div>
              </div>

              {/* Quick Options / Benefits Bar */}
              <div className="mt-8 pt-8 border-t border-gray-50 flex flex-wrap items-center justify-between gap-6">
                <div className="flex gap-4 md:gap-8 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-lime-100 flex items-center justify-center text-[#A3E635] text-[10px]">
                      <i className="fas fa-check"></i>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Fixed Pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-lime-100 flex items-center justify-center text-[#A3E635] text-[10px]">
                      <i className="fas fa-check"></i>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-lime-100 flex items-center justify-center text-[#A3E635] text-[10px]">
                      <i className="fas fa-check"></i>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Free Cancellation</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[#A3E635] font-black text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 bg-black rounded-xl">
                   <i className="fas fa-tags"></i>
                   Offers available for first ride
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Floating Stat badges - Screen Only (Hidden on small mobile) */}
        <div className="hidden md:flex justify-center gap-12 mt-16 animate-fade-in stagger-2 opacity-0 [animation-fill-mode:forwards]">
          <div className="text-center">
            <h4 className="text-white text-3xl font-black">50,000+</h4>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Trips Completed</p>
          </div>
          <div className="w-px h-12 bg-white/10 self-center"></div>
          <div className="text-center">
            <h4 className="text-white text-3xl font-black">4.9/5</h4>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Pilot Rating</p>
          </div>
          <div className="w-px h-12 bg-white/10 self-center"></div>
          <div className="text-center">
            <h4 className="text-white text-3xl font-black">200+</h4>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Verified Cars</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
