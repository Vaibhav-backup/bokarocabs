
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PriceTable from './components/PriceTable';
import Services from './components/Services';
import GeminiChat from './components/GeminiChat';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Local Pride Section - Enhanced for Mobile */}
        <section className="bg-gray-50 py-16 md:py-24 px-4 md:px-8 border-y border-gray-100">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100 mb-6">
              <span className="text-lime-600 font-black text-[10px] md:text-xs uppercase tracking-widest">Proudly From Bokaro</span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 md:mb-8 tracking-tight">
              Steel City Ki Apni <br className="md:hidden"/> Trusted Cab Service
            </h2>
            <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Based in the heart of Bokaro Steel City, we bridge the gap between Jharkhand's key hubs with safety, reliability, and local values.
            </p>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-lime-500 mb-4 group-hover:scale-110 transition-transform border border-gray-50">
                  <i className="fas fa-shield-alt text-2xl md:text-3xl"></i>
                </div>
                <span className="font-black text-gray-800 uppercase tracking-widest text-[10px] md:text-xs">100% Secure</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-lime-500 mb-4 group-hover:scale-110 transition-transform border border-gray-50">
                  <i className="fas fa-user-tie text-2xl md:text-3xl"></i>
                </div>
                <span className="font-black text-gray-800 uppercase tracking-widest text-[10px] md:text-xs">Expert Drivers</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-lime-500 mb-4 group-hover:scale-110 transition-transform border border-gray-50">
                  <i className="fas fa-star text-2xl md:text-3xl"></i>
                </div>
                <span className="font-black text-gray-800 uppercase tracking-widest text-[10px] md:text-xs">Top Rated</span>
              </div>
            </div>
          </div>
        </section>

        <Services />
        <PriceTable />
      </main>
      <Footer />
      <GeminiChat />
    </div>
  );
};

export default App;
