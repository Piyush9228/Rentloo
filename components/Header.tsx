
import React, { useState } from 'react';
import { Menu, MoreHorizontal, ShoppingCart, X, Home, Info, ShieldCheck, User as UserIcon, Package, LogOut, LogIn, PlusCircle, User, Vote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'cart' | 'orders' | 'login' | 'create-listing' | 'profile' | 'vote') => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { handleExternalQuery } = useChat();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNav = (page: 'home' | 'cart' | 'orders' | 'login' | 'create-listing' | 'profile' | 'vote') => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    onNavigate('home');
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 text-white">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer z-50" 
          onClick={() => handleNav('home')}
        >
          <span className="text-3xl font-bold tracking-tight">Rentloo</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-1 cursor-pointer hover:text-green-300">
            <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-auto rounded-sm" />
            <span>India</span>
          </div>
          <button onClick={() => onNavigate('home')} className={`hover:text-green-300 transition-colors ${currentPage === 'home' ? 'text-green-300' : ''}`}>Browse</button>
          
          <button onClick={() => onNavigate('vote')} className={`flex items-center gap-1 hover:text-green-300 transition-colors ${currentPage === 'vote' ? 'text-green-300' : ''}`}>
             <Vote size={14} /> Vote
          </button>

          {isAuthenticated && (
             <button onClick={() => onNavigate('orders')} className={`hover:text-green-300 transition-colors ${currentPage === 'orders' ? 'text-green-300' : ''}`}>My Orders</button>
          )}
          
          <button onClick={() => handleExternalQuery('How does Rentloo work?')} className="hover:text-green-300 transition-colors">How Rentloo works</button>
          <button onClick={() => handleExternalQuery('How does the Guarantee work?')} className="hover:text-green-300 transition-colors">Guarantee</button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
           <button 
            onClick={() => onNavigate('cart')}
            className="relative bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors group z-50"
            title="View Cart"
          >
            <ShoppingCart size={20} className={currentPage === 'cart' ? 'text-green-300' : 'text-white'} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#553C9A]">
                {itemCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => handleNav('create-listing')}
            className="hidden lg:block bg-[#68D391] hover:bg-[#5bc283] text-green-900 font-semibold px-5 py-2 rounded-full transition-colors text-sm"
          >
            Create listing
          </button>
          
          {isAuthenticated ? (
            <div className="relative hidden lg:block">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 pl-2 pr-4 py-1.5 rounded-full transition-all border border-transparent hover:border-white/20"
              >
                <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full bg-white/20" />
                <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 text-gray-800 animate-in fade-in slide-in-from-top-2 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold truncate">{user?.email}</p>
                  </div>
                  <button onClick={() => handleNav('profile')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <User size={16} /> Profile
                  </button>
                  <button onClick={() => handleNav('orders')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Package size={16} /> My Orders
                  </button>
                   <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="hidden lg:block border border-white/40 hover:bg-white/10 px-5 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Log in
            </button>
          )}
         
          {/* Mobile Menu Icon */}
          <button 
            className="lg:hidden ml-2 z-50 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full bg-[#553C9A] shadow-xl py-24 px-6 lg:hidden flex flex-col gap-6 animate-in slide-in-from-top-10 duration-200 z-40 border-b border-white/10">
           
           {isAuthenticated && (
             <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl mb-2">
               <img src={user?.avatar} alt={user?.name} className="w-12 h-12 rounded-full bg-white/20" />
               <div>
                 <p className="font-bold text-white">{user?.name}</p>
                 <p className="text-xs text-purple-200">{user?.email}</p>
               </div>
             </div>
           )}

           <div className="flex flex-col gap-4 text-lg font-medium">
             <button 
               onClick={() => handleNav('home')}
               className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
             >
               <Home size={20} /> Browse Rentals
             </button>

             <button 
               onClick={() => handleNav('vote')}
               className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
             >
               <Vote size={20} /> Vote Competitions
             </button>
             
             {isAuthenticated && (
              <>
               <button 
                 onClick={() => handleNav('profile')}
                 className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
               >
                 <User size={20} /> My Profile
               </button>
               <button 
                 onClick={() => handleNav('orders')}
                 className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
               >
                 <Package size={20} /> My Orders
               </button>
              </>
             )}

             <button 
               onClick={() => handleNav('cart')}
               className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
             >
               <ShoppingCart size={20} /> View Cart ({itemCount})
             </button>
             
             <button 
                onClick={() => {
                  handleExternalQuery('How does Rentloo work?');
                  setIsMobileMenuOpen(false);
                }} 
                className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10 text-left"
             >
               <Info size={20} /> How it works
             </button>

             <button 
                onClick={() => {
                  handleExternalQuery('How does the Guarantee work?');
                  setIsMobileMenuOpen(false);
                }} 
                className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10 text-left"
             >
               <ShieldCheck size={20} /> Guarantee
             </button>
             
             {isAuthenticated ? (
               <button onClick={handleLogout} className="flex items-center gap-3 text-red-300 hover:text-red-200 p-2 rounded-lg hover:bg-white/10 mt-4 border-t border-white/10 pt-6">
                 <LogOut size={20} /> Sign out
               </button>
             ) : (
                <button onClick={() => handleNav('login')} className="flex items-center gap-3 text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10">
                 <LogIn size={20} /> Log in / Sign up
               </button>
             )}
           </div>

           <button 
              onClick={() => handleNav('create-listing')}
              className="bg-[#68D391] text-green-900 font-bold py-3 rounded-xl w-full flex items-center justify-center gap-2"
           >
             <PlusCircle size={20} /> Create Listing
           </button>
        </div>
      )}
    </header>
  );
};

export default Header;
