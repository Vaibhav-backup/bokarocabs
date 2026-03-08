
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONTACT_PHONE, WHATSAPP_LINK, INSTAGRAM_LINK, FACEBOOK_LINK, CONTACT_EMAIL } from '../constants';

interface FooterProps {
  onNavigateHome?: (sectionId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateHome }) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Secret shortcut logic
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (newCount >= 5) {
      setClickCount(0);
      navigate('/admin');
    } else {
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000); // Reset after 2 seconds of inactivity
    }
  };

  const handleNavClick = (e: React.MouseEvent, id?: string) => {
    // If we are on home page, just scroll
    if (window.location.pathname === '/') {
      e.preventDefault();
      if (onNavigateHome) {
        onNavigateHome(id);
      }
    }
  };

  return (
    <footer className="bg-primary-blue text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3 mb-6 cursor-pointer" onClick={handleLogoClick}>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-primary-yellow">
              <img 
                src="https://res.cloudinary.com/dn6sk8mqh/image/upload/v1772965540/Bokaro_cab_services_wordmark_logo_a73cd6f96f_w3jpab.jpg" 
                alt="Bokaro Cab Service Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">BOKARO CAB SERVICE</h1>
              <p className="text-[10px] tracking-[0.2em] text-primary-yellow font-bold uppercase">Cabs</p>
            </div>
          </Link>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Jharkhand's most trusted intercity cab service provider. 
            Committed to safety, excellence, and the spirit of Bokaro.
          </p>
          <div className="flex gap-4">
            <a href={FACEBOOK_LINK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-blue transition-all">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-blue transition-all">
              <i className="fab fa-instagram"></i>
            </a>
            <a href={WHATSAPP_LINK} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-blue transition-all">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-primary-yellow">Services</h4>
          <ul className="space-y-3 text-white/70 text-sm">
            <li>One Way Drops</li>
            <li>Round Trips</li>
            <li>Airport Transfers</li>
            <li>Local Sightseeing</li>
            <li>Corporate Travel</li>
            <li>Marriage Bookings</li>
          </ul>
        </div>

        {/* Routes */}
        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-primary-yellow">Top Routes</h4>
          <ul className="space-y-3 text-white/70 text-sm">
            <li>Bokaro to Ranchi</li>
            <li>Bokaro to Jamshedpur</li>
            <li>Bokaro to Kolkata</li>
            <li>Bokaro to Dhanbad</li>
            <li>Bokaro to Hazaribagh</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-primary-yellow">Contact Us</h4>
          <div className="space-y-4 text-white/70 text-sm">
            <div className="flex items-start gap-3">
              <i className="fas fa-map-marker-alt text-primary-yellow mt-1"></i>
              <span>City Center, Sector 4, Bokaro Steel City, Jharkhand - 827004</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-phone text-primary-yellow"></i>
              <a href={`tel:${CONTACT_PHONE}`} className="hover:text-white">{CONTACT_PHONE}</a>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-envelope text-primary-yellow"></i>
              <span>{CONTACT_EMAIL}</span>
            </div>
            <div className="pt-4">
              <a 
                href={WHATSAPP_LINK}
                className="inline-flex items-center gap-2 bg-primary-yellow text-primary-blue px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                WHATSAPP CHAT
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs">
        <p>© 2026 Bokaro Cab Service. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-white text-left">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white text-left">Terms of Service</Link>
          <span className="text-primary-yellow font-bold">Made with Pride in Bokaro</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
