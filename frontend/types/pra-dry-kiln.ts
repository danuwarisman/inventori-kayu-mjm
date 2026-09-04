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