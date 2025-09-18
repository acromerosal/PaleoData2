export interface Record {
  id?: number;
  customId: string;
  caveName: string;
  personInCharge: string;
  personInChargeOther?: string;
  diligenciamientoDate: string;
  activeDrip: string;
  dripCount: string;
  testTubeSampleName: string;
  watchGlassSampleName: string;
  hasItRained: string;
  watchGlassFallen: string;
  observations: string;
  carbonateObserved: string;
  image?: string; // Base64 encoded image
  synced?: boolean; // Nuevo campo para el estado de sincronización
}