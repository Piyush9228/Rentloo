import React, { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { Listing, PaymentStatus } from '../types';

interface BookingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ listing, isOpen, onClose }) => {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [days, setDays] = useState(1);
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    if (isOpen) setStatus(PaymentStatus.IDLE);
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const total = listing.pricePerDay * days + 200; // +200 service fee

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(PaymentStatus.PROCESSING);
    
    // Simulate API call
    setTimeout(() => {
      setStatus(PaymentStatus.SUCCESS);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">Complete Request</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {status === PaymentStatus.SUCCESS ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h4>
            <p className="text-gray-500 mb-6">
              You've successfully requested to rent <strong>{listing.title}</strong>. 
              {listing.ownerName} will confirm shortly.
            </p>
            <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 w-full">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="p-6">
            
            {/* Item Summary */}
            <div className="flex gap-4 mb-6">
              <img src={listing.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
              <div>
                <h4 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h4>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                   <img src={listing.ownerAvatar} className="w-4 h-4 rounded-full" />
                   {listing.ownerName}
                </div>
                <div className="text-sm text-[#805AD5] font-medium mt-1">
                  {listing.currency}{listing.pricePerDay} per day
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Rental Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input 
                    type="number" 
                    min="1" 
                    max="30"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#805AD5] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Card Details</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').substring(0, 16);
                      setCardNumber(v);
                    }}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#805AD5] focus:border-transparent outline-none transition-all"
                    required
                  />
                  <div className="absolute right-3 top-2.5 flex gap-1">
                    <div className="w-6 h-4 bg-gray-200 rounded"></div>
                    <div className="w-6 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{listing.currency}{listing.pricePerDay} x {days} days</span>
                <span>{listing.currency}{listing.pricePerDay * days}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Service fee (insurance)</span>
                <span>{listing.currency}200</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                <span>Total</span>
                <span>{listing.currency}{total}</span>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={status === PaymentStatus.PROCESSING || cardNumber.length < 16}
              className="w-full bg-[#68D391] hover:bg-[#5bc283] text-green-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === PaymentStatus.PROCESSING ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Lock size={16} /> Pay & Request
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-3">
              You won't be charged until the owner accepts.
            </p>

          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;