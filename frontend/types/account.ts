export type AccountDivision = 'Admin Lapangan' | 'Admin Kantor' | 'Manager';

export interface AccountItem {
  id_account: string;
  name_account: string; // Username login
  nama_user: string;    // Nama lengkap pengguna
  password: string;
  email: string;
  alamat: string;
  divisi: AccountDivision;
}

export interface AccountFormData {
  id_account: string;
  name_account: string;
  nama_user: string;
  password: string;
  email: string;
  alamat: string;
  divisi: AccountDivision;
}