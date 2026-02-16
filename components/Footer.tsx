
import React from 'react';
import { CONTACT_PHONE, WHATSAPP_LINK } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-[#A3E635]">
              <img 
                src="https://res.cloudinary.com/dn6sk8mqh/image/upload/v1771266719/Screenshot_2026-02-16_235537_ru81eo.png" 
                alt="Go Bokaro Cabs Logo" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">GO BOKARO</h1>
              <p className="text-[10px] tracking-[0.2em] text-[#A3E635] font-bold uppercase">Cabs</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Jharkhand's most trusted intercity cab service provider. 
            Committed to safety, excellence, and the spirit of Bokaro.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <i className="fab fa-instagram"></i>
            </a>
            <a href={WHATSAPP_LINK} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-[#A3E635]">Services</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">One Way Drops</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Round Trips</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Airport Transfers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Local Sightseeing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Corporate Travel</a></li>
          </ul>
        </div>

        {/* Routes */}
        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-[#A3E635]">Top Routes</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>Bokaro to Ranchi</li>
            <li>Bokaro to Jamshedpur</li>
            <li>Bokaro to Kolkata</li>
            <li>Bokaro to Dhanbad</li>
            <li>Bokaro to Hazaribagh</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-[#A3E635]">Contact Us</h4>
          <div className="space-y-4 text-gray-400 text-sm">
            <div className="flex items-start gap-3">
              <i className="fas fa-map-marker-alt text-lime-400 mt-1"></i>
              <span>City Center, Sector 4, Bokaro Steel City, Jharkhand - 827004</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-phone text-lime-400"></i>
              <a href={`tel:${CONTACT_PHONE}`} className="hover:text-white">{CONTACT_PHONE}</a>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-envelope text-lime-400"></i>
              <span>booking@gobokarocabs.com</span>
            </div>
            <div className="pt-4">
              <a 
                href={WHATSAPP_LINK}
                className="inline-flex items-center gap-2 bg-[#A3E635] text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                <i className="fab fa-whatsapp text-lg"></i>
                WHATSAPP CHAT
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
        <p>© 2024 Go Bokaro Cabs. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <span className="text-[#A3E635] font-bold">Made with Pride in Bokaro</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
