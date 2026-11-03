# Dokumentasi Frontend — MargiJatiMakmur

Dokumentasi ini menjelaskan kondisi **frontend** aplikasi inventori kayu PT. Margi Jati Makmur: teknologi, struktur folder, alur autentikasi, kontrak API, status setiap halaman, komponen, tipe data, sampai batasan yang masih ada.

- **Scope:** hanya folder `frontend/`
- **Backend:** NestJS di folder `backend/` (tidak diubah oleh dokumentasi ini)
- **Terakhir diperbarui:** 3 November 2026
- **Commit frontend terakhir yang didokumentasikan:** `26d6dcf` — `fix(frontend): sinkronkan payload log/sawmill dan RBAC manager`
- **RBAC per aksi:** diterapkan di `lib/permissions.ts` dan dipakai halaman operasional (lihat §7.9)

> Istilah **“live”** di dokumen ini berarti data dibaca/ditulis ke backend NestJS + PostgreSQL. **“Lokal”** berarti data hanya hidup di state React dan hilang saat halaman di-refresh.

---

## Daftar Isi

1. [Ringkasan](#1-ringkasan)
2. [Prasyarat](#2-prasyarat)
3. [Menjalankan Frontend](#3-menjalankan-frontend)
4. [Environment Variable](#4-environment-variable)
5. [Struktur Folder](#5-struktur-folder)
6. [Arsitektur Aplikasi](#6-arsitektur-aplikasi)
7. [Autentikasi, Sesi, dan RBAC](#7-autentikasi-sesi-dan-rbac)
8. [API Client dan Kontrak Endpoint](#8-api-client-dan-kontrak-endpoint)
9. [Halaman dan Status Implementasi](#9-halaman-dan-status-implementasi)
10. [Komponen](#10-komponen)
11. [Tipe Data dan Mapping](#11-tipe-data-dan-mapping)
12. [Konvensi Pengembangan](#12-konvensi-pengembangan)
13. [Script dan Quality Check](#13-script-dan-quality-check)
14. [Batasan dan TODO](#14-batasan-dan-todo)
15. [Troubleshooting](#15-troubleshooting)
16. [Riwayat Perubahan Frontend](#16-riwayat-perubahan-frontend)
17. [Referensi File Penting](#17-referensi-file-penting)
18. [Panduan Menambah Halaman / Endpoint](#18-panduan-menambah-halaman--endpoint)

---

## 1. Ringkasan

Frontend adalah aplikasi **Next.js 16 App Router** yang berjalan di browser dan berkomunikasi langsung ke REST API NestJS.

| Komponen | Versi / Keterangan |
|---|---|
| Framework | Next.js `16.3.2` (App Router, Turbopack saat build) |
| React | `19.2.8` |
| Bahasa | TypeScript (`strict: true`) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Ikon | `lucide-react` |
| HTTP | `fetch` bawaan browser melalui `lib/api.ts` |
| Auth | JWT Bearer + cookie role untuk route guard |
| State | React local state / `useState`; tanpa Redux/Zustand |
| Package manager | npm (ada `package-lock.json`) |

Karakteristik utama:

- Seluruh halaman interaktif memakai `'use client'`.
- Tidak ada Server Action atau data fetching di server component; semua request API terjadi di browser.
- `app/layout.tsx` membungkus semua halaman dengan `AppShell` (Sidebar + Header), kecuali `/login` dan `/`.
- Route guard berlapis: **middleware** (cookie role) + **guard client** di `AppShell` (localStorage + cookie).
- API client memakai `NEXT_PUBLIC_API_URL`, timeout 10 detik, mengirim `Authorization: Bearer <JWT>` bila token tersedia.

---

## 2. Prasyarat

### Frontend

- Node.js **20+** (disarankan Node 20 LTS atau lebih baru)
- npm
- Browser modern

### Backend

Frontend membutuhkan backend NestJS yang berjalan, biasanya di `http://localhost:3001`.

- PostgreSQL harus aktif.
- Database harus sudah dimigrasi/di-seed (user, role, supplier, dan data awal lain).
- Backend membutuhkan `JWT_SECRET` di `backend/.env`.
- Backend mengaktifkan CORS dengan `origin: true` dan `credentials: true`.

Jika backend/PostgreSQL mati:

- Halaman login akan menampilkan pesan tidak bisa menghubungi backend.
- Halaman yang membaca API akan menampilkan error atau state kosong.
- Halaman dengan fallback lokal masih bisa “terlihat menyimpan” data, tetapi data tidak masuk database.

---

## 3. Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000`.

### Script npm

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server Next.js (default port 3000) |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint (`eslint-config-next`) |
| `npx tsc --noEmit` | Type-check TypeScript tanpa menulis output |

Tidak ada script `test` di `package.json`. Saat ini belum ada unit test atau E2E test.

### Build production

```bash
npm run build
npm run start
```

Build terakhir (Next.js 16.3.2) berhasil. Akan muncul peringatan:

```text
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

Peringatan ini belum diperbaiki; lihat [Batasan dan TODO](#14-batasan-dan-todo).

---

## 4. Environment Variable

Buat file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS=3600000
```

| Variabel | Wajib | Default di kode | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Tidak | `http://localhost:3001` | Base URL backend NestJS |
| `NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS` | Tidak | `3600000` (60 menit) | Batas waktu tidak aktif sebelum auto-logout, dalam milidetik |

Catatan:

- Variabel berprefix `NEXT_PUBLIC_` akan ikut ter-bundle ke browser. **Jangan pernah menaruh secret di sini.**
- File `.env*` di-ignore oleh `frontend/.gitignore`, jadi `.env.local` tidak masuk Git.
- Setelah mengubah env, restart `npm run dev`.
- Jika `NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS` diisi bukan angka, `Number(...)` menghasilkan `NaN`; gunakan angka bulat yang valid.

---

## 5. Struktur Folder

```text
frontend/
├─ app/
│  ├─ layout.tsx                 # Root layout + AppShell
│  ├─ page.tsx                   # Redirect / -> /login
│  ├─ globals.css                # Tailwind v4 + style global
│  ├─ login/page.tsx             # Login backend (live)
│  ├─ dashboard/page.tsx         # Dashboard admin (live read)
│  ├─ manager-dashboard/page.tsx # Dashboard manager (UI/statis)
│  ├─ master-data/page.tsx       # Data Log
│  ├─ sawmill/page.tsx           # Data Sawmill + hasil plank
│  ├─ pra-dry-kiln/page.tsx      # Pra Dry Kiln (lokal)
│  ├─ dry-kiln/page.tsx          # Dry Kiln (live)
│  ├─ stock-reports/page.tsx     # Stock Reports (lokal)
│  ├─ suppliers/page.tsx         # Supplier (live CRUD)
│  ├─ sales/page.tsx             # Sales (lokal)
│  ├─ customers/page.tsx         # Customer (lokal)
│  ├─ accounts/page.tsx          # Account Management (lokal)
│  └─ settings/page.tsx          # Settings (UI + logout)
│
├─ components/
│  ├─ AppShell.tsx               # Shell login + Sidebar + Header
│  ├─ Sidebar.tsx                # Navigasi desktop/mobile
│  ├─ Header.tsx                 # Judul halaman, search, notifikasi
│  ├─ StatCard.tsx               # Kartu statistik generik
│  ├─ ConfirmModal.tsx           # Modal konfirmasi generik
│  ├─ accounts/                  # AccountCard, AccountModal
│  ├─ customers/                 # CustomerAnalytics, CustomerModal, CustomerTable
│  ├─ dry-kiln/                  # DryKilnModal, DryKilnTable
│  ├─ pra-dry-kiln/              # BatchModal, PlankTable
│  ├─ sales/                     # SalesModal, SalesStatCards, SalesTable
│  └─ suppliers/                 # SupplierModal, SupplierTable
│
├─ lib/
│  ├─ api.ts                     # API client + semua endpoint
│  ├─ dates.ts                   # Helper tanggal ISO & format id-ID
│  ├─ permissions.ts             # Matriks izin aksi per role
│  ├─ session.ts                 # Sesi, role, RBAC route, storage
│  ├─ useInactivityLogout.ts     # Auto-logout inactivity
│  └─ useSessionUser.ts          # Hook sesi reaktif
│
├─ types/
│  ├─ log.ts
│  ├─ sawmill.ts
│  ├─ dry-kiln.ts
│  ├─ pra-dry-kiln.ts
│  ├─ stock-report.ts
│  ├─ supplier.ts
│  ├─ sales.ts
│  ├─ customer.ts
│  ├─ account.ts
│  ├─ settings.ts
│  └─ inventory.ts               # Tipe lama dari SDD (sebagian tidak dipakai)
│
├─ middleware.ts                 # Route guard berdasarkan cookie role
├─ next.config.ts                # Konfigurasi Next (masih default)
├─ postcss.config.mjs            # Plugin @tailwindcss/postcss
├─ eslint.config.mjs             # ESLint flat config
├─ tsconfig.json                 # Alias @/* -> frontend/*
└─ README.md                     # Dokumen ini
```

Aset publik ada di `frontend/public/`, terutama `logoMJM.png`.

---

## 6. Arsitektur Aplikasi

### 6.1 Alur umum

```text
Browser
  │
  ├─ /login
  │    └─ authApi.login() ──POST /auth/login──> NestJS
  │         └─ simpan JWT + sesi (cookie role + localStorage)
  │
  ├─ Halaman lain
  │    ├─ middleware.ts cek cookie role
  │    ├─ AppShell cek localStorage + cookie (guard client)
  │    └─ page.tsx ──lib/api.ts──> fetch ──> NestJS ──> Prisma ──> PostgreSQL
  │
  └─ 401 dari API
       └─ clearSession() + redirect /login?reason=expired
```

### 6.2 Root layout dan AppShell

`app/layout.tsx`:

```tsx
<html lang="id">
  <body>
    <AppShell>{children}</AppShell>
  </body>
</html>
```

`components/AppShell.tsx`:

- Halaman `/login` dan `/` dirender **tanpa** Sidebar/Header.
- Halaman lain dirender dengan Sidebar + Header.
- Membaca sesi lewat `useSessionUser()` (`useSyncExternalStore`).
- Menjalankan `useInactivityLogout()`.
- Guard client:
  - Jika tidak ada profil di localStorage tetapi cookie ada → sesi dianggap rusak, redirect `/login`.
  - Jika profil ada tetapi cookie tidak ada → `clearSession()` + redirect `/login`.
  - Jika role tidak berhak atas path → redirect ke dashboard sesuai role.
- Saat sesi belum terbaca (hidrasi), menampilkan placeholder `div` dengan `aria-busy="true"`.

### 6.3 Pembagian server/client

- Hampir semua halaman adalah Client Component (`'use client'`).
- Tidak ada pemanggilan API langsung dari server component.
- Middleware hanya membaca cookie, bukan localStorage/JWT.
- Tidak ada global state management; data per halaman disimpan di `useState`.

### 6.4 Navigasi

`components/Sidebar.tsx`:

- Menu desktop dan drawer mobile.
- `managerOnly` hanya untuk **Account Management**.
- Label role diambil dari `ROLE_LABELS`.
- Link Dashboard mengarah ke `/manager-dashboard` untuk manager, `/dashboard` untuk role lain.
- Drawer mobile ditutup dengan tombol Escape, klik backdrop, atau pindah halaman.

`components/Header.tsx`:

- Judul halaman otomatis berdasarkan `routeTitleMap`.
- Tombol hamburger untuk membuka sidebar mobile.
- Input search dan tombol notifikasi saat ini **belum terhubung ke fungsionalitas** (lihat batasan).

---

## 7. Autentikasi, Sesi, dan RBAC

### 7.1 Alur login

1. User membuka `/login`.
2. Form mengirim `POST /auth/login` dengan `{ username, password }`.
3. Backend memvalidasi user + password bcrypt dan mengembalikan:

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": "8h",
  "user": {
    "id": 1,
    "username": "danu",
    "nama": "Danu Warisman",
    "role": "MANAGER"
  }
}
```

4. Frontend menormalisasi `user.role` dengan `normalizeRole()`.
5. Jika role tidak dikenali, login **dibatalkan** dan user melihat pesan error (fail-closed).
6. Jika valid:
   - JWT disimpan di `localStorage` dengan key `mjm_access_token`.
   - Profil disimpan di `localStorage` dengan key `mjm_session_user`.
   - Cookie `mjm_session` diisi role (bukan JWT).
7. Frontend redirect ke:
   - `mjm_redirect` jika ada dan valid, atau
   - `/manager-dashboard` untuk manager, atau
   - `/dashboard` untuk role lain.

### 7.2 Data sesi yang disimpan

| Nama | Tempat | Isi | Masa berlaku | Catatan |
|---|---|---|---|---|
| `mjm_access_token` | `localStorage` | JWT dari backend | Mengikuti JWT (8 jam) | Dibaca `lib/api.ts` untuk header Bearer |
| `mjm_session_user` | `localStorage` | `{ username, fullName, role }` | Tidak otomatis expired | Profil UI untuk Sidebar/Header |
| `mjm_session` | Cookie | Role (`manager`, `admin_kantor`, `admin_lapangan`) | 8 jam (`max-age`) | Dibaca middleware; **bukan HttpOnly** |
| `mjm_redirect` | Cookie | Path tujuan awal | 5 menit | Dipakai setelah login |

`clearSession()` menghapus:

- Cookie `mjm_session` dan `mjm_redirect`.
- Semua cookie berprefix `mjm_`.
- Semua key `localStorage` dan `sessionStorage` berprefix `mjm_`.
- Cache snapshot sesi di memori.

### 7.3 Normalisasi role

Backend mengirim `role.nama.toUpperCase()`, misalnya `"ADMIN KANTOR"`. Frontend memakai kode:

| Kode frontend | Label UI | Contoh nilai backend yang diterima |
|---|---|---|
| `manager` | Manager | `MANAGER`, `Manager` |
| `admin_kantor` | Office Admin | `ADMIN KANTOR`, `ADMIN_KANTOR`, `AdminKantor` |
| `admin_lapangan` | Field Admin | `ADMIN LAPANGAN`, `ADMIN_LAPANGAN`, `AdminLapangan` |

`normalizeRole()` mengabaikan spasi, tanda hubung, dan underscore. Jika tidak ada padanan, hasilnya `null` dan login ditolak.

> Sumber kebenaran role ada di tabel `role` backend. Jika nama role di database berubah, frontend perlu peta baru di `lib/session.ts`.

### 7.4 Hak akses route

`ROLE_ACCESS` di `lib/session.ts`:

| Path | Role yang diizinkan |
|---|---|
| `/manager-dashboard` | `manager` |
| `/dashboard` | `admin_kantor`, `admin_lapangan` |
| `/accounts` | `manager` |
| `/master-data` | Semua role login |
| `/sawmill` | Semua role login |
| `/pra-dry-kiln` | Semua role login |
| `/dry-kiln` | Semua role login |
| `/stock-reports` | Semua role login |
| `/suppliers` | Semua role login |
| `/sales` | Semua role login |
| `/customers` | Semua role login |
| `/settings` | Semua role login |

`/login` dan `/` bersifat publik.

Catatan:

- `ROLE_ACCESS` dicocokkan **persis** terhadap `pathname`. Jika nanti ada nested route (mis. `/suppliers/detail`), perlu penyesuaian logika prefix.
- Middleware dan `AppShell` sama-sama memakai `ROLE_ACCESS`, tetapi guard client tetap dipertahankan sebagai lapisan kedua.
- Membuka `/login` saat sudah login akan langsung diarahkan ke dashboard sesuai role.

### 7.5 Perilaku saat API mengembalikan 401/403

| Status | Perilaku frontend |
|---|---|
| `401` dari endpoint selain login | `clearSession()`, lalu `window.location.replace('/login?reason=expired')` |
| `401` dari `/auth/login` | Tidak redirect; pesan dari backend ditampilkan (username/password salah) |
| `403` | Tidak redirect; pesan ramah `FORBIDDEN_MESSAGE` ditampilkan di banner error halaman |

`reason=expired` dan `reason=timeout` saat ini **belum ditampilkan** oleh halaman login.

### 7.6 Auto-logout karena tidak aktif

`lib/useInactivityLogout.ts`:

- Event yang dihitung aktivitas: `mousemove`, `mousedown`, `keydown`, `wheel`, `touchstart`, `scroll`.
- Reset timer di-throttle maksimal sekali per 60 detik.
- Timeout default 60 menit (`NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS`).
- Saat timeout: `clearSession()` lalu `router.replace('/login?reason=timeout')`.

### 7.7 Logout manual

Saat ini logout manual hanya ada di `/settings`:

1. Tombol logout → konfirmasi `window.confirm`.
2. `clearSession()`.
3. `router.push('/login')`.

Tidak ada tombol logout di Header/Sidebar.

### 7.8 Catatan keamanan

- JWT disimpan di `localStorage`, sehingga rentan jika ada XSS.
- Cookie `mjm_session` hanya berisi role, bukan token, dan tidak memakai `HttpOnly`/`Secure`.
- Backend **belum memasang global JWT guard** (tidak ada `APP_GUARD` di `app.module.ts`). Artinya route guard frontend belum menjadi otorisasi server yang sebenarnya.
- Idealnya nanti: backend mengeset cookie `HttpOnly` + `Secure` + `SameSite`, frontend tidak menyimpan token di localStorage, dan semua endpoint dilindungi guard role.
- `mjm_redirect` menerima path yang diawali `/`, tetapi nilai seperti `//domain-lain` juga lolos pengecekan `startsWith('/')`. Ini berpotensi open redirect dan perlu diperbaiki.

### 7.9 Matriks izin aksi (UI)

Sumber tunggal: `lib/permissions.ts` (`can(role, permission)`). Ini **hanya guard UI**; backend tetap harus memvalidasi otorisasi.

| Modul / aksi | Manager | Admin Kantor | Admin Lapangan |
|---|---:|---:|---:|
| Log: create | — | — | ✅ |
| Log: update | — | ✅ | ✅ |
| Log: delete | — | ✅ | — |
| Sawmill: create/update/delete | — | — | ✅ |
| Plank: create/update/delete | — | — | ✅ |
| Dry Kiln: create/update | — | — | ✅ |
| Pra Dry Kiln: create/update | — | — | ✅ |
| Supplier: create/update/delete | — | ✅ | — |
| Customer: create/update | — | — | ✅ |
| Sales: create | — | — | ✅ |
| Sales: approve/reject | ✅ | — | — |
| Stock: create | — | — | ✅ |
| Account Management | ✅ | — | — |
| Settings: Data Management (backup/export) | ✅ | ✅ | — |
| Dashboard Quick Entry (log) | — | — | ✅ |

Catatan:
- Admin Kantor tetap dapat **melihat** Sawmill, Dry Kiln, Pra Dry Kiln, Sales, Customer, dan Stock Reports, tetapi tanpa aksi tulis.
- Manager tetap read-only untuk data operasional; aksinya hanya approval Sales, Account Management, dan Data Management.
- `Log delete` dibatasi ke Admin Kantor sebagai aksi administratif/destruktif.
- SDD memiliki konflik pada pembuat Sales (use case menyebut Admin Lapangan; AC-10 menyebut Admin Kantor). Implementasi UI mengikuti use case + alur approval: Admin Lapangan membuat, Manager menyetujui/menolak.
- Aksi verifikasi Sales oleh Admin Kantor (UC-08) belum tersedia di UI; saat ini Admin Kantor hanya read-only pada Sales.

---

## 8. API Client dan Kontrak Endpoint

### 8.1 Lokasi dan konfigurasi

Semua request terpusat di `lib/api.ts`.

| Aspek | Nilai |
|---|---|
| Base URL | `NEXT_PUBLIC_API_URL` atau `http://localhost:3001` |
| Timeout | 10.000 ms (`AbortSignal.timeout`) |
| Credentials | `include` |
| Cache | `no-store` |
| Content-Type | `application/json` hanya jika ada body |
| Authorization | `Bearer <token>` jika `mjm_access_token` ada |
| Response 204 | Mengembalikan `undefined` |

Error dilempar sebagai `ApiError` dengan `status` HTTP. `getApiErrorMessage(err, fallback)` dipakai halaman untuk menampilkan pesan yang aman.

### 8.2 Penanganan error

- Body error backend dibaca sebagai `{ message: string | string[] }`.
- Jika `message` berupa array (ValidationPipe), item digabung dengan `, `.
- Jika body bukan JSON, dipakai pesan default.
- Network error/timeout/CORS menghasilkan pesan:

```text
Tidak bisa menghubungi backend di <URL>. Pastikan server berjalan dan CORS diizinkan.
```

### 8.3 Auth

| Method | Endpoint | Body | Respons |
|---|---|---|---|
| `POST` | `/auth/login` | `{ username, password }` | `LoginResponse` |

```ts
interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: {
    id: number;
    username: string;
    nama: string;
    role: string; // sudah uppercase dari backend
  };
}
```

### 8.4 Supplier

Model backend (`schema.prisma`):

```prisma
model Supplier {
  idSupplier    Int
  namaSupplier  String  @db.VarChar(100)
  alamatSupplier String @db.VarChar(200)
  kontakSupplier String @db.VarChar(15)
}
```

| Method | Endpoint | Body | Respons |
|---|---|---|---|
| `GET` | `/supplier` | — | `BackendSupplier[]` |
| `GET` | `/supplier/:id` | — | `BackendSupplier` (belum dipakai client) |
| `POST` | `/supplier` | `{ namaSupplier, alamatSupplier, kontakSupplier }` | `BackendSupplier` |
| `PATCH` | `/supplier/:id` | `{ namaSupplier, alamatSupplier, kontakSupplier }` | `BackendSupplier` |
| `DELETE` | `/supplier/:id` | — | Objek supplier yang dihapus (client mengabaikan body) |

Mapping ke UI (`mapBackendSupplier`):

```ts
{
  id_backend: b.idSupplier,
  id_supplier: `SUP-${String(b.idSupplier).padStart(3, '0')}`,
  nama_supplier: b.namaSupplier,
  alamat_supplier: b.alamatSupplier,
  kontak_supplier: b.kontakSupplier,
}
```

Catatan:

- `id_supplier` (`SUP-001`) hanya kode tampilan, bukan primary key.
- `id_backend` adalah ID numerik yang dipakai untuk `PATCH`/`DELETE`.
- Form hanya mengirim tiga field DTO. `ValidationPipe` backend memakai `whitelist` + `forbidNonWhitelisted`, jadi field tambahan akan ditolak.

### 8.5 Log

| Method | Endpoint | Query/Body | Respons |
|---|---|---|---|
| `GET` | `/log` | `?sortimen=&stage=` (opsional) | `LogItem[]` |
| `GET` | `/log/:id` | — | `LogItem` |
| `POST` | `/log` | `CreateLogDto` | `LogItem` |
| `PATCH` | `/log/:id` | `UpdateLogDto` | `LogItem` |
| `DELETE` | `/log/:id` | — | `{ success, message }` |

`CreateLogDto` backend:

| Field | Wajib | Tipe |
|---|---|---|
| `asalSortimen` | Ya | string |
| `panjang` | Ya | number |
| `diameter` | Ya | number |
| `kodeLog` | Tidak | string |
| `id_log` | Tidak | string |
| `volumeLog` | Tidak | number |
| `statusLog` | Tidak | string |
| `stage` | Tidak | string |
| `suplier` | Tidak | string |
| `harga` | Tidak | number |
| `tanggalMasuk` | Tidak | string/Date |

Respons backend memetakan beberapa alias agar cocok dengan UI:

- `asalSortimen` → juga dikirim sebagai `sortimen`
- `volumeLog` → juga dikirim sebagai `volume`
- `statusLog` → juga dikirim sebagai `stage`
- `tanggalMasuk` → juga dikirim sebagai `tanggal_masuk`
- `kodeLog`/`id_log`

**Mapping payload frontend → backend** (dilakukan terpusat di `lib/api.ts`):

| Field UI (`LogItem`) | Field DTO backend |
|---|---|
| `sortimen` | `asalSortimen` |
| `volume` / `volumeLog` | `volumeLog` |
| `tanggal_masuk` | `tanggalMasuk` |
| `id_log` / `kodeLog` | `kodeLog` |
| `stage` | `stage` (backend menyimpannya sebagai `statusLog`) |

`logApi.create()` dan `logApi.update()` membuang field `undefined`/`null`, lalu hanya mengirim field DTO di atas. Dengan begitu `POST /log` dari **master-data** maupun **dashboard quick entry** diterima backend, dan `PATCH /log/:id` tidak lagi mengirim field di luar DTO.

### 8.6 Sawmill

| Method | Endpoint | Query/Body | Respons |
|---|---|---|---|
| `GET` | `/sawmill` | `?sortimen=&stage=` | `SawmillItem[]` |
| `GET` | `/sawmill/planks` | — | `PlankItem[]` |
| `GET` | `/sawmill/:id` | — | `SawmillItem` |
| `POST` | `/sawmill` | `CreateSawmillDto` | `SawmillItem` |
| `PATCH` | `/sawmill/:id` | Body bebas (`any` di controller) | `SawmillItem` |
| `DELETE` | `/sawmill/:id` | — | `{ success, message }` |
| `POST` | `/sawmill/:id/plank` | `CreatePlankDto` | `PlankItem` |
| `PATCH` | `/sawmill/plank/:idPlank` | `UpdatePlankDto` | `PlankItem` |
| `DELETE` | `/sawmill/plank/:idPlank` | — | `{ success, message }` |

`CreateSawmillDto` menerima antara lain:

`kodeSawmill`, `idLog`, `id_log_asal`, `sortimen`, `panjang`, `diameter`, `volume_total`, `stage`, `suplier`, `harga`, `tanggal`, `planks`.

`CreatePlankDto`:

| Field | Wajib | Catatan |
|---|---|---|
| `gradePapan` | Ya | BUKAN `grade` |
| `tinggi` | Ya | cm |
| `lebar` | Ya | cm |
| `panjang` | Ya | cm |
| `kodePlank` | Tidak | |
| `id_plank` | Tidak | |
| `idSawmill` | Tidak | |
| `idLogAsal` | Tidak | |
| `volumePlank` | Tidak | BUKAN `volume` |
| `stage` | Tidak | |
| `sortimen` | Tidak | |

`UpdatePlankDto` hanya menerima `kodePlank`, `gradePapan`, `tinggi`, `lebar`, `panjang`, `volumePlank`, `stage`.

**Mapping payload frontend → backend** (dilakukan terpusat di `lib/api.ts`):

| Kebutuhan | Field UI | Field DTO backend |
|---|---|---|
| Create batch | `id_sawmill` | `kodeSawmill` |
| Create batch | `id_log_asal`, `sortimen`, `panjang`, `diameter`, `volume_total`, `stage`, `suplier`, `harga`, `tanggal`, `planks` | Nama field sama |
| Create plank | `id_plank` | `kodePlank` |
| Create plank | `grade` | `gradePapan` |
| Create plank | `volume` | `volumePlank` |
| Create plank | `tinggi`, `lebar`, `panjang`, `stage`, `sortimen` | Nama field sama |
| Update plank | `kodePlank`, `gradePapan`, `tinggi`, `lebar`, `panjang`, `volumePlank`, `stage` | Hanya field ini yang dikirim |

Catatan implementasi backend:

- `PATCH /sawmill/:id` memakai `@Body() dto: any`; service hanya menyimpan `stage`/`statusSawmill` dan `kodeSawmill`. Perubahan dimensi/supplier pada edit batch **belum** ikut tersimpan; frontend hanya mengirim field yang didukung agar payload tidak menyesatkan.
- `POST /sawmill` memakai DTO; `id_sawmill` tidak pernah dikirim sebagai field mentah.
- `POST /sawmill/:id/plank` dan `PATCH /sawmill/plank/:idPlank` sudah mengirim `gradePapan`/`volumePlank` sesuai DTO.

### 8.7 Dry Kiln

| Method | Endpoint | Query/Body | Respons |
|---|---|---|---|
| `GET` | `/dry-kiln` | `?sortimen=&stage=&date=` | `DryKilnItem[]` |
| `GET` | `/dry-kiln/:id` | — | `DryKilnItem` |
| `POST` | `/dry-kiln` | `CreateDryKilnDto` | `DryKilnItem` |
| `PATCH` | `/dry-kiln/:id` | `UpdateDryKilnDto` | `DryKilnItem` |
| `DELETE` | `/dry-kiln/:id` | — | `{ success, message }` |

`CreateDryKilnDto`:

| Field | Wajib | Tipe |
|---|---|---|
| `panjang` | Ya | number |
| `lebar` | Ya | number |
| `tinggi` | Ya | number |
| `id_log`, `kodeLog` | Tidak | string |
| `id_plank`, `kodePlank`, `idPlank` | Tidak | string/number |
| `sortimen`, `grade` | Tidak | string |
| `volume` | Tidak | number |
| `stage` | Tidak | string |
| `date`, `tanggalMasuk` | Tidak | string/Date |

Respons `GET /dry-kiln` mengembalikan `idOven`, `id_log`, `id_plank`, `kodeOven`, `sortimen`, `panjang`, `lebar`, `tinggi`, `volume`, `grade`, `stage`, `date`, dan `tanggalMasuk`.

### 8.8 Customer (backend ada, frontend belum memakai)

Backend memiliki `CustomerModule`, tetapi `lib/api.ts` **belum** memiliki `customerApi`, dan halaman `/customers` masih lokal. Kontrak backend perlu dicek terpisah jika nanti diintegrasikan.

---

## 9. Halaman dan Status Implementasi

### 9.1 Ringkasan status

| Route | Halaman | Status data | Ringkasan |
|---|---|---|---|
| `/` | Root | — | Redirect ke `/login` |
| `/login` | Login | **Live penuh** | Auth ke backend, simpan JWT + sesi |
| `/dashboard` | Dashboard Admin | **Sebagian** | Statistik live; quick entry Log live dengan payload sesuai DTO |
| `/manager-dashboard` | Dashboard Manager | **UI lokal** | Semua metrik 0/placeholder |
| `/master-data` | Data Log | **Live** | Baca, create, update, delete live; fallback lokal hanya saat backend error |
| `/sawmill` | Data Sawmill | **Sebagian** | Baca, create batch, tulis/edit plank, dan delete live; edit batch terbatas pada field yang didukung backend |
| `/pra-dry-kiln` | Pra Dry Kiln | **UI lokal** | Tidak ada API |
| `/dry-kiln` | Dry Kiln | **Live** | Baca, create, update live; belum ada tombol delete |
| `/stock-reports` | Stock Reports | **UI lokal** | Tidak ada API |
| `/suppliers` | Supplier | **Live penuh** | CRUD lengkap ke backend |
| `/sales` | Sales | **UI lokal** | Tidak ada API |
| `/customers` | Customer | **UI lokal** | Backend customer belum dipakai |
| `/accounts` | Account Management | **UI lokal** | Manajer-only, data di state |
| `/settings` | Settings | **UI lokal + logout live** | Profil/password/export simulasi; logout nyata |

### 9.2 `/login`

- Form username/password, show/hide password.
- Memanggil `POST /auth/login`.
- Menampilkan error backend (401, backend mati, role tidak dikenal).
- Menyimpan JWT + sesi, lalu redirect.
- Link `Forgot?` (`#forgot`) dan `Technical Support` (`#support`) masih dead link.
- Indikator “Server: Online” bersifat statis, bukan health check.

### 9.3 `/dashboard` — Dashboard Admin

- Mengambil data paralel dengan `Promise.allSettled`:
  - `logApi.list()` → jumlah log + 5 aktivitas terbaru.
  - `sawmillApi.listPlanks()` → jumlah plank.
  - `dryKilnApi.list()` → jumlah item dry kiln.
- `totalCustomers` dan `totalSales` masih hardcoded `0`.
- Quick Entry (diameter, panjang, sortimen, supplier):
  - Hanya tampil untuk `admin_lapangan` (`log:create`); role lain melihat keterangan read-only.
  - Menambahkan aktivitas ke state lokal agar UI langsung responsif.
  - Mengirim `POST /log` melalui mapper `logApi.create()`: `sortimen` → `asalSortimen`, kode → `kodeLog`, dan hanya field DTO yang dikirim.
  - Jika backend gagal, aktivitas tetap tampil sementara di state lokal (tidak ada rollback/notifikasi error).

### 9.4 `/manager-dashboard` — Dashboard Manager

- Halaman hanya untuk role `manager`.
- Semua angka metrik (`totalRevenue`, `netProfit`, `totalExpenses`, `transactions`, `stockAlerts`, `pendingInvoices`, `accountsReceivable`) diinisialisasi `0`/kosong.
- Grafik hanya placeholder dengan pesan “Belum ada data transaksi...”.
- Tombol “Generate Financial Report” belum berfungsi.
- Belum ada integrasi API.

### 9.5 `/master-data` — Data Log

- Filter tanggal (client-side) dan sortimen (server-side via `GET /log?sortimen=`).
- Tabel log: ID, sortimen, dimensi, volume, stage, supplier, harga, aksi.
- Modal tambah/edit:
  - Field: ID Log, Sortimen, Panjang, Diameter, Supplier.
  - Volume dihitung otomatis: `π/4 * (d/200)² * (p/100)`.
- Hapus memakai `DELETE /log/:id` (live) dan menghapus proses sawmill/plank terkait di backend.
- Aksi per role:
  - `admin_lapangan`: create + update.
  - `admin_kantor`: update + delete.
  - `manager`: read-only (tombol tambah/edit/hapus disembunyikan).
- Payload create/update sudah dipetakan ke DTO backend (`asalSortimen`, `volumeLog`, `tanggalMasuk`, `kodeLog`), sehingga data tersimpan ke PostgreSQL.
- Fallback lokal tetap ada sebagai jaring pengaman bila backend/PostgreSQL mati; data fallback akan hilang setelah refresh.

### 9.6 `/sawmill` — Data Sawmill

- Filter tanggal (client-side) dan sortimen (server-side).
- Mengambil `GET /sawmill` yang sudah termasuk `planks`.
- Fitur:
  - Tambah batch sawmill.
  - Edit batch.
  - Hapus batch (live; backend juga menghapus plank terkait).
  - Detail hasil plank.
  - Tambah/edit/hapus plank.
- Volume log: `π/4 * (d/200)² * (p/100)`.
- Volume plank: `t * w * l / 1.000.000` (cm³ → m³).
- RBAC: hanya `admin_lapangan` yang melihat tombol New Batch, edit batch, serta tambah/edit plank. `manager` dan `admin_kantor` read-only; manager tetap melihat kolom supplier/harga.
- Payload tulis sudah dipetakan ke DTO backend:
  - `POST /sawmill`: `id_sawmill` → `kodeSawmill`; tidak ada field di luar `CreateSawmillDto`.
  - `POST /sawmill/:id/plank`: `id_plank` → `kodePlank`, `grade` → `gradePapan`, `volume` → `volumePlank`.
  - `PATCH /sawmill/plank/:idPlank`: hanya field `UpdatePlankDto` yang dikirim.
  - Respons plank mentah dari backend dinormalisasi kembali ke `PlankItem` agar ID dan hasil tulis langsung tampil benar.
- `PATCH /sawmill/:id` hanya mengirim `stage`/`kodeSawmill`; service backend belum menyimpan perubahan dimensi/supplier, jadi edit batch masih bersifat lokal untuk field tersebut.
- `DELETE` batch/plank live.
- Tombol “Export PDF” belum berfungsi.
- Pagination di tabel belum benar-benar memotong data.

### 9.7 `/pra-dry-kiln` — Pra Dry Kiln

- Hanya state lokal; tidak ada API.
- Filter tanggal dan sortimen.
- Modal batch untuk tambah/edit item plank.
- Volume: `t * w * l / 1.000.000`.
- Hanya `admin_lapangan` yang dapat tambah/edit; manager dan admin_kantor read-only.
- “Export PDF” belum berfungsi.

### 9.8 `/dry-kiln` — Dry Kiln

- Mengambil `GET /dry-kiln?sortimen=&date=`.
- Filter tanggal dan sortimen.
- Tambah/edit item dry kiln.
- Volume: `t * w * l / 1.000.000`.
- Payload create/update saat ini cocok dengan DTO backend, sehingga data tersimpan.
- Hanya `admin_lapangan` yang dapat tambah/edit; manager dan admin_kantor read-only.
- Belum ada tombol hapus di UI, walaupun `DELETE /dry-kiln/:id` tersedia di API client.
- “Export PDF” belum berfungsi.

### 9.9 `/stock-reports` — Stock Reports

- Hanya state lokal; tidak ada API.
- Filter sortimen, grade, dan tanggal.
- Modal tambah stok.
- Status badge: `Available`, `Low Stock`, `Out of Stock`.
- Volume: `t * w * l / 1.000.000.000` (mm³ → m³).
- Hanya `admin_lapangan` yang dapat Add Stock; manager dan admin_kantor read-only.
- “Export PDF” dan pagination belum berfungsi.

### 9.10 `/suppliers` — Supplier

- CRUD lengkap dan sudah tersinkron dengan backend:
  - `GET /supplier`
  - `POST /supplier`
  - `PATCH /supplier/:id`
  - `DELETE /supplier/:id`
- Field UI: **Company Name, Address, Phone Number** (sesuai tiga field backend).
- Search mencakup ID tampilan, nama, alamat, dan kontak.
- Hapus multi-select dengan `Promise.allSettled`; jika sebagian gagal, sisanya tetap dihapus dan nama yang gagal dilaporkan.
- Loading state untuk muat/simpan/hapus dan error banner.
- Modal:
  - Validasi wajib isi, trim, `maxLength` 100/200/15.
  - Error backend ditampilkan di dalam modal.
  - Modal baru ditutup setelah request sukses.
  - State form di-reset lewat `key` dari parent (tanpa `useEffect` + setState).
- Hanya `admin_kantor` yang dapat Add/Remove/Edit; manager dan admin_lapangan read-only.
- Tombol refresh tetap tersedia untuk semua role yang boleh melihat halaman.
- Catatan: delete bisa gagal jika supplier sudah direferensikan transaksi pembelian/pengajuan (foreign key).

### 9.11 `/sales` — Sales

- Hanya state lokal.
- Stat card dihitung dari state (`SalesStatCards`).
- Filter search, status, tanggal.
- Tambah transaksi hanya untuk `admin_lapangan`; total = kuantitas × harga satuan.
- Manager dapat Approve/Reject; alasan reject lewat `window.prompt`.
- `admin_kantor` dan role lain read-only pada Sales.
- Tidak ada API penjualan di frontend.

### 9.12 `/customers` — Customer

- Hanya state lokal.
- Manager melihat widget analitik (`CustomerAnalytics`) dari data state.
- Tambah/edit customer lewat modal hanya untuk `admin_lapangan`.
- Backend memiliki modul customer, tetapi frontend belum memakai endpoint-nya.
- Manager dan admin_kantor read-only untuk aksi data.

### 9.13 `/accounts` — Account Management

- Hanya state lokal.
- Daftar akun, search, tambah/edit lewat `AccountModal`.
- Hanya bisa dibuka role `manager` (dijaga middleware + `ROLE_ACCESS`).
- Model `AccountItem` menyimpan `password` di state client; ini hanya demo UI, bukan autentikasi nyata.
- Tidak ada API akun.

### 9.14 `/settings` — Settings

- Profil user hardcoded (“Danu Warisman”, email, telepon, role Manager) dan bisa diedit di state.
- Ganti password hanya validasi lokal (password lama tidak dicek ke backend).
- Toggle notifikasi hanya state.
- Riwayat login dan riwayat manajemen berisi data contoh.
- Export database disimulasikan (`setTimeout`), tidak menghasilkan file.
- Backup database hanya memunculkan modal sukses.
- Section Data Management (backup/export/history) hanya tampil untuk `manager` dan `admin_kantor`; `admin_lapangan` tidak melihat aksi sensitif ini.
- **Logout nyata:** `clearSession()` + redirect `/login`.
- Tidak ada API settings/profil.

---

## 10. Komponen

### 10.1 Shared

| Komponen | File | Fungsi |
|---|---|---|
| `AppShell` | `components/AppShell.tsx` | Layout utama, guard sesi client, Sidebar/Header, inactivity logout |
| `Sidebar` | `components/Sidebar.tsx` | Navigasi desktop/mobile, filter menu `managerOnly`, profil user |
| `Header` | `components/Header.tsx` | Judul halaman otomatis, tombol mobile, search, notifikasi |
| `StatCard` | `components/StatCard.tsx` | Kartu statistik generik (belum dipakai halaman mana pun) |
| `ConfirmModal` | `components/ConfirmModal.tsx` | Modal konfirmasi generik (belum dipakai halaman mana pun) |

### 10.2 Domain

| Domain | Komponen | Fungsi |
|---|---|---|
| Supplier | `SupplierTable`, `SupplierModal` | Tabel, form tambah/edit, validasi |
| Dry Kiln | `DryKilnTable`, `DryKilnModal` | Tabel dan form dry kiln |
| Pra Dry Kiln | `PlankTable`, `BatchModal` | Tabel plank dan form batch |
| Sales | `SalesTable`, `SalesModal`, `SalesStatCards` | Tabel, form, dan kartu statistik sales |
| Customer | `CustomerTable`, `CustomerModal`, `CustomerAnalytics` | Tabel, form, analitik manager |
| Account | `AccountCard`, `AccountModal` | Kartu akun dan form akun |

---

## 11. Tipe Data dan Mapping

### 11.1 File tipe

| File | Isi | Dipakai oleh |
|---|---|---|
| `types/log.ts` | `LogItem`, `LogStage` | Dashboard, Master Data, API |
| `types/sawmill.ts` | `SawmillItem`, `PlankItem` | Sawmill, API |
| `types/dry-kiln.ts` | `DryKilnItem`, `DryKilnFormData` | Dry Kiln, API |
| `types/pra-dry-kiln.ts` | `PraDryKilnItem`, `PraDryKilnFormData` | Pra Dry Kiln |
| `types/stock-report.ts` | `StockReportItem`, `StockStatus` | Stock Reports |
| `types/supplier.ts` | `SupplierItem`, `SupplierFormData` | Supplier, API |
| `types/sales.ts` | `SalesItem`, `SalesFormData` | Sales |
| `types/customer.ts` | `CustomerItem`, `CustomerFormData`, `SmartAlertItem` | Customer |
| `types/account.ts` | `AccountItem`, `AccountFormData` | Accounts |
| `types/settings.ts` | Profil, riwayat login, export, riwayat manajemen | Settings |
| `types/inventory.ts` | Tipe lama dari SDD (`UserAccount`, `Supplier`, `Customer`, `StokLog`, `Plank`, `TransaksiPenjualan`) | Sebagian tidak dipakai halaman aktif |

### 11.2 Dual ID: ID tampilan vs ID backend

Beberapa model menyimpan dua jenis ID:

```ts
interface SawmillItem {
  idSawmill?: number;   // primary key backend, untuk PATCH/DELETE
  id_sawmill: string;   // kode tampilan, mis. "SM-2026-1"
  // ...
}
```

Pola yang sama berlaku untuk Log (`idLog` vs `id_log`), Plank (`idPlank` vs `id_plank`), Dry Kiln (`idOven` vs `id_plank`), dan Supplier (`id_backend` vs `id_supplier`).

Aturan:

- Gunakan ID numerik backend untuk operasi tulis/hapus.
- Gunakan ID string untuk tampilan, key React, dan filter.

### 11.3 Mapping dari backend

**Supplier** (`lib/api.ts`):

```ts
{
  id_backend: b.idSupplier,
  id_supplier: `SUP-${String(b.idSupplier).padStart(3, '0')}`,
  nama_supplier: b.namaSupplier,
  alamat_supplier: b.alamatSupplier,
  kontak_supplier: b.kontakSupplier,
}
```

**Log** (dilakukan backend):

- `asalSortimen` → `sortimen`
- `volumeLog` → `volume`
- `statusLog` → `stage`
- `tanggalMasuk` → `tanggal_masuk` (format `yyyy-mm-dd`)
- `kodeLog` → `id_log`

**Sawmill** (dilakukan backend):

- `idSawmill` → `id_sawmill` (kode `SWM-...`)
- Data log asal (`stokLog`) → `sortimen`, `panjang`, `diameter`, `volume_total`, `suplier`, `harga`, `id_log_asal`
- `planks` → `PlankItem[]`

**Dry Kiln** (dilakukan backend):

- `idOven` → primary key
- `kodeLog` → `id_log`
- `kodePlank` → `id_plank`
- `tanggalMasuk` → `date` (`yyyy-mm-dd`)

### 11.4 Inkonsistensi tipe yang diketahui

- Ada beberapa definisi role yang terpisah:
  - `UserRole` di `types/inventory.ts`
  - `AccountDivision` di `types/account.ts`
  - `role` di `types/settings.ts` (label manusia)
  - `AppRole` lokal di `app/sawmill/page.tsx` yang masih memasukkan `'admin'`
- Tipe `Supplier`/`Customer`/`StokLog` di `types/inventory.ts` memakai snake_case lama dan tidak selalu sama dengan tipe yang dipakai halaman aktif.
- `PlankGrade` didefinisikan ulang di `types/sawmill.ts`, `types/dry-kiln.ts`, dan `types/pra-dry-kiln.ts`.
- `SawmillItem.stage` dibatasi `'Sawmill' | 'finish Sawmill'`, sedangkan backend menyimpan status sebagai string bebas.

Rekomendasi: jadikan `lib/session.ts` satu-satunya sumber `AppRole`, dan pertimbangkan memindahkan `PlankGrade` ke satu file shared.

### 11.5 Helper tanggal

`lib/dates.ts`:

- `toISODate(date?)` → `yyyy-mm-dd` berdasarkan waktu lokal.
- `formatDateID(isoDate)` → `dd/mm/yyyy`.

Konvensi: tanggal disimpan sebagai ISO `yyyy-mm-dd` agar cocok dengan `<input type="date">`; format tampilan dilakukan saat render.

---

## 12. Konvensi Pengembangan

### 12.1 Bahasa dan UI

- Kode dan komentar memakai bahasa Indonesia/Inggris campur, mengikuti file sekitar.
- Label UI sebagian berbahasa Inggris (“Add Supplier”, “Company Name”), sebagian Indonesia (“Cari”, “Hapus”). Pertahankan gaya halaman yang sedang diedit agar konsisten.
- Gunakan `font-sans` dan palet hijau/stone yang sudah dipakai.

### 12.2 Komponen client

- Tambahkan `'use client'` di halaman/komponen yang memakai hook, event handler, atau browser API.
- Jangan memanggil `localStorage`/`document` di top-level module; lakukan di dalam fungsi/efek yang hanya berjalan di client.
- Untuk membaca sesi, gunakan `useSessionUser()` agar reaktif dan aman saat SSR.

### 12.3 React hooks

- Hindari `setState` sinkron langsung di body `useEffect` (aturan ESLint `react-hooks/set-state-in-effect`).
- Untuk modal yang perlu reset form, gunakan pola `key` dari parent seperti di `SupplierModal`.
- Untuk data awal, gunakan callback promise di dalam effect (contoh `fetchSuppliers`).

### 12.4 API dan DTO

- Semua request lewat `lib/api.ts`; jangan panggil `fetch` langsung dari halaman agar error handling konsisten.
- Sebelum menambah field ke payload, cek DTO backend. Backend memakai:
  ```ts
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
  ```
  Artinya field yang tidak ada di DTO akan membuat request 400.
- Gunakan camelCase untuk payload backend (`namaSupplier`, `asalSortimen`, `gradePapan`, `volumePlank`).
- Gunakan `getApiErrorMessage(err, fallback)` untuk pesan error yang ditampilkan.

### 12.5 ID dan angka

- ID tampilan boleh string (`SUP-001`), tetapi operasi backend memakai ID numerik.
- Format uang: `Rp ${nilai.toLocaleString('id-ID')}`.
- Volume disimpan dalam m³ dengan pembulatan 3 desimal pada perhitungan frontend.

### 12.6 Path alias

`tsconfig.json`:

```json
"paths": { "@/*": ["./*"] }
```

Contoh import:

```ts
import { supplierApi } from '@/lib/api';
import { SupplierItem } from '@/types/supplier';
```

---

## 13. Script dan Quality Check

Sebelum commit, minimal jalankan:

```bash
cd frontend
npx tsc --noEmit
npx eslint app components lib types
npm run build
```

Kondisi terakhir:

- `npx tsc --noEmit` ✅
- `npx eslint` untuk file yang diubah ✅
- `npm run build` ✅ (Next.js 16.3.2)
- Build hanya mengeluarkan warning deprecation `middleware` → `proxy`.

Tidak ada test otomatis. Pengujian manual memerlukan backend + PostgreSQL aktif.

---

## 14. Batasan dan TODO

### Prioritas tinggi

1. **Backend belum punya global auth guard.**
   Route guard frontend hanya melindungi UI. Endpoint backend masih bisa dipanggil langsung tanpa JWT. Perlu `APP_GUARD` JWT + role guard di NestJS.

2. **Penyimpanan JWT di localStorage.**
   Rentan XSS. Idealnya backend mengeset cookie `HttpOnly`, `Secure`, `SameSite`, dan frontend tidak menyimpan token.

### Prioritas menengah

3. **Halaman masih mock/lokal:** `/pra-dry-kiln`, `/stock-reports`, `/customers`, `/sales`, `/accounts`, `/manager-dashboard`, dan sebagian `/settings`.
4. **`/settings` memakai data hardcoded** dan export/backup simulasi.
5. **Tombol mati:** `Forgot?`, `Technical Support`, search & notifikasi Header, “Export PDF” di beberapa halaman, pagination tabel.
6. **`mjm_redirect` open redirect:** nilai `//domain-lain` lolos `startsWith('/')`. Validasi harus memastikan path diawali satu `/` dan bukan `//`.
7. **Reason redirect tidak ditampilkan:** `/login?reason=expired` dan `?reason=timeout` belum memberi pesan khusus.
8. **Tidak ada endpoint `/auth/me`:** profil hanya dari respons login; perubahan role/nama di database baru terlihat setelah login ulang.
9. **Supplier delete bisa gagal FK** jika supplier dipakai transaksi pembelian/pengajuan. Tangani error 409/500 dengan pesan khusus atau soft delete.
10. **Edit batch Sawmill belum persisten.** Backend hanya menyimpan `stage`/`statusSawmill`/`kodeSawmill` pada `PATCH /sawmill/:id`; perubahan dimensi/supplier masih lokal. Perlu penyesuaian service backend bila edit penuh diinginkan.
11. **Cookie sesi belum `Secure`** dan belum `HttpOnly`; hanya role, tetapi tetap perlu diperkuat untuk production.
12. **`middleware.ts` deprecated di Next 16.** Migrasi ke `proxy.ts` dengan export `proxy` (perilaku sama):
    ```bash
    npx @next/codemod@canary middleware-to-proxy .
    ```
13. **Dua sumber aturan role/navigasi:** `ROLE_ACCESS` di `lib/session.ts`, `routeTitleMap` di Header, dan `navConfig` di Sidebar harus diperbarui bersamaan saat menambah halaman.
14. **`StatCard` dan `ConfirmModal` belum dipakai**; bisa dihapus atau diadopsi agar konsisten.

### Prioritas rendah

15. Duplikasi tipe `PlankGrade` dan role.
16. `types/inventory.ts` sudah legacy dan berpotensi membingungkan.
17. Tabel merender semua data; pagination belum memotong array.
18. Tidak ada unit/E2E test.

---

## 15. Troubleshooting

### “Tidak bisa menghubungi backend di http://localhost:3001”

- Pastikan backend berjalan: `cd backend && npm run start:dev`.
- Cek `NEXT_PUBLIC_API_URL` di `.env.local`.
- Pastikan PostgreSQL aktif dan `DATABASE_URL` backend benar.
- Pastikan CORS backend mengizinkan origin frontend (`http://localhost:3000`).

### Login selalu 401

- Cek username/password.
- Pastikan user ada di database dan password di-hash bcrypt.
- Cek `JWT_SECRET` backend.
- Melihat respons backend di Network tab; pesan `Username atau password salah` berasal dari backend.

### Login berhasil tetapi muncul “Role akun ... tidak dikenali”

- Nama role di tabel `role` tidak cocok dengan `manager` / `admin_kantor` / `admin_lapangan`.
- Perbaiki data role atau tambahkan mapping di `normalizeRole()`.
- Frontend sengaja fail-closed: sesi tidak disimpan jika role tidak dikenal.

### Redirect loop ke `/login`

- Cookie `mjm_session` dan localStorage `mjm_session_user` tidak sinkron.
- Buka DevTools → Application → hapus cookie/localStorage berprefix `mjm_`, lalu login ulang.
- Pastikan tidak ada ekstensi yang memblokir cookie.

### Baru simpan data, refresh hilang

- Kemungkinan halaman memakai fallback lokal karena request backend gagal.
- Buka Network tab, cek status request (400/401/500) dan body payload.
- Payload Log/Sawmill sudah dipetakan di `lib/api.ts`; jika masih 400, periksa kembali nama field DTO backend dan nilai wajib seperti `asalSortimen`/`gradePapan`.

### 403 Forbidden

- JWT valid tetapi role tidak berhak.
- Backend belum punya guard role; 403 biasanya berasal dari guard yang ditambahkan kemudian.
- Cek `ROLE_ACCESS` dan role di JWT/database.

### Hapus supplier gagal 500

- Supplier kemungkinan direferensikan `TransaksiPembelian` atau `PengajuanPerubahanSupplier`.
- Backend saat ini hard delete; pertimbangkan soft delete (`deletedAt`) atau tangani error dengan pesan ramah.

### Build warning `middleware` deprecated

- Normal di Next.js 16.
- Migrasi ke `proxy.ts` seperti pada TODO.

### `ECONNREFUSED 127.0.0.1:5432`

- PostgreSQL belum berjalan.
- Jalankan service PostgreSQL atau container yang disediakan, lalu cek `DATABASE_URL`.

---

## 16. Riwayat Perubahan Frontend

| Tanggal | Commit | Perubahan |
|---|---|---|
| 2026-11-03 | *(working tree)* | RBAC per aksi terpusat di `lib/permissions.ts`: create/update/delete Log, Sawmill/Plank, Dry Kiln, Pra Dry Kiln, Supplier, Customer, Sales, Stock, Quick Entry, dan Data Management dibatasi sesuai role |
| 2026-11-02 | `26d6dcf` | Perbaikan payload Log (master-data + dashboard quick entry), payload create batch/plank Sawmill, normalisasi respons plank, dan RBAC manager Sawmill via `useSessionUser()` |
| 2026-10-25 | `0b62d93` | Sinkronisasi modul Supplier dengan API backend: mapper `idSupplier/namaSupplier/alamatSupplier/kontakSupplier`, create/update/delete, form dan tabel disesuaikan |
| 2026-10-25 | `849cb6b` | Login memakai `POST /auth/login`, simpan JWT, kirim Bearer token, normalisasi role |
| 2026-10-20 | `c4a5c19` | Sinkronisasi form dan tabel Log, Sawmill, Dry Kiln ke backend |
| 2026-10-20 | `ffdd824` | API client dan tipe data Log, Sawmill, Dry Kiln |
| 2026-10-20 | `f99e842` | Fitur hamburger untuk tablet/HP |
| 2026-10-02 | `0f29e3b` | Status aktif/nonaktif supplier dan route guard |
| 2026-10-02 | `351eff3` | Integrasi supplier, autentikasi, sesi, kredensial |
| 2026-10-01 | `2164856` | Integrasi awal supplier |
| 2026-09-19 | `2512246` | Prisma, config, env |
| 2026-09-17 | `360e14f` | Simpan tanggal ISO dan proteksi route |
| 2026-09-04 | `35e9611`, `45a6b89` | Frontend awal |

---

## 17. Referensi File Penting

### Frontend

| File | Kenapa penting |
|---|---|
| `lib/api.ts` | Semua endpoint, timeout, auth header, error handling, mapper Supplier/Log/Sawmill/Plank |
| `lib/permissions.ts` | Matriks izin aksi per role dan helper `can()` |
| `lib/session.ts` | `AppRole`, `ROLE_LABELS`, `ROLE_ACCESS`, normalisasi role, storage sesi |
| `middleware.ts` | Guard route berdasarkan cookie role |
| `components/AppShell.tsx` | Shell, guard client, inactivity logout |
| `lib/useInactivityLogout.ts` | Timeout inactivity |
| `lib/useSessionUser.ts` | Hook sesi reaktif |
| `app/login/page.tsx` | Alur login nyata |
| `app/suppliers/page.tsx` | Contoh CRUD live yang sudah benar |
| `types/supplier.ts` | Model supplier yang sudah selaras backend |

### Backend (sumber kontrak)

| File | Isi |
|---|---|
| `backend/src/main.ts` | CORS + ValidationPipe (`whitelist`, `forbidNonWhitelisted`) |
| `backend/src/app.module.ts` | Daftar modul; belum ada global guard |
| `backend/src/auth/auth.service.ts` | Bentuk respons login + role uppercase |
| `backend/src/supplier/*` | Controller, service, DTO supplier |
| `backend/src/log/*` | Controller, service, DTO log |
| `backend/src/sawmill/*` | Controller, service, DTO sawmill/plank |
| `backend/src/dry-kiln/*` | Controller, service, DTO dry kiln |
| `backend/prisma/schema.prisma` | Model dan constraint database |

---

## 18. Panduan Menambah Halaman / Endpoint

### Menambah halaman baru

1. Buat `app/<route>/page.tsx` dengan `'use client'` bila interaktif.
2. Tambahkan path ke `ROLE_ACCESS` di `lib/session.ts` (atau `null` untuk semua role login).
3. Tambahkan judul di `routeTitleMap` (`components/Header.tsx`).
4. Tambahkan menu di `navConfig` (`components/Sidebar.tsx`), gunakan `managerOnly` bila perlu.
5. Gunakan `useSessionUser()` + `can(role, permission)` dari `lib/permissions.ts` untuk conditional UI per aksi. Tambahkan permission baru ke matriks bila perlu.
6. Tambahkan komponen domain di `components/<domain>/` bila form/tabel cukup besar.

### Menambah endpoint API

1. Tambahkan tipe respons/request di `types/`.
2. Tambahkan method di `lib/api.ts` memakai `request<T>()`.
3. Jika bentuk backend berbeda, buat mapper eksplisit (contoh `mapBackendSupplier`).
4. Kirim hanya field yang ada di DTO backend.
5. Tangani error dengan `getApiErrorMessage`.
6. Tambahkan loading/error state di halaman.
7. Uji dengan backend + PostgreSQL aktif, lalu `npx tsc --noEmit`, `npm run lint`, `npm run build`.

### Checklist sebelum commit

- [ ] Tidak ada `console.log`/`console.warn` baru yang tidak perlu.
- [ ] `npx tsc --noEmit` lolos.
- [ ] `npm run lint` lolos.
- [ ] `npm run build` lolos.
- [ ] Data benar-benar tersimpan setelah refresh (bukan hanya state lokal).
- [ ] Role manager tidak melihat aksi tulis yang seharusnya read-only.
- [ ] Error backend tampil dengan pesan yang bisa dipahami user.
- [ ] Tidak ada field di luar DTO yang dikirim ke backend.
