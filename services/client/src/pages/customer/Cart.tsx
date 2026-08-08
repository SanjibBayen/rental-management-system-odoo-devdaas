import React from 'react';
import { useCart } from '../../hooks/useCart';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart({ setActiveView }: { setActiveView: (view: string) => void }) {
  const { items, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-12 text-center">
        <h2 className="text-2xl font-bold text-on-surface mb-4">Your Cart is Empty</h2>
        <p className="text-on-surface-variant mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => setActiveView('catalog')}
          className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-opacity"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8">
      <h1 className="text-3xl font-black text-on-surface tracking-tight mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-border-standard p-4 flex gap-4 items-center">
              <div className="w-24 h-24 bg-surface-container-low rounded-lg p-2 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-on-surface">{item.name}</h3>
                <div className="text-outline text-sm font-medium">{item.brand}</div>
                <div className="text-primary font-bold mt-2">₹{item.pricePerDay} / day</div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="font-medium text-sm text-on-surface-variant border border-border-standard px-2 py-1 rounded">
                  Qty: {item.quantity}
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-on-surface-variant hover:text-danger-red p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl border border-border-standard p-6 h-fit sticky top-24">
          <h3 className="font-bold text-xl mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-medium text-on-surface">₹{totalPrice} / day</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Tax (18%)</span>
              <span className="font-medium text-on-surface">₹{(totalPrice * 0.18).toFixed(2)} / day</span>
            </div>
            <div className="border-t border-border-standard pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">₹{(totalPrice * 1.18).toFixed(2)} / day</span>
            </div>
          </div>
          
          <button 
            className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-opacity"
            onClick={() => {
              alert('Checkout successful!');
              setActiveView('rentals');
            }}
          >
            Confirm Rental <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
