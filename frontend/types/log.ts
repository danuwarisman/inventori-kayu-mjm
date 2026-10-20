export type LogStage = 'Log' | 'Sawmill' | 'Pra Dry Kiln' | 'Dry Kiln' | 'Ready To Sale';

export interface LogItem {
  idLog?: number;
  id_log: string;
  kodeLog?: string;
  sortimen: string;
  panjang: number;
  diameter: number;
  volume: number;
  volumeLog?: number;
  stage: LogStage;
  tanggal_masuk: string;
  suplier: string;
  harga?: number;
}
