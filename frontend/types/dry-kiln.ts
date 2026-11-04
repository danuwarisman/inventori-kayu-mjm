export type PlankGrade = 'Grade A' | 'Grade B' | 'Grade C';
export type DryKilnStage = 'in-drykiln' | 'finish drykiln' | 'pra-drykiln';

export interface DryKilnItem {
  idOven?: number;
  id_backend?: number;
  id_log: string;
  id_plank: string;
  sortimen: string;
  panjang: number; // cm
  lebar: number;   // cm
  tinggi: number;  // cm
  volume: number;  // m³
  grade: PlankGrade;
  stage: DryKilnStage;
  date: string;
}

export interface DryKilnFormData {
  id_log: string;
  id_plank: string;
  sortimen: string;
  grade: PlankGrade;
  panjang: number | '';
  lebar: number | '';
  tinggi: number | '';
  stage: DryKilnStage;
}

/* ------------------------------------------------------------------ */
/* Kontrak backend Hasil Dry Kiln (model `HasilDryKiln`, camelCase)    */
/* ------------------------------------------------------------------ */

/** Enum `StatusKelayakanKayu` di schema.prisma. */
export type StatusKelayakanKayu =
  | 'SIAP_JUAL'
  | 'PENGERINGAN_ULANG'
  | 'RUSAK';

/** Respons GET /dry-kiln/:idOven/hasil. */
export interface HasilDryKilnItem {
  idHasilOven: number;
  idOven: number;
  idPlank: number;
  gradeAkhir: string;
  volumeAkhir: number;
  kadarAirAkhir: number;
  statusKelayakan: StatusKelayakanKayu;
  deletedAt?: string | null;
}

/** Body CreateHasilDryKilnDto/UpdateHasilDryKilnDto. */
export interface HasilDryKilnPayload {
  idPlank: number;
  gradeAkhir: string;
  volumeAkhir: number;
  kadarAirAkhir: number;
  statusKelayakan: StatusKelayakanKayu;
}