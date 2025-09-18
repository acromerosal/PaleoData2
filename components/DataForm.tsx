import React, { useState, useEffect, useRef } from 'react';
import type { Record } from '../types';
import { RadioGroupInput, SelectInput, TextInput, TextAreaInput, DateInput } from './FormElements';
import CameraPermissionModal from './CameraPermissionModal';
import { CameraIcon, FolderOpenIcon, XIcon } from './icons/Icons';

interface DataFormProps {
  onSaveRecord: (record: Omit<Record, 'id' | 'customId'> | Record) => Promise<void>;
  editingRecord: Record | null;
  onCancelEdit: () => void;
}

const CAVE_OPTIONS = [
    "La Fábrica", 
    "La Chapa", 
    "El Hoyo", 
    "El Indio", 
    "El Pesebre", 
    "Marlene", 
    "Cabeza de Toro", 
    "Alsacia", 
    "La Vaca",
    "Chivo Barbas de Oro...", 
    "El Santo", 
    "La Perrita", 
    "La Liona"
];
const PERSON_OPTIONS = ["Nicolas Peña", "Delsy Gamboa", "Deiver Amboni", "Miguel Quintero", "Arnulfo Berrio", "Sergio Rueda", "Juan Carlos Jaimes", "Avelino Solano", "Leonardo Forero"];
const DRIP_OPTIONS = ["5 segundos", "10 segundos", "30 segundos", "1 minuto", "2 minutos", "5 minutos", "Otro"];
const RAIN_OPTIONS = ["Mucho", "Más o menos", "Poco", "Muy poco", "Nada"];
const CARBONATE_OPTIONS = ["Mucho", "Más o menos", "Poco", "Muy poco", "Nada"];
const YES_NO_OPTIONS = ["Si", "No"];

const initialState: Omit<Record, 'id'> = {
  customId: '',
  caveName: '',
  personInCharge: '',
  personInChargeOther: '',
  diligenciamientoDate: '',
  activeDrip: '',
  dripCount: '',
  testTubeSampleName: '',
  watchGlassSampleName: '',
  hasItRained: '',
  watchGlassFallen: '',
  observations: '',
  carbonateObserved: '',
  image: '',
};

