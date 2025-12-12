
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant } from '../types';
import { db } from '../services/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  runTransaction, 
  setDoc, 
  addDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

interface VoteContextType {
  participants: Participant[];
  isVotingActive: boolean;
  userVote: string | null;
  addParticipant: (name: string, description: string) => void;
  removeParticipant: (id: string) => void;
  voteForParticipant: (id: string) => void;
  toggleVotingStatus: () => void;
  resetVotes: () => void;
  isOnline: boolean; // Indicator if we are using Firebase
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const VoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOnline = !!db;

  // ------------------------------------------------------------------
  // STATE
  // ------------------------------------------------------------------
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isVotingActive, setIsVotingActive] = useState<boolean>(false);
  
  // Track local user vote (Client-side only)
  const [userVote, setUserVote] = useState<string | null>(() => {
    return localStorage.getItem('rentloo_user_vote_id');
  });

  // ------------------------------------------------------------------
  // EFFECTS: Load Data
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isOnline && db) {
      // === ONLINE MODE (FIREBASE) ===
      
      // 1. Listen to Participants Collection
      const unsubParticipants = onSnapshot(collection(db, "participants"), (snapshot) => {
        const pList: Participant[] = [];
        snapshot.forEach((doc) => {
          pList.push({ id: doc.id, ...doc.data() } as Participant);
        });
        setParticipants(pList);
      });

      // 2. Listen to Config (Voting Status)
      const unsubConfig = onSnapshot(doc(db, "config", "votingState"), (doc) => {
        if (doc.exists()) {
          setIsVotingActive(doc.data().isActive);
        } else {
          // Create default config if missing
          setDoc(doc.ref, { isActive: false });
        }
      });

      return () => {
        unsubParticipants();
        unsubConfig();
      };
    } else {
      // === OFFLINE MODE (LOCALSTORAGE) ===
      const savedP = localStorage.getItem('rentloo_participants');
      if (savedP) setParticipants(JSON.parse(savedP));

      const savedStatus = localStorage.getItem('rentloo_voting_active');
      if (savedStatus) setIsVotingActive(JSON.parse(savedStatus));
    }
  }, [isOnline]);

  // Sync LocalStorage for Offline Mode changes
  useEffect(() => {
    if (!isOnline) {
      localStorage.setItem('rentloo_participants', JSON.stringify(participants));
    }
  }, [participants, isOnline]);

  useEffect(() => {
    if (!isOnline) {
      localStorage.setItem('rentloo_voting_active', JSON.stringify(isVotingActive));
    }
  }, [isVotingActive, isOnline]);

  useEffect(() => {
    if (userVote) {
      localStorage.setItem('rentloo_user_vote_id', userVote);
    } else {
      localStorage.removeItem('rentloo_user_vote_id');
    }
  }, [userVote]);


  // ------------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------------

  const addParticipant = async (name: string, description: string) => {
    const newParticipant = {
      name,
      description,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      votes: 0
    };

    if (isOnline && db) {
      await addDoc(collection(db, "participants"), newParticipant);
    } else {
      const pWithId = { ...newParticipant, id: Math.random().toString(36).substr(2, 9) };
      setParticipants(prev => [...prev, pWithId]);
    }
  };

  const removeParticipant = async (id: string) => {
    if (isOnline && db) {
      await deleteDoc(doc(db, "participants", id));
    } else {
      setParticipants(prev => prev.filter(p => p.id !== id));
    }
    if (userVote === id) setUserVote(null);
  };

  const voteForParticipant = async (id: string) => {
    if (!isVotingActive) return;
    if (userVote === id) return;

    if (isOnline && db) {
      // Transaction to ensure vote counts are accurate
      const newRef = doc(db, "participants", id);
      const oldRef = userVote ? doc(db, "participants", userVote) : null;

      try {
        await runTransaction(db, async (transaction) => {
          const newDoc = await transaction.get(newRef);
          if (!newDoc.exists()) throw "Participant does not exist";

          // Increment new
          const newVotes = (newDoc.data().votes || 0) + 1;
          transaction.update(newRef, { votes: newVotes });

          // Decrement old if exists
          if (oldRef) {
             const oldDoc = await transaction.get(oldRef);
             if (oldDoc.exists()) {
                const oldVotes = Math.max(0, (oldDoc.data().votes || 0) - 1);
                transaction.update(oldRef, { votes: oldVotes });
             }
          }
        });
        setUserVote(id);
      } catch (e) {
        console.error("Vote failed: ", e);
      }

    } else {
      // Offline Logic
      setParticipants(prev => {
        const newParticipants = [...prev];
        // Decrement old
        if (userVote) {
          const oldIndex = newParticipants.findIndex(p => p.id === userVote);
          if (oldIndex !== -1) {
            newParticipants[oldIndex] = {
              ...newParticipants[oldIndex],
              votes: Math.max(0, newParticipants[oldIndex].votes - 1)
            };
          }
        }
        // Increment new
        const newIndex = newParticipants.findIndex(p => p.id === id);
        if (newIndex !== -1) {
          newParticipants[newIndex] = {
            ...newParticipants[newIndex],
            votes: newParticipants[newIndex].votes + 1
          };
        }
        return newParticipants;
      });
      setUserVote(id);
    }
  };

  const toggleVotingStatus = async () => {
    const newState = !isVotingActive;
    if (isOnline && db) {
      const ref = doc(db, "config", "votingState");
      await setDoc(ref, { isActive: newState }); // Using setDoc to create if doesn't exist
    } else {
      setIsVotingActive(newState);
    }
  };

  const resetVotes = async () => {
    if (isOnline && db) {
      // We can't batch update unlimited docs, but for this scale it's fine.
      // Fetch all participants first
      // Note: In production you'd use a cloud function for this, but client-side is okay for demo.
      const snapshot = await collection(db, "participants"); 
      // Need to re-fetch query snapshot in transaction or loop updates.
      // Simple loop update for demo:
      participants.forEach(p => {
        updateDoc(doc(db, "participants", p.id), { votes: 0 });
      });
    } else {
      setParticipants(prev => prev.map(p => ({ ...p, votes: 0 })));
    }
    setUserVote(null);
  };

  return (
    <VoteContext.Provider value={{ 
      participants, 
      isVotingActive, 
      userVote,
      addParticipant, 
      removeParticipant, 
      voteForParticipant, 
      toggleVotingStatus,
      resetVotes,
      isOnline
    }}>
      {children}
    </VoteContext.Provider>
  );
};

export const useVote = () => {
  const context = useContext(VoteContext);
  if (!context) throw new Error('useVote must be used within a VoteProvider');
  return context;
};
