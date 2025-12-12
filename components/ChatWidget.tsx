
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const PREDEFINED_QUESTIONS = [
  { id: '1', q: "How does insurance work?", a: "Every rental on Rentloo is insured up to ₹25,00,000. It covers damages, theft, and loss during the rental period. The insurance fee is included in the service fee." },
  { id: '2', q: "How do I verify my ID?", a: "You can verify your ID in your profile settings. We use BankID or secure document upload (Passport/Driver's License) to ensure our community is safe." },
  { id: '3', q: "When do I get paid?", a: "If you are renting out an item, payouts are processed automatically 3 business days after the rental period ends successfully." },
  { id: '4', q: "Can I cancel a booking?", a: "Yes! You can cancel up to 24 hours before the rental starts for a full refund. Late cancellations may incur a fee." }
];

const ChatWidget: React.FC = () => {
  const { isOpen, closeChat, toggleChat, externalQuery, clearExternalQuery } = useChat();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', text: "Hi there! 👋 I'm the Rentloo support bot. How can I help you today?", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Handle external triggers (e.g., from footer)
  useEffect(() => {
    if (externalQuery) {
      // 1. Determine answer based on query content
      let answer = "I'm not sure about that. Try one of the suggested questions below.";
      const queryLower = externalQuery.toLowerCase();
      
      if (queryLower.includes("how does rentloo work")) {
        answer = "Rentloo makes renting simple! Here are the key operations:\n\n" +
                 "🔍 **Browse & Rent**: Search for items nearby, check availability on the calendar, and request a booking.\n\n" +
                 "📸 **List Items**: Have unused gear? Use our 'Create Listing' feature with the Smart Camera to list it in seconds.\n\n" +
                 "💳 **Secure Payment**: Pay securely via Card, UPI, or Wallet. Money is held until the owner accepts.\n\n" +
                 "🤝 **Meet & Exchange**: Pick up the item from the owner and return it when you're done.";
      } else if (queryLower.includes("about rentloo")) {
        answer = "Rentloo is a peer-to-peer rental marketplace where you can borrow items from your neighbors instead of buying them. We aim to reduce waste, save you money, and build stronger communities!";
      } else if (queryLower.includes("guarantee") || queryLower.includes("insurance")) {
        answer = "We provide a comprehensive guarantee. Every rental is insured up to ₹25,00,000 against damage and theft. Both owners and renters are verified for safety.";
      } else if (queryLower.includes("faq")) {
        answer = "Here are some of our most frequently asked questions. Click on any of the buttons below to learn more.";
      } else if (queryLower.includes("terms")) {
         answer = "Our Terms and Conditions ensure a safe community. Key points: Users must be 18+, ID verification is mandatory, and you are responsible for the item during the rental period. Cancellations are free up to 24h before start.";
      } else if (queryLower.includes("privacy")) {
         answer = "We take privacy seriously. Your data is encrypted and stored securely. We do not sell your data. You can manage your privacy settings in your profile.";
      } else if (queryLower.includes("partnership")) {
         answer = "We are always looking for great partners! Whether you are a business or an influencer, please reach out to us at partners@rentloo.com with your proposal.";
      }

      // 2. Add user message immediately
      const userMsg: Message = {
        id: Date.now().toString(),
        text: externalQuery,
        sender: 'user'
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      // 3. Simulate bot response
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: answer,
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 800);

      // 4. Clear the query so it doesn't re-trigger
      clearExternalQuery();
    }
  }, [externalQuery, clearExternalQuery]);

  const handleQuestionClick = (question: { id: string, q: string, a: string }) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: question.q,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate bot delay
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: question.a,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none transition-all duration-300 ${isOpen ? 'z-[100]' : 'z-[50]'}`}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-gray-200 mb-4 overflow-hidden flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-200">
          
          {/* Header */}
          <div className="bg-[#553C9A] p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Rentloo Support</h3>
                <span className="text-[10px] text-green-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={closeChat}
              className="hover:bg-white/10 p-1 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap
                    ${msg.sender === 'user' 
                      ? 'bg-[#805AD5] text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }
                  `}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions Area (Footer) */}
          <div className="p-3 bg-white border-t border-gray-100 max-h-[160px] overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionClick(q)}
                  disabled={isTyping}
                  className="text-xs bg-gray-100 hover:bg-[#805AD5] hover:text-white text-gray-700 px-3 py-2 rounded-full transition-all border border-gray-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={toggleChat}
        className="pointer-events-auto bg-[#805AD5] hover:bg-[#6B46C1] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} className="group-hover:animate-pulse" />
        )}
      </button>

    </div>
  );
};

export default ChatWidget;
