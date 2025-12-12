
import React, { useState } from 'react';
import { 
  User, List, Heart, CreditCard, Settings, LogOut, 
  MapPin, Plus, Edit2, Trash2, Bell, Shield, Key, 
  Wallet, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListings } from '../context/ListingContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ListingCard from './ListingCard';
import EditListingModal from './EditListingModal';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../constants'; // For mock rentals history

interface ProfileViewProps {
  onNavigate: (page: 'home' | 'create-listing') => void;
  onLogout: () => void;
}

type ProfileSection = 'overview' | 'listings' | 'rentals' | 'wishlist' | 'wallet' | 'settings';

const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate, onLogout }) => {
  const { user } = useAuth();
  const { listings, deleteListing, updateListing } = useListings();
  const { wishlistIds } = useWishlist();
  const { showToast } = useToast();
  
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  
  // Edit State
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter listings for the current user
  const myListings = listings.filter(l => l.ownerName === user?.name) || [];
  
  // Get wishlist items from IDs
  const wishlistItems = listings.filter(l => wishlistIds.includes(l.id));

  // Mock rental history (keep using mock data for history as we don't have a backend for that yet)
  const recentRentals = MOCK_LISTINGS.slice(3, 5); 

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'listings', label: 'My Listings', icon: List },
    { id: 'rentals', label: 'My Rentals', icon: CheckCircle },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'wallet', label: 'Wallet & Payments', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleDeleteListing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Ensure click doesn't bubble
    if (confirm('Are you sure you want to delete this listing? It will be removed from the marketplace.')) {
      deleteListing(id);
      showToast('Listing deleted successfully', 'success');
    }
  };

  const handleEditClick = (listing: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingListing(listing);
    setIsEditModalOpen(true);
  };

  const isEditable = (createdAt?: string) => {
    if (!createdAt) return false; // Mock data might not have createdAt, or older items
    const created = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diffMinutes = (now - created) / 1000 / 60;
    return diffMinutes < 15;
  };

  const getEditTimeLeft = (createdAt?: string) => {
    if (!createdAt) return 0;
    const created = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const diffMinutes = 15 - (now - created) / 1000 / 60;
    return Math.max(0, Math.ceil(diffMinutes));
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 animate-slide-up">
              <div className="relative">
                <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-gray-50" />
                <button className="absolute bottom-0 right-0 bg-[#805AD5] text-white p-1.5 rounded-full hover:bg-[#6B46C1] transition-colors">
                  <Edit2 size={14} />
                </button>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Shield size={12} /> ID Verified
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin size={14} /> Bangalore, India
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                 <div className="text-center px-6 py-2 border-r border-gray-100 last:border-0">
                    <p className="font-bold text-xl text-gray-900">12</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Rentals</p>
                 </div>
                 <div className="text-center px-6 py-2">
                    <p className="font-bold text-xl text-gray-900">{myListings.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Listings</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-[#553C9A] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <div className="relative z-10">
                     <p className="text-purple-200 text-sm font-medium mb-1">Wallet Balance</p>
                     <h3 className="text-3xl font-bold mb-6">₹4,250.00</h3>
                     <button onClick={() => setActiveSection('wallet')} className="bg-white text-[#553C9A] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                       Manage Wallet
                     </button>
                  </div>
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-900">Recent Activity</h3>
                     <button onClick={() => setActiveSection('rentals')} className="text-sm text-[#805AD5] hover:underline">View all</button>
                  </div>
                  <div className="space-y-4">
                     {recentRentals.map(item => (
                       <div key={item.id} className="flex items-center gap-3">
                          <img src={item.image} className="w-10 h-10 rounded bg-gray-100 object-cover" />
                          <div className="flex-1">
                             <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                             <p className="text-xs text-gray-500">Rented for 3 days</p>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Returned</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
               <button 
                 onClick={() => onNavigate('create-listing')}
                 className="bg-[#805AD5] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#6B46C1] transition-colors flex items-center gap-2"
               >
                 <Plus size={16} /> Create New
               </button>
            </div>
            
            {myListings.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {myListings.map((listing, index) => {
                   const editable = isEditable(listing.createdAt);
                   const minsLeft = getEditTimeLeft(listing.createdAt);
                   return (
                     <div 
                       key={listing.id} 
                       className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col animate-slide-up"
                       style={{ animationDelay: `${index * 100}ms` }}
                     >
                        <div className="h-40 relative">
                           <img src={listing.image} className="w-full h-full object-cover" />
                           <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">
                             {listing.currency}{listing.pricePerDay}/day
                           </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                           <h3 className="font-bold text-gray-900 mb-1">{listing.title}</h3>
                           <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                             <MapPin size={12} /> {listing.location}
                           </div>
                           
                           {/* Edit Time Warning */}
                           {listing.createdAt && minsLeft > 0 && (
                             <div className="mb-3 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                               <Clock size={12} /> Editable for {minsLeft} more mins
                             </div>
                           )}

                           <div className="flex gap-2 mt-auto">
                              <button 
                                onClick={(e) => handleEditClick(listing, e)}
                                disabled={!editable}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2
                                  ${editable 
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
                                `}
                                title={!editable ? "Editing is only allowed for 15 minutes after posting" : "Edit Listing"}
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                              <button 
                                onClick={(e) => handleDeleteListing(listing.id, e)}
                                className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                title="Delete Listing"
                              >
                                <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                     </div>
                   );
                 })}
               </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You haven't listed any items yet.</p>
                <button 
                  onClick={() => onNavigate('create-listing')}
                  className="text-[#805AD5] font-bold hover:underline"
                >
                  Create your first listing
                </button>
              </div>
            )}
          </div>
        );

      case 'rentals':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h2 className="text-2xl font-bold text-gray-900">My Rentals History</h2>
             <div className="space-y-4">
                {recentRentals.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                     <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                     <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-1">Rented from {item.ownerName}</p>
                        <p className="text-xs text-gray-400">Order #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                     </div>
                     <div className="text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
                          Completed
                        </span>
                        <p className="font-bold text-gray-900">{item.currency}{item.pricePerDay * 3 + 200}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'wishlist':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
             {wishlistItems.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((listing, idx) => (
                     <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                       <ListingCard 
                         listing={listing} 
                         onClick={() => {}} // In a real app, open modal
                         onRentNow={() => {}} // In a real app, go to checkout
                       />
                     </div>
                  ))}
               </div>
             ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                   <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                   <p className="text-gray-500">Your wishlist is empty.</p>
                   <p className="text-sm text-gray-400">Click the heart icon on any item to save it here.</p>
                </div>
             )}
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900">Wallet & Payments</h2>
            
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 animate-slide-up">
               <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                  <h3 className="text-4xl font-bold">₹4,250.00</h3>
                  <div className="flex gap-4 mt-6">
                     <button className="flex items-center gap-2 bg-[#68D391] text-green-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#48BB78] transition-colors">
                       <ArrowDownLeft size={16} /> Add Money
                     </button>
                     <button className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors">
                       <ArrowUpRight size={16} /> Withdraw
                     </button>
                  </div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                     <CreditCard size={20} className="text-white" />
                     <span className="text-sm font-medium">Default Payment Method</span>
                  </div>
                  <div className="text-lg font-mono tracking-wider mb-2">
                    •••• •••• •••• 4242
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Visa Debit</span>
                    <span>Exp 12/25</span>
                  </div>
               </div>
            </div>

            {/* Saved Cards */}
            <div>
               <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Payment Methods</h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white animate-slide-up" style={{ animationDelay: '100ms' }}>
                     <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-2 rounded text-blue-600"><CreditCard size={20}/></div>
                        <div>
                           <p className="font-bold text-gray-900 text-sm">Visa ending in 4242</p>
                           <p className="text-xs text-gray-500">Expires 12/2025</p>
                        </div>
                     </div>
                     <span className="text-xs font-bold text-[#805AD5] bg-purple-50 px-2 py-1 rounded">Default</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white animate-slide-up" style={{ animationDelay: '200ms' }}>
                     <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-2 rounded text-blue-600"><CreditCard size={20}/></div>
                        <div>
                           <p className="font-bold text-gray-900 text-sm">Mastercard ending in 8899</p>
                           <p className="text-xs text-gray-500">Expires 09/2026</p>
                        </div>
                     </div>
                     <button className="text-xs font-medium text-gray-500 hover:text-red-500">Remove</button>
                  </div>
                  <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <Plus size={16} /> Add New Card
                  </button>
               </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-slide-up">
               <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Key size={18} /> Security
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="••••••••" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                           <input type="password" className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="New password" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                           <input type="password" className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Confirm new password" />
                        </div>
                     </div>
                     <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                       Update Password
                     </button>
                  </div>
               </div>

               <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell size={18} /> Notifications
                  </h3>
                  <div className="space-y-3">
                     {['Email notifications for rentals', 'SMS alerts for messages', 'Marketing emails'].map((label, i) => (
                       <label key={i} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked={i !== 2} className="w-4 h-4 text-[#805AD5] rounded border-gray-300 focus:ring-[#805AD5]" />
                          <span className="text-sm text-gray-700">{label}</span>
                       </label>
                     ))}
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-gray-200 animate-slide-up" style={{ animationDelay: '100ms' }}>
               <button className="text-red-600 font-medium text-sm hover:text-red-700 flex items-center gap-2">
                 <LogOut size={16} /> Delete Account
               </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 animate-slide-up">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-100 lg:hidden">
                 <p className="font-bold text-gray-900">Menu</p>
              </div>
              <nav className="p-2 space-y-1">
                 {navItems.map((item) => {
                   const Icon = item.icon;
                   const isActive = activeSection === item.id;
                   return (
                     <button
                       key={item.id}
                       onClick={() => setActiveSection(item.id as ProfileSection)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                         ${isActive 
                           ? 'bg-[#805AD5] text-white shadow-md' 
                           : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                         }
                       `}
                     >
                       <Icon size={18} />
                       {item.label}
                     </button>
                   );
                 })}
                 
                 <div className="my-2 border-t border-gray-100 pt-2">
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                 </div>
              </nav>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
           {renderSection()}
        </div>

      </div>

      <EditListingModal 
        listing={editingListing}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingListing(null);
        }}
        onSave={(id, updates) => updateListing(id, updates)}
      />
    </div>
  );
};

export default ProfileView;
