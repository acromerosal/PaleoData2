import React, { useEffect, useRef } from 'react';
import { CameraIcon, ShieldCheckIcon } from './icons/Icons';

interface PermissionsModalProps {
  onGrant: () => void;
  onClose: () => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ onGrant, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
        onClose();
    }
  };

  return (
    <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
        aria-labelledby="permissions-modal-title"
        role="dialog"
        aria-modal="true"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="relative p-6">
            <div className="text-center">
                 <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-verde-institucional/10 mb-4">
                    <ShieldCheckIcon className="h-12 w-12 text-verde-institucional" />
                </div>
                <h2 id="permissions-modal-title" className="text-3xl font-bold text-gris-oscuro dark:text-zinc-100">¡Bienvenido/a!</h2>
                <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-2">
                    Para ofrecerte la mejor experiencia, esta aplicación necesita acceso a la cámara.
                </p>
            </div>
            
            <div className="mt-6 space-y-4 text-left">
                <div className="flex items-start gap-4 p-4 bg-gris-claro/30 dark:bg-zinc-900/40 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-verde-institucional/20 text-verde-institucional">
                       <CameraIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gris-oscuro dark:text-zinc-200">Acceso a la Cámara</h3>
                        <p className="text-gris-oscuro/80 dark:text-zinc-400">Te permitirá tomar fotos directamente desde el formulario para adjuntarlas a tus registros de monitoreo.</p>
                    </div>
                </div>
            </div>
            <p className="text-sm text-center text-gris-oscuro/70 dark:text-zinc-500 mt-6">Puedes gestionar este permiso en cualquier momento en la configuración de tu navegador.</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-4 bg-gris-claro/50 dark:bg-zinc-900/50 border-t border-gris-claro dark:border-zinc-700 rounded-b-xl">
           <button 
                type="button" 
                onClick={onClose} 
                className="w-full justify-center py-2.5 px-4 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm text-lg font-medium text-gris-oscuro dark:text-zinc-200 hover:bg-gris-claro/80 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral transition-colors"
            >
                Quizás más tarde
            </button>
            <button
                onClick={onGrant}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-verde-institucional hover:bg-[#004529] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-institucional transition-colors"
            >
                Otorgar Permiso
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

export default PermissionsModal;