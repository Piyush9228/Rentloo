
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ListingCard from './components/ListingCard';
import Testimonials from './components/Testimonials';
import InfoCards from './components/InfoCards';
import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrdersView from './components/OrdersView';
import LoginView from './components/LoginView';
import CreateListingView from './components/CreateListingView';
import ChatWidget from './components/ChatWidget'; 
import ViewAllListingsView from './components/ViewAllListingsView';
import ProfileView from './components/ProfileView';
import ContactModal from './components/ContactModal';
import AdminInboxView from './components/AdminInboxView';
import VoteView from './components/VoteView';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ListingProvider, useListings } from './context/ListingContext';
import { WishlistProvider } from './context/WishlistContext';
import { VoteProvider } from './context/VoteContext';
import ToastContainer from './components/Toast';
import { POPULAR_CATEGORIES } from './constants';
import { Listing } from './types';
import { CheckCircle, ArrowRight } from 'lucide-react';

// Main App Logic Component
const AppContent = () => {
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'checkout' | 'success' | 'orders' | 'login' | 'create-listing' | 'view-all' | 'profile' | 'admin-inbox' | 'vote'>('home');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  // Use ListingContext for the source of truth instead of local state
  const { listings } = useListings();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  
  // Filter States
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { logout } = useAuth();

  // Handle Deep Linking on Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const id = params.get('id');

    if (page === 'vote') {
      setCurrentView('vote');
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    } else if (page === 'orders') {
      setCurrentView('orders');
      window.history.replaceState({}, '', window.location.pathname);
    } else if (page === 'product' && id) {
      const found = listings.find(l => l.id === id);
      if (found) {
        setSelectedListing(found);
        setIsModalOpen(true);
        // Clean URL without reload
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [listings]);

  // Request camera permissions on mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        // Just requesting stream access to prompt the permission dialog
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Immediately stop it, we just wanted the permission
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.warn("Camera permission denied or not available on mount.", err);
      }
    };
    
    requestCameraPermission();
  }, []);

  // Reactive Filtering Logic
  // This ensures that whenever listings change (new item added) OR filters change, the view updates.
  useEffect(() => {
    let results = listings;

    if (activeCategoryName) {
        // Filter by Category
        const categorySlug = POPULAR_CATEGORIES.find(c => c.name === activeCategoryName)?.slug;
        if (categorySlug) {
            results = results.filter(l => l.category === categorySlug);
        }
    } else if (isSearching && searchTerm) {
        // Filter by Search Term
        const lower = searchTerm.toLowerCase();
        results = results.filter(l => 
            l.title.toLowerCase().includes(lower) || 
            l.location.toLowerCase().includes(lower) ||
            (l.category && l.category.toLowerCase().includes(lower)) ||
            (l.description && l.description.toLowerCase().includes(lower))
        );
    }

    setFilteredListings(results);
  }, [listings, activeCategoryName, searchTerm, isSearching]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setActiveCategoryName(null);
    setIsSearching(true);
    setCurrentView('home'); // Switch to home to show results
    
    // Smooth scroll to listings
    setTimeout(() => {
      const listingSection = document.getElementById('listings-section');
      if (listingSection) {
        listingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCategorySelect = (slug: string | null) => {
    setSearchTerm(''); // Clear search when selecting a category
    
    if (!slug) {
      setActiveCategoryName(null);
      setIsSearching(false);
      return;
    }

    const category = POPULAR_CATEGORIES.find(c => c.slug === slug);
    setActiveCategoryName(category ? category.name : null);
    setIsSearching(true); // Treat category selection as a "search" state to show results
    
    // Smooth scroll to listings
    const listingSection = document.getElementById('listings-section');
    if (listingSection) {
      listingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleRentNow = (listing: Listing) => {
    // Default to 1 day rental starting tomorrow for quick checkout
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    addToCart(listing, 1, tomorrow);
    setCurrentView('checkout');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    showToast('Signed out successfully', 'success');
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white relative">
      <Header 
        onNavigate={(page) => setCurrentView(page)} 
        currentPage={currentView}
      />
      <ToastContainer />
      <ChatWidget />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="animate-in fade-in duration-300">
            <Hero 
              onSearch={handleSearch} 
              onSelectCategory={handleCategorySelect}
            />
            
            {/* Recently Active Items / Filtered Items Section with 3D Background */}
            <div className="relative bg-3d-space py-16 overflow-hidden">
               {/* Animated Background Elements */}
               <div className="perspective-grid"></div>
               <div className="floating-shape shape-1"></div>
               <div className="floating-shape shape-2"></div>
               <div className="floating-shape shape-3"></div>

               <section id="listings-section" className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="flex items-center justify-between mb-8 animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeCategoryName ? `Results for "${activeCategoryName}"` : searchTerm ? `Search results for "${searchTerm}"` : 'Recently active items'}
                  </h2>
                  <div className="flex gap-4">
                    {(activeCategoryName || searchTerm) && (
                      <button 
                        onClick={() => {
                          handleCategorySelect(null);
                          setSearchTerm('');
                        }}
                        className="text-sm text-[#805AD5] hover:underline font-medium"
                      >
                        Clear Filter
                      </button>
                    )}
                    {!activeCategoryName && !searchTerm && (
                      <button 
                        onClick={() => setCurrentView('view-all')}
                        className="text-sm text-[#805AD5] hover:underline font-medium flex items-center gap-1"
                      >
                        View all items <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredListings.slice(0, 12).map((listing, index) => (
                      <div 
                        key={listing.id} 
                        className="animate-slide-up" 
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ListingCard 
                          listing={listing} 
                          onClick={handleListingClick}
                          onRentNow={handleRentNow}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gray-50/80 backdrop-blur rounded-xl border border-dashed border-gray-300 animate-in fade-in">
                    <p className="text-gray-500 text-lg">No items found.</p>
                    <button 
                      onClick={() => {
                        handleCategorySelect(null);
                        setSearchTerm('');
                      }}
                      className="mt-4 text-[#805AD5] font-semibold hover:text-[#6B46C1]"
                    >
                      View all items
                    </button>
                  </div>
                )}
               </section>
            </div>

            <Testimonials />
            {/* <InfoCards /> */}
            <FeaturesGrid />
          </div>
        )}

        {currentView === 'login' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="h-20 bg-[#553C9A]"></div>
             <LoginView onSuccess={() => setCurrentView('home')} />
          </div>
        )}

        {currentView === 'create-listing' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="h-20 bg-[#553C9A]"></div>
             <CreateListingView onSuccess={() => setCurrentView('home')} />
          </div>
        )}

        {currentView === 'view-all' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="h-20 bg-[#553C9A]"></div>
            <ViewAllListingsView 
              onListingClick={handleListingClick}
              onRentNow={handleRentNow}
            />
          </div>
        )}

        {currentView === 'profile' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="h-20 bg-[#553C9A]"></div>
            <ProfileView 
              onNavigate={(page) => setCurrentView(page)} 
              onLogout={handleLogout}
            />
          </div>
        )}

        {currentView === 'orders' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="h-20 bg-[#553C9A]"></div>
             <OrdersView />
          </div>
        )}

        {currentView === 'admin-inbox' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="h-20 bg-[#553C9A]"></div>
             <AdminInboxView />
          </div>
        )}

        {currentView === 'vote' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="h-20 bg-[#553C9A]"></div>
             <VoteView />
          </div>
        )}

        {currentView === 'cart' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="h-20 bg-[#553C9A]"></div> {/* Header spacer */}
            <CartView 
              onCheckout={() => setCurrentView('checkout')} 
              onContinueShopping={() => setCurrentView('home')}
            />
          </div>
        )}

        {currentView === 'checkout' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="h-20 bg-[#553C9A]"></div>
            <CheckoutView 
              onBack={() => setCurrentView('cart')}
              onSuccess={() => setCurrentView('success')}
            />
          </div>
        )}

        {currentView === 'success' && (
          <div className="animate-in zoom-in duration-500 pt-32 pb-20 container mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
             <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-slide-up">
                <CheckCircle size={48} />
             </div>
             <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up" style={{animationDelay: '100ms'}}>Payment Successful!</h1>
             <p className="text-xl text-gray-500 mb-8 max-w-md animate-slide-up" style={{animationDelay: '200ms'}}>
               Your rental request has been confirmed. The owner has been notified and you will receive an email shortly.
             </p>
             <div className="flex gap-4 animate-slide-up" style={{animationDelay: '300ms'}}>
               <button 
                 onClick={() => setCurrentView('home')}
                 className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold transition-colors"
               >
                 Return Home
               </button>
               <button 
                 onClick={() => setCurrentView('orders')}
                 className="bg-[#553C9A] hover:bg-[#44337a] text-white px-8 py-3 rounded-lg font-bold transition-colors"
               >
                 View My Orders
               </button>
             </div>
          </div>
        )}
      </main>

      <Footer 
        onNavigate={(page) => setCurrentView(page)} 
        onContactClick={() => setIsContactModalOpen(true)}
      />

      <ProductModal 
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigateToCart={() => setCurrentView('cart')}
        onNavigateToCheckout={() => setCurrentView('checkout')}
      />

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

// Root App that provides Contexts
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ListingProvider>
          <WishlistProvider>
            <CartProvider>
              <VoteProvider>
                <ChatProvider>
                  <AppContent />
                </ChatProvider>
              </VoteProvider>
            </CartProvider>
          </WishlistProvider>
        </ListingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
