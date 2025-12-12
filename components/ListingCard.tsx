
import React, { useState } from 'react';
import { Heart, MapPin, ShoppingCart, CreditCard, Wallet, Smartphone, Globe, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '../types';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
  onRentNow: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, onRentNow }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isSaved = isInWishlist(listing.id);

  // Use available images array or fallback to single image
  const displayImages = listing.images && listing.images.length > 0 ? listing.images : [listing.image];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to 1 day rental starting tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    addToCart(listing, 1, tomorrow);
    showToast(`Added ${listing.title} to cart`, 'success');
  };

  const handleRentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRentNow(listing);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(listing.id);
    if (!isSaved) {
      showToast('Added to wishlist', 'success');
    } else {
      showToast('Removed from wishlist', 'info');
    }
  };

  return (
    <div className="card-3d-wrapper h-full">
      <div 
        className="card-3d group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer flex flex-col h-full relative"
        onClick={() => onClick(listing)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden transform-style-3d group/image">
          <img 
            src={displayImages[currentImageIndex]} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
          />
          
          {/* Slideshow Controls */}
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
              >
                <ChevronRight size={16} />
              </button>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {displayImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {listing.isPopular && (
            <span className="absolute top-3 left-3 bg-[#9F7AEA] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-md transform translate-z-10" style={{transform: 'translateZ(20px)'}}>
              Very Popular
            </span>
          )}
          <button 
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1.5 backdrop-blur-sm z-20 hover:scale-110"
          >
            <Heart 
              size={18} 
              fill={isSaved ? "#EF4444" : "transparent"} 
              className={isSaved ? "text-red-500" : "text-white/90 hover:text-white"} 
            />
          </button>
        </div>
        
        <div className="p-4 flex flex-col flex-1 relative transform-style-3d bg-white">
          <div className="flex-1" style={{transform: 'translateZ(10px)'}}>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#805AD5] transition-colors">
              {listing.title}
            </h3>
            <p className="text-[#805AD5] font-semibold text-sm">
              {listing.currency}{listing.pricePerDay} <span className="text-gray-400 font-normal text-xs">/ day</span>
            </p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-50" style={{transform: 'translateZ(5px)'}}>
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center text-xs text-gray-400">
                 <MapPin size={12} className="mr-1" />
                 {listing.location}
               </div>
               
               {/* Avatar */}
               <div className="flex items-center gap-1">
                 <img 
                  src={listing.ownerAvatar} 
                  alt={listing.ownerName}
                  className="w-6 h-6 rounded-full border border-gray-100"
                 />
                 <span className="text-[10px] text-gray-500">{listing.ownerName}</span>
               </div>
             </div>

             {/* Payment Icons + Rent Button Row - Always Visible */}
             <div className="flex items-center justify-between gap-2 mt-auto">
                {/* Payment icons */}
                <div className="flex gap-1" title="Secure Payment Options Available">
                  <CreditCard size={14} className="text-gray-400" />
                  <Wallet size={14} className="text-gray-400" />
                  <Smartphone size={14} className="text-gray-400" />
                </div>

                {/* Primary Rent Action */}
                <button 
                  onClick={handleRentClick}
                  className="bg-[#68D391] hover:bg-[#5bc283] text-green-900 text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                >
                  Rent Now
                </button>
             </div>
          </div>
        </div>

        {/* Quick Add Button (Visible on Hover Only - Secondary Action) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-30 ${isHovered ? 'opacity-100 scale-110 translate-z-50' : 'opacity-0 scale-50 pointer-events-none'}`} style={{transform: isHovered ? 'translate(-50%, -50%) translateZ(40px) scale(1.1)' : 'translate(-50%, -50%) scale(0)'}}>
          <button
            onClick={handleQuickAdd}
            className="bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full shadow-2xl border border-gray-100 hover:bg-[#805AD5] hover:text-white transition-all"
            title="Add to Cart"
          >
            <ShoppingCart size={24} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ListingCard;
