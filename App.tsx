
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import HowItWorks from './components/HowItWorks';
import PriceTable from './components/PriceTable';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import About from './components/About';
import StickyCallButton from './components/StickyCallButton';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import { INSTAGRAM_LINK } from './constants';

const ScrollHandler: React.FC<{ targetId: string | null, onComplete: () => void }> = ({ targetId, onComplete }) => {
  useEffect(() => {
    if (targetId) {
      const timer = setTimeout(() => {
        if (targetId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(targetId);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }
        onComplete();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [targetId, onComplete]);
  return null;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'privacy' | 'terms'>('home');
  const [targetSection, setTargetSection] = useState<string | null>(null);

  const navigateToHome = (sectionId?: string) => {
    setCurrentView('home');
    setTargetSection(sectionId || 'top');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <ScrollHandler targetId={targetSection} onComplete={() => setTargetSection(null)} />
      
      <Navbar onNavigateHome={navigateToHome} />
      
      <main className="flex-grow">
        {currentView === 'home' ? (
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
        ) : currentView === 'privacy' ? (
          <PrivacyPolicy onBack={() => navigateToHome()} />
        ) : (
          <TermsConditions onBack={() => navigateToHome()} />
        )}
      </main>
      
      <Footer 
        onPrivacyClick={() => setCurrentView('privacy')} 
        onTermsClick={() => setCurrentView('terms')}
        onNavigateHome={navigateToHome} 
      />

      {/* Global Floating Elements */}
      {currentView === 'home' && (
        <StickyCallButton />
      )}
    </div>
  );
};

export default App;
