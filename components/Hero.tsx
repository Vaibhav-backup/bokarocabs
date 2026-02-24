
import React, { useState, useEffect } from 'react';
import { TripType, BookingState, RoutePrice, Lead } from '../types';
import { WHATSAPP_LINK } from '../constants';

const EVENTS = [
  'Wedding / Marriage',
  'Corporate Event',
  'Birthday Party',
  'Sightseeing / Tour',
  'Social Gathering',
  'Religious Event',
  'Other'
];

const Hero: React.FC = () => {
  const [routesPricing, setRoutesPricing] = useState<RoutePrice[]>([]);
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [booking, setBooking] = useState<BookingState>({
    from: 'Bokaro Steel City',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    tripType: 'One Way'
  });

  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lead, setLead] = useState<Lead>({
    name: '',
    phone: '',
    address: '',
    vehicleType: 'Sedan'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, carsRes] = await Promise.all([
          fetch('/api/routes'),
          fetch('/api/cars')
        ]);
        if (routesRes.ok) setRoutesPricing(await routesRes.json());
        if (carsRes.ok) setAvailableCars(await carsRes.json());
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const cities = [
    'Bokaro Steel City',
    ...routesPricing.map(r => r.destination),
    'Patna', 'Gaya', 'Deoghar', 'Varanasi', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad',
    'Bhubaneswar', 'Siliguri', 'Puri'
  ];
  const UNIQUE_CITIES = Array.from(new Set(cities)).sort();

  const tripTypes: { id: TripType; icon: string; label: string }[] = [
    { id: 'One Way', icon: 'fa-arrow-right', label: 'One Way' },
    { id: 'Round Trip', icon: 'fa-exchange-alt', label: 'Round Trip' },
    { id: 'Local Rental', icon: 'fa-clock', label: 'Rentals' },
    { id: 'Event Cabs', icon: 'fa-users', label: 'Events' }
  ];

  const normalize = (str: string) => str.toLowerCase().trim().replace(' steel city', '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.from || !booking.to) {
      alert("Please select both departure and arrival cities.");
      return;
    }

    // Smart Pricing Logic
    const fromNorm = normalize(booking.from);
    const toNorm = normalize(booking.to);
    const bokaroNorm = 'bokaro';

    let foundRoute: RoutePrice | undefined;

    // Check if route involves Bokaro and exists in our DB
    if (fromNorm.includes(bokaroNorm)) {
      foundRoute = routesPricing.find(r => normalize(r.destination) === toNorm);
    } else if (toNorm.includes(bokaroNorm)) {
      foundRoute = routesPricing.find(r => normalize(r.destination) === fromNorm);
    }

    setShowLeadForm(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          bookingDetails: booking
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        // Also open WhatsApp as a fallback/direct action
        const text = `Namaste Go Bokaro Cabs! My name is ${lead.name}. I want to book a ${lead.vehicleType} for ${booking.tripType}${booking.event ? ` (${booking.event})` : ''} from ${booking.from} to ${booking.to} on ${booking.date} at ${booking.time}. My address: ${lead.address}. Contact: ${lead.phone}`;
        window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, '_blank');
        
        setTimeout(() => {
          setShowLeadForm(false);
          setIsSuccess(false);
          setIsSubmitting(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = (quoteDetails?: string) => {
    let text = `Namaste Go Bokaro Cabs! I'd like to book a ${booking.tripType}${booking.event ? ` for ${booking.event}` : ''} from ${booking.from} to ${booking.to} on ${booking.date} at ${booking.time}.`;
    if (quoteDetails) {
      text += ` I saw the estimated fare for ${quoteDetails}. Please confirm booking.`;
    } else {
      text += ` Please provide a quote for this route.`;
    }
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const swapLocations = () => {
    setBooking(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden">
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
      <div className="container mx-auto z-20 px-4 md:px-6 lg:px-8 relative">
        
        {/* Title Area */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 shadow-2xl">
            <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-ping"></span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-white uppercase">Bokaro's Most Trusted Cab</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-tight mb-4 drop-shadow-2xl">
            Safar Shuru Karein <br/>
            <span className="text-[#A3E635]">Go Bokaro Cabs Ke Saath.</span>
          </h1>
        </div>

        {/* The Flight-Style Booking Engine */}
        <div className="w-full max-w-6xl mx-auto stagger-1 animate-fade-in relative z-30">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-100">
            
            {/* Trip Type Tabs */}
            <div className="flex flex-wrap md:flex-nowrap border-b border-gray-100 bg-gray-50/50">
              {tripTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBooking(prev => ({ ...prev, tripType: type.id }))}
                  className={`flex-1 min-w-[100px] px-4 py-4 md:py-5 flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative ${
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
            <form onSubmit={handleSearch} className="p-5 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                
                {/* Datalist for Cities */}
                <datalist id="city-list">
                  {UNIQUE_CITIES.map(city => <option key={city} value={city} />)}
                </datalist>

                {/* From Section */}
                <div className={`${booking.tripType === 'Event Cabs' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-2 group`}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">From</label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black group-focus-within:bg-white transition-all">
                    <i className="fas fa-plane-departure text-gray-300 mr-3 text-lg"></i>
                    <div className="flex flex-col w-full">
                      <input 
                        list="city-list"
                        type="text" 
                        value={booking.from}
                        onChange={(e) => setBooking(prev => ({ ...prev, from: e.target.value }))}
                        placeholder="Select Origin"
                        className="bg-transparent font-black text-gray-900 text-lg w-full focus:outline-none placeholder-gray-300"
                      />
                      <span className="text-[9px] font-bold text-gray-400 leading-none">ORIGIN CITY</span>
                    </div>
                  </div>
                </div>

                {/* Swap Icon */}
                <div className="flex lg:col-span-1 items-center justify-center pb-2 lg:pb-5">
                   <button 
                    type="button"
                    onClick={swapLocations}
                    className="w-10 h-10 rounded-full border border-gray-100 bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-[#A3E635] hover:border-[#A3E635] hover:rotate-180 transition-all duration-300"
                  >
                    <i className="fas fa-exchange-alt"></i>
                  </button>
                </div>

                {/* To Section */}
                <div className={`${booking.tripType === 'Event Cabs' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-2 group`}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">To</label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black group-focus-within:bg-white transition-all">
                    <i className="fas fa-plane-arrival text-gray-300 mr-3 text-lg"></i>
                    <div className="flex flex-col w-full">
                      <input 
                        list="city-list"
                        type="text" 
                        value={booking.to}
                        onChange={(e) => setBooking(prev => ({ ...prev, to: e.target.value }))}
                        placeholder="Select Destination"
                        className="bg-transparent font-black text-gray-900 text-lg w-full focus:outline-none placeholder-gray-300"
                      />
                      <span className="text-[9px] font-bold text-gray-400 leading-none">ARRIVAL CITY</span>
                    </div>
                  </div>
                </div>

                {/* Event Type Section (Conditional) */}
                {booking.tripType === 'Event Cabs' && (
                  <div className="lg:col-span-2 space-y-2 group animate-fade-in">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Type</label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black group-focus-within:bg-white transition-all">
                      <i className="fas fa-calendar-star text-gray-300 mr-3 text-lg"></i>
                      <div className="flex flex-col w-full">
                        <select 
                          value={booking.event || ''}
                          onChange={(e) => setBooking(prev => ({ ...prev, event: e.target.value }))}
                          className="bg-transparent font-black text-gray-900 text-sm md:text-lg w-full focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select Event</option>
                          {EVENTS.map(event => <option key={event} value={event}>{event}</option>)}
                        </select>
                        <span className="text-[9px] font-bold text-gray-400 leading-none">OCCASION</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date/Time Section */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black group-focus-within:bg-white transition-all h-[76px]">
                      <input 
                        type="date" 
                        value={booking.date}
                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-transparent font-bold text-gray-900 text-sm w-full focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 group-focus-within:border-black group-focus-within:bg-white transition-all h-[76px]">
                      <input 
                        type="time" 
                        value={booking.time}
                        onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                        className="bg-transparent font-bold text-gray-900 text-sm w-full focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="lg:col-span-2 pt-4 lg:pt-0">
                  <button 
                    type="submit"
                    className="w-full h-[76px] primary-gradient text-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_20px_40px_-10px_rgba(163,230,53,0.4)] transition-all transform active:scale-95 group"
                  >
                    SEARCH <i className="fas fa-search text-sm group-hover:scale-110 transition-transform"></i>
                  </button>
                </div>
              </div>

              {/* Quick Benefits */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4 md:gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-[#A3E635] text-xs"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bina Kisi Hidden Cost Ke</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-[#A3E635] text-xs"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full AC Cabs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-[#A3E635] text-xs"></i>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">On-Time Pickup Ki Guarantee</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Floating Stat badges */}
        <div className="hidden md:flex justify-center gap-12 mt-12 animate-fade-in stagger-2 opacity-0 [animation-fill-mode:forwards]">
          <div className="text-center">
            <h4 className="text-white text-3xl font-black">50k+</h4>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Happy Riders</p>
          </div>
          <div className="w-px h-12 bg-white/10 self-center"></div>
          <div className="text-center">
            <h4 className="text-white text-3xl font-black">4.9</h4>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Star Rating</p>
          </div>
          <div className="w-px h-12 bg-white/10 self-center"></div>
          <div className="text-center">
            <h4 className="text-white text-3xl font-black">24/7</h4>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Support</p>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="bg-black text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fas fa-id-card text-9xl"></i>
              </div>
              <h3 className="text-[#A3E635] font-black text-sm uppercase tracking-[0.2em] mb-2">Booking Inquiry</h3>
              <div className="flex items-center gap-3 text-2xl font-black">
                <span>{booking.from.split(' ')[0]}</span>
                <i className="fas fa-long-arrow-alt-right text-gray-500"></i>
                <span>{booking.to.split(' ')[0]}</span>
              </div>
              <button 
                onClick={() => setShowLeadForm(false)} 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isSuccess ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-2">Inquiry Sent!</h4>
                  <p className="text-gray-500 font-medium">Hum aapse jaldi contact karenge.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={lead.name}
                      onChange={(e) => setLead(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={lead.phone}
                      onChange={(e) => setLead(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter mobile number"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Address</label>
                    <textarea 
                      required
                      value={lead.address}
                      onChange={(e) => setLead(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full address"
                      rows={2}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableCars.map((car) => (
                        <button 
                          key={car.id}
                          type="button"
                          onClick={() => setLead(prev => ({ ...prev, vehicleType: car.name }))}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${lead.vehicleType === car.name ? 'border-black bg-black text-[#A3E635]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                        >
                          <span className="font-black text-sm uppercase tracking-widest">{car.name}</span>
                          <span className={`text-[9px] font-bold mt-1 ${lead.vehicleType === car.name ? 'text-white/60' : 'text-gray-400'}`}>{car.models}</span>
                        </button>
                      ))}
                      {availableCars.length === 0 && (
                        <>
                          <button 
                            type="button"
                            onClick={() => setLead(prev => ({ ...prev, vehicleType: 'Sedan' }))}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${lead.vehicleType === 'Sedan' ? 'border-black bg-black text-[#A3E635]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                          >
                            <span className="font-black text-sm uppercase tracking-widest">SEDAN</span>
                            <span className="text-[9px] font-bold mt-1">Dzire / Aura</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setLead(prev => ({ ...prev, vehicleType: 'SUV' }))}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${lead.vehicleType === 'SUV' ? 'border-black bg-black text-[#A3E635]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                          >
                            <span className="font-black text-sm uppercase tracking-widest">SUV</span>
                            <span className="text-[9px] font-bold mt-1">Ertiga / Carens</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 primary-gradient text-black rounded-xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Book Now'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
