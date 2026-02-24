
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, MapPin, Phone, ArrowRight, Sun, Wind, Droplets } from 'lucide-react';
import { TourPackage } from './types';
import { WHATSAPP_LINK, CONTACT_PHONE } from './constants';

const TourPackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/tour-packages/${id}`);
        if (response.ok) {
          setPkg(await response.json());
        }
      } catch (err) {
        console.error('Failed to fetch tour package');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPackage();
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-8">
        <MapPin className="text-gray-200 mb-6" size={80} />
        <h1 className="text-4xl font-black text-gray-900 mb-2">Package Not Found</h1>
        <p className="text-gray-500 font-medium max-w-md">The tour package you're looking for might have been moved or doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-24">
        {/* Header Section */}
        <section 
          className="h-[60vh] bg-cover bg-center relative flex items-end p-8 md:p-16 text-white"
          style={{ backgroundImage: `url(${pkg.image_url || 'https://picsum.photos/seed/default/1920/1080'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-4"
            >
              {pkg.title}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl w-fit"
            >
              <Clock size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">{pkg.duration}</span>
            </motion.div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column - Description */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-6">About the Tour</h2>
                <div className="prose prose-lg text-gray-600 font-medium leading-relaxed">
                  <p>{pkg.description}</p>
                  {/* Add more detailed description here if available */}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-[2.5rem] p-10 sticky top-28"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                <p className="text-5xl font-black text-gray-900 tracking-tighter mb-8">₹{pkg.price.toLocaleString()}</p>
                
                <a 
                  href={`${WHATSAPP_LINK}?text=I'm interested in the ${pkg.title} tour package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-black text-[#A3E635] rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all"
                >
                  Book on WhatsApp
                  <ArrowRight size={20} />
                </a>
                <a 
                  href={`tel:${CONTACT_PHONE}`}
                  className="w-full mt-4 py-5 bg-white border-2 border-gray-100 text-black rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:border-black transition-all"
                >
                  <Phone size={20} />
                  Call to Book
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TourPackageDetails;
