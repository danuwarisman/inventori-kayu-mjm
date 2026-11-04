/* ------------------------------------------------------------------ */
/* Kontrak backend pembelian (model `TransaksiPembelian`, camelCase)   */
/* ------------------------------------------------------------------ */

/** Enum `StatusVerifikasi` di schema.prisma. */
export type PurchaseVerificationStatus =
  | 'PENDING'
  | 'DISETUJUI'
  | 'DITOLAK'
  | 'DIBATALKAN';

/** Enum `StatusPembelian` di schema.prisma. */
export type PurchaseStatus =
  | 'MENUNGGU'
  | 'DISETUJUI'
  | 'DITOLAK'
  | 'DITERIMA'
  | 'DIBATALKAN';

/** Satu baris detail pembelian (model `DetailPembelian`). */
export interface PurchaseDetail {
  idDetailPembelian: number;
  idPembelian: number;
  asalSortimen: string;
  panjang: number;
  diameter: number;
  dimensiLog: string;
  jumlahDipesan: number;
  hargaPerLog: number;
  createdAt?: string;
}

/** Body detail pada CreatePurchaseDto. */
export interface PurchaseDetailPayload {
  asalSortimen: string;
  panjang: number;
  diameter: number;
  dimensiLog?: string;
  jumlahDipesan: number;
  hargaPerLog: number;
}

/** Body CreatePurchaseDto. */
export interface PurchaseCreatePayload {
  idSupplier: number;
  tanggalBeli: string;
  detailPembelian: PurchaseDetailPayload[];
}

/** Riwayat approval pembelian (model `ApprovalPembelian`). */
export interface PurchaseApproval {
  idApprovalPembelian: number;
  idUserManager: number;
  idPembelian: number;
  idStatusApprove: number;
  keteranganCatatan?: string | null;
  tanggalApprove: string;
}

/** Respons GET /purchase (TransaksiPembelian + relasi). */
export interface PurchaseOrder {
  idPembelian: number;
  idSupplier: number;
  idUser: number;
  tanggalBeli: string;
  statusVerifikasi: PurchaseVerificationStatus;
  statusPembelian: PurchaseStatus;
  supplier?: {
    idSupplier: number;
    namaSupplier: string;
  };
  user?: {
    id: number;
    nama: string;
  };
  detailPembelian?: PurchaseDetail[];
  approvals?: PurchaseApproval[];
  /** Dihitung di client dari detail bila backend tidak mengirimkannya. */
  totalHarga?: number;
}

/** Body aksi verifikasi/approval pembelian. */
export interface PurchaseDecisionPayload {
  catatan?: string;
}

/** Body aksi penolakan pembelian; alasan wajib diisi. */
export interface PurchaseRejectPayload {
  catatan: string;
}

/** Body aksi penerimaan barang (membuat StokLog dari detail). */
export interface PurchaseReceivePayload {
  tanggalTerima?: string;
}
