/**
 * Bentuk data supplier yang dipakai UI.
 *
 * Sesuai model `Supplier` di backend:
 * - idSupplier   -> id_backend (angka, untuk update/delete)
 * - namaSupplier -> nama_supplier
 * - alamatSupplier -> alamat_supplier
 * - kontakSupplier -> kontak_supplier
 *
 * `id_supplier` hanya kode tampilan turunan dari id_backend (SUP-001).
 */
export interface SupplierItem {
  /** ID numerik dari backend (Supplier.idSupplier). */
  id_backend: number;
  /** Kode tampilan, mis. "SUP-001". */
  id_supplier: string;
  nama_supplier: string;
  alamat_supplier: string;
  kontak_supplier: string;
}

/**
 * Data yang dikirim ke backend saat create/update.
 * Backend hanya menerima ketiga field ini (CreateSupplierDto/UpdateSupplierDto).
 */
export interface SupplierFormData {
  nama_supplier: string;
  alamat_supplier: string;
  kontak_supplier: string;
}
