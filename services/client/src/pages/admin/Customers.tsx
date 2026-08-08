import React, { useState } from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import Modal from '../../components/Modal';

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const customers = [
    { name: 'Sarah Jenkins', company: 'Jenkins Construction', email: 'sarah@jenkinsconst.com', phone: '+1 555-0123', activeRentals: 3, totalSpent: '₹14,500' },
    { name: 'Michael Chen', company: 'City Planners LLC', email: 'm.chen@cityplanners.com', phone: '+1 555-0198', activeRentals: 1, totalSpent: '₹2,300' },
    { name: 'BuildCorp Ltd.', company: 'BuildCorp Ltd.', email: 'admin@buildcorp.com', phone: '+1 555-0456', activeRentals: 5, totalSpent: '₹45,000' },
    { name: 'Vision Studios', company: 'Vision Events', email: 'hello@visionstudios.com', phone: '+1 555-0789', activeRentals: 0, totalSpent: '₹8,900' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Customers</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">View and manage customer accounts and history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <div key={index} className="bg-white border border-border-standard rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                {customer.name.charAt(0)}
              </div>
              <button 
                onClick={() => { setSelectedCustomer(customer); setIsProfileModalOpen(true); }}
                className="text-on-surface-variant hover:text-primary transition-colors p-1.5 hover:bg-primary/10 rounded-md"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-lg text-on-surface leading-tight truncate">{customer.name}</h3>
            <p className="text-on-surface-variant text-sm mb-4 truncate">{customer.company}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium truncate">
                <Mail className="w-4 h-4 text-outline shrink-0" /> {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium truncate">
                <Phone className="w-4 h-4 text-outline shrink-0" /> {customer.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-standard">
              <div>
                <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Active Rentals</div>
                <div className="font-bold text-base text-on-surface mt-0.5">{customer.activeRentals}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Total Spent</div>
                <div className="font-bold text-base text-primary mt-0.5">{customer.totalSpent}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Customer Profile">
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-surface-muted p-4 rounded-xl border border-border-standard">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">{selectedCustomer.name}</h3>
                <p className="text-outline font-medium text-sm">{selectedCustomer.company}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Email</div>
                <div className="text-sm font-bold text-on-surface">{selectedCustomer.email}</div>
              </div>
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Phone</div>
                <div className="text-sm font-bold text-on-surface">{selectedCustomer.phone}</div>
              </div>
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Active Rentals</div>
                <div className="text-sm font-bold text-on-surface">{selectedCustomer.activeRentals} Items</div>
              </div>
              <div className="bg-white border border-border-standard p-4 rounded-xl shadow-sm">
                <div className="text-xs text-outline font-bold uppercase mb-1">Total Spent</div>
                <div className="text-sm font-bold text-primary">{selectedCustomer.totalSpent}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-standard flex justify-end gap-3">
              <button onClick={() => setIsProfileModalOpen(false)} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity">Close Profile</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
