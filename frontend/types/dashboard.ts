/* ------------------------------------------------------------------ */
/* Kontrak backend dashboard (camelCase)                               */
/* ------------------------------------------------------------------ */

/** Ringkasan produksi/inventaris untuk dashboard admin & manager. */
export interface DashboardProductionSummary {
  totalLog: number;
  totalSawmill: number;
  totalPlank: number;
  totalDryKiln: number;
  totalReadyToSale: number;
}

/** Ringkasan keuangan untuk dashboard manager. */
export interface DashboardFinanceSummary {
  totalRevenue: number;
  netProfit: number;
  totalExpenses: number;
  totalTransactions: number;
  pendingInvoices: number;
  accountsReceivable: number;
}

/** Peringatan stok yang ditampilkan di dashboard. */
export interface DashboardStockAlert {
  id: string;
  title: string;
  description: string;
  level: 'info' | 'warning' | 'danger';
}

/** Satu baris aktivitas terbaru. */
export interface DashboardActivity {
  id: string;
  type: 'log' | 'sawmill' | 'dry-kiln' | 'sales' | 'purchase';
  title: string;
  description: string;
  date: string;
}

/** Respons GET /dashboard (disesuaikan dengan role pemanggil). */
export interface DashboardSummary {
  production: DashboardProductionSummary;
  finance: DashboardFinanceSummary;
  activities: DashboardActivity[];
  stockAlerts: DashboardStockAlert[];
  generatedAt: string;
}
