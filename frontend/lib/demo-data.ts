import { CustomerItem } from '@/types/customer';
import { SupplierItem } from '@/types/supplier';
import { LogItem } from '@/types/log';
import { SawmillItem } from '@/types/sawmill';
import { DryKilnItem } from '@/types/dry-kiln';
import { PurchaseOrder } from '@/types/purchase';

export const DEMO_CUSTOMERS: CustomerItem[] = [
  { id_backend: 1, id_customer: 'CUS-001', nama: 'PT Kayu Nusantara', alamat: 'Bandung', no_hp: '081234567890', email: 'procurement@kaynusantara.co.id' },
  { id_backend: 2, id_customer: 'CUS-002', nama: 'CV Jati Sejahtera', alamat: 'Cirebon', no_hp: '082233445566', email: 'admin@jatisejahtera.co.id' },
  { id_backend: 3, id_customer: 'CUS-003', nama: 'Budi Furniture', alamat: 'Tasikmalaya', no_hp: '083344556677', email: 'budi.furniture@example.com' },
];

export const DEMO_SUPPLIERS: SupplierItem[] = [
  { id_backend: 1, id_supplier: 'SUP-001', nama_supplier: 'Perhutani Jawa Barat', alamat_supplier: 'Garut', kontak_supplier: '081111222333' },
  { id_backend: 2, id_supplier: 'SUP-002', nama_supplier: 'CV Kayu Makmur', alamat_supplier: 'Sukabumi', kontak_supplier: '082222333444' },
  { id_backend: 3, id_supplier: 'SUP-003', nama_supplier: 'PT Alam Jati', alamat_supplier: 'Kuningan', kontak_supplier: '083333444555' },
];

export const DEMO_LOGS: LogItem[] = [
  { idLog: 1, id_log: 'L-2026-001', sortimen: 'A4', panjang: 400, diameter: 45, volume: 0.636, stage: 'Log', tanggal_masuk: '2026-11-10', suplier: 'Perhutani Jawa Barat', harga: 1250000 },
  { idLog: 2, id_log: 'L-2026-002', sortimen: 'A3', panjang: 350, diameter: 38, volume: 0.397, stage: 'Sawmill', tanggal_masuk: '2026-11-11', suplier: 'CV Kayu Makmur', harga: 950000 },
  { idLog: 3, id_log: 'L-2026-003', sortimen: 'A4', panjang: 420, diameter: 50, volume: 0.825, stage: 'Log', tanggal_masuk: '2026-11-12', suplier: 'PT Alam Jati', harga: 1500000 },
];

export const DEMO_SAWMILL: SawmillItem[] = [
  { idSawmill: 1, id_sawmill: 'SW-2026-001', id_log_asal: 'L-2026-002', sortimen: 'A3', panjang: 350, diameter: 38, volume_total: 0.397, stage: 'finish Sawmill', tanggal: '2026-11-12', suplier: 'CV Kayu Makmur', harga: 950000, planks: [{ idPlank: 1, id_plank: 'P-2026-001-A1', id_log: 'L-2026-002', sortimen: 'A3', tinggi: 5, lebar: 20, panjang: 250, volume: 0.025, grade: 'Grade A', stage: 'finish Sawmill' }] },
  { idSawmill: 2, id_sawmill: 'SW-2026-002', id_log_asal: 'L-2026-003', sortimen: 'A4', panjang: 420, diameter: 50, volume_total: 0.825, stage: 'Sawmill', tanggal: '2026-11-13', suplier: 'PT Alam Jati', harga: 1500000, planks: [] },
];

export const DEMO_DRY_KILN: DryKilnItem[] = [
  { idOven: 1, id_backend: 1, id_log: 'L-2026-004', id_plank: 'P-2026-004-A1', sortimen: 'A4', panjang: 250, lebar: 20, tinggi: 5, volume: 0.025, grade: 'Grade A', stage: 'in-drykiln', date: '2026-11-16' },
  { idOven: 2, id_backend: 2, id_log: 'L-2026-005', id_plank: 'P-2026-005-B1', sortimen: 'A4', panjang: 300, lebar: 25, tinggi: 5, volume: 0.038, grade: 'Grade A', stage: 'finish drykiln', date: '2026-11-17' },
  { idOven: 3, id_backend: 3, id_log: 'L-2026-006', id_plank: 'P-2026-006-A1', sortimen: 'A3', panjang: 220, lebar: 15, tinggi: 4, volume: 0.013, grade: 'Grade B', stage: 'in-drykiln', date: '2026-11-18' },
];

export const DEMO_PURCHASES: PurchaseOrder[] = [
  { idPembelian: 1, idSupplier: 1, idUser: 1, tanggalBeli: '2026-11-08', statusVerifikasi: 'DISETUJUI', statusPembelian: 'DISETUJUI', supplier: { idSupplier: 1, namaSupplier: 'Perhutani Jawa Barat', alamat: 'Garut', noTelepon: '081111222333' }, user: { id: 1, nama: 'Admin Lapangan' }, detailPembelian: [{ idDetailPembelian: 1, idPembelian: 1, asalSortimen: 'A4', panjang: 400, diameter: 45, dimensiLog: '400 x 45 cm', jumlahDipesan: 10, hargaPerLog: 1250000 }], approvals: [], totalHarga: 12500000 },
  { idPembelian: 2, idSupplier: 2, idUser: 1, tanggalBeli: '2026-11-12', statusVerifikasi: 'PENDING', statusPembelian: 'MENUNGGU', supplier: { idSupplier: 2, namaSupplier: 'CV Kayu Makmur', alamat: 'Sukabumi', noTelepon: '082222333444' }, user: { id: 1, nama: 'Admin Lapangan' }, detailPembelian: [{ idDetailPembelian: 2, idPembelian: 2, asalSortimen: 'A3', panjang: 350, diameter: 38, dimensiLog: '350 x 38 cm', jumlahDipesan: 8, hargaPerLog: 950000 }], approvals: [], totalHarga: 7600000 },
];
