
import React from 'react';

const SERVICES = [
  {
    title: 'One-Way Trips',
    description: 'Sirf utna hi pay karein jitna aap travel karte hain. Intercity travel ke liye best option.',
    icon: 'fa-arrow-right',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Round Trips',
    description: 'Same day ya multi-day return trips ke liye special discounted rates aur waiting periods.',
    icon: 'fa-exchange-alt',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    title: 'Local Rentals',
    description: 'Ghante ya din ke hisaab se cab hire karein Bokaro Steel City ke andar ghumne ke liye.',
    icon: 'fa-clock',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Marriage Booking',
    description: 'Shaadi-byah ke liye premium luxury fleets, groom entry aur guest transport options ke saath.',
    icon: 'fa-heart',
    color: 'bg-pink-50 text-pink-600'
  },
  {
    title: 'Corporate & Events',
    description: 'Corporate seminars ya family gatherings ke liye bulk bookings aur group transport solutions.',
    icon: 'fa-users',
    color: 'bg-rose-50 text-rose-600'
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#A3E635] font-black text-sm tracking-widest uppercase">Premium Mobility</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">Services Tailored For You</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {SERVICES.map((svc, idx) => (
            <div key={idx} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] p-8 rounded-[2rem] border border-gray-100 bg-white hover:border-[#A3E635] hover:shadow-2xl transition-all duration-300 group flex flex-col">
              <div className={`w-16 h-16 ${svc.color} group-hover:bg-[#A3E635] group-hover:text-black rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 transform group-hover:rotate-6`}>
                <i className={`fas ${svc.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">{svc.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {svc.description}
              </p>
              <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-2">
                  Learn More <i className="fas fa-arrow-right text-xs"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
