import React, { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon, TrashIcon } from './icons/Icons';
import type { Record } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: Record | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, record }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
        onClose();
    }
  };
  
  if (!isOpen || !record) return null;

  return (
    <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
        aria-labelledby="delete-confirm-title"
        role="dialog"
        aria-modal="true"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="relative p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 id="delete-confirm-title" className="text-2xl font-bold text-gris-oscuro dark:text-zinc-100">¿Eliminar Registro?</h2>
            <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-2">
                Estás a punto de eliminar permanentemente el registro de la cueva <span className="font-semibold">{record.caveName}</span> del <span className="font-semibold">{new Date(record.diligenciamientoDate).toLocaleDateString('es-CO')}</span>.
            </p>
             <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-2">
                Esta acción no se puede deshacer.
            </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-4 bg-gris-claro/50 dark:bg-zinc-900/50 border-t border-gris-claro dark:border-zinc-700 rounded-b-xl">
           <button 
                type="button" 
                onClick={onClose} 
                className="w-full justify-center py-2 px-4 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm text-lg font-medium text-gris-oscuro dark:text-zinc-200 hover:bg-gris-claro/80 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral transition-colors"
            >
                Cancelar
            </button>
            <button
                onClick={onConfirm}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
            >
                <TrashIcon className="w-5 h-5" />
                <span>Sí, Eliminar</span>
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DeleteConfirmationModal;