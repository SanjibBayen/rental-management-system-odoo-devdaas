import React from 'react';
import { ArrowRight, ShieldCheck, Clock, PenTool } from 'lucide-react';
import { products } from '../../data';
import ProductCard from '../../components/ProductCard';

export default function Home({ setActiveView, setSelectedProductId }: { setActiveView: (v: string) => void, setSelectedProductId: (id: string) => void }) {
  const featured = products.slice(0, 3);
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-margin-desktop">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-black leading-tight tracking-tight">Professional Gear, Ready When You Are.</h1>
            <p className="text-xl text-primary-container font-medium max-w-lg">
              RentFlow provides top-tier enterprise equipment for construction, audio-visual, and specialized industries with same-day delivery.
            </p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setActiveView('catalog')}
                className="bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-surface-muted transition-colors flex items-center gap-2"
              >
                Browse Catalog <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video bg-surface-muted">
              <img src="https://images.unsplash.com/photo-1541888087616-20092bc3ffc6?auto=format&fit=crop&w=1200&q=80" alt="Construction Equipment" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-muted py-16 px-margin-desktop border-b border-border-standard">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-border-standard flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">Quality Assured</h3>
              <p className="text-on-surface-variant text-sm">Every item is rigorously inspected and serviced before every rental.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border-standard flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary"><Clock className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">Fast Delivery</h3>
              <p className="text-on-surface-variant text-sm">Same-day delivery available for premium members in select locations.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border-standard flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary"><PenTool className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-lg mb-1">Odoo Integrated</h3>
              <p className="text-on-surface-variant text-sm">Seamlessly syncing your inventory, invoicing, and fleet routing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-margin-desktop max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-on-surface">Featured Equipment</h2>
            <p className="text-on-surface-variant mt-2 font-medium">Top picks for your next project.</p>
          </div>
          <button onClick={() => setActiveView('catalog')} className="text-primary font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(product => (
            <div key={product.id} onClick={() => { setSelectedProductId(product.id); setActiveView('product_detail'); }} className="cursor-pointer h-full">
              <ProductCard product={product} setActiveView={setActiveView} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
