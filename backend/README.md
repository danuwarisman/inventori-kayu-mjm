<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).



# Backend Documentation — Sistem Inventori Kayu MJM

Dokumentasi ini menjadi acuan integrasi antara frontend dan backend Sistem Informasi Inventori Kayu PT. Margi Jati Makmur (MJM).

## 1. Informasi Backend

| Komponen | Keterangan |
|---|---|
| Framework | NestJS 11 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| API Port | 3001 |
| API Base URL (Local) | `http://localhost:3001` |
| Authentication | JWT |
| Format komunikasi | REST API |
| Content-Type | `application/json` |

## 2. Menjalankan Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run start:dev
```

Backend berjalan pada:

```text
http://localhost:3001
```

Pastikan database PostgreSQL sudah aktif dan konfigurasi koneksi database tersedia pada file `.env`.

## 3. Authentication

Sistem menggunakan autentikasi JWT untuk mengamankan endpoint API.

### Login

Endpoint:

```http
POST /auth/login
```

Frontend mengirimkan kredensial pengguna untuk mendapatkan token autentikasi.

Setelah login berhasil:
- Frontend menyimpan token autentikasi.
- Token digunakan untuk mengakses endpoint yang dilindungi.
- Token dikirim melalui HTTP header.

Format header:

```http
Authorization: Bearer <token>
```

### Session

- Masa berlaku JWT: 7 hari.
- Endpoint yang dilindungi membutuhkan token valid.
- Jika token tidak valid atau kedaluwarsa, backend menolak permintaan.

## 4. Role dan Hak Akses

Sistem menggunakan dua role utama:

| Role | Hak Akses |
|---|---|
| ADMIN | Pengelolaan operasional, master data, pembelian, produksi, dan penjualan |
| MANAGER | Persetujuan transaksi pembelian dan penjualan serta fitur manajerial |

Frontend harus menyesuaikan tampilan menu dan tindakan berdasarkan role pengguna.

**Catatan:** Hak akses setiap endpoint mengikuti konfigurasi RolesGuard pada backend. Detail per endpoint akan dicantumkan pada dokumentasi API.

## 5. Alur Bisnis Sistem

### 5.1 Master Data Log

1. Admin memasukkan data kayu log.
2. Admin memilih supplier.
3. Admin memasukkan sortimen, panjang, dan diameter.
4. Backend menghitung volume log.
5. Data disimpan sebagai StokLog dengan status awal `Log`.

### 5.2 Pembelian

Alur pembelian:

```text
Admin membuat transaksi pembelian
              |
              v
Admin mengajukan pembelian
              |
              v
Manager memeriksa transaksi
              |
       +------+------+
       |             |
    DISETUJUI      DITOLAK
       |             |
       v             v
Buat StokLog      Tidak membuat
otomatis          StokLog
       |
       v
