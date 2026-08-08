import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Cart({ setActiveView }: { setActiveView: (view: string) => void }) {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate API call for payment
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        setActiveView('rentals');
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-20 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-success-teal/10 text-success-teal rounded-full flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-on-surface mb-4">Payment Successful!</h2>
        <p className="text-on-surface-variant mb-8 max-w-md">Your order has been confirmed and is being prepared for dispatch. You will be redirected to your rentals shortly.</p>
      </div>
    );
  }

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
          <div className="bg-white rounded-xl border border-border-standard p-6 mb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Rental Agreement & Insurance</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              By proceeding, you agree to our standard terms of service. A temporary hold will be placed on your card for the deposit amount until the equipment is safely returned.
            </p>
          </div>
          
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-border-standard p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-full sm:w-24 h-48 sm:h-24 bg-surface-container-low rounded-lg p-2 shrink-0 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-on-surface leading-tight">{item.name}</h3>
                <div className="text-outline text-sm font-medium mb-2">{item.brand}</div>
                <div className="text-primary font-bold text-lg">₹{item.pricePerDay} <span className="text-sm text-outline font-medium">/ day</span></div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                <div className="font-medium text-sm text-on-surface border border-border-standard px-3 py-1.5 rounded-lg bg-surface-muted">
                  Qty: {item.quantity}
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-on-surface-variant hover:text-danger-red p-2 bg-white rounded-lg border border-transparent hover:border-danger-red/20 transition-all"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl border border-border-standard p-6 h-fit sticky top-24 shadow-sm">
          <h3 className="font-bold text-xl mb-6 border-b border-border-standard pb-4">Payment Summary</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-medium text-on-surface">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Tax (18%)</span>
              <span className="font-medium text-on-surface">₹{(totalPrice * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Insurance Deposit</span>
              <span className="font-medium text-on-surface">₹500.00</span>
            </div>
            <div className="border-t border-border-standard pt-4 flex justify-between font-black text-xl text-primary">
              <span>Total / day</span>
              <span>₹{((totalPrice * 1.18) + 500).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            disabled={isProcessing}
            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${isProcessing ? 'bg-outline cursor-not-allowed' : 'bg-primary hover:bg-opacity-90 shadow-md hover:shadow-lg'}`}
            onClick={handleCheckout}
          >
            {isProcessing ? 'Processing Payment...' : (
              <>Pay Securely <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
          
          <p className="text-xs text-center text-outline mt-4 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Secured by Odoo Payments
          </p>
        </div>
      </div>
    </div>
  );
}
