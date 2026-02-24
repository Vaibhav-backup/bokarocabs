
import React, { useState, useEffect } from 'react';
import { RoutePrice } from '../types';

const PriceTable: React.FC = () => {
  const [routes, setRoutes] = useState<RoutePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/api/routes');
        if (response.ok) {
          setRoutes(await response.json());
        }
      } catch (err) {
        console.error('Failed to fetch routes');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-gray-50 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-lime-100 text-lime-700 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4">Pricing Guide</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Standard Intercity Rates</h2>
          <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto font-medium">Clear, competitive, and honest pricing from Bokaro Steel City. No hidden charges, just pure service.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching latest prices...</p>
          </div>
        ) : (
          <>
            {/* Desktop View (Table) */}
            <div className="hidden lg:block overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-8 text-xs font-black uppercase tracking-widest opacity-60">Destination</th>
                    <th className="p-8 text-xs font-black uppercase tracking-widest opacity-60">Duration & Dist.</th>
                    <th className="p-8 text-xs font-black uppercase tracking-widest text-center bg-[#A3E635] text-black">Sedan (Starts)</th>
                    <th className="p-8 text-xs font-black uppercase tracking-widest text-center">Ertiga (7-Seater)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {routes.map((route, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-[#A3E635] group-hover:bg-[#A3E635] group-hover:text-black transition-all">
                            <i className="fas fa-route text-lg"></i>
                          </div>
                          <span className="font-black text-xl text-gray-900 tracking-tight">{route.destination}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-800 text-lg">{route.time}</span>
                          <span className="text-xs uppercase tracking-widest font-black text-gray-400">{route.distance}</span>
                        </div>
                      </td>
                      <td className="p-8 text-center bg-lime-50/30">
                        <span className="text-3xl font-black text-gray-900">₹{route.sedan.toLocaleString()}</span>
                        <span className="block text-[10px] font-bold text-lime-600 uppercase mt-1 tracking-widest">Base Fare</span>
                      </td>
                      <td className="p-8 text-center">
                        <span className="text-3xl font-black text-gray-900">₹{route.ertiga.toLocaleString()}</span>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Premium Choice</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
              {routes.map((route, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 hover:border-[#A3E635] transition-all transform active:scale-[0.98]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-lime-500 text-white flex items-center justify-center shadow-lg shadow-lime-500/20">
                        <i className="fas fa-map-marked-alt text-lg"></i>
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-gray-900 tracking-tight">{route.destination}</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{route.distance} • {route.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-lime-50 p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-[9px] uppercase font-black text-lime-700 tracking-[0.2em] mb-1">Sedan</p>
                        <p className="text-2xl font-black text-gray-900">₹{route.sedan.toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <i className="fas fa-car text-lime-600"></i>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.2em] mb-1">Ertiga (SUV)</p>
                        <p className="text-2xl font-black text-gray-900">₹{route.ertiga.toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <i className="fas fa-shuttle-van text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-12 text-center text-gray-400 font-medium px-6">
          <div className="max-w-xl mx-auto border-t border-gray-100 pt-8 space-y-2">
            <p className="text-xs">* Prices are indicative for one-way drops. Toll, parking, and state taxes are extra as per actual usage.</p>
            <p className="text-[10px] uppercase font-black tracking-widest text-lime-600">Verified Service • 24/7 Bokaro Help Desk</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceTable;
