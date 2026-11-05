# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased] - 2026-11-05

### Added
- **Modul Transaksi Pembelian (`/pembelian`)**:
  - Halaman baru `frontend/app/pembelian/page.tsx` yang terhubung langsung ke `purchaseApi` (`GET /pembelian`, `POST /pembelian`, `PATCH /pembelian/:id`, `DELETE /pembelian/:id`).
  - Komponen antarmuka modular: `PurchaseStatCards` (ringkasan akumulasi transaksi, nominal biaya, status pending & approved), `PurchaseTable` (tabel riwayat pesanan dengan badge status dan aksi), `PurchaseModal` (modal input pesanan dengan pemilihan supplier mitra, tanggal transaksi, dan repeater dinamis rincian log kayu), serta `PurchaseDetailModal` (rincian spesifikasi kayu log dan riwayat approval).
  - Navigasi & Hak Akses: Menambahkan rute `/pembelian` pada `ROLE_ACCESS` di `lib/session.ts`, judul rute pada `Header.tsx`, izin per role pada `lib/permissions.ts`, serta item menu "Pembelian" di `Sidebar.tsx` yang hanya tampil untuk role `admin_kantor` dan `manager`.

### Changed
- **Integrasi Live Halaman Customer (`/customers`)**:
  - Menghubungkan `app/customers/page.tsx` ke backend `customerApi` (`list`, `create`, `update`, `remove`), menggantikan penyimpanan state lokal sehingga data tersimpan persisten ke database PostgreSQL.
  - Mempertahankan dual-ID pattern (`id_backend` numerik untuk backend operations dan `id_customer` string `CUS-xxx` untuk UI).
  - Penambahan tombol refresh data, banner pesan error backend dengan tombol retry, serta dialog konfirmasi hapus data.
  - Pembaruan `CustomerModal.tsx` dan `CustomerTable.tsx` dengan dukungan `isSaving`, `isLoading`, `canDelete`, spinner `Loader2`, serta penyesuaian validasi nomor kontak (maksimal 15 karakter sesuai DTO backend).
- **API Client Customer (`frontend/lib/api.ts`)**: Sinkronisasi endpoint customer ke route jamak `/customers` (`list`, `get`, `create`, `update`, `remove`) sesuai implementasi `CustomerController` NestJS backend.
- **API Client Pembelian (`frontend/lib/api.ts`)**: Sinkronisasi endpoint pembelian ke `/pembelian` sesuai `PembelianController` backend, dengan injeksi otomatis `idUser` dari user login aktif dan normalisasi `detailPembelian`.
- **Kontrak Tipe Data Approval (`frontend/types/purchase.ts`, `frontend/types/sales.ts`)**: Penyelarasan kontrak approval pada `PurchaseApproval` dan `SalesApproval` mengikuti entitas Prisma `Approval` terpadu (`idApproval`, `idUserManager`, `status`, `keteranganCatatan`, `tanggalApprove`, `manager`).
- **Sesi Pengguna (`frontend/lib/session.ts`, `frontend/app/login/page.tsx`)**: Menyimpan `id` pengguna pada `SessionUser` saat login dan menyediakan helper `getCurrentUserId()` dengan fallback dekode token JWT (`sub`).

