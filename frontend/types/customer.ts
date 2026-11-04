export interface CustomerItem {
  /** ID numerik backend (Customer.idCustomer), dipakai untuk PATCH/DELETE. */
  id_backend?: number;
  id_customer: string;
  nama: string;
  alamat: string;
  no_hp: string;
  email: string;
}

export interface CustomerFormData {
  id_customer: string;
  nama: string;
  alamat: string;
  no_hp: string;
  email: string;
}

export interface SmartAlertItem {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'neutral' | 'success';
}

/* ------------------------------------------------------------------ */
/* Kontrak backend (model `Customer`, camelCase)                       */
/* ------------------------------------------------------------------ */

/** Respons GET /customer sesuai model `Customer` di schema.prisma. */
export interface BackendCustomer {
  idCustomer: number;
  namaCustomer: string;
  alamatCustomer: string;
  kontakCustomer: string;
  deletedAt?: string | null;
}

/** Body CreateCustomerDto/UpdateCustomerDto. */
export interface CustomerPayload {
  namaCustomer: string;
  alamatCustomer: string;
  kontakCustomer: string;
}