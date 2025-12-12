
import React from 'react';
import { Facebook, Instagram, Mail, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface FooterProps {
  onNavigate: (page: 'home' | 'cart' | 'orders' | 'login' | 'create-listing' | 'view-all' | 'profile' | 'admin-inbox') => void;
  onContactClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onContactClick }) => {
  const { handleExternalQuery } = useChat();

  return (
    <footer className="bg-[#553C9A] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#FEB2B2]">Rentloo</h2>
            <div className="space-y-3 text-sm text-purple-100">
              <button onClick={() => handleExternalQuery('Tell me about Rentloo')} className="block hover:text-white text-left">About Rentloo</button>
              <button onClick={() => handleExternalQuery('How does the Guarantee work?')} className="block hover:text-white text-left">Guarantee</button>
              <button onClick={() => handleExternalQuery('Show me FAQs')} className="block hover:text-white text-left">FAQ's</button>
              <button onClick={() => handleExternalQuery('What are the Terms and Conditions?')} className="block hover:text-white text-left">Terms and Conditions</button>
            </div>
          </div>

          {/* Col 2 */}
          <div className="pt-2">
            <h3 className="font-bold mb-4 hidden md:block opacity-0">Links</h3>
            <div className="space-y-3 text-sm text-purple-100">
              <button onClick={() => handleExternalQuery('What is the Privacy Policy?')} className="block hover:text-white text-left">Privacy Policy</button>
              <button onClick={() => handleExternalQuery('I am interested in Partnerships')} className="block hover:text-white text-left">Partnerships</button>
              <button onClick={() => onNavigate('view-all')} className="block hover:text-white text-left">All categories</button>
            </div>
          </div>

          {/* Col 3 */}
          <div className="pt-2">
            <div className="space-y-3 text-sm text-purple-100">
              <a href="#" className="block hover:text-white"></a>
              <a href="#" className="block hover:text-white"></a>
            </div>
          </div>

          {/* Col 4 - Contact Us & App */}
          <div>
            <h3 className="font-bold mb-4 text-white">Contact Us</h3>
            <div className="space-y-4 text-sm text-purple-200 mb-8">
              <div>
                <p className="mb-2">Have specific questions?</p>
                <a href="mailto:support@rentloo.com" className="flex items-center gap-2 text-white hover:text-green-300 font-medium transition-colors mb-2">
                  <Mail size={16} /> support@rentloo.com
                </a>
                <button 
                  onClick={onContactClick}
                  className="flex items-center gap-2 text-purple-300 hover:text-white text-xs font-medium transition-colors underline underline-offset-2"
                >
                  <MessageSquare size={12} /> Or send a message directly
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <button className="bg-black/30 border border-white/20 rounded p-1 px-3 flex items-center gap-2 hover:bg-black/40">
                <span className="text-xs">App Store</span>
              </button>
              <button className="bg-black/30 border border-white/20 rounded p-1 px-3 flex items-center gap-2 hover:bg-black/40">
                <span className="text-xs">Google Play</span>
              </button>
            </div>

            <div className="flex gap-4">
               <Facebook className="text-white hover:text-purple-200 cursor-pointer" />
               <Instagram className="text-white hover:text-purple-200 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-xs text-purple-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <p className="mb-1 text-[#FEB2B2]">English</p>
              <p>Rentloo LTD • 5th Main, Kempapura, Hebbal, Benglauru</p>
              <p>Company registration number 12456789</p>
           </div>
           
           <button 
             onClick={() => onNavigate('admin-inbox')}
             className="text-white/50 hover:text-white hover:underline"
           >
             View Admin Inbox
           </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
