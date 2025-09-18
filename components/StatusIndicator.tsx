import React from 'react';

interface StatusIndicatorProps {
  isOnline: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline }) => {
  if (isOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-base font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800" title="Conectado a internet">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span>En línea</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-base font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700" title="No hay conexión a internet">
        <span className="relative flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-400 dark:bg-zinc-500"></span>
        </span>
        <span>Fuera de línea</span>
      </div>
    );
  }
};

export default StatusIndicator;