import React from 'react';
import { motion } from 'motion/react';
import { TourPackage } from '../../types';
import { ImageIcon, Edit2, Trash2, Clock } from 'lucide-react';

interface ToursDashboardProps {
  tourPackages: TourPackage[];
  setEditingTour: (tour: Partial<TourPackage>) => void;
  setIsTourModalOpen: (isOpen: boolean) => void;
  handleDeleteTour: (id: string) => void;
}

const ToursDashboard: React.FC<ToursDashboardProps> = ({ tourPackages, setEditingTour, setIsTourModalOpen, handleDeleteTour }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tourPackages.map((pkg, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          key={pkg.id}
          className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="relative h-48 bg-gray-100">
            {pkg.image_url ? (
              <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ImageIcon size={48} />
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => {
                  setEditingTour(pkg);
                  setIsTourModalOpen(true);
                }}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl flex items-center justify-center hover:bg-black hover:text-[#A3E635] transition-all shadow-lg"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteTour(pkg.id)}
                className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{pkg.title}</h3>
              <span className="text-[#A3E635] font-black">₹{pkg.price}</span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{pkg.description}</p>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">{pkg.duration}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ToursDashboard;
