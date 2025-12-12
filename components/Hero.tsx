import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Sparkles, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { POPULAR_CATEGORIES } from '../constants';
import { getAIRecommendations } from '../services/geminiService';

interface HeroProps {
  onSearch: (term: string) => void;
  onSelectCategory: (categorySlug: string | null) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Popover states
  const [showMap, setShowMap] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); 

  // Refs for click outside
  const mapRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setShowMap(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    onSearch(searchTerm);

    setIsAiLoading(true);
    // Wrap in try-catch to prevent UI blocking if AI service fails
    try {
        const aiSuggestions = await getAIRecommendations(searchTerm);
        setSuggestions(aiSuggestions);
    } catch (err) {
        console.error("Failed to get suggestions", err);
    } finally {
        setIsAiLoading(false);
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (day: number) => {
      if (!selectedDate) return false;
      return day === selectedDate.getDate() && 
             currentDate.getMonth() === selectedDate.getMonth() && 
             currentDate.getFullYear() === selectedDate.getFullYear();
  }

  const handleDateClick = (day: number) => {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      setShowCalendar(false); 
  }

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] bg-gray-900 overflow-hidden perspective-1000">
      {/* 3D Background Image with Slow Zoom */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-slow-zoom"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000")',
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Floating Particles/Decorations */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 lg:pt-40 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Content & Search */}
        <div className="lg:col-span-7 flex flex-col justify-center transform-style-3d">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight reveal-text-3d">
            Borrow instead <br/> of buying
          </h1>
          <p className="text-xl text-gray-200 mb-8 font-light reveal-text-3d reveal-delay-1">
            Nearby and at times that suit you
          </p>

          {/* Search Box - 3D Lift */}
          <div className="bg-white rounded-xl p-2 shadow-2xl max-w-2xl w-full relative z-20 reveal-text-3d reveal-delay-2 transform hover:scale-[1.01] transition-transform duration-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center">
              <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                <Search className="text-gray-400 w-5 h-5 mr-3" />
                <input 
                  type="text" 
                  placeholder="What do you need? (Try 'Camping trip')" 
                  className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 p-2 relative">
                 {/* Location Button */}
                 <div className="relative" ref={mapRef}>
                    <button 
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className={`hidden md:flex items-center gap-2 text-sm font-medium px-3 transition-colors ${showMap ? 'text-[#805AD5]' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <MapPin size={16} />
                        <span className="truncate max-w-[100px]">Near Bangalore</span>
                    </button>

                    {/* Map Popover */}
                    {showMap && (
                        <div className="absolute top-full mt-4 left-0 w-80 h-64 bg-white rounded-xl shadow-2xl p-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200" style={{transformStyle: 'preserve-3d', transform: 'translateZ(20px)'}}>
                            <iframe 
                                title="Map"
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                loading="lazy"
                                marginHeight={0} 
                                marginWidth={0} 
                                src="https://maps.google.com/maps?q=Bangalore,India&z=12&output=embed"
                                className="rounded-lg bg-gray-100"
                            ></iframe>
                            <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                        </div>
                    )}
                 </div>

                 {/* Date Button */}
                 <div className="relative" ref={calendarRef}>
                     <button 
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={`hidden md:flex items-center gap-2 text-sm font-medium px-3 border-l border-gray-200 transition-colors ${showCalendar ? 'text-[#805AD5]' : 'text-gray-500 hover:text-gray-800'}`}
                     >
                        <Calendar size={16} />
                        <span>{selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Select dates'}</span>
                     </button>

                     {/* Calendar Popover */}
                     {showCalendar && (
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl p-4 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200" style={{transformStyle: 'preserve-3d', transform: 'translateZ(20px)'}}>
                           <div className="flex justify-between items-center mb-4">
                               <button onClick={prevMonth} type="button" className="p-1 hover:bg-gray-100 rounded-full text-gray-600"><ChevronLeft size={16} /></button>
                               <span className="font-bold text-gray-800 text-sm">{currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                               <button onClick={nextMonth} type="button" className="p-1 hover:bg-gray-100 rounded-full text-gray-600"><ChevronRight size={16} /></button>
                           </div>
                           <div className="grid grid-cols-7 text-center mb-2">
                               {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                   <div key={d} className="text-xs font-semibold text-gray-400">{d}</div>
                               ))}
                           </div>
                           <div className="grid grid-cols-7 gap-1">
                               {blanks.map(x => <div key={`blank-${x}`} />)}
                               {days.map(d => (
                                   <button 
                                      key={d} 
                                      type="button"
                                      onClick={() => handleDateClick(d)}
                                      className={`
                                        h-8 w-8 text-sm rounded-full flex items-center justify-center transition-colors
                                        ${isToday(d) && !isSelected(d) ? 'border border-[#805AD5] text-[#805AD5] font-semibold' : ''}
                                        ${isSelected(d) ? 'bg-[#805AD5] text-white hover:bg-[#6B46C1] shadow-md' : 'hover:bg-gray-100 text-gray-700'}
                                      `}
                                   >
                                       {d}
                                   </button>
                               ))}
                           </div>
                           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                        </div>
                     )}
                 </div>

                 <button type="submit" className="bg-[#bbf7d0] hover:bg-[#86efac] text-green-900 px-8 py-3 rounded-lg font-semibold transition-transform active:scale-95 flex-1 md:flex-none shadow-lg hover:shadow-green-300/30">
                   Search
                 </button>
              </div>
            </form>
          </div>

          {/* AI Suggestions Pill Area */}
          <div className="mt-6 reveal-text-3d reveal-delay-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white/80 text-sm">Recent searches:</span>
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
                Projector
              </button>
              {isAiLoading && (
                 <span className="flex items-center gap-2 text-green-300 text-sm animate-pulse">
                   <Sparkles size={14} /> AI is thinking...
                 </span>
              )}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-green-300 text-sm flex items-center gap-1 w-full"><Sparkles size={12}/> AI Suggestions:</span>
                  {suggestions.map((s, i) => (
                    <span key={i} className="bg-purple-900/60 border border-purple-500/50 text-purple-100 px-3 py-1 rounded-full text-xs animate-in zoom-in duration-300" style={{animationDelay: `${i * 100}ms`}}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Categories Overlay (Floating) */}
        <div className="lg:col-span-5 text-white perspective-500">
          <div className="lg:bg-white/10 lg:backdrop-blur-md p-6 lg:rounded-3xl border border-white/10 animate-float shadow-2xl transform-style-3d hover:rotate-1 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-6" style={{transform: 'translateZ(20px)'}}>
                <div className="bg-yellow-400 p-2 rounded-lg text-yellow-900">
                    <Zap size={24} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold">Trending Categories</h2>
            </div>
            
            <div className="flex gap-3 mb-6" style={{transform: 'translateZ(10px)'}}>
              <button 
                onClick={() => onSelectCategory(null)}
                className="bg-[#805AD5] hover:bg-[#6B46C1] text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg"
              >
                All categories
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg">
                Film & Photography
              </button>
            </div>

            <div className="flex flex-wrap gap-3" style={{transform: 'translateZ(30px)'}}>
              {POPULAR_CATEGORIES.map((cat, idx) => (
                <button 
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className="border border-white/40 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm transition-all hover:scale-110 hover:shadow-lg hover:border-white"
                  style={{transitionDelay: `${idx * 50}ms`}}
                >
                  {cat.name}
                </button>
              ))}
              <button className="border border-white/40 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm hover:scale-105">
                Go to category overview
              </button>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent z-20"></div>
    </section>
  );
};

export default Hero;