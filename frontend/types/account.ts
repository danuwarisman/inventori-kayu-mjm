export type AccountDivision = 'Admin' | 'Manager' | 'Admin Lapangan' | 'Admin Kantor';

export interface AccountItem {
  idUser?: number;
  id_account: string;
  name_account: string; // Username login
  nama_user: string;    // Nama lengkap pengguna
  password: string;
  email: string;
  alamat: string;
  divisi: AccountDivision;
  isActive?: boolean;
}

export interface AccountFormData {
  idUser?: number;
  id_account: string;
  name_account: string;
  nama_user: string;
  password: string;
  email: string;
  alamat: string;
  divisi: AccountDivision;
  isActive?: boolean;
}

/* ------------------------------------------------------------------ */
/* Kontrak backend (model `User` + `Role`, camelCase)                  */
/* ------------------------------------------------------------------ */

/** Role aplikasi dalam bentuk kode frontend. */
export type AccountRole = 'admin' | 'manager';

/** Respons GET /users atau GET /accounts: user beserta relasi role. */
export interface AccountUser {
  id?: number;
  idUser?: number;
  username: string;
  nama: string;
  email?: string | null;
  alamat?: string | null;
  role?:
    | string
    | {
        id: number;
        nama: string;
      };
  roleId?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Body CreateAccountDto (`POST /users`). */
export interface AccountCreatePayload {
  username: string;
  password: string;
  nama: string;
  role?: string;
  roleId?: number;
  email?: string;
  alamat?: string;
}

/** Body UpdateAccountDto (`PATCH /users/:id`); semua field opsional. */
export interface AccountUpdatePayload {
  username?: string;
  password?: string;
  nama?: string;
  role?: string;
  roleId?: number;
  email?: string;
  alamat?: string;
  isActive?: boolean;
}