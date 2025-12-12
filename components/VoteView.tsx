
import React, { useState, useEffect, useRef } from 'react';
import { useVote } from '../context/VoteContext';
import { useToast } from '../context/ToastContext';
import { ThumbsUp, Trophy, Clock, Check, RefreshCw, Crown, Medal, PartyPopper, Wifi, WifiOff, Share2, Sparkles } from 'lucide-react';

const VoteView: React.FC = () => {
  const { participants, isVotingActive, userVote, voteForParticipant, isOnline } = useVote();
  const { showToast } = useToast();
  
  // State to track which items just updated (for visual pulse effect)
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const prevParticipantsRef = useRef<typeof participants>([]);

  // Effect to detect vote changes and trigger animations
  useEffect(() => {
    const newChanges = new Set<string>();
    
    // Compare current participants with previous ref
    participants.forEach(curr => {
      const prev = prevParticipantsRef.current.find(p => p.id === curr.id);
      // If previous version exists and votes changed
      if (prev && prev.votes !== curr.votes) {
        newChanges.add(curr.id);
      }
    });

    if (newChanges.size > 0) {
      setChangedIds(prev => {
        const next = new Set(prev);
        newChanges.forEach(id => next.add(id));
        return next;
      });

      // Clear highlights after animation duration
      const timer = setTimeout(() => {
        setChangedIds(new Set());
      }, 800); 

      return () => clearTimeout(timer);
    }
    
    prevParticipantsRef.current = participants;
  }, [participants]);

  const handleShare = async () => {
    // Construct a deep link to the vote page
    const baseUrl = window.location.origin + window.location.pathname;
    // Ensure we don't double slashes if pathname is just '/'
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl; 
    const shareUrl = `${cleanBase}?page=vote`;
    
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
       showToast('Localhost Link: Only works on this device.', 'info');
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rentloo Community Vote',
          text: 'Join the live voting session on Rentloo! Cast your vote now.',
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Share cancelled");
      }
    }

    // Fallback to clipboard
    navigator.clipboard.writeText(shareUrl);
    showToast('Voting link copied to clipboard!', 'success');
  };

  // Sort participants by votes descending
  const sortedParticipants = [...participants].sort((a, b) => b.votes - a.votes);
  
  const top3 = sortedParticipants.slice(0, 3);
  const rest = sortedParticipants.slice(3);

  // Helper to render podium column
  const renderPodiumStep = (participant: typeof participants[0], rank: number) => {
    let heightClass = 'h-40 md:h-52';
    let colorClass = 'bg-gray-100 border-gray-300';
    let textClass = 'text-gray-400';
    let delay = '200ms';
    let scale = 'scale-90';
    let label = '2nd';
    let icon = <Medal size={24} className="text-gray-400" />;

    const hasChanged = changedIds.has(participant.id);

    if (rank === 1) {
      heightClass = 'h-52 md:h-72';
      colorClass = 'bg-yellow-100 border-yellow-300';
      textClass = 'text-yellow-500';
      delay = '600ms'; 
      scale = 'scale-110 z-10';
      label = '1st';
      icon = <Crown size={32} className="text-yellow-500 fill-yellow-500 animate-pulse" />;
    } else if (rank === 3) {
      heightClass = 'h-32 md:h-40';
      colorClass = 'bg-orange-100 border-orange-300';
      textClass = 'text-orange-500';
      delay = '1000ms';
      scale = 'scale-90';
      label = '3rd';
      icon = <Medal size={24} className="text-orange-500" />;
    }

    return (
      <div 
        className={`flex flex-col items-center justify-end ${scale} transition-all duration-700`}
      >
         {/* Avatar & Name */}
         <div 
           className="mb-4 flex flex-col items-center animate-slide-up" 
           style={{ animationDelay: `${parseInt(delay) + 200}ms` }}
         >
            <div className="relative">
                <img 
                  src={participant.avatar} 
                  alt={participant.name}
                  className={`rounded-full border-4 border-white shadow-xl object-cover ${rank === 1 ? 'w-24 h-24' : 'w-20 h-20'} transition-transform duration-300 ${hasChanged ? 'scale-110 ring-4 ring-green-400' : ''}`} 
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  {icon}
                </div>
            </div>
            <span className="font-bold mt-3 text-gray-900 text-center leading-tight max-w-[120px]">{participant.name}</span>
            <div className={`
                px-3 py-1 rounded-full text-sm font-bold shadow-sm mt-1 border transition-all duration-300
                ${hasChanged ? 'bg-green-500 text-white scale-110 border-green-600' : 'bg-white/80 backdrop-blur text-[#805AD5] border-purple-100'}
            `}>
              {participant.votes} Votes
            </div>
         </div>

         {/* The Block */}
         <div 
           className={`w-24 md:w-32 ${heightClass} ${colorClass} border-t-4 rounded-t-xl shadow-lg flex flex-col items-center justify-start pt-4 relative animate-slide-up`}
           style={{ animationDelay: delay }}
         >
            <span className={`text-4xl font-black opacity-30 ${textClass}`}>{label}</span>
         </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 min-h-screen relative">
      
      {/* Top Bar Actions */}
      <div className="absolute top-24 right-4 lg:right-8 flex flex-col items-end gap-2 z-50">
        
        {/* Sync Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm transition-colors ${isOnline ? 'bg-green-50 border-green-200' : 'bg-white/80 border-gray-200 text-gray-500'}`}>
          {isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-green-700">Live Sync Active</span>
              </>
          ) : (
              <>
                <WifiOff size={14} />
                <span>Offline Mode (Local)</span>
              </>
          )}
        </div>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#805AD5] text-white hover:bg-[#6B46C1] transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Share2 size={14} /> Share Voting Link
        </button>
      </div>

      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex justify-center items-center gap-3">
          {isVotingActive ? <Trophy className="text-yellow-500" size={40} /> : <PartyPopper className="text-[#805AD5]" size={40} />} 
          {isVotingActive ? 'Community Vote' : 'Final Results'}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {isVotingActive 
            ? "Vote for your favorite community members or items. The leaderboard updates in real-time across all devices!"
            : "The voting session has ended. Here are the winners of the competition!"}
        </p>
        
        {isVotingActive && userVote && (
          <div className="mt-4 inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium animate-in fade-in">
             You have cast your vote. You can change it while the session is active.
          </div>
        )}
      </div>

      {isVotingActive ? (
        // ACTIVE VOTING VIEW (List)
        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
           {sortedParticipants.map((participant, index) => {
             const isVoted = userVote === participant.id;
             const isOtherVoted = userVote !== null && !isVoted;
             const hasChanged = changedIds.has(participant.id);
             
             return (
               <div 
                 key={participant.id}
                 className={`
                   relative bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-6 transition-all duration-300 ease-in-out
                   ${index === 0 ? 'border-yellow-400 ring-4 ring-yellow-400/20 scale-[1.02]' : 'border-gray-100'}
                   ${isVoted ? 'bg-green-50 border-green-200 ring-2 ring-green-400/30' : ''}
                   ${hasChanged ? 'scale-[1.03] ring-2 ring-green-400 bg-green-50' : ''}
                 `}
                 style={{ zIndex: sortedParticipants.length - index }}
               >
                  {/* Rank Indicator */}
                  <div className={`
                     w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xl font-bold transition-colors
                     ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                       index === 1 ? 'bg-gray-300 text-gray-800' :
                       index === 2 ? 'bg-orange-200 text-orange-800' : 'bg-gray-100 text-gray-500'}
                  `}>
                     #{index + 1}
                  </div>

                  {/* Avatar */}
                  <img src={participant.avatar} alt={participant.name} className="w-16 h-16 rounded-full bg-gray-50 object-cover border-2 border-white shadow-sm" />
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                     <h3 className="text-xl font-bold text-gray-900 truncate flex items-center gap-2">
                       {participant.name}
                       {isVoted && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Your Pick</span>}
                       {hasChanged && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1"><Sparkles size={10} /> New Vote</span>}
                     </h3>
                     <p className="text-sm text-gray-500 line-clamp-2">{participant.description}</p>
                  </div>

                  {/* Vote Button & Count */}
                  <div className="text-center flex flex-col items-center gap-2">
                     <div className={`
                        text-sm font-bold uppercase tracking-wide transition-colors duration-300
                        ${hasChanged ? 'text-green-600 scale-110' : 'text-gray-500'}
                     `}>
                       {participant.votes} Votes
                     </div>
                     
                     {isVoted ? (
                        <button 
                          disabled
                          className="bg-green-500 text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 cursor-default shadow-sm"
                        >
                          <Check size={18} /> Voted
                        </button>
                     ) : (
                        <button 
                          onClick={() => voteForParticipant(participant.id)}
                          className={`
                            font-bold px-6 py-2 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-sm hover:shadow-md
                            ${isOtherVoted 
                              ? 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800' 
                              : 'bg-[#68D391] hover:bg-[#5bc283] text-green-900'}
                          `}
                        >
                          {isOtherVoted ? (
                             <> <RefreshCw size={16} /> Revote </>
                          ) : (
                             <> <ThumbsUp size={18} /> Vote </>
                          )}
                        </button>
                     )}
                  </div>
               </div>
             );
           })}
           {sortedParticipants.length === 0 && (
             <div className="text-center py-12 text-gray-500">No participants yet.</div>
           )}
        </div>
      ) : (
        // RESULTS VIEW (Podium + Floor)
        sortedParticipants.length > 0 ? (
           <div className="max-w-4xl mx-auto">
              
              {/* Podium Section */}
              <div className="flex justify-center items-end gap-2 md:gap-6 mb-16 min-h-[450px] pt-10">
                 {/* 2nd Place (Left) */}
                 <div className="order-1">
                   {top3[1] && renderPodiumStep(top3[1], 2)}
                 </div>

                 {/* 1st Place (Center) */}
                 <div className="order-2 -mt-12">
                   {top3[0] && renderPodiumStep(top3[0], 1)}
                 </div>

                 {/* 3rd Place (Right) */}
                 <div className="order-3">
                   {top3[2] && renderPodiumStep(top3[2], 3)}
                 </div>
              </div>

              {/* The Floor (Rest of participants) */}
              {rest.length > 0 && (
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 animate-slide-up" style={{ animationDelay: '1200ms' }}>
                   <h3 className="text-center text-xl font-bold text-gray-800 mb-8 uppercase tracking-widest text-sm">Honorable Mentions</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rest.map((p, idx) => (
                        <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                           <div className="font-bold text-gray-400 text-lg w-8 text-center">#{idx + 4}</div>
                           <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                           <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{p.name}</h4>
                              <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</p>
                           </div>
                           <div className="font-bold text-[#805AD5]">{p.votes} pts</div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        ) : (
           // No Participants Empty State
           <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 text-center animate-in fade-in">
             <div className="bg-white p-6 rounded-full shadow-sm mb-6">
               <Clock size={48} className="text-[#805AD5]" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900 mb-2">No results to show</h2>
             <p className="text-gray-500 max-w-md">
               The voting session ended without any participants.
             </p>
           </div>
        )
      )}
    </div>
  );
};

export default VoteView;
