export type PlankGrade = 'Grade A' | 'Grade B' | 'Grade C';
export type PraDryKilnStage = 'pra-drykiln' | 'finish pra-drykiln';

export interface PraDryKilnItem {
  idOven?: number;
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

export interface PraDryKilnBatchFormData {
  id_palet: string;
  ketebalan_min: number | '';
  ketebalan_max: number | '';
  panjang_min: number | '';
  panjang_max: number | '';
  lebar_min: number | '';
  lebar_max: number | '';
  grade: PlankGrade;
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
  panjang?: number | string | null;
  lebar?: number | string | null;
  tinggi?: number | string | null;
  idLog?: number | null;
  kodeLog?: string | null;
  stage?: string | null;
}

/** Respons GET /pra-dry-kiln. */
export interface PraDryKilnBatch {
  idPalet: number;
  tanggalSticking: string;
  statusPalet: string;
  planks: PraDryKilnPlank[];
}