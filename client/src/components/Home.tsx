
import React from 'react';
import Hero from './Hero';
import TrustBadges from './TrustBadges';
import HowItWorks from './HowItWorks';
import Services from './Services';
import Testimonials from './Testimonials';
import PriceTable from './PriceTable';
import FAQ from './FAQ';
import About from './About';
import { INSTAGRAM_LINK } from '../constants';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <TrustBadges />
      <HowItWorks />
      
      {/* Local Pride Section */}
      <section className="bg-gray-50 py-16 md:py-24 px-4 md:px-8 border-y border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100 mb-6">
            <span className="text-lime-600 font-black text-[10px] md:text-xs uppercase tracking-widest">Proudly From Bokaro</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 md:mb-8 tracking-tight">
            Steel City Ki Apni <br className="md:hidden"/> Trusted Cab Service
          </h2>
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Bokaro Steel City ke dil se, hum Jharkhand ke hubs ko connect karte hain—safety, bharosa, aur local values ke saath.
          </p>
          <div className="mt-12 flex justify-center">
            <a 
              href={INSTAGRAM_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d62976] font-bold text-sm transition-colors"
            >
              <i className="fab fa-instagram text-xl"></i>
              <span>Join our community on Instagram</span>
            </a>
          </div>
        </div>
      </section>

      <Services />
      <Testimonials />
      <PriceTable />
      <FAQ />
      <About />
    </>
  );
};

export default Home;
