import React from 'react';
import { motion } from 'motion/react';
import { Lead } from '../../types';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface LeadsDashboardProps {
  leads: Lead[];
  updateLeadStatus: (id: string, status: string) => void;
}

const LeadsDashboard: React.FC<LeadsDashboardProps> = ({ leads, updateLeadStatus }) => {
  return (
    <>
      {/* Stats Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total', value: leads.length, icon: Users, color: 'text-gray-400' },
          { label: 'New', value: leads.filter(l => l.status === 'new').length, icon: Clock, color: 'text-lime-500' },
          { label: 'Booked', value: leads.filter(l => l.status === 'booked').length, icon: CheckCircle, color: 'text-blue-500' },
          { label: 'Cancelled', value: leads.filter(l => l.status === 'cancelled').length, icon: XCircle, color: 'text-red-500' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <stat.icon className={`${stat.color} mb-4`} size={24} />
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label} Leads</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900">No Inquiries Yet</h3>
            <p className="text-gray-400 font-medium mt-2">New leads will appear here automatically.</p>
          </div>
        ) : (
          leads.map((lead, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={lead.id}
              className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                {/* Customer Info */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{lead.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      lead.status === 'new' ? 'bg-lime-100 text-lime-600' :
                      lead.status === 'contacted' ? 'bg-blue-100 text-blue-600' :
                      lead.status === 'booked' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Phone size={14} /> {lead.phone}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Route Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">From</span>
                      <span className="font-black text-gray-900">{lead.bookingDetails.from.split(' ')[0]}</span>
                    </div>
                    <ChevronRight className="text-gray-300" size={20} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To</span>
                      <span className="font-black text-gray-900">{lead.bookingDetails.to.split(' ')[0]}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {lead.bookingDetails.tripType} • {lead.bookingDetails.date} @ {lead.bookingDetails.time}
                  </p>
                </div>

                {/* Vehicle & Actions */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</span>
                    <span className="font-black text-gray-900 uppercase tracking-tighter">{lead.vehicleType}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-black transition-all"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="booked">Booked</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <div className="flex gap-2">
                      <a href={`tel:${lead.phone}`} className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all">
                        <Phone size={18} />
                      </a>
                      <a 
                        href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-all"
                      >
                        <MessageSquare size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};

export default LeadsDashboard;
