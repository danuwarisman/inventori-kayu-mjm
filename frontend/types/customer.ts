export interface CustomerItem {
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