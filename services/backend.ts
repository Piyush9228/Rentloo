import { Order, OrderStatus, PaymentMethod } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const backendService = {
  
  async processPayment(amount: number, method: PaymentMethod, cardDetails?: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    console.log(`Processing payment of ${amount} via ${method}...`);
    await delay(2000); // Fake processing time

    // Simulate random failure for realism (10% chance)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Payment declined by bank. Please try another method.'
      };
    }
  },

  async createOrder(order: Omit<Order, 'id' | 'status' | 'date'>): Promise<Order> {
    await delay(1000);
    
    const newOrder: Order = {
      ...order,
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      status: OrderStatus.CONFIRMED,
      date: new Date().toISOString()
    };

    // "Save" to local storage for persistence across reloads (mock database)
    const existingOrders = JSON.parse(localStorage.getItem('rentloo_orders') || '[]');
    existingOrders.push(newOrder);
    localStorage.setItem('rentloo_orders', JSON.stringify(existingOrders));

    return newOrder;
  }
};