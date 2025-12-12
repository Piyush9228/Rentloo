
export interface Listing {
  id: string;
  title: string;
  image: string; // Main thumbnail/cover image
  images?: string[]; // Array of all images for slideshow
  pricePerDay: number;
  currency: string;
  location: string;
  ownerName: string;
  ownerAvatar: string;
  isPopular?: boolean;
  description?: string;
  category?: string;
  cancellationPolicy?: 'flexible' | 'medium' | 'strict';
  createdAt?: string; // ISO date string for tracking edit expiry
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  rentedItem: string;
  timeAgo: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart line item
  listing: Listing;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  days: number;
  totalPrice: number;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
}

export enum PaymentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string;
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  paymentMethod: PaymentMethod;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Participant {
  id: string;
  name: string;
  description: string;
  avatar: string;
  votes: number;
}
