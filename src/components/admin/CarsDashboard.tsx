import React from 'react';
import { motion } from 'motion/react';
import { Car } from '../../types';
import { Car as CarIcon, Edit2, Trash2, Users, TrendingUp } from 'lucide-react';

interface CarsDashboardProps {
  cars: Car[];
  setEditingCar: (car: Partial<Car>) => void;
  setIsCarModalOpen: (isOpen: boolean) => void;
  handleDeleteCar: (id: string) => void;
}

const CarsDashboard: React.FC<CarsDashboardProps> = ({ cars, setEditingCar, setIsCarModalOpen, handleDeleteCar }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, i) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          key={car.id}
          className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-[#A3E635] transition-all duration-500">
              <CarIcon size={24} />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingCar(car);
                  setIsCarModalOpen(true);
                }}
                className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-black hover:text-[#A3E635] transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDeleteCar(car.id)}
                className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{car.name}</h3>
          <p className="text-gray-400 font-bold text-sm mb-6">{car.models}</p>
          
          <div className="flex items-center gap-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-300" />
              <span className="text-xs font-black text-gray-900">{car.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-gray-300" />
              <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{car.type}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CarsDashboard;
