import React from 'react';
import { MapPin, Navigation2, Clock } from 'lucide-react';

export default function Route() {
  const stops = [
    { id: 1, type: 'Pickup', location: 'Main Warehouse - Section A', time: '08:00 AM', status: 'Completed', distance: '0 km' },
    { id: 2, type: 'Delivery', location: '123 Construction Site, Downtown', time: '09:30 AM', status: 'In Progress', distance: '12.5 km' },
    { id: 3, type: 'Pickup', location: '456 Industrial Park, Westside', time: '11:00 AM', status: 'Pending', distance: '8.2 km' },
    { id: 4, type: 'Delivery', location: '789 Residential Complex, North', time: '02:00 PM', status: 'Pending', distance: '15.0 km' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Today's Route</h1>
          <p className="text-on-surface-variant font-medium mt-1">Optimized path for 4 scheduled stops.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
          <Navigation2 className="w-5 h-5" /> Start Navigation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-highest rounded-2xl min-h-[400px] flex items-center justify-center border border-border-standard relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-muted bg-cover bg-center"></div>
          <div className="z-10 bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg border border-border-standard text-center max-w-sm">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-lg text-on-surface">Map View</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-2">Map integration would render here with the optimized delivery route.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border-standard p-6">
          <h2 className="text-xl font-bold text-on-surface mb-6">Stops Schedule</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-standard before:to-transparent">
            {stops.map((stop) => (
              <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm
                  ${stop.status === 'Completed' ? 'bg-success-teal text-white' : 
                    stop.status === 'In Progress' ? 'bg-primary text-white' : 'bg-surface-container-highest text-outline'}`}>
                  {stop.type === 'Pickup' ? <MapPin className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </div>
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border-standard bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${stop.type === 'Delivery' ? 'bg-info-blue/10 text-info-blue' : 'bg-warning-amber/10 text-warning-amber'}`}>
                      {stop.type}
                    </span>
                    <span className="text-xs font-medium text-outline flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {stop.time}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface leading-tight mb-1">{stop.location}</h4>
                  <div className="text-xs text-on-surface-variant font-medium">{stop.distance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
