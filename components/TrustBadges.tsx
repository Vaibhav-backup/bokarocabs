
import React from 'react';

const BADGES = [
  { icon: 'fa-user-check', title: 'Verified Drivers', desc: 'Police verified & trained' },
  { icon: 'fa-spray-can-sparkles', title: 'Sanitized Cabs', desc: 'Clean & fresh every trip' },
  { icon: 'fa-location-crosshairs', title: 'GPS Tracked', desc: 'Real-time safety monitoring' },
  { icon: 'fa-headset', title: '24/7 Support', desc: 'Bokaro based helpdesk' }
];

const TrustBadges: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
        {BADGES.map((badge, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-lime-50 flex items-center justify-center text-[#A3E635] group-hover:bg-[#A3E635] group-hover:text-black transition-all duration-300">
              <i className={`fas ${badge.icon} text-xl`}></i>
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">{badge.title}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
