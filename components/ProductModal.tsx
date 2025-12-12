
import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Shield, Star, ShoppingCart, ArrowRight, CreditCard, Wallet, Smartphone, Globe, ChevronLeft, ChevronRight, Clock, Check, Share2 } from 'lucide-react';
import { Listing } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCart: () => void;
  onNavigateToCheckout: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ listing, isOpen, onClose, onNavigateToCart, onNavigateToCheckout }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Payment Method State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  // Initialize end date based on initial days
  useEffect(() => {
    if (isOpen && startDate && !endDate) {
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(nextDay);
      setDays(1);
      setCurrentImageIndex(0); // Reset image index on open
    }
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  const displayImages = listing.images && listing.images.length > 0 ? listing.images : [listing.image];

  const total = listing.pricePerDay * days;
  const serviceFee = 200; // Fixed fee in Rupees
  const grandTotal = total + serviceFee;

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentMonth);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  const getDateObj = (day: number) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

  const isSelected = (day: number) => {
    const date = getDateObj(day);
    if (startDate && date.toDateString() === startDate.toDateString()) return true;
    if (endDate && date.toDateString() === endDate.toDateString()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = getDateObj(day);
    return date > startDate && date < endDate;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = getDateObj(day);
    
    // If we have a start date and the clicked date is after start date, set end date
    if (startDate && !endDate && clickedDate > startDate) {
      setEndDate(clickedDate);
      const diffTime = Math.abs(clickedDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setDays(diffDays);
      setShowCalendar(false); // Close calendar after selection
    } 
    // If no start date, or we are resetting (clicked when both set or clicked before start)
    else {
      setStartDate(clickedDate);
      setEndDate(null);
      setDays(1); // Reset duration
    }
  };

  const handleAddToCart = () => {
    if (startDate) {
      addToCart(listing, days, startDate);
      onClose();
    }
  };

  const handleRentNow = () => {
    if (startDate) {
      addToCart(listing, days, startDate);
      onClose();
      onNavigateToCheckout();
    }
  };

  const handleShare = async () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?page=product&id=${listing.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rent ${listing.title} on Rentloo`,
          text: `Check out this ${listing.title} for rent on Rentloo!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback
      }
    }
    navigator.clipboard.writeText(shareUrl);
    showToast('Product link copied to clipboard!', 'success');
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[90vh] h-[90vh] md:h-auto">
        
        {/* Left: Image Carousel */}
        <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto flex-shrink-0 group">
          <img src={displayImages[currentImageIndex]} className="w-full h-full object-cover" alt={listing.title} />
          
          <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full md:hidden z-20 hover:bg-black/70 transition-colors">
            <X size={20} />
          </button>

          {/* Carousel Controls */}
          {displayImages.length > 1 && (
            <>
               <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                 {displayImages.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                 ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Content */}
        {/* Updated classes: flex-1 min-h-0 allows this container to shrink and scroll properly on mobile within the flex parent */}
        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar relative">
          <div className="p-6 md:p-8 flex-1">
             <div className="flex justify-between items-start">
               <div className="flex-1 pr-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin size={16} /> {listing.location}
                    <span className="mx-1">•</span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" /> 4.9 (24 reviews)
                  </div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={handleShare} 
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-[#805AD5] transition-colors"
                    title="Share Listing"
                  >
                    <Share2 size={20} />
                  </button>
                  <button onClick={onClose} className="hidden md:block p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} className="text-gray-400" />
                  </button>
               </div>
             </div>

             <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
               <img src={listing.ownerAvatar} className="w-10 h-10 rounded-full border border-white shadow-sm" alt={listing.ownerName} />
               <div>
                 <p className="text-sm font-semibold text-gray-900">Rented by {listing.ownerName}</p>
                 <p className="text-xs text-green-600 flex items-center gap-1">
                   <Shield size={10} /> Identity verified
                 </p>
               </div>
             </div>

             <div className="space-y-4 mb-8">
               <p className="text-gray-600 text-sm leading-relaxed">
                 {listing.description || "This item is in excellent condition and perfect for your needs. Includes all standard accessories. Please treat it with care!"}
               </p>
               
               {/* Date Range Selection Area */}
               <div className="border border-gray-200 rounded-xl relative">
                  {/* Selector Button */}
                  <button 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl"
                  >
                    <div className="flex flex-col items-start">
                       <span className="text-xs font-bold text-gray-500 uppercase mb-1">Rental Period</span>
                       <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                         <Calendar size={16} className="text-[#805AD5]" />
                         {startDate ? startDate.toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Select'} 
                         <span className="text-gray-400">→</span>
                         {endDate ? endDate.toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Select'}
                       </div>
                    </div>
                    <div className="bg-[#805AD5]/10 text-[#805AD5] px-3 py-1 rounded-full text-xs font-bold">
                       {days} Day{days !== 1 ? 's' : ''}
                    </div>
                  </button>

                  {/* Calendar Popover */}
                  {showCalendar && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4 animate-in fade-in slide-in-from-top-2">
                       <div className="flex justify-between items-center mb-4">
                           <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={16} /></button>
                           <span className="font-bold text-gray-800">{currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                           <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={16} /></button>
                       </div>
                       
                       <div className="grid grid-cols-7 text-center mb-2 text-xs font-medium text-gray-400">
                           {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                       </div>

                       <div className="grid grid-cols-7 gap-1">
                           {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                           {calendarDays.map(day => (
                               <button 
                                  key={day} 
                                  onClick={() => handleDateClick(day)}
                                  className={`
                                    h-9 w-9 text-sm rounded-full flex items-center justify-center transition-all relative
                                    ${isToday(day) && !isSelected(day) && !isInRange(day) ? 'border border-[#805AD5] text-[#805AD5] font-bold' : ''}
                                    ${isSelected(day) ? 'bg-[#805AD5] text-white shadow-md z-10' : ''}
                                    ${isInRange(day) ? 'bg-[#805AD5]/20 text-[#805AD5] rounded-none' : ''}
                                    ${!isSelected(day) && !isInRange(day) ? 'hover:bg-gray-100 text-gray-700' : ''}
                                  `}
                               >
                                   {day}
                               </button>
                           ))}
                       </div>
                       <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                          <p className="text-xs text-gray-500">Select start and end date</p>
                          <button 
                            onClick={() => setShowCalendar(false)} 
                            className="text-xs font-bold text-[#805AD5] hover:underline"
                          >
                            Close
                          </button>
                       </div>
                    </div>
                  )}
               </div>

               {/* Time & Duration Details */}
               <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700">Rental Schedule</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div className="space-y-1">
                       <span className="text-xs text-gray-500 block uppercase">Pickup</span>
                       <p className="font-medium text-gray-900">
                         {startDate ? startDate.toLocaleDateString() : '---'}
                       </p>
                       <p className="text-blue-600 font-bold text-xs">at 10:00 AM</p>
                     </div>
                     <div className="space-y-1">
                       <span className="text-xs text-gray-500 block uppercase">Return</span>
                       <p className="font-medium text-gray-900">
                         {endDate ? endDate.toLocaleDateString() : (startDate ? new Date(startDate.getTime() + 86400000).toLocaleDateString() : '---')}
                       </p>
                       <p className="text-blue-600 font-bold text-xs">at 10:00 AM</p>
                     </div>
                  </div>
               </div>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{listing.currency}{listing.pricePerDay} x {days} days</span>
                  <span>{listing.currency}{total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service fee</span>
                  <span>{listing.currency}{serviceFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>{listing.currency}{grandTotal}</span>
                </div>
                
                {/* INLINE RENT NOW BUTTON */}
                <button 
                  onClick={handleRentNow}
                  className="w-full mt-3 bg-[#68D391] hover:bg-[#5bc283] text-green-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm transform active:scale-[0.98]"
                >
                  Rent Now <ArrowRight size={18} />
                </button>
                
                {/* Payment Methods Badges - Now Interactive */}
                <div className="pt-3 mt-2 border-t border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Select Payment Method:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'card', label: 'Card', icon: CreditCard, color: 'text-gray-700' },
                      { id: 'paypal', label: 'PayPal', icon: Wallet, color: 'text-blue-600' },
                      { id: 'apple', label: 'Apple Pay', icon: Smartphone, color: 'text-gray-900' },
                      { id: 'google', label: 'Google Pay', icon: Globe, color: 'text-green-600' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`flex items-center gap-1.5 border px-2.5 py-1.5 rounded text-[11px] font-medium shadow-sm transition-all
                          ${selectedPaymentMethod === method.id 
                            ? 'bg-white border-[#805AD5] ring-1 ring-[#805AD5] text-[#805AD5]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <method.icon size={14} className={selectedPaymentMethod === method.id ? 'text-[#805AD5]' : method.color} />
                        {method.label}
                        {selectedPaymentMethod === method.id && <Check size={10} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button 
              onClick={handleRentNow}
              className="flex-1 bg-[#805AD5] hover:bg-[#6B46C1] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Rent Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
