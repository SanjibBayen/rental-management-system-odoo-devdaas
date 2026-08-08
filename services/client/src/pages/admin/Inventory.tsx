import React from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { products } from '../../data';

export default function Inventory() {
  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Inventory Management</h1>
          <p className="text-on-surface-variant font-medium mt-1">Manage your rental equipment and stock levels.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-standard overflow-hidden">
        <div className="p-4 border-b border-border-standard flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-muted">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-white border border-border-standard rounded-lg font-medium text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              placeholder="Search inventory..."
            />
          </div>
          <button className="w-full sm:w-auto px-4 py-2 border border-border-standard rounded-lg font-bold text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-muted border-b border-border-standard">
              <tr>
                <th className="px-6 py-4 font-bold text-on-surface text-sm">Item Name</th>
                <th className="px-6 py-4 font-bold text-on-surface text-sm">Category</th>
                <th className="px-6 py-4 font-bold text-on-surface text-sm">Stock</th>
                <th className="px-6 py-4 font-bold text-on-surface text-sm">Price/Day</th>
                <th className="px-6 py-4 font-bold text-on-surface text-sm">Status</th>
                <th className="px-6 py-4 font-bold text-on-surface text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => {
                const stock = index === 1 ? 0 : 5 + index;
                const totalStock = index === 1 ? 2 : 10 + index;
                
                return (
                <tr key={index} className="border-b border-border-standard hover:bg-surface-muted/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-on-surface">{item.name}</td>
                  <td className="px-6 py-4 text-on-surface-variant font-medium">{item.category}</td>
                  <td className="px-6 py-4 font-mono">{stock} / {totalStock}</td>
                  <td className="px-6 py-4 font-bold text-primary">₹{item.pricePerDay}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${stock > 0 ? 'bg-success-teal/10 text-success-teal' : 'bg-danger-red/10 text-danger-red'}`}>
                      {stock > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button className="p-1 text-on-surface-variant hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1 text-on-surface-variant hover:text-danger-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
