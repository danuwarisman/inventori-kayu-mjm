# Sistem Informasi Pendataan Kayu - PT. Margi Jati Makmur

Repository ini berisi *source code* untuk aplikasi web inventori kayu PT. Margi Jati Makmur, mencakup manajemen bahan baku (*log*), proses *sawmill*, *pra dry-kiln*, *dry kiln*, pengelolaan *supplier* & *customer*, transaksi pembelian (*Purchase Order*), hingga transaksi penjualan (*Sales*) dan laporan stok.

## Kelompok Kaciw (Proyek Tingkat II)
Proyek ini dikembangkan oleh:
* **Haryanto Wifakul Azmi** (103122400037) - UI/UX Designer & System Analyst
* **Riyan Hidayat Taufik** (103122400050) - Dokumentasi & System Analyst
* **Cikal Chrestella Cora** (103122400051) - Backend Developer
* **Danu Warisman** (103122400041) - Frontend Developer
* **Jovanov Alvin Bertram** (103122400045) - UI/UX Designer

## Tech Stack
* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, Lucide React
* **Backend:** NestJS, Prisma ORM, TypeScript, JWT Auth
* **Database:** PostgreSQL

## Struktur Direktori
* [`/frontend`](./frontend) - Berisi *source code* antarmuka pengguna (Next.js). Dokumentasi teknis lengkap tersedia di [`frontend/README.md`](./frontend/README.md).
* [`/backend`](./backend) - Berisi *source code* logika server, REST API, dan skema database Prisma (NestJS).
* [`CHANGELOG.md`](./CHANGELOG.md) - Catatan riwayat perubahan dan fitur terbaru aplikasi.

## Sistem Peran Pengguna (Role-Based Access Control)
Aplikasi menggunakan **2 peran (role) resmi** yang terintegrasi antara *frontend* dan *backend*:
1. **Admin (`admin`)** — Mengelola operasional harian pabrik & pengadaan:
   * Pencatatan & pengelolaan **Master Data Log**, proses **Sawmill**, **Pra Dry-Kiln**, dan **Dry-Kiln**.
   * Pengelolaan data **Supplier**, **Customer**, pembuatan **Purchase Order (`/pembelian`)**, **Sales Order (`/sales`)**, serta **Stock Reports**.
2. **Manager (`manager`)** — Mengawasi performa bisnis & otorisasi transaksi:
   * Akses eksklusif ke **Executive Manager Dashboard (`/manager-dashboard`)** (metrik finansial, grafik pendapatan vs pengeluaran, piutang, dan peringatan stok).
   * Persetujuan (*Approve* / *Reject*) atas **Purchase Order** dan **Sales Order**.
   * Pengelolaan akun pengguna di **Account Management (`/accounts`)** serta fitur **Backup/Export Database**.

## Fitur & Otomatisasi Alur Produksi
* **Dashboard Operasional Live (`/dashboard`):** Menampilkan ringkasan metrik *Total Wood Logs*, *Processed Planks*, *Active Kilns*, dan *Total Customers* secara *real-time* dari database PostgreSQL beserta fitur *Quick Log Entry*.
* **Otomatisasi Log $\rightarrow$ Sawmill (`/master-data` $\rightarrow$ `/sawmill`):** Tombol aksi cepat **"Ke Sawmill"** pada Master Data Log otomatis memindahkan status log ke `in-sawmill` dan membuka modal produksi Sawmill dengan data dimensi & harga log yang sudah terisi otomatis (*auto-fill*).
* **Otomatisasi Palet Pra-Dry-Kiln $\rightarrow$ Oven (`/pra-dry-kiln` $\rightarrow$ `/dry-kiln`):** Tombol aksi cepat **"Ke Oven"** pada tabel Pra-Dry-Kiln langsung mengirim papan/palet ke antrean proses pengeringan oven (`dryKilnApi.create` dengan stage `in-drykiln`).
* **Manajemen Purchase Order (`/pembelian`):** Mendukung pembuatan PO multi-item, kalkulasi nilai pesanan otomatis, serta alur **Verifikasi**, **Approve**, **Reject**, dan **Terima Barang** dengan *graceful fallback*.
* **Export Laporan (PDF / CSV / Excel):** Tersedia di seluruh modul produksi dan laporan stok.

## Cara Menjalankan Proyek

### 1. Persiapan Frontend
```bash
cd frontend
npm install
npm install lucide-react
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:3000`.

### 2. Persiapan Backend
```bash
cd backend
npm install
npm run start:dev
```
Server API backend akan berjalan di `http://localhost:3001` *(Untuk konfigurasi database `.env` dan migrasi Prisma, koordinasi dengan Cikal)*.
