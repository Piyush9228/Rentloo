
import React, { useState, useMemo } from 'react';
import { Search, ArrowDownCircle } from 'lucide-react';
import ListingCard from './ListingCard';
import { POPULAR_CATEGORIES } from '../constants';
import { Listing } from '../types';
import { useListings } from '../context/ListingContext';

interface ViewAllListingsViewProps {
  onListingClick: (listing: Listing) => void;
  onRentNow: (listing: Listing) => void;
}

const ViewAllListingsView: React.FC<ViewAllListingsViewProps> = ({ onListingClick, onRentNow }) => {
  const { listings } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8);

  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, listings]);

  const visibleListings = filteredListings.slice(0, displayCount);
  const hasMore = visibleListings.length < filteredListings.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  return (
    <div className="relative bg-3d-space min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="perspective-grid"></div>
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>

      <div className="container mx-auto px-4 lg:px-8 py-12 animate-in fade-in duration-500 relative z-10">
        {/* Header Section */}
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Trending Listed Products</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mb-8">
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search for items to rent..." 
               className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#805AD5] focus:border-transparent outline-none shadow-sm transition-all text-gray-800 placeholder-gray-400 bg-white/90 backdrop-blur-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          {/* Categories Row */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
             <button 
               onClick={() => setSelectedCategory(null)}
               className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm ${!selectedCategory ? 'bg-[#805AD5] text-white border-[#805AD5]' : 'bg-white/80 backdrop-blur-sm text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-white'}`}
             >
               All Categories
             </button>
             {POPULAR_CATEGORIES.map(cat => (
               <button 
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.slug)}
                 className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm ${selectedCategory === cat.slug ? 'bg-[#805AD5] text-white border-[#805AD5]' : 'bg-white/80 backdrop-blur-sm text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-white'}`}
               >
                 {cat.name}
               </button>
             ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visibleListings.map((listing, index) => (
             <div 
               key={listing.id}
               className="animate-slide-up"
               style={{ animationDelay: `${index * 50}ms` }}
             >
               <ListingCard 
                 listing={listing} 
                 onClick={onListingClick}
                 onRentNow={onRentNow} 
               />
             </div>
          ))}
        </div>
        
        {/* Empty State */}
        {visibleListings.length === 0 && (
           <div className="text-center py-20 bg-gray-50/80 backdrop-blur-sm rounded-2xl border border-dashed border-gray-200 animate-in fade-in">
              <p className="text-gray-500 mb-4">No items found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory(null);}} 
                className="text-[#805AD5] font-semibold hover:underline"
              >
                Clear filters
              </button>
           </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center pb-12 animate-slide-up">
             <button 
               onClick={handleLoadMore}
               className="bg-white/90 backdrop-blur border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-full hover:bg-white hover:border-gray-400 transition-all flex items-center gap-2 shadow-sm"
             >
               Load More <ArrowDownCircle size={20} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllListingsView;
