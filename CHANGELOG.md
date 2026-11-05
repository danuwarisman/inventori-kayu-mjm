# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased] - 2026-11-05

### Changed
- **API Client Customer (`frontend/lib/api.ts`)**: Sinkronisasi endpoint customer ke route jamak `/customers` (`list`, `get`, `create`, `update`, `remove`) sesuai implementasi `CustomerController` NestJS backend.
- **API Client Pembelian (`frontend/lib/api.ts`)**: Sinkronisasi endpoint pembelian ke `/pembelian` sesuai `PembelianController` backend, dengan injeksi otomatis `idUser` dari user login aktif dan normalisasi `detailPembelian`.
- **Kontrak Tipe Data Approval (`frontend/types/purchase.ts`, `frontend/types/sales.ts`)**: Penyelarasan kontrak approval pada `PurchaseApproval` dan `SalesApproval` mengikuti entitas Prisma `Approval` terpadu (`idApproval`, `idUserManager`, `status`, `keteranganCatatan`, `tanggalApprove`, `manager`).
- **Sesi Pengguna (`frontend/lib/session.ts`, `frontend/app/login/page.tsx`)**: Menyimpan `id` pengguna pada `SessionUser` saat login dan menyediakan helper `getCurrentUserId()` dengan fallback dekode token JWT (`sub`).

