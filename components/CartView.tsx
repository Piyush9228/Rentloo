
import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, CreditCard, Wallet, Smartphone, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartViewProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

const CartView: React.FC<CartViewProps> = ({ onCheckout, onContinueShopping }) => {
  const { items, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any rentals yet.</p>
        <button 
          onClick={onContinueShopping}
          className="bg-[#805AD5] hover:bg-[#6B46C1] text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Start Browsing
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-slide-up">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img src={item.listing.image} alt={item.listing.title} className="w-24 h-24 rounded-lg object-cover bg-gray-200" />
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.listing.title}</h3>
                    <p className="text-sm text-gray-500">{item.listing.location}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md inline-block">
                    {new Date(item.startDate).toLocaleDateString()} — {item.days} days
                  </div>
                  <div className="font-bold text-lg text-[#805AD5]">
                    {item.listing.currency}{item.totalPrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="w-full lg:w-96 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fees</span>
                <span>₹{items.length * 200}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>₹{cartTotal + (items.length * 200)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-[#68D391] hover:bg-[#5bc283] text-green-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 mb-4">
              Secure checkout provided by Rentloo
            </p>

            <div className="flex justify-center gap-2 opacity-60">
                <div className="bg-gray-100 p-1.5 rounded"><CreditCard size={16} className="text-gray-500"/></div>
                <div className="bg-gray-100 p-1.5 rounded"><Wallet size={16} className="text-gray-500"/></div>
                <div className="bg-gray-100 p-1.5 rounded"><Smartphone size={16} className="text-gray-500"/></div>
                <div className="bg-gray-100 p-1.5 rounded"><Globe size={16} className="text-gray-500"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
