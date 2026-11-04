/* ------------------------------------------------------------------ */
/* Kontrak backend stok (berbasis `Plank` + `StokLog`, camelCase)      */
/* ------------------------------------------------------------------ */

/** Status ketersediaan stok untuk badge UI. */
export type StockLevelStatus = 'Available' | 'Low Stock' | 'Out of Stock';

/** Satu baris stok siap tampil di UI. */
export interface StockItem {
  idPlank: number;
  kodePlank?: string | null;
  idLogAsal: number;
  kodeLog?: string | null;
  sortimen: string;
  grade: string;
  stage: string;
  panjang: number;
  lebar: number;
  tinggi: number;
  volume: number;
  status: StockLevelStatus;
}

/** Agregasi stok per stage/grade. */
export interface StockGroupSummary {
  key: string;
  label: string;
  totalPlank: number;
  totalVolume: number;
}

/** Respons GET /stock/summary. */
export interface StockSummary {
  totalPlank: number;
  totalVolume: number;
  totalReadyToSale: number;
  totalInDryKiln: number;
  byStage: StockGroupSummary[];
  byGrade: StockGroupSummary[];
}

/** Pergerakan stok (ledger). */
export interface StockMovement {
  id: number;
  idPlank: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  volume: number;
  stage: string;
  note?: string | null;
  createdAt: string;
}

/** Body POST /stock/adjustments. */
export interface StockAdjustmentPayload {
  idPlank: number;
  volume: number;
  catatan?: string;
}