Stok tercatat
```

Ketentuan:
- Pembelian dibuat oleh Admin.
- Manager bertugas menyetujui atau menolak pembelian.
- Jika disetujui, backend otomatis membuat StokLog berdasarkan item pembelian.
- Setiap StokLog terhubung dengan transaksi pembelian asal.
- Jika ditolak, backend tidak membuat StokLog.
- Transaksi yang sudah diproses tidak dapat diproses kembali.

### 5.3 Sawmill

1. Admin memilih log yang akan diproses.
2. Log dialihkan ke proses Sawmill.
3. Admin mencatat proses pemotongan.
4. Hasil pemotongan dicatat sebagai Plank.
5. Backend menyimpan relasi antara proses Sawmill, log, dan hasil plank.

### 5.4 Pra Dry-Kiln

1. Admin mengelola plank yang akan dikeringkan.
2. Plank ditata dan dikelompokkan ke dalam batch palet.
3. Data palet dan plank disimpan melalui backend.
4. Plank yang siap dikeringkan dapat diteruskan ke Dry-Kiln.

### 5.5 Dry-Kiln

1. Admin memasukkan plank ke antrean Dry-Kiln.
2. Backend menyimpan data proses pengeringan.
3. Hasil pengeringan dicatat pada data Hasil Dry-Kiln.
4. Plank yang telah memenuhi ketentuan proses dapat masuk ke inventori siap jual.

### 5.6 Penjualan

1. Admin membuat transaksi penjualan.
2. Admin memilih customer dan produk.
3. Admin menambahkan detail item penjualan.
4. Manager melakukan persetujuan atau penolakan.
5. Perubahan stok mengikuti hasil persetujuan transaksi sesuai implementasi backend.

## 6. Daftar Endpoint API

Endpoint berikut merupakan endpoint yang sudah teridentifikasi dari implementasi dan pengujian sebelumnya.

| Modul | Method | Endpoint | Keterangan |
|---|---|---|---|
| Auth | POST | `/auth/login` | Login pengguna |
| Log | GET | `/log` | Mengambil seluruh data log |
| Log | GET | `/log/:id` | Mengambil detail log |
| Log | POST | `/log` | Membuat data log |
| Log | PATCH | `/log/:id` | Memperbarui data log |
| Log | DELETE | `/log/:id` | Menghapus data log |
| Pembelian | POST | `/pembelian` | Membuat transaksi pembelian |
| Pembelian | POST | `/pembelian/:id/approval` | Persetujuan atau penolakan pembelian |

**Penting:** Daftar ini belum merupakan daftar seluruh endpoint backend. Endpoint Supplier, Customer, Sawmill, Plank, Palet, Dry-Kiln, Penjualan, dan lainnya akan dilengkapi setelah audit controller.

## 7. Format Request dan Response

Secara umum, frontend mengirimkan request menggunakan HTTP method yang sesuai dengan endpoint.

Contoh request dengan autentikasi:

```javascript
fetch(`${API_BASE_URL}/log`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

Contoh pengiriman data:

```javascript
fetch(`${API_BASE_URL}/pembelian`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

Struktur request dan response setiap endpoint akan didokumentasikan berdasarkan DTO, controller, service, dan hasil pengujian aktual.

## 8. HTTP Status dan Error Handling

Frontend perlu menangani respons backend dengan baik.

| Status | Makna |
|---|---|
| 200 | Request berhasil |
| 201 | Data berhasil dibuat |
| 400 | Request atau validasi data tidak sesuai |
| 401 | Belum login atau token tidak valid |
| 403 | Tidak memiliki hak akses |
| 404 | Data atau endpoint tidak ditemukan |
| 500 | Terjadi kesalahan internal server |

Pesan error dari backend sebaiknya ditampilkan secara informatif pada frontend.

## 9. Konfigurasi Frontend

Frontend menggunakan base URL backend sebagai alamat komunikasi API.

Contoh konfigurasi:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Pastikan nama environment variable yang digunakan sesuai dengan implementasi frontend.

Untuk pengembangan lokal:
- Jalankan backend pada port 3001.
- Jalankan frontend pada port 3000.
- Pastikan kedua aplikasi dapat saling berkomunikasi.
- Pastikan CORS backend mengizinkan origin frontend.

## 10. Catatan Integrasi

1. Frontend tidak boleh mengasumsikan transaksi berhasil sebelum menerima respons backend.
2. Gunakan token JWT untuk endpoint yang memerlukan autentikasi.
3. Tampilan dan tindakan harus mengikuti role pengguna.
4. Perubahan stok mengikuti proses bisnis yang dijalankan backend.
5. Jangan membuat perhitungan atau perubahan status sendiri jika backend sudah menangani proses tersebut.
6. Gunakan struktur request dan response aktual dari backend.
7. Jika terdapat perubahan endpoint atau DTO, dokumentasi ini harus diperbarui.

## 11. Status Kelengkapan Dokumentasi

Bagian berikut akan dilengkapi secara bertahap berdasarkan hasil audit backend:

- [x] Informasi backend dan cara menjalankan server.
- [x] Authentication dan role secara umum.
- [x] Alur bisnis pembelian dan pembuatan StokLog.
- [x] Beberapa endpoint yang sudah teridentifikasi.
- [ ] Dokumentasi lengkap endpoint dan DTO.
- [ ] Dokumentasi request dan response setiap modul.
- [ ] Dokumentasi relasi database.
- [ ] Dokumentasi alur Sawmill dan Pra Dry-Kiln.
- [ ] Dokumentasi alur Dry-Kiln.
- [ ] Dokumentasi transaksi penjualan.
- [ ] Dokumentasi SQL View, Trigger, Procedure, dan Function.
- [ ] Dokumentasi hasil pengujian API.