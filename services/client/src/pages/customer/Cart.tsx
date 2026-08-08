import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import Modal from "../../components/Modal";
import { api } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

export default function Cart({
  setActiveView,
}: {
  setActiveView: (view: string) => void;
}) {
  const { items, removeFromCart, totalPrice, clearCart, isLoading } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate grand total
  const subtotal = totalPrice;
  const tax = subtotal * 0.18;
  const deposit = 500;
  const grandTotal = subtotal + tax + deposit;

  const handleInitiatePayment = () => {
    if (!user) {
      setError("Please login to proceed with payment.");
      return;
    }
    setIsRazorpayOpen(true);
    setError(null);
  };

  const handleRazorpaySuccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRazorpayOpen(false);
    setIsProcessing(true);
    setError(null);

    try {
      if (!user) {
        setError("User not found. Please login.");
        setIsProcessing(false);
        return;
      }
      // 1. Create rental via API
      const rentalResponse = await api.rentals.create({
        user_id: user.id,
        product_id: items[0].id, // For now, one product per rental
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        total_amount: totalPrice,
        deposit_amount: deposit,
      });

      const rentalId = rentalResponse.data.id;

      // 2. Create Razorpay order (you'd call your backend to create an order)
      // For demo, we'll simulate a payment ID
      const paymentId = "pay_" + Math.random().toString(36).substr(2, 12);

      // 3. Confirm payment with backend
      await api.rentals.confirmPayment(rentalId, {
        payment_id: paymentId,
        status: "completed",
        amount: grandTotal,
      });

      // 4. Clear cart and show success
      clearCart();
      setIsSuccess(true);

      // 5. Redirect after 3 seconds
      setTimeout(() => {
        setActiveView("rentals");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-20 text-center">
        <div className="animate-pulse text-on-surface-variant">
          Loading cart...
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-20 text-center flex flex-col items-center justify-center animate-fade-in-up">
        <div className="w-24 h-24 bg-success-teal text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-success-teal/20 scale-in-center">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-on-surface mb-4">
          Payment Successful!
        </h2>
        <p className="text-lg text-on-surface-variant mb-8 max-w-md">
          Your order has been confirmed and is being prepared for dispatch. You
          will be redirected to your rentals shortly.
        </p>
        <div className="flex items-center gap-2 text-sm font-bold text-outline">
          <div className="w-4 h-4 rounded-full border-2 border-t-primary border-primary/30 animate-spin"></div>
          Redirecting...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-margin-desktop py-20 text-center">
        <div className="w-24 h-24 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-6 text-outline">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our
          top-tier gear today.
        </p>
        <button
          onClick={() => setActiveView("catalog")}
          className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-opacity-90 transition-opacity shadow-sm"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-margin-desktop py-8 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-8">
        Checkout
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-danger-red/10 border border-danger-red/20 rounded-xl text-danger-red font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border-standard p-6 mb-4 shadow-sm flex gap-4 items-start">
            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 text-on-surface">
                Rental Agreement & Insurance
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                By proceeding, you agree to our standard terms of service. A
                temporary hold will be placed on your card for the deposit
                amount until the equipment is safely returned.
              </p>
            </div>
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-border-standard p-4 flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full sm:w-28 h-48 sm:h-28 bg-surface-container-low rounded-xl p-3 shrink-0 flex items-center justify-center border border-border-standard">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-on-surface leading-tight text-lg mb-1">
                  {item.name}
                </h3>
                <div className="text-outline text-sm font-bold uppercase tracking-wider mb-3">
                  {item.brand}
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-primary font-black text-2xl">
                    ₹{item.pricePerDay}
                  </div>
                  <div className="text-sm text-outline font-medium mb-1">
                    / day
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                <div className="font-bold text-sm text-on-surface border border-border-standard px-4 py-2 rounded-lg bg-surface-muted shadow-sm">
                  Qty: {item.quantity}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-on-surface-variant hover:text-danger-red hover:bg-danger-red/10 p-2.5 rounded-lg border border-transparent transition-colors flex items-center justify-center"
                  title="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border-standard p-8 h-fit sticky top-24 shadow-lg shadow-surface-muted">
          <h3 className="font-black text-xl mb-6 border-b border-border-standard pb-4 flex items-center gap-2">
            Payment Summary
          </h3>
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between text-on-surface-variant font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-on-surface">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant font-medium">
              <span>Tax (18%)</span>
              <span className="font-bold text-on-surface">
                ₹{tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant font-medium">
              <span>Insurance Deposit</span>
              <span className="font-bold text-on-surface">
                ₹{deposit.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-border-standard pt-6 flex justify-between font-black text-2xl text-on-surface">
              <span>Total / day</span>
              <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={isProcessing}
            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${isProcessing ? "bg-outline cursor-not-allowed" : "bg-primary hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5"}`}
            onClick={handleInitiatePayment}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <>
                Pay Securely <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-outline font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" /> 256-bit Secure Encryption
          </div>
        </div>
      </div>

      <Modal
        isOpen={isRazorpayOpen}
        onClose={() => !isProcessing && setIsRazorpayOpen(false)}
        title="Secure Payment"
      >
        <form onSubmit={handleRazorpaySuccess} className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border-standard">
            <div className="font-bold text-on-surface flex items-center gap-3">
              <div className="bg-[#02042B] w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-inner">
                <span className="transform -skew-x-12">R</span>
              </div>
              <div className="flex flex-col">
                <span className="leading-none">Razorpay</span>
                <span className="text-[10px] text-outline uppercase tracking-widest mt-1">
                  Test Environment
                </span>
              </div>
            </div>
            <div className="text-primary font-black text-2xl">
              ₹{grandTotal.toFixed(2)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-on-surface">
                Card Details
              </label>
              <div className="flex gap-1 text-outline">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="border border-border-standard rounded-xl overflow-hidden shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <input
                required
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-3 border-b border-border-standard outline-none bg-white font-mono text-sm placeholder:text-outline/50"
                maxLength={19}
              />
              <div className="flex">
                <input
                  required
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 px-4 py-3 border-r border-border-standard outline-none bg-white font-mono text-sm placeholder:text-outline/50"
                  maxLength={5}
                />
                <input
                  required
                  type="text"
                  placeholder="CVC"
                  className="w-1/2 px-4 py-3 outline-none bg-white font-mono text-sm placeholder:text-outline/50"
                  maxLength={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Cardholder Name
              </label>
              <input
                required
                type="text"
                placeholder="Name on card"
                className="w-full px-4 py-3 border border-border-standard rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#02042B] text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Pay ₹{grandTotal.toFixed(2)}
          </button>

          <div className="text-center text-xs font-medium text-outline pt-2">
            This is a secure 128-bit SSL encrypted payment.
          </div>
        </form>
      </Modal>
    </div>
  );
}
