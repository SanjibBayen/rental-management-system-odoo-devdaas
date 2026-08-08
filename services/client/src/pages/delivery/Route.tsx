import React, { useState } from 'react';
import { MapPin, Navigation2, Clock, CheckCircle, Package } from 'lucide-react';

export default function Route() {
  const [isNavigating, setIsNavigating] = useState(false);
  
  const stops = [
    { id: 1, type: 'Pickup', location: 'Main Warehouse - Section A', time: '08:00 AM', status: 'Completed', distance: '0 km' },
    { id: 2, type: 'Delivery', location: '123 Construction Site, Downtown', time: '09:30 AM', status: 'In Progress', distance: '12.5 km' },
    { id: 3, type: 'Pickup', location: '456 Industrial Park, Westside', time: '11:00 AM', status: 'Pending', distance: '8.2 km' },
    { id: 4, type: 'Delivery', location: '789 Residential Complex, North', time: '02:00 PM', status: 'Pending', distance: '15.0 km' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8 relative">
      
      {isNavigating && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 z-50 bg-info-blue text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
          <Navigation2 className="w-6 h-6 animate-spin-slow" />
          <div>
            <div className="font-bold text-sm">Navigation Started</div>
            <div className="text-xs opacity-90">Routing to next destination...</div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Today's Route</h1>
          <p className="text-on-surface-variant font-medium mt-1">Optimized path for {stops.length} scheduled stops.</p>
        </div>
        <button 
          onClick={() => {
            setIsNavigating(true);
            setTimeout(() => setIsNavigating(false), 5000);
          }}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md ${isNavigating ? 'bg-surface-muted text-on-surface-variant cursor-not-allowed' : 'bg-primary text-white hover:bg-opacity-90 hover:shadow-lg'}`}
        >
          <Navigation2 className="w-5 h-5" /> {isNavigating ? 'Navigating...' : 'Start Navigation'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2 bg-surface-container-highest rounded-2xl min-h-[500px] flex items-center justify-center border border-border-standard relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-surface-muted bg-cover bg-center opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')" }}></div>
          <div className="z-10 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border-standard text-center max-w-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-black text-xl text-on-surface mb-2">Live Map View</h3>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              Google Maps integration would render here, showing real-time traffic and optimized Odoo fleet routing.
            </p>
          </div>
        </div>

        {/* Schedule list */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-standard p-6 h-fit max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-black text-on-surface mb-6 border-b border-border-standard pb-4">Stops Schedule</h2>
          
          <div className="space-y-4">
            {stops.map((stop, index) => (
              <div key={stop.id} className={`p-4 rounded-xl border ${stop.status === 'Completed' ? 'border-success-teal/30 bg-success-teal/5' : stop.status === 'In Progress' ? 'border-primary shadow-md bg-primary/5' : 'border-border-standard'} transition-all`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${stop.status === 'Completed' ? 'bg-success-teal' : stop.status === 'In Progress' ? 'bg-primary' : 'bg-surface-dim text-on-surface'}`}>
                      {stop.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> : <span>{index + 1}</span>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${stop.type === 'Delivery' ? 'bg-info-blue/10 text-info-blue' : 'bg-warning-amber/10 text-warning-amber'}`}>
                      {stop.type}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-outline flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {stop.time}
                  </span>
                </div>
                
                <h4 className="font-bold text-sm text-on-surface leading-tight mb-2 mt-3">{stop.location}</h4>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-standard/50">
                  <div className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {stop.distance}
                  </div>
                  {stop.status === 'In Progress' && (
                    <span className="text-xs font-bold text-primary animate-pulse flex items-center gap-1">
                      <Navigation2 className="w-3 h-3" /> Current Stop
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
