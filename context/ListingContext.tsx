
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../constants';

interface ListingContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  deleteListing: (id: string) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>(() => {
    // Try to load from local storage to persist user creations, otherwise use mock
    const saved = localStorage.getItem('rentloo_listings');
    return saved ? JSON.parse(saved) : MOCK_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem('rentloo_listings', JSON.stringify(listings));
  }, [listings]);

  const addListing = (listing: Listing) => {
    setListings(prev => [listing, ...prev]);
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <ListingContext.Provider value={{ listings, addListing, deleteListing, updateListing }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context) throw new Error('useListings must be used within a ListingProvider');
  return context;
};
