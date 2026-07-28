# Aplikasi Kuesioner dengan Google OAuth

Aplikasi ini merupakan sistem kuesioner berbasis **Next.js**, **Prisma ORM**, dan **PostgreSQL (Neon)**. Pengguna umum dapat mengisi kuesioner tanpa perlu login, sedangkan halaman **Dashboard Admin** dilindungi menggunakan autentikasi **Google OAuth** melalui **Auth.js (NextAuth v5)**.


<img  height="380" alt="Screenshot (183)" src="https://github.com/user-attachments/assets/d8f12cf4-ef3c-49bd-83aa-e36c67b2766a" />
<img  height="380" alt="Screenshot (178)" src="https://github.com/user-attachments/assets/5acd48c4-2015-4448-8c38-1daa80f66a80" />
<img  height="380" alt="Screenshot (180)" src="https://github.com/user-attachments/assets/67e31412-2c15-4d52-a8a1-90793003c80d" />
<img  height="380" alt="Screenshot (181)" src="https://github.com/user-attachments/assets/2b3f1f8b-07db-4a9e-9406-c87d8c09aed0" />
<img  height="380" alt="Screenshot (184)" src="https://github.com/user-attachments/assets/50221d3d-f7c5-465f-a99e-b6c6b6435ee6" />

---
*.env di zip


# Fitur Aplikasi

- Pengguna dapat mengisi kuesioner tanpa login.
- Upload gambar dan screenshot sebagai lampiran masukan.
- Dashboard admin untuk melihat hasil kuesioner.
- Login admin menggunakan akun Google.
- Pembatasan akses dashboard berdasarkan daftar email admin.
- Export hasil kuesioner.
- Logout admin.

---

# Instalasi

1. Clone repository

```bash
git clone <repository-url>
```

2. Masuk ke folder project

```bash
cd kuesioner-app
```

3. Install seluruh dependency

```bash
npm install
```

---

# Konfigurasi Environment

Salin file `.env.example` menjadi `.env`, kemudian isi seluruh variabel berikut.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

AUTH_SECRET="secret_acak"

AUTH_URL="http://localhost:3000"

AUTH_GOOGLE_ID="client_id_google"

AUTH_GOOGLE_SECRET="client_secret_google"

