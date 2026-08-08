import React from 'react';
import { Calendar, Package, Clock, CheckCircle2 } from 'lucide-react';

export default function MyRentals() {
  const rentals = [
    { id: 'RNT-001', item: 'Heavy Duty Excavator 5000', startDate: '2023-11-01', endDate: '2023-11-15', status: 'Active', cost: '₹4,500' },
    { id: 'RNT-002', item: 'Industrial Generator 100kW', startDate: '2023-10-15', endDate: '2023-10-20', status: 'Completed', cost: '₹850' },
    { id: 'RNT-003', item: 'Scaffolding Set (50m)', startDate: '2023-11-20', endDate: '2023-12-05', status: 'Upcoming', cost: '₹1,200' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-on-surface tracking-tight">My Rentals</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
          Extend a Rental
        </button>
      </div>

      <div className="grid gap-6">
        {rentals.map((rental) => (
          <div key={rental.id} className="bg-white border border-border-standard rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">{rental.item}</h3>
                <div className="text-sm text-on-surface-variant font-medium mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {rental.startDate} to {rental.endDate}</span>
                  <span className="text-outline">|</span>
                  <span className="font-mono text-outline">{rental.id}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <div className="font-bold text-xl text-primary">{rental.cost}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                ${rental.status === 'Active' ? 'bg-success-teal/10 text-success-teal' : 
                  rental.status === 'Completed' ? 'bg-surface-container-highest text-on-surface-variant' : 
                  'bg-warning-amber/10 text-warning-amber'}`}>
                {rental.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                {rental.status === 'Upcoming' && <Clock className="w-3 h-3" />}
                {rental.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
 