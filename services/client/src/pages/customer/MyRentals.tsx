import React, { useState } from 'react';
import { Package, Clock, ShieldCheck, Download, ExternalLink, Calendar } from 'lucide-react';
import Modal from '../../components/Modal';

export default function MyRentals() {
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<any>(null);

  const handleExtendRental = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExtendModalOpen(false);
    alert('Rental extended successfully! (Simulation)');
  };

  const rentals = [
    {
      id: "ORD-90210",
      status: "active",
      product: "Sony Alpha a7 IV Mirrorless Camera",
      startDate: "Oct 20, 2023",
      endDate: "Oct 25, 2023",
      price: "₹120.00",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
      daysLeft: 2
    },
    {
      id: "ORD-88042",
      status: "completed",
      product: "DJI Mavic 3 Pro Drone",
      startDate: "Sep 12, 2023",
      endDate: "Sep 15, 2023",
      price: "₹450.00",
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">My Rentals</h1>
          <p className="text-on-surface-variant text-sm font-medium mt-1">Manage your active rentals and view past orders.</p>
        </div>
        <button 
          onClick={() => { setSelectedRental(rentals[0]); setIsExtendModalOpen(true); }}
          className="bg-surface-muted text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/10 transition-colors border border-border-standard flex items-center gap-2 shadow-sm"
        >
          <Calendar className="w-4 h-4" /> Extend a Rental
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {rentals.map((rental) => (
            <div key={rental.id} className="bg-white rounded-xl border border-border-standard p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-border-standard pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    rental.status === 'active' ? 'bg-success-teal/10 text-success-teal' : 'bg-surface-muted text-on-surface-variant'
                  }`}>
                    {rental.status === 'active' ? 'Active Rental' : 'Completed'}
                  </div>
                  <div className="font-mono text-sm text-outline font-medium">
                    Order #{rental.id}
                  </div>
                </div>
                {rental.status === 'active' && (
                  <div className="flex items-center gap-1.5 text-warning-amber bg-warning-amber/10 px-3 py-1 rounded-full text-xs font-bold">
                    <Clock className="w-4 h-4" /> {rental.daysLeft} days remaining
                  </div>
                )}
              </div>
              
              <div className="flex gap-6">
                <div className="w-24 h-24 bg-surface-container-low rounded-lg p-2 border border-border-standard flex-shrink-0">
                  <img src={rental.image} alt={rental.product} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-on-surface mb-2">{rental.product}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-outline font-medium mb-1">Rental Period</div>
                      <div className="font-bold text-sm text-on-surface">{rental.startDate} - {rental.endDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-outline font-medium mb-1">Total Paid</div>
                      <div className="font-bold text-sm text-primary">{rental.price}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border-standard">
                <button className="flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors">
                  <Download className="w-4 h-4" /> Download Invoice
                </button>
                <div className="flex-1"></div>
                {rental.status === 'active' && (
                  <>
                    <button 
                      onClick={() => { setSelectedRental(rental); setIsExtendModalOpen(true); }}
                      className="px-4 py-2 border border-border-standard rounded-lg text-sm font-bold text-on-surface hover:bg-surface-muted transition-colors"
                    >
                      Extend
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity">
                      Return Instructions
                    </button>
                  </>
                )}
                {rental.status === 'completed' && (
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity">
                    Rent Again
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="bg-surface-muted p-6 rounded-xl border border-border-standard">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Rental Protection
            </h3>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
              All active rentals are covered by our standard damage waiver. In case of accidental damage, your liability is limited.
            </p>
            <a href="#" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
              View coverage details <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-border-standard shadow-sm">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Return Drop-off
            </h3>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
              Returns are due by 5:00 PM on the final day of your rental period. 
            </p>
            <div className="p-3 bg-surface-container rounded-lg border border-border-standard text-sm">
              <div className="font-bold text-on-surface">Odoo Headquarters</div>
              <div className="text-on-surface-variant font-medium">123 Business Avenue, Suite 100<br/>San Francisco, CA 94107</div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isExtendModalOpen} onClose={() => setIsExtendModalOpen(false)} title="Extend Rental">
        <form onSubmit={handleExtendRental} className="space-y-4">
          {selectedRental && (
            <div className="bg-surface-muted p-4 rounded-xl border border-border-standard mb-4 flex gap-4 items-center">
              <img src={selectedRental.image} alt={selectedRental.product} className="w-12 h-12 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
              <div>
                <h4 className="font-bold text-sm text-on-surface">{selectedRental.product}</h4>
                <p className="text-xs text-outline font-medium">Current end date: {selectedRental.endDate}</p>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">New End Date</label>
            <input required type="date" className="w-full px-4 py-2 border border-border-standard rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="text-on-surface-variant">Extension Cost (Estimated)</span>
              <span className="font-bold text-primary">₹150.00</span>
            </div>
            <p className="text-xs text-outline">You will be charged when the extension is approved.</p>
          </div>

          <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
            <button type="button" onClick={() => setIsExtendModalOpen(false)} className="px-4 py-2 font-bold text-on-surface-variant hover:bg-surface-muted rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity">Request Extension</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
