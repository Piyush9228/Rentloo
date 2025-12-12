
import React, { useState } from 'react';
import { X, Send, Mail, CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend API call and save to LocalStorage
    setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
        read: false
      };

      const existingMessages = JSON.parse(localStorage.getItem('rentloo_messages') || '[]');
      localStorage.setItem('rentloo_messages', JSON.stringify([newMessage, ...existingMessages]));

      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('Message sent successfully!', 'success');
    }, 1500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#553C9A] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-purple-200" />
            <h3 className="font-bold text-lg">Contact Support</h3>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
            <p className="text-gray-500 mb-8 max-w-xs">
              Thank you for reaching out. Our support team will get back to you at <strong>{formData.email}</strong> within 24 hours.
            </p>
            <button 
              onClick={handleClose}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-8 py-3 rounded-xl font-bold transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm mb-4 flex gap-3">
               <MessageSquare size={18} className="flex-shrink-0 mt-0.5" />
               <p>We usually reply within a few hours. Please be as descriptive as possible.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
              <input 
                required
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
              <textarea 
                required
                rows={4}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#805AD5] transition-all resize-none"
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#805AD5] hover:bg-[#6B46C1] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
