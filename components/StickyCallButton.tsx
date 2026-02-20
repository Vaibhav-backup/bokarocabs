
import React from 'react';
import { CONTACT_PHONE } from '../constants';

const StickyCallButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-6 z-[200]">
      <a 
        href={`tel:${CONTACT_PHONE}`}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#A3E635] text-black shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 active:scale-95 transition-all animate-bounce [animation-duration:3s]"
        aria-label="Call Support"
      >
        <i className="fas fa-phone-alt text-xl"></i>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-black"></span>
        </span>
      </a>
    </div>
  );
};

export default StickyCallButton;
