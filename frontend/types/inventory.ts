// Sesuai Tabel 1 & 2 SDD
export type UserRole = 'admin_lapangan' | 'admin_kantor' | 'manager';

export interface UserAccount {
  id_user: string;
  id_role: UserRole;
  nama_lengkap: string;
  username: string;
  password?: string;
  email?: string;
  alamat?: string;
  divisi?: string;
}

// Sesuai Tabel 3 SDD
export interface Supplier {
  id_supplier: string;
  nama_supplier: string;
  alamat_supplier: string;
  kontak_supplier: string;
}

// Sesuai Tabel 4 SDD
export interface Customer {
  id_customer: string;
  nama_customer: string;
  alamat_customer: string;
  kontak_customer: string;
  email_customer?: string;
}

// Sesuai Tabel 7 SDD
export interface StokLog {
  id_log: string;
  id_pembelian?: string;
  asal_sortimen: string;
  dimensi_log: string; // misal: "Panjang x Diameter"
  volume_log: number;
  status_log: 'Log' | 'Sawmill' | 'Pra-Dry Kiln' | 'Dry Kiln' | 'Siap Jual';
  tanggal_masuk?: string;
  supplier?: string;
  harga?: number;
}

// Sesuai Tabel 10 SDD
export interface Plank {
  id_plank: string;
  id_sawmill?: string;
  id_log_asal: string;
  grade_papan: 'Grade A' | 'Grade B' | 'Grade C';
  dimensi_plank: string; // "T x W x L"
  volume_plank: number;
}

// Sesuai Tabel 16 & 17 SDD
export interface TransaksiPenjualan {
  id_penjualan: string;
  id_customer: string;
  nama_customer?: string;
  id_user_input: string;
  tanggal_jual: string;
  total_harga: number;
  status_verifikasi: 'Pending' | 'Disetujui' | 'Ditolak';
  catatan_approval?: string;
}