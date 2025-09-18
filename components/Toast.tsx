import React, { useEffect } from 'react';
import { CheckCircleIcon, XIcon, XCircleIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-verde-institucional' : 'bg-red-600';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div 
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center w-full max-w-sm p-4 text-white ${bgColor} rounded-lg shadow-2xl animate-slide-in-up`} 
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-white/20">
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-3 text-lg font-medium">{message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/20 focus:ring-2 focus:ring-white transition-colors" 
        onClick={onClose} 
        aria-label="Cerrar"
      >
        <span className="sr-only">Cerrar</span>
        <XIcon className="w-5 h-5" />
      </button>
      <style>{`
        @keyframes slide-in-up {
          from { 
            opacity: 0; 
            transform: translate(-50%, 20px); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, 0); 
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;