import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';

export default function Customers() {
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
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Customers</h1>
          <p className="text-on-surface-variant font-medium mt-1">View and manage customer accounts and history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <div key={index} className="bg-white border border-border-standard rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                {customer.name.charAt(0)}
              </div>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-bold text-xl text-on-surface leading-tight">{customer.name}</h3>
            <p className="text-outline font-medium text-sm mb-4">{customer.company}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                <Mail className="w-4 h-4 text-outline" /> {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                <Phone className="w-4 h-4 text-outline" /> {customer.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border-standard">
              <div>
                <div className="text-xs text-outline font-medium">Active Rentals</div>
                <div className="font-bold text-lg text-on-surface">{customer.activeRentals}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-outline font-medium">Total Spent</div>
                <div className="font-bold text-lg text-primary">{customer.totalSpent}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
