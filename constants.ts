
import { Listing, Testimonial, Category } from './types';

export const POPULAR_CATEGORIES: Category[] = [
  { id: '1', name: 'Carpet & Upholstery Cleaners', slug: 'carpet-cleaners' },
  { id: '2', name: 'Smoke Machine', slug: 'smoke-machine' },
  { id: '3', name: 'Projector', slug: 'projector' },
  { id: '4', name: 'Power Station', slug: 'power-station' },
  { id: '5', name: 'Party Lights', slug: 'party-lights' },
  { id: '6', name: 'Laptops', slug: 'laptops' },
  { id: '7', name: 'Keyboard', slug: 'keyboard' },
  { id: '8', name: 'Drums', slug: 'drums' },
  { id: '9', name: 'Mobile Phones', slug: 'mobile-phones' },
  { id: '10', name: 'Amplifier', slug: 'amplifier' },
  { id: '11', name: 'Trestle tables', slug: 'trestle-tables' },
  { id: '12', name: 'Electric Bike', slug: 'electric-bike' },
  { id: '13', name: 'Pressure Washer', slug: 'pressure-washer' },
  { id: '14', name: 'Rotary Hammer', slug: 'rotary-hammer' },
  { id: '15', name: 'Cameras', slug: 'cameras' },
  { id: '16', name: 'Drones', slug: 'drones' },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Golden brass trumpet',
    image: 'https://images.unsplash.com/photo-1573871666457-7c7329118cf9?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 400,
    currency: '₹',
    location: 'Mumbai',
    ownerName: 'Sarah',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    isPopular: true,
    category: 'drums' 
  },
  {
    id: '2',
    title: 'Pronstoor teleprompter kit',
    image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 500,
    currency: '₹',
    location: 'Bangalore',
    ownerName: 'Mike',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    category: 'projector'
  },
  {
    id: '3',
    title: 'Affordable white chair cover for hire',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 150,
    currency: '₹',
    location: 'Delhi',
    ownerName: 'Events Co',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    category: 'trestle-tables'
  },
  {
    id: '4',
    title: 'Neewer 12" aluminum teleprompter',
    image: 'https://images.unsplash.com/photo-1486704155675-e4c07f8ad160?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 1500,
    currency: '₹',
    location: 'Pune',
    ownerName: 'John',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    category: 'projector'
  },
  {
    id: '5',
    title: 'Karcher K4 Pressure Washer',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 1200,
    currency: '₹',
    location: 'Bangalore',
    ownerName: 'David',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026011d',
    category: 'pressure-washer',
    isPopular: true
  },
  {
    id: '6',
    title: 'Heavy Duty Rotary Hammer Drill',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 850,
    currency: '₹',
    location: 'Hyderabad',
    ownerName: 'ConstructIt',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026033d',
    category: 'rotary-hammer'
  },
  {
    id: '7',
    title: 'Professional Fog Machine 900W',
    image: 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 2000,
    currency: '₹',
    location: 'Chennai',
    ownerName: 'PartyTime',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026044d',
    category: 'smoke-machine'
  },
  {
    id: '8',
    title: 'Foldable Electric Bike',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 3500,
    currency: '₹',
    location: 'Bangalore',
    ownerName: 'EcoRide',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026055d',
    category: 'electric-bike'
  },
  // NEW ITEMS
  {
    id: '9',
    title: 'Sony A7III Mirrorless Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 4500,
    currency: '₹',
    location: 'Mumbai',
    ownerName: 'CreativeLens',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026099d',
    category: 'cameras',
    isPopular: true
  },
  {
    id: '10',
    title: 'DJI Mavic Air 2 Drone',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 4000,
    currency: '₹',
    location: 'Bangalore',
    ownerName: 'SkyHigh',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026088d',
    category: 'drones'
  },
  {
    id: '11',
    title: 'Rug Doctor Carpet Cleaner',
    image: 'https://images.unsplash.com/photo-1558317374-a3594743e466?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 2200,
    currency: '₹',
    location: 'Delhi',
    ownerName: 'HomeHelpers',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026077d',
    category: 'carpet-cleaners'
  },
  {
    id: '12',
    title: 'Portable Power Station 1000W',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 2800,
    currency: '₹',
    location: 'Kolkata',
    ownerName: 'CampGear',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026066d',
    category: 'power-station'
  },
  {
    id: '13',
    title: 'Disco Party Lights Set',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 1800,
    currency: '₹',
    location: 'Mumbai',
    ownerName: 'DJ Dave',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026012d',
    category: 'party-lights'
  },
  {
    id: '14',
    title: 'MacBook Pro M1 16"',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 5500,
    currency: '₹',
    location: 'Bangalore',
    ownerName: 'TechRentals',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026013d',
    category: 'laptops'
  },
  {
    id: '15',
    title: 'Roland Electronic Drum Kit',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb4747?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 4000,
    currency: '₹',
    location: 'Hyderabad',
    ownerName: 'MusicBox',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026014d',
    category: 'drums'
  },
  {
    id: '16',
    title: 'Marshall Guitar Amplifier',
    image: 'https://images.unsplash.com/photo-1550985543-f47f38aee6c7?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 2500,
    currency: '₹',
    location: 'Pune',
    ownerName: 'RockOn',
    ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026015d',
    category: 'amplifier'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    text: 'Really great hire, would definitely use again!',
    author: 'Louis M',
    rentedItem: 'Sony FX6 Cine Camera',
    timeAgo: '9 minutes ago',
    rating: 5
  },
  {
    id: '2',
    text: 'Great flash & great communication. Thank you!',
    author: 'Alicia A',
    rentedItem: 'GODOX TT600 Flash Speedlight',
    timeAgo: 'an hour ago',
    rating: 5
  },
  {
    id: '3',
    text: 'Excellent kit and service.',
    author: 'Daniel B',
    rentedItem: 'Sony a7iii',
    timeAgo: '2 hours ago',
    rating: 5
  }
];
