export type PlankGrade = 'Grade A' | 'Grade B' | 'Grade C';
export type DryKilnStage = 'in-drykiln' | 'finish drykiln' | 'pra-drykiln';

export interface DryKilnItem {
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