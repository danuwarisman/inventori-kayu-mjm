export type PlankGrade = 'Grade A' | 'Grade B' | 'Grade C';
export type SawmillStage = 'Sawmill' | 'finish Sawmill';

export interface PlankItem {
  idPlank?: number;
  id_plank: string;
  kodePlank?: string;
  sortimen: string;
  tinggi: number;  // Tebal (cm)
  lebar: number;   // Lebar (cm)
  panjang: number; // Panjang (cm)
  volume: number;  // m3
  grade: PlankGrade;
  stage?: string;
}

export interface SawmillItem {
  idSawmill?: number;
  id_sawmill: string;
  kodeSawmill?: string;
  id_log_asal: string;
  idLog?: number;
  sortimen: string;
  panjang: number;
  diameter: number;
  volume_total: number;
  stage: SawmillStage;
  tanggal: string;
  suplier: string;
  harga?: number;
  planks: PlankItem[];
}
