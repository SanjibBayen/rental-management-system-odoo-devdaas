import React from 'react';
import { ArrowLeft, Star, ShoppingCart, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';

export default function ProductDetail({ 
  productId, 
  setActiveView 
}: { 
  productId: string, 
  setActiveView: (v: string) => void 
}) {
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();

  // Find the product from the products list
  const product = products.find(p => p.id === productId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-margin-desktop py-20 text-center">
        <div className="animate-pulse text-on-surface-variant">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-margin-desktop py-20 text-center">
        <h2 className="text-2xl font-bold text-on-surface">Product Not Found</h2>
        <p className="text-on-surface-variant mt-2">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => setActiveView('catalog')} 
          className="text-primary font-bold mt-4 hover:underline"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <button 
        onClick={() => setActiveView('catalog')}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-border-standard overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="bg-surface-muted p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-border-standard">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200'} 
              alt={product.name} 
              className="w-full max-w-md object-contain aspect-square hover:scale-105 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="text-outline font-bold text-sm uppercase tracking-wider mb-2">
              {product.brand || 'Premium'} • {product.category || 'Equipment'}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-on-surface leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 fill-warning-amber text-warning-amber" />
              <span className="font-bold text-lg text-on-surface">{product.rating}</span>
              <span className="text-on-surface-variant font-medium">({product.reviewsCount} reviews)</span>
            </div>

            <p className="text-on-surface-variant leading-relaxed mb-8">
              {product.description || `Professional-grade ${product.category || 'equipment'}. Inspected and maintained to factory standards. Perfect for your next major project. Includes standard accessories and protective casing.`}
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                <CheckCircle2 className="w-5 h-5 text-success-teal" /> Available for immediate pickup/delivery
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                <ShieldAlert className="w-5 h-5 text-primary" /> Insurance deposit required at checkout
              </div>
            </div>

            <div className="mt-auto border-t border-border-standard pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="text-outline font-medium text-sm mb-1">Rental Rate</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-primary">₹{product.pricePerDay}</span>
                  <span className="text-on-surface-variant font-medium">/ day</span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => addToCart(product)}
                  className="p-4 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-bold transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => { addToCart(product); setActiveView('cart'); }}
                  className="flex-1 sm:flex-none px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-opacity-90 transition-opacity"
                >
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}