
import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowRightLeft, 
  Clock, 
  Heart, 
  Users, 
  ChevronRight 
} from 'lucide-react';

const SERVICES = [
  {
    title: 'One-Way Trips',
    description: 'Sirf utna hi pay karein jitna aap travel karte hain. Intercity travel ke liye best option.',
    icon: ArrowRight,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Round Trips',
    description: 'Same day ya multi-day return trips ke liye special discounted rates aur waiting periods.',
    icon: ArrowRightLeft,
    color: 'bg-purple-50 text-purple-600'
  },
  {
    title: 'Local Rentals',
    description: 'Ghante ya din ke hisaab se cab hire karein Bokaro Steel City ke andar ghumne ke liye.',
    icon: Clock,
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Marriage Booking',
    description: 'Shaadi-byah ke liye premium luxury fleets, groom entry aur guest transport options ke saath.',
    icon: Heart,
    color: 'bg-pink-50 text-pink-600'
  },
  {
    title: 'Corporate & Events',
    description: 'Corporate seminars ya family gatherings ke liye bulk bookings aur group transport solutions.',
    icon: Users,
    color: 'bg-rose-50 text-rose-600'
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#A3E635] font-black text-[10px] tracking-[0.4em] uppercase"
          >
            Premium Mobility
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 mt-4 tracking-tighter"
          >
            Services Tailored For You
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((svc, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              key={idx} 
              className="p-10 rounded-[3rem] border border-gray-100 bg-white hover:border-[#A3E635] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col"
            >
              <div className={`w-16 h-16 ${svc.color} group-hover:bg-[#A3E635] group-hover:text-black rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 transform group-hover:rotate-12 shadow-sm`}>
                <svc.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{svc.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {svc.description}
              </p>
              <div className="mt-auto pt-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button className="text-[10px] font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                  Learn More <ChevronRight size={14} className="text-[#A3E635]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
