# Lucky Spin - User Documentation

## Overview

Lucky Spin adalah aplikasi web interaktif yang memungkinkan pengguna untuk bermain roda keberuntungan menggunakan kode kupon. Aplikasi ini dibangun dengan Next.js dan menggunakan SQLite sebagai database.

## Fitur Utama

### 🎯 Untuk Pengguna Umum
- **Spin Wheel**: Putar roda keberuntungan dengan memasukkan kode kupon
- **Hadiah Terjamin**: Setiap kupon memiliki hadiah yang sudah ditentukan (bukan random)
- **Interface Menarik**: Desain modern dengan animasi dan efek visual
- **Responsive Design**: Dapat diakses dari desktop maupun mobile

### 🛠️ Untuk Administrator
- **Manajemen Hadiah**: Tambah, edit, dan hapus hadiah
- **Manajemen Kupon**: Buat kupon dengan hadiah yang sudah ditentukan
- **Dashboard Admin**: Pantau aktivitas dan kelola sistem
- **Autentikasi**: Sistem login untuk mengamankan area admin

## Cara Menggunakan

### Untuk Pengguna

1. **Akses Aplikasi**
   - Buka browser dan kunjungi URL aplikasi
   - Halaman utama akan menampilkan roda keberuntungan

2. **Memasukkan Kode Kupon**
   - Masukkan kode kupon 5 karakter di kolom yang tersedia
   - Klik tombol "Spin" untuk memulai permainan

3. **Bermain**
   - Roda akan berputar secara otomatis
   - Tunggu hingga roda berhenti
   - Hadiah yang didapat akan ditampilkan dalam dialog popup

4. **Melihat Hasil**
   - Dialog akan menampilkan nama hadiah dan deskripsinya
   - Klik "Tutup" untuk menutup dialog

### Untuk Administrator

1. **Login Admin**
   - Akses `/admin` dari URL aplikasi
   - Masukkan kredensial admin yang valid

2. **Mengelola Hadiah**
   - **Tambah Hadiah Baru**:
     - Isi form "Tambah Hadiah"
     - Masukkan nama, deskripsi, kuantitas
     - Pilih kategori (Hadiah/Zonk)
     - Klik "Tambah"
   
   - **Edit Hadiah**:
     - Klik hadiah yang ingin diedit dari daftar
     - Form akan terisi otomatis
     - Ubah data yang diperlukan
     - Klik "Update"
   
   - **Hapus Hadiah**:
     - Klik tombol hapus (ikon tempat sampah) pada hadiah
     - Konfirmasi penghapusan

3. **Mengelola Kupon**
   - **Buat Kupon Baru**:
     - Klik "Generate Random" untuk membuat kode otomatis
     - Atau masukkan kode manual (5 karakter)
     - Pilih hadiah dari dropdown
     - Klik "Tambah"
   
   - **Edit Kupon**:
     - Klik kupon yang ingin diedit
     - Ubah kode atau hadiah yang terkait
     - Klik "Update"
   
   - **Hapus Kupon**:
     - Klik tombol hapus pada kupon
     - Konfirmasi penghapusan

## Struktur Database

### Tabel Prizes (Hadiah)
- `id`: ID unik hadiah
- `name`: Nama hadiah
- `description`: Deskripsi hadiah
- `quantity`: Jumlah hadiah (-1 untuk unlimited)
- `category`: Kategori (hadiah/zonk)
- `created_at`: Waktu pembuatan

### Tabel Coupons (Kupon)
- `id`: ID unik kupon
- `code`: Kode kupon (5 karakter)
- `prize_id`: ID hadiah yang terkait
- `is_used`: Status penggunaan kupon
- `created_at`: Waktu pembuatan

### Tabel Users (Pengguna)
- `id`: ID unik pengguna
- `username`: Nama pengguna
- `won_prize_id`: ID hadiah yang dimenangkan
- `used_coupon_id`: ID kupon yang digunakan
- `timestamp`: Waktu bermain

## Teknologi yang Digunakan

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: SQLite dengan better-sqlite3
- **Animasi**: Framer Motion, react-custom-roulette
- **Icons**: Lucide React
- **Notifications**: Sonner

## Instalasi dan Setup

### Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm, yarn, pnpm, atau bun

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd luckyspin-sekawan78
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   # atau
   bun install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   # atau
   bun dev
   ```

4. **Akses Aplikasi**
   - Buka browser dan kunjungi `http://localhost:3000`
   - Untuk admin: `http://localhost:3000/admin`

### Build untuk Production

```bash
npm run build
npm start
```

## Konfigurasi

### Environment Variables
Tidak ada environment variables khusus yang diperlukan untuk setup dasar.

### Database
Database SQLite akan dibuat otomatis di `database.sqlite` pada root project saat aplikasi pertama kali dijalankan.

## Troubleshooting

### Masalah Umum

1. **Roda tidak muncul**
   - Pastikan JavaScript diaktifkan di browser
   - Refresh halaman
   - Periksa console browser untuk error

2. **Kupon tidak valid**
   - Pastikan kode kupon benar (5 karakter)
   - Periksa apakah kupon sudah pernah digunakan
   - Hubungi admin jika masalah berlanjut

3. **Tidak bisa akses admin**
   - Pastikan kredensial login benar
   - Periksa URL admin (`/admin`)
   - Clear browser cache dan cookies

4. **Database error**
   - Pastikan file `database.sqlite` dapat ditulis
   - Restart aplikasi
   - Periksa permissions folder

### Error Codes
- `400`: Bad Request - Data input tidak valid
- `401`: Unauthorized - Tidak memiliki akses
- `404`: Not Found - Resource tidak ditemukan
- `500`: Internal Server Error - Error server

## Keamanan

- Autentikasi diperlukan untuk mengakses area admin
- Validasi input pada semua form
- Sanitasi data sebelum disimpan ke database
- CSRF protection melalui Next.js

## Kontribusi

Untuk berkontribusi pada project ini:
1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

© 2025 Sekawan78. Semua hak dilindungi.

## Support

Jika mengalami masalah atau memiliki pertanyaan, silakan hubungi tim development atau buat issue di repository.

---

**Catatan**: Dokumentasi ini akan terus diperbarui seiring dengan pengembangan aplikasi.