ADMIN_EMAILS="admin@gmail.com,dosen@gmail.com"
```

## Penjelasan Variabel Environment

| Variabel | Fungsi |
|----------|--------|
| DATABASE_URL | Digunakan Prisma untuk terhubung ke database PostgreSQL (Neon). |
| AUTH_SECRET | Secret yang digunakan Auth.js untuk mengenkripsi session JWT. |
| AUTH_URL | URL dasar aplikasi ketika proses autentikasi berlangsung. |
| AUTH_GOOGLE_ID | Client ID Google OAuth yang diperoleh dari Google Cloud Console. |
| AUTH_GOOGLE_SECRET | Client Secret Google OAuth yang diperoleh dari Google Cloud Console. |
| ADMIN_EMAILS | Daftar email yang diizinkan mengakses dashboard admin. Jika lebih dari satu email dipisahkan dengan tanda koma (,). |

Contoh:

```env
ADMIN_EMAILS="admin@gmail.com,dosen@gmail.com"
```

> **Catatan**
>
> Nama variabel mengikuti standar yang digunakan oleh **Auth.js** dan **Prisma**. Nama variabel dapat disesuaikan apabila menggunakan library lain, namun pada implementasi ini menggunakan nama bawaan library agar lebih mudah dikonfigurasi.

---

# Konfigurasi Google OAuth

1. Masuk ke **Google Cloud Console**.
2. Buat **OAuth Client ID** dengan tipe **Web Application**.
3. Tambahkan Authorized JavaScript Origin:

```
http://localhost:3000
```

4. Tambahkan Authorized Redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

5. Salin Client ID dan Client Secret ke file `.env`.

---

# Migrasi Database

Generate Prisma Client

```bash
npx prisma generate
```

Sinkronkan schema ke database

```bash
npx prisma db push
```

Apabila menggunakan migration Prisma

```bash
npx prisma migrate deploy
```

atau

```bash
npx prisma migrate dev
```

---

# Menjalankan Aplikasi

Jalankan server development

```bash
npm run dev
```

Aplikasi dapat diakses melalui

```
http://localhost:3000
```

---

# Alur Penggunaan

## Pengguna Umum

1. Membuka halaman utama.
2. Mengisi nama.
3. Mengisi masukan.
4. Mengunggah gambar atau screenshot (opsional).
5. Menekan tombol **Kirim Masukan**.

Pengguna tidak perlu login.

---

## Admin

1. Membuka halaman

```
http://localhost:3000/login
```

2. Login menggunakan akun Google.

3. Sistem memeriksa apakah email terdapat pada variabel

```
ADMIN_EMAILS
```

4. Jika email terdaftar, pengguna diarahkan ke

```
/admin
```

5. Jika email tidak terdaftar, maka pengguna akan menerima pesan

```
Akun Anda tidak memiliki akses sebagai admin.
```

---

# Perubahan yang Dilakukan

Implementasi pada tugas ini menambahkan mekanisme autentikasi dan otorisasi admin menggunakan Google OAuth.

Perubahan yang dilakukan meliputi:

- Menambahkan autentikasi Google menggunakan Auth.js (NextAuth v5).
- Menambahkan halaman login admin (`/login`).
- Menambahkan validasi email admin menggunakan variabel `ADMIN_EMAILS`.
- Menambahkan proteksi halaman `/admin`.
- Menambahkan proteksi endpoint API admin.
- Menambahkan tombol logout pada dashboard admin.
- Memastikan halaman kuesioner tetap dapat diakses tanpa login.

---

# Endpoint yang Diproteksi

Endpoint berikut hanya dapat diakses oleh admin yang telah login.

- `/admin`
- `/api/admin/export`
- `/api/admin/summary`
- `/api/admin/submissions/[id]/file`

Apabila pengguna belum login maka sistem mengembalikan status:

```
401 Unauthorized
```

Apabila pengguna telah login tetapi bukan admin maka sistem mengembalikan status:

```
403 Forbidden
```

---

# Halaman Publik

Halaman berikut tetap dapat diakses tanpa login.

- `/`
- `/api/questions`
- `/api/submit`

---

# File yang Dimodifikasi

Implementasi autentikasi dilakukan dengan melakukan perubahan pada beberapa file berikut.

| File | Perubahan |
|------|-----------|
| `auth.ts` | Konfigurasi Auth.js, Google OAuth, session JWT, dan validasi `ADMIN_EMAILS`. |
| `app/login/page.tsx` | Menambahkan halaman login menggunakan akun Google. |
| `app/admin/page.tsx` | Menambahkan proteksi dashboard admin berdasarkan session pengguna. |
| `app/api/auth/[...nextauth]/route.ts` | Endpoint autentikasi Auth.js. |
| `app/api/admin/export/route.ts` | Menambahkan validasi autentikasi dan otorisasi admin. |
| `app/api/admin/summary/route.ts` | Menambahkan validasi autentikasi dan otorisasi admin. |
| `app/api/admin/submissions/[id]/file/route.ts` | Menambahkan validasi autentikasi dan otorisasi admin. |

---

# Teknologi yang Digunakan

- Next.js 16
- React 19
- Prisma ORM
- PostgreSQL (Neon)
- Auth.js (NextAuth v5)
- Google OAuth 2.0

---

# Pengujian

Pengujian yang dilakukan meliputi:

- ✅ Login menggunakan akun Google.
- ✅ Admin berhasil mengakses dashboard.
- ✅ Email yang tidak terdaftar pada `ADMIN_EMAILS` ditolak.
- ✅ Dashboard admin hanya dapat diakses setelah login.
- ✅ Logout berhasil mengakhiri session.
- ✅ Pengguna umum tetap dapat mengisi kuesioner tanpa login.
