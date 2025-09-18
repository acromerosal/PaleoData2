import React, { useState } from 'react';
import type { Record } from '../types';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import { QrCodeIcon, PencilAltIcon, TrashIcon, CloudIcon, CloudSlashIcon, DownloadIcon } from './icons/Icons';
import QrCodeModal from './QrCodeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface DataListProps {
  records: Record[];
  onEdit: (record: Record) => void;
  onDelete: (id: number | undefined) => void;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const SyncStatusBadge: React.FC<{ synced: boolean | undefined }> = ({ synced }) => {
    const isSynced = synced === true;
    const statusText = isSynced ? 'Sincronizado' : 'Pendiente';
    const Icon = isSynced ? CloudIcon : CloudSlashIcon;
    const colors = isSynced 
        ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-500/10' 
        : 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/10';

    return (
        <div className={`inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-base font-medium ${colors}`}>
            <Icon className="w-4 h-4" />
            <span>{statusText}</span>
        </div>
    );
};

// Helper function to generate the zip blob for a record
const generateRecordZip = async (record: Record): Promise<{ blob: Blob, filename: string }> => {
    const zip = new JSZip();
    
    const personInChargeSanitized = (record.personInCharge === 'Otro' ? record.personInChargeOther || 'Otro' : record.personInCharge)
        .trim().replace(/\s+/g, '_');
    const caveNameSanitized = record.caveName.trim().replace(/\s+/g, '_');
    const baseFilename = `${caveNameSanitized}-${personInChargeSanitized}-${record.diligenciamientoDate}`;
    const zipFilename = `${baseFilename}.zip`;

    // 1. Prepare data and create JSON/TXT
    const { image, ...recordData } = record;
    const imageName = image ? `${baseFilename}.png` : null;
    const dataToExport = { ...recordData, imageName };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    zip.file(`${baseFilename}.json`, jsonString);
    zip.file(`${baseFilename}.txt`, jsonString);

    // 2. Create CSV
    const headers = Object.keys(dataToExport) as (keyof typeof dataToExport)[];
    const csvHeader = headers.join(',');
    const csvValues = headers.map(header => {
      let val = dataToExport[header];
      let strVal = (val === null || val === undefined) ? '' : String(val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        strVal = `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    });
    const csvString = `${csvHeader}\n${csvValues.join(',')}`;
    zip.file(`${baseFilename}.csv`, `\uFEFF${csvString}`);

    // 3. Add image
    if (image && imageName) {
        const base64Data = image.split(',')[1];
        if (base64Data) {
            zip.file(imageName, base64Data, { base64: true });
        }
    }

    // 4. Generate and add QR code
    const { image: qrImage, ...recordDataForQR } = record;
    const qrDataString = JSON.stringify(recordDataForQR, null, 2);
    try {
        const qrCodeUrl = await QRCode.toDataURL(qrDataString, {
            errorCorrectionLevel: 'M',
            margin: 2,
            scale: 6,
            color: { dark: "#005833", light: "#FFFFFF" }
        });
        const qrBase64Data = qrCodeUrl.split(',')[1];
        if (qrBase64Data) {
            zip.file(`${baseFilename}_QR.png`, qrBase64Data, { base64: true });
        }
    } catch (err) {
        console.error("Failed to generate QR code for zip:", err);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    return { blob, filename: zipFilename };
};

// Helper to download a blob
const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


const DataList: React.FC<DataListProps> = ({ records, onEdit, onDelete, setToast }) => {
  const [qrCodeRecord, setQrCodeRecord] = useState<Record | null>(null);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<Record | null>(null);

  if (!records.length) {
    return <p className="text-center text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-4">No hay datos recolectados aún.</p>;
  }
  
  const handleDownloadRecord = async (record: Record) => {
    setIsProcessing(record.id!);
    try {
        const { blob, filename } = await generateRecordZip(record);
        downloadBlob(blob, filename);
    } catch (error) {
        setToast({ message: 'Error al generar el archivo.', type: 'error' });
        console.error("Failed to generate zip for download:", error);
    } finally {
        setIsProcessing(null);
    }
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
        onDelete(recordToDelete.id);
        setRecordToDelete(null);
    }
  };

  const IconButton: React.FC<{onClick: () => void; title: string; children: React.ReactNode; className?: string; disabled?: boolean}> = ({onClick, title, children, className = '', disabled = false}) => (
     <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-full text-gris-oscuro dark:text-zinc-300 bg-white/50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gris-claro dark:focus:ring-offset-zinc-800 focus:ring-verde-institucional transition-colors disabled:opacity-50 disabled:cursor-wait ${className}`}
        title={title}
    >
        {children}
    </button>
  );

  return (
    <>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto -mr-2 pr-2">
        {records.map((record) => (
          <div key={record.id} className="bg-gris-claro/30 dark:bg-zinc-800/50 p-4 rounded-lg border border-gris-claro dark:border-zinc-700/50 transition-all duration-200 hover:shadow-md hover:bg-white dark:hover:bg-zinc-700/50">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-2xl text-verde-institucional dark:text-green-400 truncate">{record.caveName}</p>
                <p className="text-lg text-gris-oscuro/90 dark:text-zinc-400">{new Date(record.diligenciamientoDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="mt-2 text-lg text-gris-oscuro dark:text-zinc-300">
                  <p><span className="font-semibold">Encargado/a:</span> {record.personInCharge === 'Otro' ? record.personInChargeOther : record.personInCharge}</p>
                  {record.observations && <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-1 italic truncate">"{record.observations}"</p>}
                </div>
              </div>
              <div className="flex items-start gap-1 flex-shrink-0">
                {record.image && <img src={record.image} alt="Muestra" className="w-20 h-20 object-cover rounded-md border-2 border-white dark:border-zinc-600 shadow-sm" />}
                
                <div className="flex flex-col gap-1">
                    <IconButton onClick={() => onEdit(record)} title="Editar registro" className="hover:bg-amarillo-mineral hover:text-white dark:hover:bg-yellow-500" disabled={isProcessing === record.id}>
                        <PencilAltIcon className="w-5 h-5" />
                    </IconButton>
                    <IconButton onClick={() => setQrCodeRecord(record)} title="Generar código QR" className="hover:bg-verde-institucional hover:text-white dark:hover:bg-green-500" disabled={isProcessing === record.id}>
                        <QrCodeIcon className="w-5 h-5" />
                    </IconButton>
                     <IconButton 
                        onClick={() => handleDownloadRecord(record)} 
                        title="Descargar registro (ZIP con JSON, TXT, CSV, imagen y QR)" 
                        className="hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500"
                        disabled={isProcessing === record.id}
                    >
                        <DownloadIcon className={`w-5 h-5 ${isProcessing === record.id ? 'animate-spin' : ''}`} />
                    </IconButton>
                    <IconButton onClick={() => setRecordToDelete(record)} title="Eliminar registro" className="hover:bg-red-600 hover:text-white dark:hover:bg-red-500" disabled={isProcessing === record.id}>
                        <TrashIcon className="w-5 h-5" />
                    </IconButton>
                </div>

              </div>
            </div>
             <div className="mt-3 pt-3 border-t border-gris-claro/80 dark:border-zinc-700/70">
                <SyncStatusBadge synced={record.synced} />
            </div>
          </div>
        ))}
      </div>
      {qrCodeRecord && <QrCodeModal record={qrCodeRecord} onClose={() => setQrCodeRecord(null)} />}
      <DeleteConfirmationModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        record={recordToDelete}
       />
    </>
  );
};

export default DataList;