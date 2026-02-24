import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Car as CarIcon, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Calendar,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicleType: string;
  status: 'new' | 'contacted' | 'booked' | 'cancelled';
  createdAt: string;
  bookingDetails: {
    from: string;
    to: string;
    date: string;
    time: string;
    tripType: string;
    event?: string;
  };
}

interface RoutePrice {
  id: string;
  destination: string;
  time: string;
  distance: string;
  sedan: number;
  ertiga: number;
}

interface Car {
  id: string;
  name: string;
  models: string;
  capacity: string;
  type: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- Components ---

const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Admin: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [routes, setRoutes] = useState<RoutePrice[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'routes' | 'cars'>('leads');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Form states
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Partial<RoutePrice> | null>(null);
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);

  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, [token]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [leadsRes, routesRes, carsRes] = await Promise.all([
        fetch('/api/admin/leads', { headers }),
        fetch('/api/admin/routes', { headers }),
        fetch('/api/admin/cars', { headers })
      ]);

      if (leadsRes.status === 403 || leadsRes.status === 401) {
        handleLogout();
        return;
      }

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data);
      }
      if (routesRes.ok) setRoutes(await routesRes.json());
      if (carsRes.ok) setCars(await carsRes.json());
    } catch (err) {
      addNotification('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        addNotification('Status updated', 'success');
        fetchData();
      }
    } catch (err) {
      addNotification('Failed to update status', 'error');
    }
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;
    try {
      const response = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingRoute)
      });
      if (response.ok) {
        addNotification(editingRoute.id ? 'Route updated' : 'Route added', 'success');
        setIsRouteModalOpen(false);
        setEditingRoute(null);
        fetchData();
      }
    } catch (err) {
      addNotification('Failed to save route', 'error');
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    try {
      const response = await fetch(`/api/admin/routes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        addNotification('Route deleted', 'success');
        fetchData();
      } else {
        const err = await response.json();
        addNotification(err.error || 'Failed to delete route', 'error');
      }
    } catch (err) {
      addNotification('Network error during deletion', 'error');
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    try {
      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingCar)
      });
      if (response.ok) {
        addNotification(editingCar.id ? 'Car updated' : 'Car added', 'success');
        setIsCarModalOpen(false);
        setEditingCar(null);
        fetchData();
      }
    } catch (err) {
      addNotification('Failed to save car', 'error');
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        addNotification('Car deleted', 'success');
        fetchData();
      } else {
        const err = await response.json();
        addNotification(err.error || 'Failed to delete car', 'error');
      }
    } catch (err) {
      addNotification('Network error during deletion', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        addNotification('Welcome back, Admin', 'success');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Connection failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShieldCheck className="text-[#A3E635]" size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Go Bokaro Cabs Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all text-center tracking-widest"
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs font-black text-center uppercase tracking-wider"
              >
                {error}
              </motion.p>
            )}
            <button 
              type="submit"
              className="w-full py-5 bg-black text-[#A3E635] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      
      {/* Notifications */}
      <div className="fixed top-6 right-6 z-[200] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                n.type === 'success' ? 'bg-white border-lime-100 text-lime-600' :
                n.type === 'error' ? 'bg-white border-red-100 text-red-600' :
                'bg-white border-blue-100 text-blue-600'
              }`}
            >
              {n.type === 'success' ? <CheckCircle size={18} /> : 
               n.type === 'error' ? <AlertCircle size={18} /> : <RefreshCw size={18} />}
              <span className="text-sm font-black uppercase tracking-wider">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-black text-white flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-[#A3E635] rounded-2xl flex items-center justify-center text-black font-black text-xl">GB</div>
          <div>
            <h1 className="text-lg font-black tracking-tighter">ADMIN</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Control Panel</p>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'leads', label: 'Inquiries', icon: LayoutDashboard },
            { id: 'routes', label: 'Pricing', icon: MapPin },
            { id: 'cars', label: 'Fleet', icon: CarIcon },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                activeTab === item.id 
                ? 'bg-[#A3E635] text-black shadow-[0_10px_20px_-5px_rgba(163,230,53,0.3)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-black text-white p-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#A3E635] rounded-xl flex items-center justify-center text-black font-black">GB</div>
          <h1 className="text-lg font-black tracking-tight uppercase">{activeTab}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="p-2 text-gray-400 hover:text-white"><RefreshCw size={20} /></button>
          <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex gap-1 shadow-2xl">
        {[
          { id: 'leads', icon: LayoutDashboard },
          { id: 'routes', icon: MapPin },
          { id: 'cars', icon: CarIcon },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === item.id ? 'bg-[#A3E635] text-black' : 'text-gray-500'
            }`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 pb-32 md:pb-12">
        
        {/* Tab Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight capitalize">
              {activeTab === 'leads' ? 'Booking Inquiries' : activeTab === 'routes' ? 'Route Pricing' : 'Fleet Management'}
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
              {activeTab === 'leads' ? 'Manage customer requests and status' : activeTab === 'routes' ? 'Update intercity travel fares' : 'Manage available vehicles'}
            </p>
          </div>
          
          {(activeTab === 'routes' || activeTab === 'cars') && (
            <button 
              onClick={() => {
                if (activeTab === 'routes') {
                  setEditingRoute({});
                  setIsRouteModalOpen(true);
                } else {
                  setEditingCar({});
                  setIsCarModalOpen(true);
                }
              }}
              className="bg-black text-[#A3E635] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
            >
              <Plus size={18} />
              Add New {activeTab === 'routes' ? 'Route' : 'Car'}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          
          {activeTab === 'leads' && (
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
          )}

          {activeTab === 'routes' && (
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
          )}

          {activeTab === 'cars' && (
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
          )}
        </div>
      </main>

      {/* --- Modals --- */}

      {/* Route Modal */}
      <Modal 
        isOpen={isRouteModalOpen} 
        onClose={() => setIsRouteModalOpen(false)} 
        title={editingRoute?.id ? 'Edit Route' : 'New Route'}
      >
        <form onSubmit={handleSaveRoute} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
              <input 
                required
                type="text" 
                value={editingRoute?.destination || ''}
                onChange={(e) => setEditingRoute(prev => ({ ...prev, destination: e.target.value }))}
                placeholder="e.g. Ranchi"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Travel Time</label>
              <input 
                required
                type="text" 
                value={editingRoute?.time || ''}
                onChange={(e) => setEditingRoute(prev => ({ ...prev, time: e.target.value }))}
                placeholder="e.g. 3h 15m"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Distance</label>
            <input 
              required
              type="text" 
              value={editingRoute?.distance || ''}
              onChange={(e) => setEditingRoute(prev => ({ ...prev, distance: e.target.value }))}
              placeholder="e.g. 112 km"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sedan Fare (₹)</label>
              <input 
                required
                type="number" 
                value={editingRoute?.sedan || ''}
                onChange={(e) => setEditingRoute(prev => ({ ...prev, sedan: Number(e.target.value) }))}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SUV Fare (₹)</label>
              <input 
                required
                type="number" 
                value={editingRoute?.ertiga || ''}
                onChange={(e) => setEditingRoute(prev => ({ ...prev, ertiga: Number(e.target.value) }))}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full py-5 bg-black text-[#A3E635] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {editingRoute?.id ? 'Update Route' : 'Create Route'}
          </button>
        </form>
      </Modal>

      {/* Car Modal */}
      <Modal 
        isOpen={isCarModalOpen} 
        onClose={() => setIsCarModalOpen(false)} 
        title={editingCar?.id ? 'Edit Vehicle' : 'New Vehicle'}
      >
        <form onSubmit={handleSaveCar} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Class</label>
            <input 
              required
              type="text" 
              value={editingCar?.name || ''}
              onChange={(e) => setEditingCar(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Premium Sedan"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Models</label>
            <input 
              required
              type="text" 
              value={editingCar?.models || ''}
              onChange={(e) => setEditingCar(prev => ({ ...prev, models: e.target.value }))}
              placeholder="e.g. Honda City / Verna"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
              <input 
                required
                type="text" 
                value={editingCar?.capacity || ''}
                onChange={(e) => setEditingCar(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="e.g. 4+1"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
              <select 
                value={editingCar?.type || 'Sedan'}
                onChange={(e) => setEditingCar(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 outline-none focus:border-black appearance-none cursor-pointer"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full py-5 bg-black text-[#A3E635] rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {editingCar?.id ? 'Update Vehicle' : 'Add to Fleet'}
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default Admin;
