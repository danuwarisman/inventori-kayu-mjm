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