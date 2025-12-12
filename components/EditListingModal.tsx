
import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Listing } from '../types';
import { useToast } from '../context/ToastContext';

interface EditListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Listing>) => void;
}

const EditListingModal: React.FC<EditListingModalProps> = ({ listing, isOpen, onClose, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    location: ''
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description || '',
        pricePerDay: listing.pricePerDay.toString(),
        location: listing.location
      });
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pricePerDay) {
      showToast('Title and Price are required', 'error');
      return;
    }

    onSave(listing.id, {
      title: formData.title,
      description: formData.description,
      pricePerDay: parseFloat(formData.pricePerDay),
      location: formData.location
    });
    
    showToast('Listing updated successfully', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between text-white">
          <h3 className="font-bold text-lg">Edit Listing</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg flex items-start gap-2">
             <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
             <p>You can edit this listing for a limited time. Major changes might require re-verification.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
             <textarea 
               rows={4}
               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all resize-none"
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price / Day (₹)</label>
              <input 
                required
                type="number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                value={formData.pricePerDay}
                onChange={e => setFormData({...formData, pricePerDay: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
              <input 
                required
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               className="flex-1 bg-[#805AD5] hover:bg-[#6B46C1] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
             >
               <Save size={18} /> Save Changes
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;
