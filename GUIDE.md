# Panduan Penggunaan Sistem Inventori Kayu — PT. Margi Jati Makmur

Selamat datang di Sistem Informasi Inventori Kayu PT. Margi Jati Makmur (MJM). Dokumen ini berisi panduan praktis dan sederhana mengenai cara menggunakan fitur-fitur utama sistem, alur kerja operasional kayu (dari bahan baku hingga penjualan), serta fitur otomatisasi antar-tahap produksi.

---

## 1. Peran Pengguna (Roles) & Hak Akses

Sistem menggunakan **2 peran resmi**:

| Peran | Pengguna | Tugas & Kewenangan Utama |
|---|---|---|
| **Admin** | Staf Operasional Lapangan & Pengadaan | • Mencatat bahan baku kayu log baru di **Master Data**.<br>• Mengelola pemotongan kayu di **Sawmill** & rincian papan (*plank*).<br>• Menata palet kayu di **Pra Dry-Kiln** & memasukkan ke antrean oven **Dry-Kiln**.<br>• Mengelola data **Supplier** & **Customer**.<br>• Membuat pesanan pembelian kayu (*Purchase Order*) & pesanan penjualan (*Sales*).<br>• Melakukan input cepat via *Quick Log Entry* di Dashboard Operasional. |
| **Manager** | Pimpinan / Manajer Operasional | • Memantau performa finansial di **Executive Manager Dashboard** (pendapatan, laba bersih, pengeluaran, tagihan pending, piutang).<br>• Melakukan verifikasi dan persetujuan (**Approve** / **Reject**) transaksi pembelian & penjualan.<br>• Mengelola akun pengguna di **Account Management**.<br>• Mengakses fitur ekspor dan *backup data*. |

---

## 2. Alur Operasional Produksi Kayu (End-to-End Workflow)

Aplikasi menghubungkan setiap tahapan pengolahan kayu secara terintegrasi:

```
[Master Data Log]  ──(Tombol "Ke Sawmill")──>  [Sawmill / Pemotongan]
                                                       │
                                                       ▼
[Dry-Kiln Oven]    <──(Tombol "Ke Oven")─────  [Pra Dry-Kiln / Palet]
       │
       ▼
[Kayu Siap Jual / Stock Reports] ────────────> [Penjualan / Sales]
```

---

### Tahap 1: Penerimaan & Input Kayu Log (`/master-data`)
1. Buka menu **Master Data**.
2. Klik tombol **"+ New Log"** untuk mencatat log kayu baru yang tiba di pabrik.
3. Masukkan Sortimen (Sortimen A, B, atau C), Panjang (cm), Diameter (cm), dan pilih Supplier. Volume kubikasi ($m^3$) akan dihitung secara otomatis oleh sistem:
   $$\text{Volume Log} = \frac{\pi}{4} \times \left(\frac{\text{Diameter}}{200}\right)^2 \times \left(\frac{\text{Panjang}}{100}\right)$$
4. Log yang tersimpan akan masuk ke tabel dengan status tahap awal: `Log`.

---

### Tahap 2: Pengalihan Otomatis ke Sawmill (`Tombol "Ke Sawmill"`)
1. Saat kayu log siap dibelah, cari baris kayu tersebut di tabel **Master Data**.
2. Klik tombol warna oranye bertuliskan **"Ke Sawmill"**.
3. **Otomatisasi Sistem:**
   - Status kayu log langsung dialihkan menjadi `Sawmill` / `in-sawmill`.
   - Sistem membuka halaman `/sawmill` dan otomatis memunculkan modal produksi baru dengan data ID Log, Sortimen, Dimensi, Supplier, dan Harga yang **sudah terisi otomatis (*auto-filled*)**.

---

### Tahap 3: Pemotongan Menjadi Papan Kayu (`/sawmill`)
1. Di halaman **Sawmill**, Anda dapat melihat batch pemotongan log.
2. Klik ikon papan (*plank*) pada batch terkait untuk mencatat hasil pembelahan log menjadi papan.
3. Klik **"+ Tambah Plank"**, masukkan ukuran papan: Tebal (T), Lebar (W), Panjang (L), serta Grade papan (Grade A, B, atau C).
4. Volume papan ($m^3$) otomatis dihitung dengan rumus:
   $$\text{Volume Plank} = \frac{\text{Tinggi (cm)} \times \text{Lebar (cm)} \times \text{Panjang (cm)}}{1.000.000}$$

---

