
import React from 'react';
import { INSTAGRAM_LINK, FACEBOOK_LINK } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-black text-white relative overflow-hidden">
      {/* Background pattern/image */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute right-0 top-0 w-96 h-96 bg-[#A3E635] rounded-full blur-[150px] transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#A3E635] rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-[#A3E635] font-black tracking-widest uppercase text-xs md:text-sm mb-2 block">Our Story</span>
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                Born in <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] to-lime-600">The Steel City.</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Go Bokaro Cabs koi boardroom mein nahi shuru hui thi. Ye shuru hui ek simple soch se: 
                Bokaro ke logon ko travel karne ka ek behtar tareeka milna chahiye—safer, cleaner, aur faceless apps se zyada personal.
              </p>
              <p>
                Hum locals ki ek team hain jo samajhte hain ki Ranchi flight ke liye jaana ho, ya Kolkata kisi shaadi mein, ye sirf ek ride nahi hai. Ye ek bharosa hai.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-6">
              <a 
                href={INSTAGRAM_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-purple-900/20"
              >
                <i className="fab fa-instagram text-xl"></i>
                <span>Instagram</span>
              </a>
              <a 
                href={FACEBOOK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-900/20"
              >
                <i className="fab fa-facebook-f text-xl"></i>
                <span>Facebook</span>
              </a>
            </div>
          </div>

          <div className="relative stagger-1 animate-fade-in">
             <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 relative group shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/dn6sk8mqh/image/upload/v1771444370/q6m0e0h8_-sails-bokaro-steel-plant_625x300_30_June_23_m4hzss.jpg" 
                  alt="Bokaro Steel Plant" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-[#A3E635] rounded-full flex items-center justify-center text-black text-xl font-bold">
                       <i className="fas fa-quote-left"></i>
                     </div>
                  </div>
                  <p className="text-white font-medium text-xl italic leading-snug">
                    "Our mission is simple: To make every journey from Bokaro a premium experience, without the premium price tag."
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
