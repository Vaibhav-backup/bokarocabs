import React, { useState, useEffect } from 'react';

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

const Admin: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [routes, setRoutes] = useState<RoutePrice[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'routes' | 'cars'>('leads');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [editingRoute, setEditingRoute] = useState<Partial<RoutePrice> | null>(null);
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);

  const ADMIN_KEY = 'gobokaro2024';

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-admin-key': ADMIN_KEY };
      const [leadsRes, routesRes, carsRes] = await Promise.all([
        fetch('/api/admin/leads', { headers }),
        fetch('/api/admin/routes', { headers }),
        fetch('/api/admin/cars', { headers })
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.sort((a: Lead, b: Lead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
      if (routesRes.ok) setRoutes(await routesRes.json());
      if (carsRes.ok) setCars(await carsRes.json());
    } catch (err) {
      setError('Network error');
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
          'x-admin-key': ADMIN_KEY
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const saveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;
    try {
      const response = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY
        },
        body: JSON.stringify(editingRoute)
      });
      if (response.ok) {
        setEditingRoute(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save route');
    }
  };

  const deleteRoute = async (id: string) => {
    if (!confirm('Are you sure you want to delete this route?')) return;
    try {
      const response = await fetch(`/api/admin/routes/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': ADMIN_KEY }
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Failed to delete route');
    }
  };

  const saveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;
    try {
      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_KEY
        },
        body: JSON.stringify(editingCar)
      });
      if (response.ok) {
        setEditingCar(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save car');
    }
  };

  const deleteCar = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': ADMIN_KEY }
      });
      if (response.ok) fetchData();
    } catch (err) {
      console.error('Failed to delete car');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-[#A3E635] text-2xl"></i>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Admin Login</h1>
            <p className="text-gray-500 font-medium">Go Bokaro Cabs Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 font-bold text-gray-900 focus:border-black focus:bg-white outline-none transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button 
              type="submit"
              className="w-full py-4 bg-black text-[#A3E635] rounded-xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar/Header */}
      <header className="bg-black text-white p-6 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#A3E635] rounded-xl flex items-center justify-center text-black font-black">GB</div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Management</p>
            </div>
          </div>
          
          <nav className="flex bg-white/10 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-[#A3E635] text-black' : 'text-white hover:bg-white/10'}`}
            >
              Leads
            </button>
            <button 
              onClick={() => setActiveTab('routes')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'routes' ? 'bg-[#A3E635] text-black' : 'text-white hover:bg-white/10'}`}
            >
              Pricing
            </button>
            <button 
              onClick={() => setActiveTab('cars')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'cars' ? 'bg-[#A3E635] text-black' : 'text-white hover:bg-white/10'}`}
            >
              Fleet
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 hover:text-[#A3E635] transition-colors">
              <i className="fas fa-sync-alt"></i>
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {activeTab === 'leads' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
                <h3 className="text-3xl font-black text-gray-900">{leads.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest mb-1">New Leads</p>
                <h3 className="text-3xl font-black text-gray-900">{leads.filter(l => l.status === 'new').length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Booked</p>
                <h3 className="text-3xl font-black text-gray-900">{leads.filter(l => l.status === 'booked').length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion</p>
                <h3 className="text-3xl font-black text-gray-900">
                  {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'booked').length / leads.length) * 100) : 0}%
                </h3>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900">Recent Inquiries</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <div className="text-gray-300 text-4xl mb-4"><i className="fas fa-inbox"></i></div>
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No leads found yet</p>
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-black text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{lead.phone}</p>
                            <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{lead.address}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{lead.bookingDetails.from.split(' ')[0]}</span>
                              <i className="fas fa-arrow-right text-[10px] text-gray-300"></i>
                              <span className="font-bold text-gray-900">{lead.bookingDetails.to.split(' ')[0]}</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lead.bookingDetails.tripType}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{lead.bookingDetails.date}</p>
                            <p className="text-xs text-gray-500">{lead.bookingDetails.time}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              lead.vehicleType === 'SUV' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {lead.vehicleType}
                            </span>
                          </td>
                          <td className="p-4">
                            <select 
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                              className={`text-[10px] font-black uppercase tracking-widest p-2 rounded-lg outline-none cursor-pointer ${
                                lead.status === 'new' ? 'bg-lime-100 text-lime-600' :
                                lead.status === 'contacted' ? 'bg-blue-100 text-blue-600' :
                                lead.status === 'booked' ? 'bg-green-100 text-green-600' :
                                'bg-gray-100 text-gray-500'
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="booked">Booked</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <a href={`tel:${lead.phone}`} className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-all">
                                <i className="fas fa-phone-alt text-xs"></i>
                              </a>
                              <a 
                                href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600 transition-all"
                              >
                                <i className="fab fa-whatsapp text-sm"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">{editingRoute?.id ? 'Edit Route' : 'Add New Route'}</h2>
              <form onSubmit={saveRoute} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                  <input 
                    required
                    type="text" 
                    value={editingRoute?.destination || ''}
                    onChange={(e) => setEditingRoute(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g. Ranchi"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                  <input 
                    required
                    type="text" 
                    value={editingRoute?.time || ''}
                    onChange={(e) => setEditingRoute(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g. 3h 0m"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Distance</label>
                  <input 
                    required
                    type="text" 
                    value={editingRoute?.distance || ''}
                    onChange={(e) => setEditingRoute(prev => ({ ...prev, distance: e.target.value }))}
                    placeholder="e.g. 112 km"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sedan Price</label>
                  <input 
                    required
                    type="number" 
                    value={editingRoute?.sedan || ''}
                    onChange={(e) => setEditingRoute(prev => ({ ...prev, sedan: Number(e.target.value) }))}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SUV Price</label>
                  <input 
                    required
                    type="number" 
                    value={editingRoute?.ertiga || ''}
                    onChange={(e) => setEditingRoute(prev => ({ ...prev, ertiga: Number(e.target.value) }))}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-black text-[#A3E635] py-3 rounded-xl font-black uppercase tracking-widest text-xs">
                    {editingRoute?.id ? 'Update' : 'Add'}
                  </button>
                  {editingRoute && (
                    <button type="button" onClick={() => setEditingRoute(null)} className="px-4 bg-gray-100 text-gray-500 rounded-xl font-black uppercase tracking-widest text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sedan</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">SUV</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {routes.map((route) => (
                      <tr key={route.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-black text-gray-900">{route.destination}</td>
                        <td className="p-4">
                          <p className="text-xs font-bold text-gray-900">{route.time}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{route.distance}</p>
                        </td>
                        <td className="p-4 font-black text-gray-900">₹{route.sedan}</td>
                        <td className="p-4 font-black text-gray-900">₹{route.ertiga}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingRoute(route)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                              <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button onClick={() => deleteRoute(route.id)} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                              <i className="fas fa-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">{editingCar?.id ? 'Edit Car' : 'Add New Car'}</h2>
              <form onSubmit={saveCar} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Car Name</label>
                  <input 
                    required
                    type="text" 
                    value={editingCar?.name || ''}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Sedan"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Models</label>
                  <input 
                    required
                    type="text" 
                    value={editingCar?.models || ''}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, models: e.target.value }))}
                    placeholder="e.g. Dzire / Aura"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                  <input 
                    required
                    type="text" 
                    value={editingCar?.capacity || ''}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="e.g. 4+1"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                  <select 
                    value={editingCar?.type || 'Sedan'}
                    onChange={(e) => setEditingCar(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 font-bold text-gray-900 outline-none focus:border-black appearance-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-black text-[#A3E635] py-3 rounded-xl font-black uppercase tracking-widest text-xs">
                    {editingCar?.id ? 'Update' : 'Add'}
                  </button>
                  {editingCar && (
                    <button type="button" onClick={() => setEditingCar(null)} className="px-4 bg-gray-100 text-gray-500 rounded-xl font-black uppercase tracking-widest text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-[#A3E635] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl text-gray-400 group-hover:bg-[#A3E635] group-hover:text-black transition-all">
                      <i className="fas fa-car"></i>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCar(car)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => deleteCar(car.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900">{car.name}</h3>
                  <p className="text-gray-500 font-medium mb-4">{car.models}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-users text-gray-300 text-xs"></i>
                      <span className="text-xs font-black text-gray-900">{car.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-tag text-gray-300 text-xs"></i>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{car.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
