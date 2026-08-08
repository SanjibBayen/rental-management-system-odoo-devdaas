import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, Clock, CheckCircle, Package } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateHelpers';

interface RouteStop {
  id: string;
  type: 'Pickup' | 'Delivery' | 'Return';
  location: string;
  address: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  distance: string;
  rentalId?: string;
}

export default function Route() {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchRouteStops();
  }, []);

  const fetchRouteStops = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch today's pickups and returns
      const [pickupsRes, returnsRes] = await Promise.all([
        api.pickups.getToday(),
        api.returns.getToday(),
      ]);

      // Map pickups to stops
      const pickupStops: RouteStop[] = (pickupsRes.data || []).map((p: any) => ({
        id: p.id,
        type: 'Pickup',
        location: p.customer_name || 'Unknown Customer',
        address: p.address_line1 || 'No address provided',
        time: new Date(p.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        distance: '—',
        rentalId: p.rental_id,
      }));

      // Map returns to stops
      const returnStops: RouteStop[] = (returnsRes.data || []).map((r: any) => ({
        id: r.id,
        type: 'Return',
        location: r.customer_name || 'Unknown Customer',
        address: r.address_line1 || 'No address provided',
        time: new Date(r.return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        distance: '—',
        rentalId: r.rental_id,
      }));

      // Combine, sort by time, and optimize route via AI
      const allStops = [...pickupStops, ...returnStops]
        .sort((a, b) => a.time.localeCompare(b.time));

      // If there are addresses, try to optimize route via AI
      if (allStops.length > 1) {
        try {
          const addresses = allStops.map(s => s.address);
          const optimized = await api.ai.optimizeRoute({ addresses });
          // Reorder stops based on optimized route
          const orderedStops = optimized.optimized_route
            .map((address: string) => allStops.find(s => s.address === address))
            .filter(Boolean) as RouteStop[];
          setStops(orderedStops);
        } catch (err) {
          // Fallback to time-based order if AI fails
          setStops(allStops);
        }
      } else {
        setStops(allStops);
      }
    } catch (err) {
      console.error('Failed to fetch route stops:', err);
      setError('Failed to load route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    // Update first pending stop to 'In Progress'
    const firstPending = stops.find(s => s.status === 'Pending');
    if (firstPending) {
      setStops(stops.map(s => 
        s.id === firstPending.id ? { ...s, status: 'In Progress' } : s
      ));
    }
    setTimeout(() => setIsNavigating(false), 5000);
  };

  const handleCompleteStop = async (stopId: string) => {
    try {
      const stop = stops.find(s => s.id === stopId);
      if (!stop) return;

      // Update status in backend
      if (stop.type === 'Pickup') {
        await api.pickups.confirm(stopId, { notes: 'Completed via route' });
      } else if (stop.type === 'Return') {
        await api.returns.confirm(stopId);
      }

      // Update UI
      setStops(stops.map(s => 
        s.id === stopId ? { ...s, status: 'Completed' } : s
      ));

      // Auto-start next pending stop
      const nextPending = stops.find(s => s.status === 'Pending' && s.id !== stopId);
      if (nextPending) {
        setStops(stops.map(s => 
          s.id === nextPending.id ? { ...s, status: 'In Progress' } : s
        ));
      }
    } catch (err) {
      console.error('Failed to complete stop:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading route...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
        <div className="text-center py-20">
          <p className="text-danger-red font-bold">{error}</p>
          <button 
            onClick={fetchRouteStops}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Today's Route</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Optimized path for {stops.length} scheduled stops.</p>
        </div>
        <button 
          onClick={handleStartNavigation}
          disabled={isNavigating || stops.every(s => s.status === 'Completed')}
          className={`px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm ${
            isNavigating || stops.every(s => s.status === 'Completed')
              ? 'bg-surface-muted text-on-surface-variant cursor-not-allowed'
              : 'bg-primary text-white hover:bg-opacity-90 active:scale-95'
          }`}
        >
          <Navigation2 className="w-4 h-4" /> 
          {isNavigating ? 'Navigating...' : stops.every(s => s.status === 'Completed') ? 'Route Complete' : 'Start Navigation'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2 bg-surface-container-highest rounded-2xl min-h-125 flex items-center justify-center border border-border-standard relative overflow-hidden shadow-inner">
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
        <div className="bg-white rounded-2xl shadow-sm border border-border-standard p-6 h-fit max-h-150 overflow-y-auto">
          <h2 className="text-xl font-black text-on-surface mb-6 border-b border-border-standard pb-4">Stops Schedule</h2>
          
          <div className="space-y-4">
            {stops.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                No stops scheduled for today.
              </div>
            ) : (
              stops.map((stop, index) => (
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
                    {stop.status === 'Pending' && (
                      <button 
                        onClick={() => handleCompleteStop(stop.id)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}