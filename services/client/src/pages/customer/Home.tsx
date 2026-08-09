import React from 'react';
import { ArrowRight, ShieldCheck, Clock, PenTool, Star, Zap } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types';

interface HomeProps {
  setActiveView: (view: string) => void;
  setSelectedProductId: (id: string) => void;
}

export default function Home({ setActiveView, setSelectedProductId }: HomeProps) {
  const { products, isLoading } = useProducts();

  const featured = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [products]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-[#0F172A] text-white py-24 px-margin-desktop overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 text-center lg:text-left">
           
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Premium Gear.
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-primary">
                Ready to Work.
              </span>
            </h1>
            <p className="text-xl text-slate-300 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              RentFlow provides top-tier enterprise equipment for construction,
              audio-visual, and specialized industries with same-day delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <button
                onClick={() => setActiveView('catalog')}
                className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
              >
                Browse Catalog
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 hidden md:block w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video lg:aspect-square bg-surface-muted max-w-lg ml-auto group">
              <div className="absolute inset-0 bg-linear-to-t from-[#0F172A] via-transparent to-transparent z-10 opacity-60" />
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
                alt="Professional Equipment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex-1">
                  <div className="text-warning-amber flex gap-1 mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div className="font-bold text-sm">
                    "Flawless gear, arrived in 2 hours."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface-muted py-20 px-margin-desktop border-b border-border-standard">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-on-surface">
              Why Professionals Choose RentFlow
            </h2>
            <p className="text-on-surface-variant mt-3 font-medium text-lg">
              Enterprise-grade reliability at your fingertips.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-border-standard shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-xl text-primary mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-on-surface">
                Quality Assured
              </h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                Every item is rigorously inspected, cleaned, and serviced before
                every rental to ensure zero downtime on your projects.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-border-standard shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-xl text-primary mb-6">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-on-surface">
                Fast Delivery
              </h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                Same-day delivery available for premium members in select
                locations. Get your gear precisely when you need it.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-border-standard shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-14 h-14 flex items-center justify-center rounded-xl text-primary mb-6">
                <PenTool className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-on-surface">
                Odoo Integrated
              </h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                Seamlessly syncs your inventory, invoicing, and fleet routing
                directly with your existing Odoo workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-margin-desktop max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-on-surface">
              Featured Equipment
            </h2>
            <p className="text-on-surface-variant mt-2 font-medium text-lg">
              Top picks for your next project, highly rated by experts.
            </p>
          </div>
          <button
            onClick={() => setActiveView('catalog')}
            className="text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            View All Catalog
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-on-surface-variant">
              Loading featured products...
            </div>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            No featured products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product: Product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProductId(product.id);
                  setActiveView('product_detail');
                }}
                className="cursor-pointer h-full"
              >
                <ProductCard product={product} setActiveView={setActiveView} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}