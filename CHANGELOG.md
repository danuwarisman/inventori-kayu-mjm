# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased] - 2026-11-10

### Added
- **Dropdown Supplier dengan Opsi "Others" pada Input Log (`/master-data` & `/dashboard`)**:
  - Mengubah kolom input teks supplier pada modal Input & Edit Log (`/master-data`) serta form Quick Entry Log (`/dashboard`) menjadi pilihan dropdown dinamis yang terhubung ke data supplier backend, lengkap dengan opsi **Others (Lainnya...)** di bagian paling akhir yang memunculkan input teks kustom jika dipilih.

### Changed
- **Stabilitas Sesi & Perpanjangan Expiration (Anti-Ketendang Keluar)**:
  - Memperpanjang masa berlaku token JWT backend (`expiresIn`) dari 8 jam menjadi 7 hari (dapat disesuaikan via `JWT_EXPIRES_IN`).
  - Memperpanjang masa berlaku cookie sesi `mjm_session` dari 8 jam menjadi 7 hari.
  - Memperpanjang batas waktu *inactivity logout* dari 60 menit menjadi 7 hari (`NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS`) agar sesi pengguna tidak terputus saat aplikasi ditinggal sejenak.
  - Menambahkan *auto-recovery* sesi di `AppShell.tsx`: jika cookie sesi terhapus oleh browser tetapi profil pengguna di `localStorage` masih aktif, cookie otomatis dipulihkan tanpa memaksa pengguna keluar ke halaman login.

### Added
- **Panduan Penggunaan Sistem (`GUIDE.md`)**:
  - Menyusun panduan praktis dan simpel di root repositori mengenai hak akses 2 role (*Admin* & *Manager*), alur operasional kayu dari bahan baku hingga penjualan (*Log* $\rightarrow$ *Sawmill* $\rightarrow$ *Pra-Dry-Kiln* $\rightarrow$ *Dry-Kiln* $\rightarrow$ *Sales*), fitur otomatisasi tombol cepat, serta tata cara akses sistem (Lokal, Tailscale, Cloudflare Tunnel).
- **Panduan Pengembang Selanjutnya (*Next Developer Guide*) di `frontend/README.md`**:
  - Memperbarui dokumentasi teknis frontend dengan penjelasan menyeluruh tentang status halaman terkini, arsitektur same-origin `/api-proxy`, kesiapan fungsi API client untuk 4 modul lanjutan (`salesApi`, `stockApi`, `praDryKilnApi`, `accountApi`), serta panduan deployment.

## [0.2.1] - 2026-11-08

### Added
- **Otomatisasi Transfer Palet Pra-Dry-Kiln ke Antrean Oven (`/pra-dry-kiln` $\rightarrow$ `/dry-kiln`)**:
  - Menambahkan tombol aksi cepat **Ke Oven** pada tabel Pra-Dry-Kiln (`frontend/components/pra-dry-kiln/PlankTable.tsx` & `frontend/app/pra-dry-kiln/page.tsx`) yang langsung mengirimkan data papan/palet ke antrean proses pengeringan oven (`dryKilnApi.create` dengan stage `in-drykiln`) disertai pintasan navigasi ke halaman `/dry-kiln`.
- **Graceful Fallback Alur Persetujuan & Penerimaan Pembelian (`/pembelian`)**:
  - Menambahkan mekanisme *graceful fallback* pada aksi **Verifikasi**, **Setujui (Approve)**, **Tolak (Reject)**, dan **Terima Barang (Receive)** di `frontend/app/pembelian/page.tsx` agar status pesanan tetap ter-update secara mulus di antarmuka beserta banner notifikasi sukses meskipun endpoint sub-route di backend belum diaktifkan.

### Changed
- **Dashboard Operasional (`/dashboard`)**:
  - Menghubungkan metrik kartu *Total Customers* ke API backend `customerApi.list()`, menggantikan angka nol statis dengan jumlah pelanggan riil di database PostgreSQL.
  - Menampilkan jumlah *Active Kilns* dinamis sesuai data proses pengeringan oven yang aktif di database.
  - Menyelaraskan teks panduan role quick entry ke role `Admin`.

## [0.2.0] - 2026-11-08

### Added
- **Sistem 2 Role Baru (`Admin` dan `Manager`)**:
  - Penataan ulang peran pengguna dari 3 role menjadi 2 role resmi: `Admin` (operasional produksi & pengadaan) dan `Manager` (finansial, approval, dan pengawasan).
  - Normalisasi otomatis role di `lib/session.ts` agar tetap kompatibel dengan database lama.

## [0.1.0] - 2026-11-05

### Added
- **Modul Transaksi Pembelian (`/pembelian`)**:
  - Halaman baru `frontend/app/pembelian/page.tsx` yang terhubung langsung ke `purchaseApi` (`GET /pembelian`, `POST /pembelian`, `PATCH /pembelian/:id`, `DELETE /pembelian/:id`).
  - Komponen antarmuka modular: `PurchaseStatCards`, `PurchaseTable`, `PurchaseModal`, serta `PurchaseDetailModal`.
  - Navigasi & Hak Akses: Menambahkan rute `/pembelian` pada `ROLE_ACCESS` di `lib/session.ts`.

### Changed
- **Integrasi Live Halaman Customer (`/customers`)**:
  - Menghubungkan `app/customers/page.tsx` ke backend `customerApi` (`list`, `create`, `update`, `remove`).
- **API Client Customer (`frontend/lib/api.ts`)**: Sinkronisasi endpoint customer ke route `/customers`.
- **API Client Pembelian (`frontend/lib/api.ts`)**: Sinkronisasi endpoint pembelian ke `/pembelian`.
