import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import type { Record } from '../types';
import { DownloadIcon, XIcon, ShareIcon } from './icons/Icons';

interface QrCodeModalProps {
  record: Record;
  onClose: () => void;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ record, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Excluir los datos de la imagen, que son muy pesados, del código QR
    const { image, ...recordData } = record;
    const dataToEncode = JSON.stringify(recordData, null, 2);

    QRCode.toDataURL(dataToEncode, {
        errorCorrectionLevel: 'M',
        margin: 2,
        scale: 6,
        color: {
            dark: "#005833", // Verde institucional
            light: "#FFFFFF"
        }
    })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
  }, [record]);

  // Manejar el cierre del modal con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Manejar el cierre del modal al hacer clic en el fondo
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && event.target === modalRef.current) {
        onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR-Registro-${record.caveName}-${record.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `QR-Registro-${record.caveName}-${record.id}.png`, { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Código QR: ${record.caveName}`,
          text: `QR del registro para la cueva ${record.caveName} del ${new Date(record.diligenciamientoDate).toLocaleDateString('es-CO')}.`,
          files: [file],
        });
      } else {
        alert('La función de compartir no es compatible con este archivo en tu navegador.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // El usuario canceló la acción, no hacer nada.
      } else {
        console.error('Error al compartir el código QR:', error);
        alert('Ocurrió un error al intentar compartir.');
      }
    }
  };

  if (!record) return null;

  return (
    <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
        aria-labelledby="qr-modal-title"
        role="dialog"
        aria-modal="true"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-gris-claro dark:border-zinc-700">
          <h2 id="qr-modal-title" className="text-2xl font-bold text-gris-oscuro dark:text-zinc-100">Código QR del Registro</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gris-oscuro/80 dark:text-zinc-400 hover:bg-gris-claro dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-verde-institucional">
            <XIcon className="w-5 h-5" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        <div className="p-6 text-center">
            {qrCodeUrl ? (
                <img src={qrCodeUrl} alt={`Código QR para ${record.caveName}`} className="mx-auto rounded-lg border-4 border-gris-claro dark:border-zinc-700" />
            ) : (
                <div className="h-64 w-64 bg-gris-claro dark:bg-zinc-700 animate-pulse rounded-lg mx-auto flex items-center justify-center">
                    <p className="text-gris-oscuro dark:text-zinc-400">Generando QR...</p>
                </div>
            )}
             <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-4">
                Este QR contiene los datos del monitoreo en la cueva <span className="font-semibold">{record.caveName}</span> del día <span className="font-semibold">{new Date(record.diligenciamientoDate).toLocaleDateString('es-CO')}.</span>
            </p>
        </div>
        <div className="flex justify-between items-center gap-3 p-4 bg-gris-claro/50 dark:bg-zinc-900/50 border-t border-gris-claro dark:border-zinc-700 rounded-b-xl">
           <button 
                type="button" 
                onClick={onClose} 
                className="justify-center py-2 px-4 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm text-lg font-medium text-gris-oscuro dark:text-zinc-200 hover:bg-gris-claro/80 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral transition-colors"
            >
                Cerrar
            </button>
            <div className="flex items-center gap-3">
              <button
                  onClick={handleDownload}
                  disabled={!qrCodeUrl}
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-verde-institucional hover:bg-[#004529] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-institucional disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
              >
                  <DownloadIcon className="w-5 h-5" />
                  <span>Descargar</span>
              </button>
              {!!navigator.share && (
                <button
                  onClick={handleShare}
                  disabled={!qrCodeUrl}
                  title="Compartir"
                  className="flex items-center justify-center p-3 border border-transparent rounded-md shadow-sm text-white bg-amarillo-mineral hover:bg-[#b88e33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="sr-only">Compartir</span>
                  <ShareIcon className="w-5 h-5" />
                </button>
              )}
            </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QrCodeModal;