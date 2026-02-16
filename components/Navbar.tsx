
import React, { useState, useEffect } from 'react';
import { CONTACT_PHONE, WHATSAPP_LINK } from '../constants';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-lg py-2' : 'bg-transparent py-4'} text-white border-b border-white/10 px-4 md:px-8`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-[#A3E635]">
            <img 
              src="https://res.cloudinary.com/dn6sk8mqh/image/upload/v1771266719/Screenshot_2026-02-16_235537_ru81eo.png" 
              alt="Go Bokaro Cabs Logo" 
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tighter leading-none">GO BOKARO</h1>
            <p className="text-[8px] md:text-[10px] tracking-[0.2em] text-[#A3E635] font-bold uppercase">Cabs</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-medium uppercase tracking-wider">
          <a href="#" className="hover:text-[#A3E635] transition-colors">Home</a>
          <a href="#services" className="hover:text-[#A3E635] transition-colors">Services</a>
          <a href="#pricing" className="hover:text-[#A3E635] transition-colors">Pricing</a>
          <a href="#about" className="hover:text-[#A3E635] transition-colors">About</a>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 md:gap-4">
          <a 
            href={`tel:${CONTACT_PHONE}`}
            className="hidden lg:flex items-center gap-2 text-[#A3E635] font-bold text-sm"
          >
            <i className="fas fa-phone"></i>
            <span>{CONTACT_PHONE}</span>
          </a>
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#A3E635] hover:bg-[#8ecb2e] text-black px-4 md:px-6 py-2 rounded-full font-bold text-[10px] md:text-sm transition-all transform hover:scale-105 active:scale-95"
          >
            BOOK NOW
          </a>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white text-xl relative z-[101]"
            aria-label="Toggle Menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 bg-black backdrop-blur-2xl transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} md:hidden z-[99] flex flex-col items-center justify-center gap-10`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="#" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-[#A3E635] transition-colors">Home</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-[#A3E635] transition-colors">Services</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-[#A3E635] transition-colors">Pricing</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-[#A3E635] transition-colors">About</a>
        </div>
        
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-white/10 pt-12 w-full px-12">
           <a href={`tel:${CONTACT_PHONE}`} className="text-[#A3E635] font-black text-2xl flex items-center gap-3">
            <i className="fas fa-phone"></i>
            {CONTACT_PHONE}
          </a>
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-[#A3E635] hover:text-black transition-all">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-[#A3E635] hover:text-black transition-all">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Safe • Reliable • Local</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