const DataForm: React.FC<DataFormProps> = ({ onSaveRecord, editingRecord, onCancelEdit }) => {
  const [formData, setFormData] = useState<Omit<Record, 'id'> | Record>(initialState);
  const [error, setError] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (editingRecord) {
      setFormData(editingRecord);
    } else {
      setFormData(initialState);
    }
  }, [editingRecord]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10 MB limit
        setError('El archivo es muy grande. El tamaño máximo es 10 MB.');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        handleChange('image', '');
    }
    e.target.value = '';
  };
  
  const handleCameraClick = async () => {
    setError('');
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("La función de cámara no es compatible con este navegador o la página no es segura (HTTPS). Por favor, intenta elegir una foto de la galería.");
      return;
    }

    try {
      // Solicitar acceso a la cámara. Esto activa el diálogo de permiso nativo del navegador.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Si tenemos permiso, detenemos el stream para apagar la luz de la cámara.
      stream.getTracks().forEach(track => track.stop());
      
      // Activamos el input de archivo oculto que usa la cámara del dispositivo.
      cameraInputRef.current?.click();
    } catch (err) {
      // Si la promesa es rechazada, el acceso fue denegado o hubo otro error.
      if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
        // Este error significa que el usuario ha denegado el permiso, ya sea ahora o antes.
        console.warn('El acceso a la cámara fue denegado por el usuario.');
        setShowPermissionModal(true); // Mostramos el modal con instrucciones.
      } else {
        // Otros errores (cámara no encontrada, en uso, etc.).
        console.error("Error al acceder a la cámara:", err);
        setError("No se pudo acceder a la cámara. Asegúrate de que el dispositivo tenga una, que no esté en uso por otra aplicación y que hayas concedido los permisos necesarios en la configuración del navegador.");
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.caveName || !formData.personInCharge || !formData.diligenciamientoDate) {
      setError('Por favor, completa los campos requeridos: Cueva, Persona Encargada y Fecha.');
      window.scrollTo(0, 0);
      return;
    }
    if (formData.personInCharge === 'Otro' && !formData.personInChargeOther?.trim()) {
        setError('Por favor, especifica el nombre de la persona encargada en el campo "Otro".');
        window.scrollTo(0, 0);
        return;
    }
    setError('');

    try {
      await onSaveRecord(formData);
      if (!editingRecord) {
        setFormData(initialState);
      }
    } catch (error) {
      console.error("Save failed, form not cleared:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/10 p-3 rounded-md text-lg border border-red-300 dark:border-red-500/30">{error}</p>}
        
        <SelectInput label="Cueva" options={CAVE_OPTIONS} selected={formData.caveName} onChange={val => handleChange('caveName', val)} required placeholder="Seleccione una cueva..." />
        <SelectInput label="Persona encargada" options={[...PERSON_OPTIONS, 'Otro']} selected={formData.personInCharge} onChange={val => handleChange('personInCharge', val)} otherValue={formData.personInChargeOther} onOtherChange={val => handleChange('personInChargeOther', val)} required placeholder="Seleccione una persona..." />
        
        <DateInput label="Fecha de diligenciamiento" value={formData.diligenciamientoDate} onChange={val => handleChange('diligenciamientoDate', val)} required />

        <fieldset className="space-y-6 pt-4 border-t border-gris-claro dark:border-zinc-700">
          <legend className="sr-only">Mediciones</legend>
          <SelectInput label="Goteo activo" subLabel="Seleccione opción de tiempo" options={DRIP_OPTIONS} selected={formData.activeDrip} onChange={val => handleChange('activeDrip', val)} />
          <TextInput label="Número de gotas" value={formData.dripCount} onChange={val => handleChange('dripCount', val)} type="number" />
          <TextInput label="Nombre de muestra tubo" prefix="MGA-" value={formData.testTubeSampleName} onChange={val => handleChange('testTubeSampleName', val)} type="number" />
          <TextInput label="Nombre de muestra vidrio reloj" prefix="VR-" value={formData.watchGlassSampleName} onChange={val => handleChange('watchGlassSampleName', val)} type="number" />
        </fieldset>

        <fieldset className="space-y-6 pt-4 border-t border-gris-claro dark:border-zinc-700">
          <legend className="sr-only">Observaciones Climáticas y de Estado</legend>
          <SelectInput label="Desde el último monitoreo, ha llovido..." options={RAIN_OPTIONS} selected={formData.hasItRained} onChange={val => handleChange('hasItRained', val)} />
          <RadioGroupInput label="¿Se ha caído el vidrio reloj?" options={YES_NO_OPTIONS} selected={formData.watchGlassFallen} onChange={val => handleChange('watchGlassFallen', val)} />
          <SelectInput label="¿Observó carbonato en el vidrio reloj?" options={CARBONATE_OPTIONS} selected={formData.carbonateObserved} onChange={val => handleChange('carbonateObserved',val)} />
        </fieldset>
        
        <fieldset className="space-y-6 pt-4 border-t border-gris-claro dark:border-zinc-700">
          <legend className="sr-only">Comentarios Adicionales</legend>
          <TextAreaInput label="Observaciones" value={formData.observations} onChange={val => handleChange('observations', val)} />
          <div>
              <label className="block text-lg font-medium text-gris-oscuro dark:text-zinc-300">Adjuntar imagen (opcional)</label>
              <p className="text-base text-gris-oscuro/80 dark:text-zinc-400 mb-2">Tamaño máximo: 10 MB.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                  <button
                      type="button"
                      onClick={handleCameraClick}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm text-lg font-medium text-gris-oscuro dark:text-zinc-200 bg-white dark:bg-zinc-700 hover:bg-gris-claro/70 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-institucional transition-colors"
                      title="Tomar foto"
                  >
                      <CameraIcon className="w-5 h-5" />
                      <span>Tomar foto</span>
                  </button>
                  <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm text-lg font-medium text-gris-oscuro dark:text-zinc-200 bg-white dark:bg-zinc-700 hover:bg-gris-claro/70 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-institucional transition-colors"
                  >
                      <FolderOpenIcon className="w-5 h-5" />
                      <span>Elegir de galería</span>
                  </button>
              </div>

              <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-hidden="true"
              />
              <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-hidden="true"
              />
              
              {formData.image && (
                  <div className="mt-4 relative">
                      <img src={formData.image} alt="Previsualización" className="rounded-md max-h-64 w-auto border border-gris-claro dark:border-zinc-700" />
                      <button 
                          type="button" 
                          onClick={() => handleChange('image', '')} 
                          className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                          aria-label="Eliminar imagen"
                      >
                          <XIcon className="w-5 h-5" />
                      </button>
                  </div>
              )}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gris-claro dark:border-zinc-700">
          <button type="submit" className="w-full sm:w-auto flex-grow justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-verde-institucional hover:bg-[#004529] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-institucional transition-colors">
            {editingRecord ? 'Actualizar registro' : 'Guardar registro'}
          </button>
          {editingRecord ? (
            <button type="button" onClick={onCancelEdit} className="w-full sm:w-auto justify-center py-3 px-6 border border-amarillo-mineral dark:border-amarillo-mineral/80 rounded-md shadow-sm text-xl font-medium text-amarillo-mineral hover:bg-amarillo-mineral/10 dark:hover:bg-amarillo-mineral/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral transition-colors">
              Cancelar edición
            </button>
          ) : (
            <button type="button" onClick={() => setFormData(initialState)} className="w-full sm:w-auto justify-center py-3 px-6 border border-amarillo-mineral dark:border-amarillo-mineral/80 rounded-md shadow-sm text-xl font-medium text-amarillo-mineral hover:bg-amarillo-mineral/10 dark:hover:bg-amarillo-mineral/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amarillo-mineral transition-colors">
              Borrar formulario
            </button>
          )}
        </div>
      </form>
      <CameraPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />
    </>
  );
};

export default DataForm;