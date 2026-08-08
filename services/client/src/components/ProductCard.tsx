import { Product } from '../types';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
  setActiveView?: (view: string) => void;
  key?: string | number;
}

export default function ProductCard({ product, setActiveView }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Logic: if rating > 4.5, it's Top Recommended
  const displayBadge = product.rating > 4.5 
    ? { text: 'Top Recommended', type: 'warning' as const } 
    : product.badge;
  
  const getBadgeStyle = () => {
    if (!displayBadge) return '';
    switch (displayBadge.type) {
      case 'success': return 'bg-success-teal text-white';
      case 'info': return 'bg-primary text-white';
      case 'warning': return 'bg-warning-amber text-white';
      default: return 'bg-surface-dim text-on-surface';
    }
  };

  const handleRentNow = () => {
    addToCart(product);
    if (setActiveView) {
      setActiveView('cart');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border-standard overflow-hidden flex flex-col h-full group hover:shadow-md hover:border-primary transition-all">
      <div className="relative h-48 w-full bg-surface-container-low overflow-hidden flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
          referrerPolicy="no-referrer"
        />
        {displayBadge && (
          <div className={`absolute top-3 left-3 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${getBadgeStyle()}`}>
            {displayBadge.text}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-outline font-bold text-[11px] uppercase tracking-wider mb-1">
          {product.brand}
        </div>
        <h3 className="font-bold text-lg text-on-surface mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mb-5">
          <Star className="w-4 h-4 fill-warning-amber text-warning-amber" />
          <span className="font-bold text-sm text-on-surface">{product.rating}</span>
          <span className="font-medium text-xs text-outline">({product.reviewsCount} reviews)</span>
        </div>
        
        <div className="mt-auto flex items-end justify-between pt-4 border-t border-border-standard">
          <div>
            <div className="font-medium text-xs text-outline mb-0.5">Starting at</div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-2xl text-primary">₹{product.pricePerDay}</span>
              <span className="font-medium text-sm text-outline">/day</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              className="bg-surface-muted text-primary border border-primary/20 font-bold p-2.5 rounded-lg hover:bg-primary/10 transition-colors shadow-sm cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleRentNow(); }}
              className="bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
