
import React, { useState } from 'react';
import { Star, Send, User, MessageSquare, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [showAll, setShowAll] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate network delay for effect
    setTimeout(() => {
      const newReview: Testimonial = {
        id: Date.now().toString(),
        text: message,
        author: name,
        rentedItem: 'Verified User', // Default badge
        timeAgo: 'Just now',
        rating: rating
      };

      setReviews(prev => [newReview, ...prev]);
      
      // Reset form
      setName('');
      setMessage('');
      setRating(5);
      setIsSubmitting(false);
    }, 600);
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold text-gray-900 mb-4">Some love from our users</h2>
           <p className="text-gray-500 max-w-2xl mx-auto">
             See what our community has to say about their rental experiences. We value transparency and trust above all.
           </p>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {displayedReviews.map((t, index) => (
            <div 
              key={t.id} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full transform transition-all hover:-translate-y-1 hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-[#805AD5] font-bold text-lg">
                      {t.author.charAt(0).toUpperCase()}
                   </div>
                   <div>
                      <span className="block font-bold text-gray-900 text-sm">{t.author}</span>
                      <span className="text-xs text-gray-400 font-medium">{t.timeAgo}</span>
                   </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < t.rating ? "currentColor" : "none"} 
                      className={i < t.rating ? "text-yellow-400" : "text-gray-200"}
                      strokeWidth={i < t.rating ? 0 : 2} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative mb-6 flex-1">
                <span className="absolute -top-2 -left-2 text-4xl text-purple-100 font-serif leading-none">"</span>
                <p className="text-gray-700 font-medium text-lg leading-relaxed relative z-10">
                  {t.text}
                </p>
              </div>
              
              <div className="text-xs bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center gap-2">
                <ThumbsUp size={12} className="text-[#805AD5]" />
                <span className="text-gray-500">Rented: </span>
                <span className="font-semibold text-[#805AD5] truncate max-w-[150px]">{t.rentedItem}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All / Collapse Button */}
        {reviews.length > 3 && (
          <div className="text-center mb-20">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center justify-center gap-2 mx-auto text-[#805AD5] font-bold hover:bg-purple-50 px-6 py-2 rounded-full transition-all"
            >
              {showAll ? 'Show Less' : `View all ${reviews.length} reviews`}
              {showAll ? (
                <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" />
              ) : (
                <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
              )}
            </button>
          </div>
        )}

        {/* Feedback Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
             <div className="h-2 bg-gradient-to-r from-[#805AD5] to-blue-500 w-full"></div>
             
             <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="bg-purple-100 p-3 rounded-full text-[#805AD5]">
                      <MessageSquare size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold text-gray-900">Share your experience</h3>
                      <p className="text-gray-500 text-sm">Your feedback helps us improve the Rentloo community.</p>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   {/* Rating Input */}
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">How would you rate your experience?</label>
                      <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                            >
                               <Star 
                                 size={32} 
                                 fill={(hoveredStar !== null ? star <= hoveredStar : star <= rating) ? "#FACC15" : "none"}
                                 className={(hoveredStar !== null ? star <= hoveredStar : star <= rating) ? "text-yellow-400" : "text-gray-300"}
                                 strokeWidth={1.5}
                               />
                            </button>
                         ))}
                         <span className="ml-4 text-sm font-medium text-gray-500 self-center">
                            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Okay' : 'Needs Improvement'}
                         </span>
                      </div>
                   </div>

                   {/* Name Input */}
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                      <div className="relative">
                         <User className="absolute left-3 top-3 text-gray-400" size={18} />
                         <input 
                           type="text" 
                           placeholder="Your full name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#805AD5] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                           required
                         />
                      </div>
                   </div>

                   {/* Message Input */}
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                      <textarea 
                        rows={4}
                        placeholder="Tell us about your rental experience..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#805AD5] focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                        required
                      />
                   </div>

                   <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full bg-[#805AD5] hover:bg-[#6B46C1] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? (
                        <>Processing...</>
                     ) : (
                        <>Submit Feedback <Send size={18} /></>
                     )}
                   </button>
                </form>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
