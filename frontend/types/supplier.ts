export interface SupplierItem {
  id_supplier: string;
  nama_supplier: string; // Company Name
  kontak_person: string; // Contact Person
  no_hp: string;         // Phone Number
  harga: number;         // IDR Price
  kota: string;
  status: 'Active' | 'Inactive';
}

export interface SupplierFormData {
  id_supplier: string;
  nama_supplier: string;
  kontak_person: string;
  no_hp: string;
  harga: number | '';
  kota: string;
  status: 'Active' | 'Inactive';
}