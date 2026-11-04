export type SalesStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SalesItem {
  id_transaksi: string;
  tanggal: string;
  nama_customer: string;
  kuantitas: number;      // pcs
  harga_satuan: number;   // IDR
  total_harga: number;    // IDR
  status: SalesStatus;
  catatan_approval?: string;
}

export interface SalesFormData {
  id_transaksi: string;
  nama_customer: string;
  kuantitas: number | '';
  harga_satuan: number | '';
  tanggal: string;
  status: SalesStatus;
}

/* ------------------------------------------------------------------ */
/* Kontrak backend (model `TransaksiPenjualan`, camelCase)             */
/* ------------------------------------------------------------------ */

/** Enum `StatusVerifikasi` di schema.prisma. */
export type BackendStatusVerifikasi =
  | 'PENDING'
  | 'DISETUJUI'
  | 'DITOLAK'
  | 'DIBATALKAN';

/** Enum `StatusPenjualan` di schema.prisma. */
export type BackendStatusPenjualan =
  | 'MENUNGGU'
  | 'DISETUJUI'
  | 'DITOLAK'
  | 'DIBATALKAN';

/** Satu baris detail penjualan (model `DetailPenjualan`). */
export interface SalesDetail {
  idDetail: number;
  idPenjualan: number;
  referensiBarang: string;
  idLog?: number | null;
  idPlank?: number | null;
  kuantitasTerjual: number;
  hargaSatuan: number;
}

/** Body detail pada CreateSalesDto. */
export interface SalesDetailPayload {
  referensiBarang: string;
  idLog?: number;
  idPlank?: number;
  kuantitasTerjual: number;
  hargaSatuan: number;
}

/** Body CreateSalesDto. */
export interface SalesCreatePayload {
  idCustomer: number;
  tanggalJual: string;
  detailPenjualan: SalesDetailPayload[];
}

/** Riwayat approval/verifikasi penjualan (model `ApprovalPenjualan`). */
export interface SalesApproval {
  idApprovalPenjualan: number;
  idUserManager: number;
  idPenjualan: number;
  status: BackendStatusVerifikasi;
  keteranganCatatan?: string | null;
  tanggalApprove: string;
}

/** Respons GET /sales (TransaksiPenjualan + relasi). */
export interface SalesOrder {
  idPenjualan: number;
  idCustomer: number;
  idUserInput: number;
  tanggalJual: string;
  statusVerifikasi: BackendStatusVerifikasi;
  statusPenjualan: BackendStatusPenjualan;
  customer?: {
    idCustomer: number;
    namaCustomer: string;
  };
  user?: {
    id: number;
    nama: string;
  };
  detailPenjualan?: SalesDetail[];
  approvals?: SalesApproval[];
  /** Dihitung di client dari detail bila backend tidak mengirimkannya. */
  totalHarga?: number;
}

/** Body aksi verifikasi/approval. */
export interface SalesDecisionPayload {
  catatan?: string;
}

/** Body aksi penolakan; alasan wajib diisi. */
export interface SalesRejectPayload {
  catatan: string;
}