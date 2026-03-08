import React from 'react';
import { motion } from 'motion/react';
import { RoutePrice } from '../../types';
import { MapPin, Edit2, Trash2 } from 'lucide-react';

interface RoutesDashboardProps {
  routes: RoutePrice[];
  setEditingRoute: (route: Partial<RoutePrice>) => void;
  setIsRouteModalOpen: (isOpen: boolean) => void;
  handleDeleteRoute: (id: string) => void;
}

const RoutesDashboard: React.FC<RoutesDashboardProps> = ({ routes, setEditingRoute, setIsRouteModalOpen, handleDeleteRoute }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {routes.map((route, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          key={route.id}
          className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <MapPin size={80} />
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{route.destination}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{route.distance} • {route.time}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingRoute(route);
                  setIsRouteModalOpen(true);
                }}
                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-black hover:text-[#A3E635] transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteRoute(route.id)}
                className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sedan</span>
              <span className="text-xl font-black text-gray-900">₹{route.sedan}</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">SUV</span>
              <span className="text-xl font-black text-gray-900">₹{route.ertiga}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RoutesDashboard;
