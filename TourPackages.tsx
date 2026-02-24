
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Phone, ArrowRight, ChevronRight } from 'lucide-react';
import { TourPackage } from './types';
import { WHATSAPP_LINK, CONTACT_PHONE } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const TourPackages: React.FC = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/tour-packages');
        if (response.ok) {
          setPackages(await response.json());
        }
      } catch (err) {
        console.error('Failed to fetch tour packages');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-4 md:px-8 mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="bg-black rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src="https://picsum.photos/seed/travel/1920/1080" 
                  alt="Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 max-w-3xl">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block bg-[#A3E635] text-black px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-8"
                >
                  Explore Jharkhand
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8"
                >
                  Curated <br/>
                  <span className="text-[#A3E635] italic text-4xl md:text-6xl lg:text-7xl">Tour Packages.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-400 text-lg md:text-xl font-medium max-w-xl"
                >
                  Discover the hidden gems of Jharkhand with our specially crafted tour packages. From spiritual journeys to nature retreats.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading adventures...</p>
              </div>
            ) : packages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={pkg.id}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative h-72 overflow-hidden">
                      {pkg.image_url ? (
                        <img 
                          src={pkg.image_url} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                          <MapPin size={48} />
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {pkg.duration}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#A3E635] transition-colors">{pkg.title}</h3>
                      </div>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                        {pkg.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                          <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{pkg.price.toLocaleString()}</p>
                        </div>
                        <a 
                          href={`${WHATSAPP_LINK}?text=I'm interested in the ${pkg.title} tour package.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 bg-black text-[#A3E635] rounded-2xl flex items-center justify-center hover:bg-[#A3E635] hover:text-black transition-all shadow-xl group-hover:rotate-12"
                        >
                          <ArrowRight size={24} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-[3rem]">
                <MapPin className="mx-auto text-gray-200 mb-6" size={64} />
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Packages Yet</h3>
                <p className="text-gray-400 font-medium">We are currently crafting new adventures for you.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-8 mt-32">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#A3E635] rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none mb-6">
                  Want a Custom <br/>
                  <span className="opacity-50 italic">Itinerary?</span>
                </h2>
                <p className="text-black/60 font-bold text-lg max-w-md">
                  Tell us where you want to go and we'll plan the perfect trip for you and your family.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <a 
                  href={`tel:${CONTACT_PHONE}`}
                  className="bg-black text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
                >
                  <Phone size={20} />
                  Call Expert
                </a>
                <a 
                  href={WHATSAPP_LINK}
                  className="bg-white text-black px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TourPackages;
