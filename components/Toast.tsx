import React from 'react';
import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-24 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`
            pointer-events-auto flex items-start gap-3 min-w-[300px] p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-full duration-300
            ${toast.type === 'success' ? 'bg-white border-green-200 text-gray-800' : ''}
            ${toast.type === 'error' ? 'bg-white border-red-200 text-gray-800' : ''}
            ${toast.type === 'info' ? 'bg-white border-blue-200 text-gray-800' : ''}
          `}
        >
          <div className="mt-0.5">
            {toast.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
            {toast.type === 'info' && <Info className="text-blue-500" size={20} />}
          </div>
          
          <div className="flex-1">
            <h4 className={`font-semibold text-sm ${
              toast.type === 'success' ? 'text-green-700' : 
              toast.type === 'error' ? 'text-red-700' : 'text-blue-700'
            }`}>
              {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
            </h4>
            <p className="text-sm text-gray-600">{toast.message}</p>
          </div>

          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;