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

/* ------------------------------------------------------------------ */
/* Kontrak backend (model `User` + `Role`, camelCase)                  */
/* ------------------------------------------------------------------ */

/** Role aplikasi dalam bentuk kode frontend. */
export type AccountRole = 'manager' | 'admin_kantor' | 'admin_lapangan';

/** Respons GET /accounts: user beserta relasi role. */
export interface AccountUser {
  id: number;
  username: string;
  nama: string;
  roleId: number;
  role?: {
    id: number;
    nama: string;
  };
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Body CreateAccountDto. `roleId` mengacu ke tabel `role`. */
export interface AccountCreatePayload {
  username: string;
  password: string;
  nama: string;
  roleId: number;
}

/** Body UpdateAccountDto; semua field opsional. */
export interface AccountUpdatePayload {
  username?: string;
  password?: string;
  nama?: string;
  roleId?: number;
}