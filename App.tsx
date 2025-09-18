import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import DataForm from './components/DataForm';
import DataList from './components/DataList';
import StatusIndicator from './components/StatusIndicator';
import UserManual from './components/UserManual';
import Toast from './components/Toast';
import PermissionsModal from './components/PermissionsModal';
import { db } from './services/localDb';
import type { Record } from './types';
import { DownloadIcon, SunIcon, MoonIcon, MenuIcon, XIcon, PhoneIcon, LocationMarkerIcon, BookOpenIcon, ArrowUpTrayIcon, EnvelopeIcon, BeakerIcon, LightBulbIcon, UsersIcon } from './components/icons/Icons';

type ActiveView = 'formulario' | 'manual' | 'acerca';

// Hook para gestionar el modo oscuro
const useDarkMode = (): [string, () => void] => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      return storedTheme || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
};

const DarkModeToggle: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-verde-institucional focus:ring-amarillo-mineral"
    aria-label="Toggle dark mode"
  >
    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
  </button>
);

interface HeaderProps {
    isOnline: boolean;
    theme: string;
    toggleTheme: () => void;
    activeView: ActiveView;
    setActiveView: (view: ActiveView) => void;
}

const Header: React.FC<HeaderProps> = ({ isOnline, theme, toggleTheme, activeView, setActiveView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [
        { name: 'Formulario', id: 'formulario' as ActiveView },
        { name: 'Manual de uso', id: 'manual' as ActiveView },
        { name: '¿Para qué sirve?', id: 'acerca' as ActiveView },
    ];

    const handleNavClick = (view: ActiveView) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <header className="sticky top-0 z-30 bg-verde-institucional shadow-lg">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <button onClick={() => handleNavClick('formulario')} className="flex items-center text-xl font-bold text-white">
                           <img src="https://www.sgc.gov.co/static/media/logoWhite.dacc0ba6b2cd29a071d738e6fbaa4a62.svg" alt="Logo del Servicio Geológico Colombiano" className="h-12" />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center">
                        <nav className="flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <button key={link.name} onClick={() => handleNavClick(link.id)} className={`px-3 py-2 rounded-md text-lg font-medium text-white transition-colors ${activeView === link.id ? 'bg-black/20' : 'hover:bg-black/10'}`}>
                                    {link.name}
                                </button>
                            ))}
                        </nav>
                        <div className="flex items-center gap-3 ml-6 pl-6 border-l border-white/30">
                             <StatusIndicator isOnline={isOnline} />
                             <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
                        </div>
                    </div>
                    <div className="md:hidden flex items-center gap-3">
                        <StatusIndicator isOnline={isOnline} />
                        <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-black/10 focus:outline-none">
                            <span className="sr-only">Abrir menú principal</span>
                            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-verde-institucional/95 backdrop-blur-sm z-40">
                    <div className="flex justify-end p-4">
                         <button onClick={() => setIsOpen(false)} className="p-2 rounded-md text-white hover:bg-black/20 focus:outline-none">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                        {navLinks.map((link) => (
                            <button key={link.name} onClick={() => handleNavClick(link.id)} className="text-white hover:bg-black/20 block w-full text-left px-3 py-3 rounded-md text-3xl font-medium">
                                {link.name}
                            </button>
                        ))}
                    </div>
                     <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-gris-oscuro dark:bg-zinc-950 text-gris-claro">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <h3 className="font-bold text-xl text-white">Servicio Geológico Colombiano</h3>
                    <p className="flex items-start gap-2 text-lg">
                        <LocationMarkerIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                        <span>Diagonal 53 No. 34 - 53, Bogotá D.C., Colombia</span>
                    </p>
                </div>
                 <div className="space-y-2">
                     <h3 className="font-bold text-xl text-white">Contacto</h3>
                    <p className="flex items-center gap-2 text-lg">
                        <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                        <span>(+57) 601 220 0200 ext. 7919</span>
                    </p>
                    <p className="flex items-center gap-2 text-lg">
                        <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                        <span>Línea gratuita: 01 8000 110 842</span>
                    </p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-xl text-white">Escríbenos</h3>
                    <a href="mailto:mfalmanza@sgc.gov.co" className="flex items-center gap-2 hover:text-amarillo-mineral transition-colors text-lg">
                        <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                        <span>mfalmanza@sgc.gov.co</span>
                    </a>
                     <a href="mailto:sctulcan@sgc.gov.co" className="flex items-center gap-2 hover:text-amarillo-mineral transition-colors text-lg">
                        <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                        <span>sctulcan@sgc.gov.co</span>
                    </a>
                     <a href="mailto:lfgomez@sgc.gov.co" className="flex items-center gap-2 hover:text-amarillo-mineral transition-colors text-lg">
                        <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                        <span>lfgomez@sgc.gov.co</span>
                    </a>
                </div>
            </div>
        </div>
        <div className="bg-black/50 text-center py-3 text-base text-gris-claro/80">
            <p>&copy; {new Date().getFullYear()} Servicio Geológico Colombiano. Todos los derechos reservados.</p>
        </div>
    </footer>
);


