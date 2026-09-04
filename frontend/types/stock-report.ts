export type StockStatus = 'Available' | 'Low Stock' | 'Out of Stock';

export interface StockReportItem {
  id_log: string;
  sortimen: string;
  grade: string;
  thickness: number; // mm
  width: number;     // mm
  length: number;    // mm
  dimensions: string;
  volume: number;    // m³
  status: StockStatus;
  date: string;
}

export interface StockReportFormData {
  id_log: string;
  sortimen: string;
  grade: string;
  thickness: number | '';
  width: number | '';
  length: number | '';
  status: StockStatus;
}