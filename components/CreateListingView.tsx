
import React, { useState } from 'react';
import { Upload, Camera, MapPin, DollarSign, AlertCircle, Check, ArrowRight, X, Plus, Aperture } from 'lucide-react';
import { POPULAR_CATEGORIES } from '../constants';
import { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useListings } from '../context/ListingContext';
import CameraCaptureModal from './CameraCaptureModal';

interface CreateListingViewProps {
  onSubmit?: (listing: Listing) => void; // Kept for navigation behavior
  onSuccess: () => void;
}

const CreateListingView: React.FC<CreateListingViewProps> = ({ onSubmit, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addListing } = useListings();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price1Day: '',
    price3Day: '',
    price7Day: '',
    location: '',
    cancellationPolicy: 'flexible' as 'flexible' | 'medium' | 'strict'
  });

  // Category State
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');

  // Image State
  const [images, setImages] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleCameraCapture = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
    showToast('Photo captured successfully', 'success');
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('You must be logged in to list an item', 'error');
      return;
    }
    
    // Determine final category
    let finalCategory = selectedCategorySlug;
    if (selectedCategorySlug === 'other') {
        // Try to match custom text to an existing category
        const matchingCategory = POPULAR_CATEGORIES.find(c => c.name.toLowerCase() === customCategory.toLowerCase());
        finalCategory = matchingCategory ? matchingCategory.slug : customCategory.toLowerCase().replace(/\s+/g, '-');
    }

    if (!formData.title || !formData.price1Day || !finalCategory) {
       showToast('Please fill in title, price and category', 'error');
       return;
    }

    if (images.length === 0) {
      showToast('Please upload at least one image', 'error');
      return;
    }

    const newListing: Listing = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      image: images[0], // Use the first image as the main display image
      images: images,   // Pass all images for slideshow
      pricePerDay: parseFloat(formData.price1Day),
      currency: '₹',
      location: formData.location || 'Bangalore, India',
      ownerName: user.name,
      ownerAvatar: user.avatar,
      category: finalCategory,
      cancellationPolicy: formData.cancellationPolicy,
      createdAt: new Date().toISOString() // Track creation time for edit limits
    };

    // Use Context to add listing globally (avoids double entry in app state)
    addListing(newListing);
    
    showToast('Listing published successfully!', 'success');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">List your item</h1>
        <p className="text-gray-500">Earn money by renting out things you don't use every day.</p>
      </div>

      {/* Main Form Container - Dark Mode as requested for contrast */}
      <form onSubmit={handleSubmit} className="bg-gray-900 text-white rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
        
        {/* 1. Category */}
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#805AD5] text-white flex items-center justify-center text-sm font-bold">1</span>
            Select Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
             {/* Map Popular Categories - Show ALL to allow correct selection */}
             {POPULAR_CATEGORIES.map((cat) => (
                <label key={cat.id} className={`
                  cursor-pointer p-3 rounded-xl border transition-all text-sm font-medium text-center flex items-center justify-center
                  ${selectedCategorySlug === cat.slug 
                    ? 'border-[#805AD5] bg-[#805AD5]/20 text-[#D6BCFA] ring-1 ring-[#805AD5]' 
                    : 'border-gray-700 hover:border-gray-500 text-gray-300 bg-gray-800'}
                `}>
                   <input 
                     type="radio" 
                     name="categorySelect" 
                     value={cat.slug} 
                     className="hidden"
                     onChange={(e) => setSelectedCategorySlug(e.target.value)}
                   />
                   {cat.name}
                </label>
             ))}

             {/* Other / Custom Option */}
             <label className={`
                  cursor-pointer p-3 rounded-xl border transition-all text-sm font-medium text-center flex items-center justify-center
                  ${selectedCategorySlug === 'other' 
                    ? 'border-[#805AD5] bg-[#805AD5]/20 text-[#D6BCFA] ring-1 ring-[#805AD5]' 
                    : 'border-gray-700 hover:border-gray-500 text-gray-300 bg-gray-800'}
                `}>
                   <input 
                     type="radio" 
                     name="categorySelect" 
                     value="other" 
                     className="hidden"
                     onChange={(e) => setSelectedCategorySlug(e.target.value)}
                   />
                   Other (Type your own)
             </label>
          </div>

          {/* Custom Category Input */}
          {selectedCategorySlug === 'other' && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Custom Category Name</label>
              <input 
                type="text" 
                placeholder="e.g. Vintage Arcade Machine"
                className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none transition-all placeholder-gray-500"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 2. Description */}
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#805AD5] text-white flex items-center justify-center text-sm font-bold">2</span>
            Describe your item
          </h2>
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
               <input 
                 type="text" 
                 name="title" 
                 placeholder="e.g. Professional Drill Kit (DeWalt)"
                 className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none transition-all placeholder-gray-500"
                 value={formData.title}
                 onChange={handleInputChange}
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
               <textarea 
                 name="description" 
                 rows={4}
                 placeholder="Describe the condition, features, and what's included..."
                 className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none transition-all resize-none placeholder-gray-500"
                 value={formData.description}
                 onChange={handleInputChange}
               />
             </div>
          </div>
        </div>

        {/* 3. Pictures (Multiple Upload) */}
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#805AD5] text-white flex items-center justify-center text-sm font-bold">3</span>
            Pictures
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* File Upload Option */}
               <label className="flex flex-col items-center justify-center h-48 w-full rounded-2xl border-2 border-dashed border-gray-600 bg-gray-800 hover:bg-gray-750 hover:border-gray-500 cursor-pointer transition-all group">
                  <div className="bg-gray-700 p-4 rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform">
                     <Upload size={32} className="text-[#805AD5]" />
                  </div>
                  <span className="font-semibold text-gray-300">Upload Photos</span>
                  <span className="text-xs text-gray-500 mt-1">Select from device</span>
                  <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*" 
                     multiple 
                     onChange={handleImageUpload} 
                  />
               </label>

               {/* Camera Capture Option */}
               <button 
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex flex-col items-center justify-center h-48 w-full rounded-2xl border-2 border-dashed border-gray-600 bg-gray-800 hover:bg-gray-750 hover:border-gray-500 cursor-pointer transition-all group"
               >
                  <div className="bg-gray-700 p-4 rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform">
                     <Camera size={32} className="text-[#805AD5]" />
                  </div>
                  <span className="font-semibold text-gray-300">Take Photo</span>
                  <span className="text-xs text-gray-500 mt-1">Use device camera</span>
               </button>
            </div>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400 font-medium">Selected Images ({images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-700">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Remove Button */}
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>

                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 bg-[#805AD5] text-white text-[10px] px-2 py-0.5 rounded shadow-sm">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                  
                  {/* Small add button in grid */}
                  <label className="aspect-square rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-750 flex items-center justify-center cursor-pointer transition-colors">
                     <Plus size={24} className="text-gray-500" />
                     <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Price */}
        <div className="p-8 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#805AD5] text-white flex items-center justify-center text-sm font-bold">4</span>
            Set your price (₹)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price per day</label>
                <div className="relative">
                   <span className="absolute left-3 top-3 text-gray-500 text-sm">₹</span>
                   <input 
                    type="number" 
                    name="price1Day"
                    placeholder="0" 
                    className="w-full pl-9 p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none placeholder-gray-500"
                    value={formData.price1Day}
                    onChange={handleInputChange}
                   />
                </div>
             </div>
             <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price for 3 days</label>
                <div className="relative">
                   <span className="absolute left-3 top-3 text-gray-500 text-sm">₹</span>
                   <input 
                    type="number" 
                    name="price3Day"
                    placeholder="0" 
                    className="w-full pl-9 p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none placeholder-gray-500"
                    value={formData.price3Day}
                    onChange={handleInputChange}
                   />
                </div>
             </div>
             <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Price for 7 days</label>
                <div className="relative">
                   <span className="absolute left-3 top-3 text-gray-500 text-sm">₹</span>
                   <input 
                    type="number" 
                    name="price7Day"
                    placeholder="0" 
                    className="w-full pl-9 p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none placeholder-gray-500"
                    value={formData.price7Day}
                    onChange={handleInputChange}
                   />
                </div>
             </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
             <AlertCircle size={12} /> Rentloo takes a 20% service fee on successful rentals.
          </p>
        </div>

        {/* 5. Location */}
        <div className="p-8 border-b border-gray-800">
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#805AD5] text-white flex items-center justify-center text-sm font-bold">5</span>
            Where can the item be handed over?
          </h2>
          <div className="relative">
             <MapPin className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
             <input 
               type="text" 
               name="location"
               placeholder="Street address, City, or Postcode" 
               className="w-full pl-10 p-3 rounded-xl border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-[#805AD5] outline-none placeholder-gray-500"
               value={formData.location}
               onChange={handleInputChange}
             />
          </div>
        </div>

        {/* 6. Cancellation Terms */}
        <div className="p-8">
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#805AD5] text-white flex items-center justify-center text-sm font-bold">6</span>
            Cancellation Terms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {['flexible', 'medium', 'strict'].map((policy) => (
                <label key={policy} className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all relative
                  ${formData.cancellationPolicy === policy 
                    ? 'border-[#805AD5] bg-[#805AD5]/20 text-[#D6BCFA]' 
                    : 'border-gray-700 hover:border-gray-500 bg-gray-800 text-gray-300'}
                `}>
                   <input 
                     type="radio" 
                     name="cancellationPolicy" 
                     value={policy} 
                     className="hidden"
                     onChange={handleInputChange}
                   />
                   <div className="flex justify-between items-center mb-2">
                      <span className="font-bold capitalize text-white">{policy}</span>
                      {formData.cancellationPolicy === policy && <Check size={16} className="text-[#805AD5]" />}
                   </div>
                   <p className="text-xs text-gray-400 leading-relaxed">
                     {policy === 'flexible' && 'Full refund 1 day prior to rental.'}
                     {policy === 'medium' && 'Full refund 3 days prior. 50% thereafter.'}
                     {policy === 'strict' && '50% refund up to 7 days prior. No refund after.'}
                   </p>
                </label>
             ))}
          </div>
        </div>

        {/* Submit */}
        <div className="p-8 bg-gray-800 border-t border-gray-700">
           <button 
             type="submit"
             className="w-full bg-[#68D391] hover:bg-[#5bc283] text-green-900 text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
           >
             Publish Listing <ArrowRight size={20} />
           </button>
        </div>

      </form>
      
      {/* Camera Capture Modal */}
      <CameraCaptureModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default CreateListingView;
