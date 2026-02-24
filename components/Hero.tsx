
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlaneTakeoff, 
  PlaneLanding, 
  ArrowRightLeft, 
  Search, 
  CheckCircle2, 
  Users, 
  Clock, 
  Calendar,
  MapPin,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';
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

  const tripTypes: { id: TripType; icon: any; label: string }[] = [
    { id: 'One Way', icon: PlaneTakeoff, label: 'One Way' },
    { id: 'Round Trip', icon: ArrowRightLeft, label: 'Round Trip' },
    { id: 'Local Rental', icon: Clock, label: 'Rentals' },
    { id: 'Event Cabs', icon: Users, label: 'Events' }
  ];

  const normalize = (str: string) => str.toLowerCase().trim().replace(' steel city', '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.from || !booking.to) {
      alert("Please select both departure and arrival cities.");
      return;
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

  const swapLocations = () => {
    setBooking(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-white z-10"></div>
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Highway Travel" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto z-20 px-4 md:px-6 lg:px-8 relative">
        
        {/* Title Area */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-full mb-8 shadow-2xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-pulse"></span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-white uppercase">Bokaro's #1 Premium Cab Service</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl"
          >
            Safar Shuru Karein <br/>
            <span className="text-[#A3E635] italic">Go Bokaro</span> <span className="text-white">Cabs.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-sm md:text-lg font-medium max-w-2xl mx-auto tracking-wide"
          >
            Experience luxury intercity travel with professional drivers and premium fleet. 
            Safe, reliable, and always on time.
          </motion.p>
        </div>

        {/* The Flight-Style Booking Engine */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-6xl mx-auto relative z-30"
        >
          <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border border-gray-100">
            
            {/* Trip Type Tabs */}
            <div className="flex flex-wrap md:flex-nowrap border-b border-gray-100 bg-gray-50/50 p-2">
              {tripTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBooking(prev => ({ ...prev, tripType: type.id }))}
                  className={`flex-1 min-w-[120px] px-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative group ${
                    booking.tripType === type.id 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <type.icon size={16} className={booking.tripType === type.id ? 'text-[#A3E635]' : 'text-gray-300 group-hover:text-gray-400'} />
                  {type.label}
                  {booking.tripType === type.id && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 border-2 border-[#A3E635]/20 rounded-2xl" />
                  )}
                </button>
              ))}
            </div>

            {/* Main Booking Form */}
            <form onSubmit={handleSearch} className="p-6 md:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                
                <datalist id="city-list">
                  {UNIQUE_CITIES.map(city => <option key={city} value={city} />)}
                </datalist>

                {/* From Section */}
                <div className={`${booking.tripType === 'Event Cabs' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3 group`}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={10} /> From
                  </label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-5 group-focus-within:border-black group-focus-within:bg-white transition-all shadow-sm">
                    <div className="flex flex-col w-full">
                      <input 
                        list="city-list"
                        type="text" 
                        value={booking.from}
                        onChange={(e) => setBooking(prev => ({ ...prev, from: e.target.value }))}
                        placeholder="Select Origin"
                        className="bg-transparent font-black text-gray-900 text-xl w-full focus:outline-none placeholder-gray-300"
                      />
                      <span className="text-[9px] font-bold text-gray-400 leading-none mt-1">ORIGIN CITY</span>
                    </div>
                  </div>
                </div>

                {/* Swap Icon */}
                <div className="flex lg:col-span-1 items-center justify-center pb-2 lg:pb-6">
                   <motion.button 
                    whileHover={{ rotate: 180 }}
                    type="button"
                    onClick={swapLocations}
                    className="w-12 h-12 rounded-full border border-gray-100 bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-[#A3E635] hover:border-[#A3E635] transition-all duration-500"
                  >
                    <ArrowRightLeft size={20} />
                  </motion.button>
                </div>

                {/* To Section */}
                <div className={`${booking.tripType === 'Event Cabs' ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-3 group`}>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={10} /> To
                  </label>
                  <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-5 group-focus-within:border-black group-focus-within:bg-white transition-all shadow-sm">
                    <div className="flex flex-col w-full">
                      <input 
                        list="city-list"
                        type="text" 
                        value={booking.to}
                        onChange={(e) => setBooking(prev => ({ ...prev, to: e.target.value }))}
                        placeholder="Select Destination"
                        className="bg-transparent font-black text-gray-900 text-xl w-full focus:outline-none placeholder-gray-300"
                      />
                      <span className="text-[9px] font-bold text-gray-400 leading-none mt-1">ARRIVAL CITY</span>
                    </div>
                  </div>
                </div>

                {/* Event Type Section (Conditional) */}
                {booking.tripType === 'Event Cabs' && (
                  <div className="lg:col-span-2 space-y-3 group animate-fade-in">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Zap size={10} /> Event
                    </label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-5 group-focus-within:border-black group-focus-within:bg-white transition-all shadow-sm">
                      <div className="flex flex-col w-full">
                        <select 
                          value={booking.event || ''}
                          onChange={(e) => setBooking(prev => ({ ...prev, event: e.target.value }))}
                          className="bg-transparent font-black text-gray-900 text-lg w-full focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select Event</option>
                          {EVENTS.map(event => <option key={event} value={event}>{event}</option>)}
                        </select>
                        <span className="text-[9px] font-bold text-gray-400 leading-none mt-1">OCCASION</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date/Time Section */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Calendar size={10} /> Date
                    </label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-5 group-focus-within:border-black group-focus-within:bg-white transition-all shadow-sm h-[84px]">
                      <input 
                        type="date" 
                        value={booking.date}
                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-transparent font-bold text-gray-900 text-sm w-full focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Clock size={10} /> Time
                    </label>
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] p-5 group-focus-within:border-black group-focus-within:bg-white transition-all shadow-sm h-[84px]">
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
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full h-[84px] bg-black text-[#A3E635] rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all group"
                  >
                    SEARCH <Search size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>

              {/* Quick Benefits */}
              <div className="mt-10 pt-8 border-t border-gray-50 flex flex-wrap items-center justify-between gap-6">
                <div className="flex gap-8 flex-wrap">
                  {[
                    { icon: ShieldCheck, text: 'No Hidden Costs' },
                    { icon: Zap, text: 'Full AC Cabs' },
                    { icon: Clock, text: 'On-Time Pickup' }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <benefit.icon size={14} className="text-[#A3E635]" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Floating Stat badges */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16">
          {[
            { label: 'Happy Riders', value: '50k+' },
            { label: 'Star Rating', value: '4.9', icon: Star },
            { label: 'Support', value: '24/7' }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              key={i} 
              className="text-center group"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {stat.icon && <stat.icon size={20} className="text-[#A3E635]" />}
                <h4 className="text-white text-3xl md:text-4xl font-black group-hover:text-[#A3E635] transition-colors">{stat.value}</h4>
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lead Form Modal */}
      <AnimatePresence>
        {showLeadForm && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-md rounded-t-[3rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-black text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Users size={160} />
                </div>
                <h3 className="text-[#A3E635] font-black text-[10px] uppercase tracking-[0.4em] mb-4">Confirm Booking</h3>
                <div className="flex items-center gap-4 text-3xl font-black tracking-tighter">
                  <span>{booking.from.split(' ')[0]}</span>
                  <ChevronRight size={24} className="text-white/20" />
                  <span>{booking.to.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={() => setShowLeadForm(false)} 
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                {isSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-24 h-24 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="text-3xl font-black text-gray-900 mb-3">Booking Initiated!</h4>
                    <p className="text-gray-500 font-medium tracking-wide">Redirecting to WhatsApp for confirmation...</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={lead.name}
                        onChange={(e) => setLead(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        value={lead.phone}
                        onChange={(e) => setLead(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter mobile number"
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Address</label>
                      <textarea 
                        required
                        value={lead.address}
                        onChange={(e) => setLead(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter full address"
                        rows={2}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                      <div className="grid grid-cols-2 gap-4">
                        {(availableCars.length > 0 ? availableCars : [{id:1, name:'Sedan', models:'Dzire'}, {id:2, name:'SUV', models:'Ertiga'}]).map((car) => (
                          <button 
                            key={car.id}
                            type="button"
                            onClick={() => setLead(prev => ({ ...prev, vehicleType: car.name }))}
                            className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${lead.vehicleType === car.name ? 'border-black bg-black text-[#A3E635]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                          >
                            <span className="font-black text-xs uppercase tracking-widest">{car.name}</span>
                            <span className={`text-[8px] font-bold mt-1 ${lead.vehicleType === car.name ? 'text-white/60' : 'text-gray-400'}`}>{car.models}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-5 bg-black text-[#A3E635] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
