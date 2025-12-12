
import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load from local mock database
    const saved = localStorage.getItem('rentloo_orders');
    if (saved) {
      setOrders(JSON.parse(saved).reverse()); // Newest first
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500">When you rent items, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-32 max-w-4xl min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-slide-up">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div 
            key={order.id} 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
               <div className="flex gap-6 text-sm">
                 <div>
                   <span className="block text-gray-500 text-xs uppercase">Order Placed</span>
                   <span className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</span>
                 </div>
                 <div>
                   <span className="block text-gray-500 text-xs uppercase">Total</span>
                   <span className="font-medium text-gray-900">₹{order.totalAmount}</span>
                 </div>
                 <div>
                   <span className="block text-gray-500 text-xs uppercase">Order #</span>
                   <span className="font-medium text-gray-900">{order.id}</span>
                 </div>
               </div>
               
               <div className="flex items-center gap-2">
                 {order.status === OrderStatus.CONFIRMED ? (
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                     <CheckCircle size={12} /> Confirmed
                   </span>
                 ) : (
                   <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                     <Clock size={12} /> Pending
                   </span>
                 )}
               </div>
             </div>
             
             <div className="p-6">
               <div className="space-y-6">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex gap-4">
                      <img src={item.listing.image} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-900">{item.listing.title}</h4>
                        <p className="text-sm text-gray-500 mb-1">{item.listing.ownerName} • {item.listing.location}</p>
                        <p className="text-sm text-[#805AD5] font-medium">
                           Rental Period: {item.days} Days
                        </p>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersView;
