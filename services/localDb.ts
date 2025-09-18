import Dexie, { type Table } from 'dexie';
import type { Record } from '../types';

type LocalDatabase = Dexie & {
  records: Table<Record>;
};

const db = new Dexie('OfflineDataCollectorDB') as LocalDatabase;

// Se actualiza la versión de la base de datos para reflejar el nuevo esquema con 'synced'.
db.version(4).stores({
  // '++id' lo mantiene como clave primaria autoincremental.
  // Se añade 'synced' como índice para buscar registros no sincronizados.
  records: '++id, customId, caveName, diligenciamientoDate, synced',
});

// Versiones anteriores para migración
db.version(3).stores({
  records: '++id, customId, caveName, diligenciamientoDate',
});

db.version(2).stores({
  records: '++id, caveName, diligenciamientoDate',
});

db.version(1).stores({
  records: '++id, name, email, synced',
});


export { db };