### Tahap 4: Penataan Palet Pra Dry-Kiln (`/pra-dry-kiln`)
1. Papan-papan kayu yang telah dibelah ditata di atas palet untuk persiapan pengeringan (*sticking*).
2. Di halaman **Pra Dry-Kiln**, klik **"+ New Batch"** untuk mendaftarkan palet papan kayu.
3. Papan yang sudah siap masuk pengeringan akan berstatus `pra-drykiln` atau `finish pra-drykiln`.

---

### Tahap 5: Pengiriman Otomatis ke Oven Pengeringan (`Tombol "Ke Oven"`)
1. Pada tabel papan di **Pra Dry-Kiln**, klik tombol **"Ke Oven"** (ikon api warna amber).
2. **Otomatisasi Sistem:**
   - Data papan langsung dikirim ke antrean oven **Dry-Kiln** (memanggil API oven dengan stage `in-drykiln`).
   - Status papan di Pra Dry-Kiln ter-update menjadi `finish pra-drykiln`.
   - Muncul notifikasi sukses berwarna hijau lengkap dengan tombol pintasan **"Buka Dry-Kiln"**.

---

### Tahap 6: Pengeringan Kayu di Dry-Kiln (`/dry-kiln`)
1. Buka menu **Dry-Kiln** untuk melihat daftar papan yang sedang atau telah melalui proses oven.
2. Informasi harga bahan baku kayu ditampilkan secara otomatis berdasarkan harga log asal.
3. Papan kayu yang telah selesai dikeringkan dan mencapai kadar air standar siap masuk ke inventori akhir (**Ready To Sale**).

---

## 3. Alur Pengadaan Bahan Baku / Pembelian (`/pembelian`)

Modul Pembelian mengelola *Purchase Order* (PO) dari supplier dengan alur ramping dua langkah:

1. **Pengajuan PO (Admin):**
   - Klik **"+ New Purchase Order"**, pilih Supplier dan tanggal transaksi.
   - Tambahkan item pesanan (sortimen, panjang, diameter, jumlah log, dan harga satuan per log). Subtotal dan total nilai PO dihitung seketika.
   - Setelah disimpan, status pesanan otomatis menjadi `Menunggu Approval` dan diajukan ke Manager.
2. **Persetujuan & Pencatatan Otomatis ke Stok Log (Manager - Proses Akhir):**
   - Manager memeriksa rincian PO.
   - Manager menekan **Approve (ACC)** untuk menyetujui transaksi, atau **Tolak** dengan alasan penolakan.
   - **Otomatis Masuk Inventori:** Begitu Manager menyetujui (ACC), pesanan langsung berstatus final `Disetujui (Stok Log)` dan kayu log langsung tercatat sebagai inventori Stok Log pabrik tanpa memerlukan tindakan "Terima Barang" tambahan dari Admin.

---

## 4. Fitur-Fitur Unggulan Lainnya

### A. Dashboard Operasional Live (`/dashboard`)
* Ringkasan metrik riil: Total Wood Logs, Processed Planks, Active Kilns, dan Total Customers yang tersambung langsung ke database backend.
* **Quick Log Entry:** Form entri kilat di sisi kanan dashboard untuk staf gudang mencatat log yang baru datang hanya dalam hitungan detik.

### B. Executive Manager Dashboard (`/manager-dashboard`)
* Visualisasi grafik perbandingan pendapatan vs pengeluaran, metrik laba bersih, piutang usaha, dan notifikasi stok menipis khusus untuk Manager.

### C. Ekspor Laporan Instan (PDF, CSV, Excel)
* Seluruh tabel modul utama (Master Data, Sawmill, Pra Dry-Kiln, Dry-Kiln, Stock Reports) dilengkapi tombol **"Export PDF"** yang siap dicetak atau disimpan sebagai dokumen arsip resmi.

---

## 5. Cara Menjalankan Sistem

### Akses Lokal (Development)
1. **Frontend:** Jalankan `cd frontend && npm run dev` (buka `http://localhost:3000`).
2. **Backend:** Jalankan `cd backend && npm run start:dev` (API di `http://localhost:3001`).

### Akses Deployment (Server & Remote)
* **Akses Publik (Bisa dibuka siapa saja dari HP / Laptop):**
  Buka tautan Cloudflare Tunnel:
  `https://conjunction-within-queens-bag.trycloudflare.com`
* **Akses Jaringan Tailscale:**
  Buka domain internal:
  `https://desktop-b4ll9vs.tail29d035.ts.net/`
