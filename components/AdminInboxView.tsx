
import React, { useEffect, useState } from 'react';
import { Mail, Search, Trash2, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, User, Vote, Plus, Play, Pause, RotateCcw } from 'lucide-react';
import { useVote } from '../context/VoteContext';
import { useToast } from '../context/ToastContext';

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const AdminInboxView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'voting'>('messages');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Voting Context
  const { participants, isVotingActive, addParticipant, removeParticipant, toggleVotingStatus, resetVotes } = useVote();
  const { showToast } = useToast();
  
  // New Participant Form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rentloo_messages');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  const deleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem('rentloo_messages', JSON.stringify(updated));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc) return;
    addParticipant(newName, newDesc);
    setNewName('');
    setNewDesc('');
    showToast('Participant added successfully', 'success');
  };

  // Sort by votes for admin view too
  const sortedParticipants = [...participants].sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 max-w-5xl min-h-[80vh]">
      
      {/* Tab Switcher */}
      <div className="flex gap-4 mb-8 animate-slide-up">
         <button 
           onClick={() => setActiveTab('messages')}
           className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'messages' ? 'bg-[#553C9A] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
         >
           <Mail size={18} /> Support Messages
           <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full ml-1">{messages.length}</span>
         </button>
         <button 
           onClick={() => setActiveTab('voting')}
           className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'voting' ? 'bg-[#553C9A] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
         >
           <Vote size={18} /> Voting Manager
         </button>
      </div>

      {activeTab === 'messages' && (
        <>
          <div className="flex items-center justify-between mb-8 animate-in fade-in">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Admin Inbox</h1>
               <p className="text-gray-500 mt-2">View messages sent via the contact form.</p>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-16 text-center animate-in fade-in">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <Mail size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Inbox is empty</h3>
               <p className="text-gray-500">Messages sent from the "Contact Us" form will appear here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-slide-up">
               {messages.map((msg) => (
                 <div 
                   key={msg.id} 
                   className={`border-b border-gray-100 last:border-0 transition-colors ${expandedId === msg.id ? 'bg-purple-50/30' : 'hover:bg-gray-50 cursor-pointer'}`}
                   onClick={() => toggleExpand(msg.id)}
                 >
                    <div className="p-5 flex items-start gap-4">
                       <div className="mt-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${expandedId === msg.id ? 'bg-[#805AD5] text-white' : 'bg-gray-100 text-gray-600'}`}>
                             {msg.name.charAt(0).toUpperCase()}
                          </div>
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                             <h3 className="font-bold text-gray-900 truncate pr-4">{msg.subject}</h3>
                             <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                               <Clock size={12} />
                               {new Date(msg.date).toLocaleDateString()}
                             </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                             <p className="text-sm text-gray-600 truncate flex items-center gap-2">
                                <span className="font-medium text-gray-900">{msg.name}</span>
                                <span className="text-gray-400">&lt;{msg.email}&gt;</span>
                             </p>
                             <button 
                                onClick={(e) => deleteMessage(msg.id, e)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                title="Delete"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === msg.id && (
                       <div className="px-5 pb-5 pl-[72px] animate-in slide-in-from-top-2">
                          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed shadow-sm">
                             {msg.message}
                          </div>
                          <div className="mt-3 flex gap-3">
                             <a href={`mailto:${msg.email}`} className="text-sm font-bold text-[#805AD5] hover:underline flex items-center gap-1">
                                Reply via Email
                             </a>
                          </div>
                       </div>
                    )}
                 </div>
               ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'voting' && (
        <div className="animate-in fade-in">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                 <h1 className="text-3xl font-bold text-gray-900">Voting Manager</h1>
                 <p className="text-gray-500 mt-2">Add participants and control the live voting session.</p>
              </div>
              
              <div className="flex items-center gap-3">
                 <button 
                   onClick={resetVotes}
                   className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                 >
                   <RotateCcw size={16} /> Reset Votes
                 </button>
                 <button 
                   onClick={toggleVotingStatus}
                   className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all ${isVotingActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                 >
                   {isVotingActive ? <><Pause size={18} /> Stop Voting</> : <><Play size={18} /> Start Vote</>}
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form to Add */}
              <div className="lg:col-span-1">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Plus size={20} className="text-[#805AD5]" /> Add Participant
                    </h3>
                    <form onSubmit={handleAddParticipant} className="space-y-4">
                       <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                          <input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#805AD5] outline-none"
                            placeholder="e.g. John Doe"
                            required
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                          <textarea 
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#805AD5] outline-none resize-none"
                            placeholder="e.g. Best Rental Service 2024"
                            rows={3}
                            required
                          />
                       </div>
                       <button className="w-full bg-[#805AD5] text-white font-bold py-3 rounded-xl hover:bg-[#6B46C1] transition-colors">
                          Add to List
                       </button>
                    </form>
                 </div>
              </div>

              {/* List / Live Results */}
              <div className="lg:col-span-2">
                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
                    <span>Participants ({participants.length})</span>
                    {isVotingActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse">● Live</span>}
                 </h3>
                 
                 <div className="space-y-3">
                    {sortedParticipants.map((p, idx) => (
                       <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 transition-all">
                          <div className="text-xl font-bold text-gray-300 w-8">#{idx + 1}</div>
                          <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full bg-gray-50 object-cover" />
                          <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-gray-900">{p.name}</h4>
                             <p className="text-sm text-gray-500 truncate">{p.description}</p>
                          </div>
                          <div className="text-right px-4 border-r border-gray-100">
                             <span className="block font-bold text-lg text-[#805AD5]">{p.votes}</span>
                             <span className="text-xs text-gray-400 uppercase">Votes</span>
                          </div>
                          <button 
                            onClick={() => removeParticipant(p.id)}
                            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                    
                    {participants.length === 0 && (
                       <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400">
                          Add participants to start a voting session.
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminInboxView;
