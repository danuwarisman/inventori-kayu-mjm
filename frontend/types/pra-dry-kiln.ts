export type PlankGrade = 'Grade A' | 'Grade B' | 'Grade C';
export type PraDryKilnStage = 'pra-drykiln' | 'finish pra-drykiln';

export interface PraDryKilnItem {
  id_plank: string;
  id_log: string;
  sortimen: string;
  panjang: number; // cm
  lebar: number;   // cm
  tinggi: number;  // cm
  volume: number;  // m³
  grade: PlankGrade;
  stage: PraDryKilnStage;
  date: string;
}

export interface PraDryKilnFormData {
  id_plank: string;
  id_log: string;
  sortimen: string;
  grade: PlankGrade;
  panjang: number | '';
  lebar: number | '';
  tinggi: number | '';
  stage: PraDryKilnStage;
}

/* ------------------------------------------------------------------ */
/* Kontrak backend Pra Dry Kiln (model `Palet` + `DetailPalet`)        */
/* ------------------------------------------------------------------ */

/** Body CreatePraDryKilnDto: buat palet dan lampirkan plank yang sudah ada. */
export interface PraDryKilnCreatePayload {
  tanggalSticking: string;
  statusPalet: string;
  idPlanks: number[];
}

/** Body UpdatePraDryKilnDto. */
export interface PraDryKilnUpdatePayload {
  tanggalSticking?: string;
  statusPalet?: string;
}

/** Plank yang tergabung dalam satu palet. */
export interface PraDryKilnPlank {
  idPlank: number;
  kodePlank?: string | null;
  gradePapan: string;
  volumePlank: number;
  stage?: string | null;
}

/** Respons GET /pra-dry-kiln. */
export interface PraDryKilnBatch {
  idPalet: number;
  tanggalSticking: string;
  statusPalet: string;
  planks: PraDryKilnPlank[];
}