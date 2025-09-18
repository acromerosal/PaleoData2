import React from 'react';
import { PencilAltIcon, ClipboardListIcon, QrCodeIcon, DownloadIcon, WifiIcon, SunIcon, TrashIcon, ArrowUpTrayIcon, CameraIcon, BookOpenIcon } from './icons/Icons';

interface InstructionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-verde-institucional/10 dark:bg-verde-institucional/20 text-verde-institucional dark:text-green-300">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-semibold text-gris-oscuro dark:text-zinc-100">{title}</h3>
      <div className="prose prose-lg dark:prose-invert text-gris-oscuro/90 dark:text-zinc-300 mt-1 max-w-none">
        {children}
      </div>
    </div>
  </div>
);

const UserManual: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-2xl border border-gris-claro/50 dark:border-zinc-700/50">
        <div className="border-b-2 border-verde-institucional pb-4 mb-6">
          <h2 className="text-4xl font-bold text-gris-oscuro dark:text-zinc-100">Manual de uso de la aplicación</h2>
          <p className="text-lg text-gris-oscuro/80 dark:text-zinc-400 mt-1">
            Una guía completa para entender todas las funcionalidades disponibles.
          </p>
        </div>

        <div className="space-y-8">
          <InstructionCard icon={<PencilAltIcon className="w-6 h-6" />} title="1. Llenar el formulario de monitoreo">
            <p>
              El formulario principal le permite recolectar los datos de monitoreo de manera eficiente.
            </p>
            <ul>
              <li><strong>Campos Requeridos:</strong> Asegúrese de completar los campos marcados con un asterisco (*), como Cueva, Persona Encargada y Fecha, para poder guardar.</li>
              <li><strong>Guardar:</strong> Al presionar "Guardar registro", los datos se almacenan de forma segura en su dispositivo y se marcan como "Pendiente" para ser sincronizados.</li>
              <li><strong>Borrar / Cancelar:</strong> El botón "Borrar formulario" limpia todos los campos. Si está editando un registro, este botón se convierte en "Cancelar edición" para descartar los cambios y volver al estado original.</li>
            </ul>
          </InstructionCard>

          <InstructionCard icon={<ClipboardListIcon className="w-6 h-6" />} title="2. Gestionar los registros guardados">
            <p>
              Debajo del formulario, en la sección "Datos recolectados", encontrará la lista de todos sus registros. Cada uno tiene un conjunto de acciones rápidas:
            </p>
            <ul>
              <li><strong className="flex items-center gap-1.5"><PencilAltIcon className="w-4 h-4" />Editar:</strong> Permite modificar la información de un registro. Al guardar, el registro se marcará nuevamente como "Pendiente".</li>
              <li><strong className="flex items-center gap-1.5"><TrashIcon className="w-4 h-4" />Eliminar:</strong> Borra permanentemente un registro del dispositivo. Esta acción no se puede deshacer.</li>
               <li><strong className="flex items-center gap-1.5"><QrCodeIcon className="w-4 h-4" />Generar QR:</strong> Crea un código QR con la información del registro (excepto la imagen). Puede descargar o compartir este QR.</li>
               <li><strong className="flex items-center gap-1.5"><DownloadIcon className="w-4 h-4" />Descargar (Individual):</strong> Guarda un archivo <code>.zip</code> con los datos de un solo registro en formatos JSON, TXT, CSV, la imagen adjunta (si existe) y su código QR.</li>
            </ul>
          </InstructionCard>

          <InstructionCard icon={<ArrowUpTrayIcon className="w-6 h-6" />} title="3. Sincronizar y exportar datos">
            <p>
              Estas herramientas le permiten respaldar y compartir toda la información recolectada.
            </p>
            <ul>
              <li><strong>Estado del Registro:</strong> Cada registro muestra si está <span className="font-semibold text-green-600 dark:text-green-400">Sincronizado</span> o <span className="font-semibold text-amber-600 dark:text-amber-400">Pendiente</span>.</li>
              <li><strong>Botón de Sincronizar:</strong> Ubicado en la sección "Datos recolectados", este botón le indica cuántos registros están pendientes. Presiónelo cuando tenga conexión a internet para subirlos y asegurar su respaldo.</li>
               <li>
                <strong className="flex items-center gap-1.5"><DownloadIcon className="w-4 h-4" />Descargar todo:</strong> Genera un archivo <code>.zip</code> que contiene una copia completa de <strong>todos</strong> los datos guardados en su dispositivo, incluyendo formatos CSV, JSON, TXT, una carpeta con todas las imágenes y otra con todos los códigos QR.
              </li>
            </ul>
          </InstructionCard>
          
          <InstructionCard icon={<WifiIcon className="w-6 h-6" />} title="4. Funcionalidades clave">
            <p>
              La aplicación está diseñada para ser robusta y fácil de usar en cualquier condición.
            </p>
             <ul>
              <li><strong>Modo offline:</strong> Puede llenar formularios, guardar, editar y eliminar datos sin necesidad de estar conectado. El indicador de estado en la parte superior le muestra si está <span className="font-semibold">"En línea"</span> o <span className="font-semibold">"Fuera de línea"</span>. La sincronización es la única acción que requiere internet.</li>
              <li><strong className="flex items-center gap-1.5"><CameraIcon className="w-4 h-4" />Permisos de cámara:</strong> La aplicación solicita acceso a la cámara para que pueda tomar fotos directamente y adjuntarlas a sus registros. Este permiso es opcional y puede gestionarlo en la configuración de su navegador.</li>
              <li><strong className="flex items-center gap-1.5"><SunIcon className="w-4 h-4" />Tema visual:</strong> Puede cambiar entre el modo claro y el modo oscuro para su comodidad visual usando el ícono del sol o la luna en la esquina superior derecha.</li>
            </ul>
          </InstructionCard>
          
           <InstructionCard icon={<BookOpenIcon className="w-6 h-6" />} title="5. Secciones de la aplicación">
            <p>
              Utilice el menú de navegación superior para moverse entre las diferentes secciones:
            </p>
            <ul>
                <li><strong>Formulario:</strong> La vista principal para la recolección y gestión de datos.</li>
                <li><strong>Manual de uso:</strong> Esta guía que está leyendo actualmente.</li>
                <li><strong>¿Para qué sirve?:</strong> Una sección que explica la importancia del proyecto de monitoreo de cavernas y el propósito de esta aplicación en la investigación del paleoclima.</li>
            </ul>
          </InstructionCard>

        </div>
      </div>
    </div>
  );
};

export default UserManual;