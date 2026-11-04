/* ------------------------------------------------------------------ */
/* Kontrak backend laporan (camelCase)                                 */
/* ------------------------------------------------------------------ */

export type ReportType =
  | 'stock'
  | 'production'
  | 'sales'
  | 'purchase'
  | 'finance';

/** Filter periode yang dikirim sebagai query string. */
export interface ReportPeriod {
  startDate?: string;
  endDate?: string;
}

/** Definisi kolom tabel laporan. */
export interface ReportColumn {
  key: string;
  label: string;
}

/** Nilai sel laporan; angka tetap dikirim sebagai number. */
export type ReportCell = string | number | null;

/** Respons GET /report/:type. */
export interface ReportResponse {
  type: ReportType;
  title: string;
  period: {
    startDate: string | null;
    endDate: string | null;
  };
  columns: ReportColumn[];
  rows: Record<string, ReportCell>[];
  /** Ringkasan opsional, mis. totalVolume/totalRevenue. */
  summary?: Record<string, number>;
}

/** Metadata jenis laporan yang tersedia. */
export interface ReportDefinition {
  type: ReportType;
  title: string;
}
