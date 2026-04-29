# TaskGo — Home Service Platform

TaskGo adalah aplikasi web berbasis **Express.js, EJS, PostgreSQL, dan Sequelize** untuk mempertemukan buyer dengan seller penyedia jasa rumahan. Aplikasi ini memiliki tiga role utama, yaitu **admin**, **seller**, dan **buyer**. Buyer dapat mencari layanan, melakukan booking, melihat invoice, dan mengunggah bukti pembayaran. Seller dapat mengelola layanan, memproses booking, membuat invoice, dan memverifikasi pembayaran. Admin dapat mengelola master item, user, dan memantau invoice.

---

## Fitur Utama

### Public & Authentication

- Landing page aplikasi
- Register user baru
- Login menggunakan email atau username
- Logout
- Session-based authentication
- Role-based authorization untuk admin, seller, dan buyer

### Admin

- Dashboard admin
- CRUD master item layanan
- CRUD user
- Melihat daftar invoice
- Melihat detail invoice

### Seller

- Setup dan edit profil seller
- Mengelola layanan/jasa yang ditawarkan
- Menambahkan layanan berdasarkan master item
- Melihat daftar booking dari buyer
- Approve atau reject booking
- Menyelesaikan booking
- Membuat invoice untuk booking yang sudah selesai
- Melihat invoice yang diterbitkan
- Melihat pembayaran dari buyer
- Konfirmasi atau tolak pembayaran

### Buyer

- Setup dan edit profil buyer
- Melihat dan mencari layanan yang tersedia
- Filter layanan berdasarkan item/kategori
- Membuat booking layanan
- Melihat daftar dan detail booking
- Membatalkan booking yang masih bisa dibatalkan
- Melihat invoice
- Upload bukti pembayaran
- Melihat riwayat pembayaran

---

## Instalasi

Clone repository:

```bash
git clone https://github.com/brahmantiodiaz/TaskGo.git
cd TaskGo
```

Install dependencies:

```bash
npm install
```

---

## Konfigurasi Environment

Buat file `.env` berdasarkan `.env.example`:

```bash
cp .env.example .env
```

Isi konfigurasi berikut:

```env
PORT=3000

DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=taskgo_db
DB_HOST=127.0.0.1
DB_DIALECT=postgres

SESSION_SECRET=your_session_secret
```

> Catatan: jangan upload file `.env` ke repository public. Gunakan `.env.example` sebagai contoh konfigurasi.

---

## Menjalankan Database

Buat database:

```bash
npx sequelize-cli db:create
```

Jalankan migration:

```bash
npx sequelize-cli db:migrate
```

Jalankan seeder:

```bash
npx sequelize-cli db:seed:all
```

Rollback seeder jika diperlukan:

```bash
npx sequelize-cli db:seed:undo:all
```

Rollback migration jika diperlukan:

```bash
npx sequelize-cli db:migrate:undo:all
```

---

## Menjalankan Aplikasi

Mode development:

```bash
npm run dev
```

```js
const AuthController = require("../controller/authController");
```

Selain itu, pastikan folder berikut tersedia agar upload file berjalan lancar:

```txt
public/uploads
```

---

## Author

Created by **Brahmantio Diaz**.
