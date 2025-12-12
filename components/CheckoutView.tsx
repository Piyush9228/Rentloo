
import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Smartphone, ShieldCheck, Loader2, ArrowLeft, AlertCircle, Check, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { backendService } from '../services/backend';
import { PaymentMethod } from '../types';

interface CheckoutViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onSuccess }) => {
  const { cartTotal, items, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const total = cartTotal + (items.length * 200);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Process Payment
      const paymentResult = await backendService.processPayment(total, activeMethod);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // 2. Create Order
      await backendService.createOrder({
        items,
        totalAmount: total,
        customerDetails: {
          name: formData.name,
          email: formData.email,
          address: `${formData.address}, ${formData.city} ${formData.zip}`
        },
        paymentMethod: activeMethod
      });

      // 3. Success
      clearCart();
      onSuccess();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 max-w-4xl">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Cart
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Main Checkout Form */}
        <div className="md:col-span-7">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Shipping & Contact</h2>
              {user && (
                 <div className="mb-4 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                   <ShieldCheck size={16} /> Logged in as {user.name}
                 </div>
              )}
              <div className="grid grid-cols-1 gap-4">
                <input 
                  required name="name" placeholder="Full Name" 
                  value={formData.name}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                  onChange={handleInputChange}
                />
                <input 
                  required name="email" type="email" placeholder="Email Address" 
                  value={formData.email}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                  onChange={handleInputChange}
                />
                <input 
                  required name="address" placeholder="Street Address" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    required name="city" placeholder="City" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                    onChange={handleInputChange}
                  />
                  <input 
                    required name="zip" placeholder="Postal Code" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Payment Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <button 
                  type="button"
                  onClick={() => setActiveMethod(PaymentMethod.CREDIT_CARD)}
                  className={`relative p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    activeMethod === PaymentMethod.CREDIT_CARD 
                    ? 'border-[#805AD5] bg-purple-50 text-[#805AD5] shadow-sm ring-1 ring-[#805AD5]' 
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {activeMethod === PaymentMethod.CREDIT_CARD && <div className="absolute top-2 right-2 text-[#805AD5]"><Check size={14} strokeWidth={3} /></div>}
                  <CreditCard size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Card</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setActiveMethod(PaymentMethod.PAYPAL)}
                  className={`relative p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    activeMethod === PaymentMethod.PAYPAL 
                    ? 'border-[#805AD5] bg-purple-50 text-[#805AD5] shadow-sm ring-1 ring-[#805AD5]' 
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {activeMethod === PaymentMethod.PAYPAL && <div className="absolute top-2 right-2 text-[#805AD5]"><Check size={14} strokeWidth={3} /></div>}
                  <Wallet size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">PayPal</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setActiveMethod(PaymentMethod.APPLE_PAY)}
                  className={`relative p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    activeMethod === PaymentMethod.APPLE_PAY 
                    ? 'border-[#805AD5] bg-purple-50 text-[#805AD5] shadow-sm ring-1 ring-[#805AD5]' 
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {activeMethod === PaymentMethod.APPLE_PAY && <div className="absolute top-2 right-2 text-[#805AD5]"><Check size={14} strokeWidth={3} /></div>}
                  <Smartphone size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Apple Pay</span>
                </button>

                 <button 
                  type="button"
                  onClick={() => setActiveMethod(PaymentMethod.GOOGLE_PAY)}
                  className={`relative p-3 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    activeMethod === PaymentMethod.GOOGLE_PAY 
                    ? 'border-[#805AD5] bg-purple-50 text-[#805AD5] shadow-sm ring-1 ring-[#805AD5]' 
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {activeMethod === PaymentMethod.GOOGLE_PAY && <div className="absolute top-2 right-2 text-[#805AD5]"><Check size={14} strokeWidth={3} /></div>}
                  <Globe size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">Google Pay</span>
                </button>
              </div>

              {/* Card Form (Conditional) */}
              {activeMethod === PaymentMethod.CREDIT_CARD && (
                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 space-y-5 animate-in fade-in slide-in-from-top-2 shadow-inner relative overflow-hidden">
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                   <div className="flex justify-between items-center mb-2 relative z-10">
                     <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Card Information</span>
                     <div className="flex gap-2 opacity-60 grayscale">
                       <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-blue-800 italic">VISA</div>
                       <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-red-600">MC</div>
                     </div>
                   </div>
                   
                   <div className="space-y-4 relative z-10">
                     <div>
                       <input 
                        required name="cardNumber" placeholder="Card Number (0000 0000 0000 0000)" 
                        maxLength={19}
                        className="w-full p-3 pl-12 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all font-mono text-sm"
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                          setFormData(p => ({...p, cardNumber: v.substring(0, 19)}));
                        }}
                        value={formData.cardNumber}
                       />
                       <CreditCard className="absolute left-9 top-[60px] text-gray-400 w-5 h-5" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                       <input 
                        required name="expiry" placeholder="MM/YY" maxLength={5}
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all text-center font-mono text-sm"
                        onChange={handleInputChange}
                       />
                       <input 
                        required name="cvc" placeholder="CVC" maxLength={3} type="password"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#805AD5] transition-all text-center font-mono text-sm"
                        onChange={handleInputChange}
                       />
                     </div>
                   </div>
                </div>
              )}
              
              {activeMethod !== PaymentMethod.CREDIT_CARD && (
                <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 animate-in fade-in">
                  <p className="text-gray-800 font-bold text-lg mb-2">
                    Pay with {activeMethod === PaymentMethod.PAYPAL ? 'PayPal' : activeMethod === PaymentMethod.APPLE_PAY ? 'Apple Pay' : 'Google Pay'}
                  </p>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    You will be redirected to a secure verification page to complete your payment safely.
                  </p>
                </div>
              )}
            </section>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-left-2">
                 <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#68D391] hover:bg-[#5bc283] text-green-900 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
              {loading ? 'Processing Transaction...' : `Pay ₹${total}`}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Guaranteed safe & secure checkout
            </p>

          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="md:col-span-5">
           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-4">Order Review</h3>
             <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm bg-white p-2 rounded-lg border border-gray-100 relative group hover:border-[#805AD5]/30 transition-colors">
                    <img src={item.listing.image} className="w-12 h-12 rounded object-cover bg-gray-200" />
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.listing.title}</p>
                      <p className="text-gray-500">{item.days} days x {item.listing.currency}{item.listing.pricePerDay}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      {item.listing.currency}{item.totalPrice}
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>₹{items.length * 200}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Total Due</span>
                  <span>₹{total}</span>
                </div>
             </div>
             
             <div className="mt-6 flex flex-col gap-2">
               <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex items-start gap-2">
                 <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                 <p>Free cancellation up to 24h before rental start time.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