interface FormularioViewProps {
    onSaveRecord: (record: Omit<Record, 'id' | 'customId'> | Record) => Promise<void>;
    records: Record[] | undefined;
    editingRecord: Record | null;
    onCancelEdit: () => void;
    onEdit: (record: Record) => void;
    onDelete: (id: number | undefined) => Promise<void>;
    onSync: () => void;
    isSyncing: boolean;
    unsyncedCount: number;
    setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const FormularioView: React.FC<FormularioViewProps> = ({ onSaveRecord, records, editingRecord, onCancelEdit, onEdit, onDelete, onSync, isSyncing, unsyncedCount, setToast }) => {
    
    const exportAllDataAsZip = async () => {
        const allRecords = await db.records.toArray();
        if (!allRecords.length) {
            alert("No hay datos para exportar.");
            return;
        }
        
        const zip = new JSZip();

        // 1. Generate JSON and TXT
        const recordsToExportJson = allRecords.map(r => {
            const { image, ...rest } = r;
            const imageName = image ? `${r.customId || `record_${r.id}`}.png` : null;
            return { ...rest, imageName };
        });
        const jsonString = JSON.stringify(recordsToExportJson, null, 2);
        zip.file("monitoreo-cavernas.json", jsonString);
        zip.file("monitoreo-cavernas.txt", jsonString);

        // 2. Generate CSV
        const headers = [
            "id", "customId", "caveName", "personInCharge", "personInChargeOther",
            "diligenciamientoDate", "activeDrip", "dripCount", "testTubeSampleName",
            "watchGlassSampleName", "hasItRained", "watchGlassFallen", "observations",
            "carbonateObserved", "imageName", "synced"
        ];
        const csvRows = [headers.join(',')];
        for (const record of allRecords) {
            const imageName = record.image ? `${record.customId || `record_${record.id}`}.png` : '';
            const recordForCsv = { ...record, imageName };
            const values = headers.map(header => {
                const key = header as keyof typeof recordForCsv;
                let val = recordForCsv[key] === null || recordForCsv[key] === undefined ? '' : String(recordForCsv[key]);
                if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                    val = `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            });
            csvRows.push(values.join(','));
        }
        const csvString = csvRows.join('\n');
        zip.file("monitoreo-cavernas.csv", `\uFEFF${csvString}`);

        // 3. Add images to an 'images' folder
        const imagesFolder = zip.folder("images");
        if (imagesFolder) {
            for (const record of allRecords) {
                if (record.image) {
                    const base64Data = record.image.split(',')[1];
                    if (base64Data) {
                        const imageName = `${record.customId || `record_${record.id}`}.png`;
                        imagesFolder.file(imageName, base64Data, { base64: true });
                    }
                }
            }
        }
        
        // 4. Add QR codes to a 'qrcodes' folder
        const qrCodesFolder = zip.folder("qrcodes");
        if (qrCodesFolder) {
            for (const record of allRecords) {
                // Exclude bulky image data from QR code
                const { image, ...recordDataForQR } = record;
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
                        const qrImageName = `${record.customId || `record_${record.id}`}_QR.png`;
                        qrCodesFolder.file(qrImageName, qrBase64Data, { base64: true });
                    }
                } catch (err) {
                    console.error(`Failed to generate QR code for record ${record.id}:`, err);
                }
            }
        }

        // 5. Generate and download zip
        zip.generateAsync({ type: "blob" })
            .then(function(content) {
                const url = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = `export-monitoreo-cavernas-${new Date().toISOString().slice(0, 10)}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-2xl border border-gris-claro/50 dark:border-zinc-700/50">
                <div className="border-b-2 border-verde-institucional pb-4 mb-6">
                    <h2 className="text-3xl font-bold text-gris-oscuro dark:text-zinc-100">{editingRecord ? 'Editando registro' : 'Nuevo registro de monitoreo'}</h2>
                    <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-1">{editingRecord ? `Modificando los datos del registro #${editingRecord.id}.` : ''}</p>
                </div>
                <DataForm onSaveRecord={onSaveRecord} editingRecord={editingRecord} onCancelEdit={onCancelEdit} />
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-2xl border border-gris-claro/50 dark:border-zinc-700/50">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 border-b pb-2 border-gris-claro dark:border-zinc-600">
                    <h2 className="text-3xl font-semibold text-gris-oscuro dark:text-zinc-100">Datos recolectados</h2>
                    <div className="flex items-center flex-wrap gap-2">
                         <button
                            onClick={onSync}
                            disabled={isSyncing || unsyncedCount === 0}
                            className="flex items-center gap-2 py-1.5 px-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amarillo-mineral hover:bg-[#b88e33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                            title="Sincronizar registros pendientes con la nube"
                        >
                            <ArrowUpTrayIcon className={`w-5 h-5 ${isSyncing ? 'animate-pulse' : ''}`} />
                            {isSyncing ? 'Sincronizando...' : <span>Sincronizar ({unsyncedCount})</span>}
                        </button>
                        <button
                            onClick={exportAllDataAsZip}
                            disabled={!records || records.length === 0}
                            className="flex items-center gap-2 py-1.5 px-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-verde-institucional hover:bg-[#004529] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-institucional disabled:bg-zinc-400 dark:disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                            title="Descargar todos los datos (JSON, TXT, CSV, imágenes y QRs) en un archivo .zip"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            <span>Descargar todo</span>
                        </button>
                    </div>
                </div>
                <DataList records={records || []} onEdit={onEdit} onDelete={onDelete} setToast={setToast} />
            </div>
        </div>
    );
}

interface InfoSectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ icon, title, children }) => (
    <div className="flex items-start gap-5 p-4 bg-gris-claro/30 dark:bg-zinc-800/50 rounded-lg">
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-verde-institucional/10 dark:bg-verde-institucional/20 text-verde-institucional dark:text-green-300 mt-1">
          {icon}
        </div>
        <div>
            <h3 className="text-2xl font-semibold text-gris-oscuro dark:text-zinc-100 mb-2">{title}</h3>
            <div className="prose prose-xl dark:prose-invert max-w-none text-gris-oscuro/90 dark:text-zinc-300 space-y-4">
                {children}
            </div>
        </div>
    </div>
);

const AcercaDeView: React.FC = () => (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-2xl border border-gris-claro/50 dark:border-zinc-700/50">
            <div className="border-b-2 border-verde-institucional pb-4 mb-6 text-center">
                <h2 className="text-4xl font-bold text-gris-oscuro dark:text-zinc-100">Un Instrumento para la Ciencia y la Vida</h2>
                <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-1">
                    Conectando el trabajo de campo con la investigación climática global.
                </p>
            </div>
            <div className="space-y-8">
                
                <InfoSection icon={<BookOpenIcon className="w-8 h-8"/>} title="¿Por qué monitorear cavernas?">
                    <p>Las cavernas son verdaderas <strong>bibliotecas del clima</strong>. En su interior, las estalactitas y estalagmitas (espeleotemas) han registrado, durante miles de años, información vital sobre las variaciones de lluvia y temperatura. Son un archivo natural invaluable para entender el pasado de nuestro planeta.</p>
                </InfoSection>

                <InfoSection icon={<BeakerIcon className="w-8 h-8"/>} title="La Misión Científica del SGC">
                    <p>El <strong>Servicio Geológico Colombiano (SGC)</strong>, a través de su Grupo de Investigación en Paleoclima, lidera expediciones a lugares clave como el Parque Nacional Natural Cueva de los Guácharos. El objetivo es "leer" estos archivos de roca para reconstruir el clima del pasado y comprender sus patrones naturales.</p>
                     <blockquote className="border-l-4 border-amarillo-mineral pl-4 italic text-xl mt-4">
                        "Cuando analizamos los espeleotemas, es como si estuviéramos viendo una foto de cómo era el sistema de vientos y de lluvias hace miles de años."
                    </blockquote>
                    <p className="mt-4">Entender estas variaciones nos da herramientas cruciales para enfrentar la crisis climática actual, robusteciendo las estrategias de adaptación de Colombia ante eventos extremos como sequías e inundaciones.</p>
                </InfoSection>

                <InfoSection icon={<LightBulbIcon className="w-8 h-8"/>} title="El Papel de esta Aplicación">
                    <p>Esta aplicación es una herramienta de campo diseñada para potenciar esa investigación. Su propósito es facilitar la recolección de datos de manera <strong>eficiente, estandarizada y segura</strong>, incluso en las condiciones más remotas y sin conexión a internet. Garantiza que la información crítica no se pierda y llegue intacta a los laboratorios.</p>
                </InfoSection>
                
                <InfoSection icon={<UsersIcon className="w-8 h-8"/>} title="Tu Contribución es Fundamental">
                     <p>Al usar esta app, cada investigador/a se convierte en una pieza clave del rompecabezas climático. Cada dato recolectado contribuye directamente a construir un panorama más claro del pasado y futuro de nuestro planeta. Es un paso fundamental en la misión de construir un <strong>"SGC para la vida"</strong>, utilizando las geociencias para buscar soluciones y asegurar un futuro más resiliente para todos.</p>
                </InfoSection>

            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [theme, toggleTheme] = useDarkMode();
  const [activeView, setActiveView] = useState<ActiveView>('formulario');
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const records = useLiveQuery(() => db.records.orderBy('id').reverse().toArray(), []);
  const unsyncedCount = records?.filter(r => !r.synced).length || 0;


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline',handleOffline);
    };
  }, []);

  useEffect(() => {
    const permissionsModalSeen = window.localStorage.getItem('permissionsModalSeen');
    if (!permissionsModalSeen) {
        const timer = setTimeout(() => setShowPermissionsModal(true), 500);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleGrantPermissions = async () => {
    window.localStorage.setItem('permissionsModalSeen', 'true');
    setShowPermissionsModal(false);
    try {
      // Request camera permission which will trigger the native browser prompt.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // We don't need to use the stream, so we stop it immediately to turn off the camera light.
      stream.getTracks().forEach(track => track.stop());
      setToast({ message: '¡Gracias! Permiso de cámara aceptado.', type: 'success' });
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      // The DataForm component will show a specific modal if the permission is permanently blocked.
      setToast({ message: 'Permiso de cámara denegado.', type: 'error' });
    }
  };

  const handleClosePermissionsModal = () => {
    window.localStorage.setItem('permissionsModalSeen', 'true');
    setShowPermissionsModal(false);
  };

 const saveRecord = async (recordData: Omit<Record, 'id' | 'customId'> | Record) => {
    try {
        if ('id' in recordData && recordData.id) {
            // Es una actualización
            const recordWithSyncStatus = { ...recordData, synced: false };
            await db.records.put(recordWithSyncStatus, recordData.id);
            setToast({ message: '¡Gracias! Registro actualizado con éxito.', type: 'success' });
        } else {
            // Es un nuevo registro
            const person = recordData.personInCharge === 'Otro'
                ? recordData.personInChargeOther
                : recordData.personInCharge;

            const customId = `${recordData.caveName.trim().replace(/\s+/g, '_')}-${recordData.diligenciamientoDate}-${person?.trim().replace(/\s+/g, '_')}-${Date.now()}`;

            const newRecord: Omit<Record, 'id'> = {
                ...recordData,
                customId: customId,
                synced: false,
            };
            await db.records.add(newRecord);
            setToast({ message: '¡Gracias! Tu registro ha sido guardado.', type: 'success' });
        }
        setEditingRecord(null); // Limpia el estado de edición si se estaba editando
    } catch (error) {
        console.error('Failed to save record:', error);
        setToast({ message: 'Hubo un error al guardar el registro.', type: 'error' });
        throw error; // Re-lanza el error para que el formulario sepa que no debe limpiarse
    }
  };


  const handleEdit = (record: Record) => {
      setEditingRecord(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number | undefined) => {
      if (id === undefined) {
          console.error("Delete failed: record ID is undefined.");
          setToast({ message: "No se pudo eliminar: ID inválido.", type: 'error' });
          return;
      }
      
      try {
          await db.records.delete(id);
          setToast({ message: 'Registro eliminado con éxito.', type: 'success' });
          if (editingRecord && editingRecord.id === id) {
            setEditingRecord(null);
          }
      } catch (error) {
          console.error('Failed to delete record:', error);
          setToast({ message: 'Hubo un error al eliminar el registro.', type: 'error' });
      }
  };

  const handleCancelEdit = () => {
      setEditingRecord(null);
  };
  
  const handleSync = async () => {
    if (!isOnline) {
      setToast({ message: "Sin conexión. No se puede sincronizar.", type: 'error' });
      return;
    }
    if (unsyncedCount === 0) {
      setToast({ message: "Todos los registros ya están sincronizados.", type: 'success' });
      return;
    }

    setIsSyncing(true);
    setToast({ message: `Sincronizando ${unsyncedCount} registros...`, type: 'success' });
    try {
      const unsyncedRecords = records?.filter(r => !r.synced) || [];
      
      for (const record of unsyncedRecords) {
        // Simula una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 250));
        // Si la llamada es exitosa, actualiza el registro local
        if (record.id) {
          await db.records.update(record.id, { synced: true });
        }
      }
      setToast({ message: "¡Sincronización completada!", type: 'success' });
    } catch (error) {
      console.error("Error durante la sincronización:", error);
      setToast({ message: "Ocurrió un error durante la sincronización.", type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };


  const renderContent = () => {
    switch (activeView) {
        case 'manual':
            return <UserManual />;
        case 'acerca':
            return <AcercaDeView />;
        case 'formulario':
        default:
            return <FormularioView 
                        onSaveRecord={saveRecord} 
                        records={records} 
                        editingRecord={editingRecord}
                        onCancelEdit={handleCancelEdit}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSync={handleSync}
                        isSyncing={isSyncing}
                        unsyncedCount={unsyncedCount}
                        setToast={setToast}
                    />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gris-claro dark:bg-zinc-900 text-gris-oscuro dark:text-zinc-300">
      <Header isOnline={isOnline} theme={theme} toggleTheme={toggleTheme} activeView={activeView} setActiveView={setActiveView} />
      
      <div className="relative h-48 sm:h-56 w-full text-white shadow-lg">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Carlsbad_Interior_Formations.jpg" alt="Formaciones de cavernas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      </div>

      <main className="container mx-auto p-4 md:p-6 -mt-10 sm:-mt-12 relative z-20 flex-grow">
        {renderContent()}
      </main>

       <Footer />
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
       {showPermissionsModal && (
        <PermissionsModal 
            onGrant={handleGrantPermissions}
            onClose={handleClosePermissionsModal}
        />
       )}
    </div>
  );
};

export default App;