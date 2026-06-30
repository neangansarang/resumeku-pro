# DOCS.md — Admin Dashboard CV

Dokumentasi arsitektur, data flow, cara kerja, dan cara menjalankan Admin Dashboard untuk pengelolaan data CV Asep Septiadi.

---

## 1. Arsitektur Sistem

```
┌─────────────────────────────────────────────────┐
│              Browser (Frontend)                  │
│  index.html  →  js/cv-renderer.js  →  fetch()   │
└──────────────────────┬──────────────────────────┘
                       │ GET /data/data.json
                       ▼
┌─────────────────────────────────────────────────┐
│           Express Backend (Node.js)              │
│                                                   │
│  /admin/login    → Login page (session auth)     │
│  /admin/*        → Admin CRUD pages (HTML)       │
│  /api/*          → REST API endpoints             │
│  /data/data.json → Static JSON untuk frontend    │
│                                                   │
│  Sync: SQLite → data.json (auto di tiap CRUD)    │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│              Data Layer                          │
│                                                   │
│  data/resume.db  ← SQLite database (write)       │
│  data/data.json  ← Generated JSON (read-only)    │
└─────────────────────────────────────────────────┘
```

**Alur singkat:**
1. Admin login → CRUD data CV melalui dashboard
2. Backend menyimpan ke SQLite (`data/resume.db`)
3. Setiap perubahan, backend auto-generate `data/data.json`
4. Frontend publik fetch `/data/data.json` dan render

---

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend (existing) | HTML5, CSS3, Vanilla JavaScript |
| Backend (baru) | Node.js + Express.js |
| Database (baru) | SQLite via `better-sqlite3` |
| Session (baru) | express-session (cookie-based) |
| Password (baru) | bcryptjs |
| File Upload (baru) | multer |
| Admin UI (baru) | Tailwind CSS via CDN |

---

## 3. Struktur Direktori

```
resume-asep/
├── admin.js                  ← Runner: seed user + start server
├── package.json              ← Root scripts (admin, seed)
├── .gitignore                ← Ignore resume.db, node_modules
│
├── admin/                    ← Backend aplikasi
│   ├── package.json          ← Dependencies backend
│   ├── server.js             ← Entry point Express (port 3001)
│   ├── db.js                 ← Koneksi SQLite + schema 13 tabel
│   ├── sync-json.js          ← Logic sync SQLite → data.json
│   ├── seed.js               ← Seed admin user default
│   ├── seed-data.js          ← Seed initial CV data
│   ├── middleware/
│   │   └── auth.js           ← Session check middleware
│   ├── routes/
│   │   ├── auth.js           ← Login/logout routes
│   │   ├── api.js            ← REST CRUD endpoints
│   │   └── admin.js          ← Serve halaman HTML admin
│   └── views/                ← Halaman admin (Tailwind CSS)
│       ├── login.html
│       ├── dashboard.html
│       ├── profile.html
│       ├── contact.html
│       ├── social-media.html
│       ├── skills.html
│       ├── abilities.html
│       ├── experiences.html
│       ├── education.html
│       ├── certifications.html
│       ├── projects.html
│       └── awards.html
│
├── js/
│   ├── script.js             ← Blog data + page switching (existing)
│   └── cv-renderer.js        ← Render CV dari data.json (BARU)
│
├── data/
│   ├── resume.db             ← SQLite database (local, di-gitignore)
│   ├── resume.db-wal         ← SQLite WAL file (auto, di-gitignore)
│   ├── resume.db-shm         ← SQLite SHM file (auto, di-gitignore)
│   └── data.json             ← Generated JSON (committed ke git)
│
├── index.html                ← Frontend (dimodifikasi: rendering via JS)
├── css/style.css             ← Tidak berubah
└── src/images/               ← Tidak berubah
```

---

## 4. Data Model (SQLite Tables)

| Table | Fields | Deskripsi |
|---|---|---|
| `admin_users` | id, username, password_hash, created_at | Login admin |
| `profile` | id, name, title, bio, photo_path, updated_at | Data diri |
| `contact` | id, phone, email, location | Kontak |
| `social_media` | id, platform, url, icon, sort_order | Sosial media |
| `skills` | id, name, percentage, sort_order | Keahlian teknis |
| `abilities` | id, name | Soft skills |
| `experiences` | id, role, company, period_start, period_end, description, sort_order | Pengalaman kerja |
| `experience_bullets` | id, experience_id, text, sort_order | Poin detail (CASCADE delete) |
| `education` | id, degree, institution, gpa, period, description, sort_order | Pendidikan |
| `certifications` | id, name, issuer, link, sort_order | Sertifikasi |
| `projects` | id, name, description, tech_stack, link, sort_order | Proyek |
| `awards` | id, name, issuer, year, sort_order | Penghargaan |

### Relasi

```
experiences 1──* experience_bullets
  (CASCADE DELETE: hapus experience → bullets ikut terhapus)
```

---

## 5. Data Flow

### Flow Admin: Input → SQLite → JSON → Frontend

```
Admin login (POST /auth/login)
       │
       ▼
Dashboard CRUD (POST/PUT/DELETE /api/*)
       │
       ├── Simpan ke SQLite (data/resume.db)
       │
       └── Auto panggil syncJson()
               │
               ▼
       Baca semua tabel SQLite
               │
               ▼
       Generate data/data.json
               │
               ▼
       Frontend fetch(/data/data.json)
               │
               ▼
       js/cv-renderer.js render DOM
```

### Trigger Sync

| Event | Aksinya |
|---|---|
| CREATE / UPDATE / DELETE via API | Auto panggil `syncJson()` |
| Server start | Auto panggil `syncJson()` |
| Tombol "Sync ke JSON" di dashboard | Manual panggil `POST /api/sync` |

---

## 6. API Endpoints

Semua endpoint `API` membutuhkan session login (kecuali `/auth/login`).

### Authentication

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/auth/login` | Login (body: username, password) |
| `GET` | `/auth/logout` | Logout, redirect ke login |
| `GET` | `/auth/me` | Cek session (return username) |

### Profile & Contact

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/profile` | Ambil data profile |
| `PUT` | `/api/profile` | Update profile (name, title, bio, photo_path) |
| `GET` | `/api/contact` | Ambil data kontak |
| `PUT` | `/api/contact` | Update kontak (phone, email, location) |

### Social Media

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/social-media` | List semua |
| `POST` | `/api/social-media` | Tambah (platform, url, icon) |
| `PUT` | `/api/social-media/:id` | Update |
| `DELETE` | `/api/social-media/:id` | Hapus |

### Skills

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/skills` | List semua |
| `POST` | `/api/skills` | Tambah (name, percentage) |
| `PUT` | `/api/skills/:id` | Update |
| `DELETE` | `/api/skills/:id` | Hapus |

### Abilities

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/abilities` | List semua |
| `POST` | `/api/abilities` | Tambah (name) |
| `PUT` | `/api/abilities/:id` | Update |
| `DELETE` | `/api/abilities/:id` | Hapus |

### Experiences

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/experiences` | List semua + bullets |
| `POST` | `/api/experiences` | Tambah (role, company, period_start, period_end, description, bullets[]) |
| `PUT` | `/api/experiences/:id` | Update (bullets diganti seluruhnya) |
| `DELETE` | `/api/experiences/:id` | Hapus + cascade bullets |

### Education

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/education` | List semua |
| `POST` | `/api/education` | Tambah (degree, institution, gpa, period, description) |
| `PUT` | `/api/education/:id` | Update |
| `DELETE` | `/api/education/:id` | Hapus |

### Certifications

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/certifications` | List semua |
| `POST` | `/api/certifications` | Tambah (name, issuer, link) |
| `PUT` | `/api/certifications/:id` | Update |
| `DELETE` | `/api/certifications/:id` | Hapus |

### Projects

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/projects` | List semua |
| `POST` | `/api/projects` | Tambah (name, description, tech_stack, link) |
| `PUT` | `/api/projects/:id` | Update |
| `DELETE` | `/api/projects/:id` | Hapus |

### Awards

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/awards` | List semua |
| `POST` | `/api/awards` | Tambah (name, issuer, year) |
| `PUT` | `/api/awards/:id` | Update |
| `DELETE` | `/api/awards/:id` | Hapus |

### Utility

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/upload-photo` | Upload foto profil (multipart/form-data, field: photo) |
| `POST` | `/api/sync` | Manual sync database → data.json |

---

## 7. Cara Menjalankan

### Prasyarat

- Node.js v18+ dan npm

### 1. Install Dependencies

```bash
cd admin
npm install
cd ..
```

### 2. Seed Data (sekali, jika dari awal)

```bash
# Seed admin user
node admin/seed.js

# Seed data CV eksisting (import hardcoded data sebelumnya)
node admin/seed-data.js
```

Atau langsung sekali jalan:

```bash
node admin.js
```

Script `admin.js` akan melakukan seed user + start server secara berurutan.

### 3. Start Server

```bash
node admin.js
```

### 4. Akses

| Halaman | URL |
|---|---|
| Admin Dashboard | `http://localhost:3001/admin/login` |
| Public CV | `http://localhost:3001/` |

### Login Default

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

---

## 8. Format Data JSON

File `data/data.json` yang di-generate memiliki struktur berikut:

```json
{
  "profile": {
    "name": "Asep Septiadi",
    "title": "Software Engineer",
    "bio": "Deskripsi diri...",
    "photo_path": "src/images/photo_profile.jpg"
  },
  "contact": {
    "phone": "+62813 2409 1141",
    "email": "septiadi.imail@gmail.com",
    "location": "Jakasetia, Bekasi Selatan"
  },
  "social_media": [
    { "platform": "LinkedIn", "url": "https://linkedin.com/in/aspsptyd", "icon": "fab fa-linkedin-in" }
  ],
  "skills": [
    { "name": "JavaScript", "percentage": 90 }
  ],
  "abilities": ["Leadership", "Project Management"],
  "experiences": [
    {
      "role": "Senior Full Stack Developer",
      "company": "PT Tokopedia Teknologi",
      "period": "Jan 2022 - Sekarang",
      "period_start": "Jan 2022",
      "period_end": "Sekarang",
      "description": "",
      "bullets": [
        "Memimpin tim 5 engineer...",
        "Merancang arsitektur microservice..."
      ]
    }
  ],
  "education": [
    {
      "degree": "S1 Teknik Informatika",
      "institution": "Universitas Telkom",
      "gpa": "IPK: 3.72/4.00 - Cumlaude",
      "period": "2013 - 2017",
      "description": "Bandung"
    }
  ],
  "certifications": [
    { "name": "AWS Certified Solutions Architect", "issuer": "Amazon Web Services", "link": "" }
  ],
  "projects": [
    { "name": "E-Commerce Platform", "description": "...", "tech_stack": "Laravel, React, MySQL", "link": "" }
  ],
  "awards": [
    { "name": "Best Developer Award 2024", "issuer": "PT Tech Innovasi", "year": "2024" }
  ]
}
```

---

## 9. Git Strategy

| File | Status | Alasan |
|---|---|---|
| `data/resume.db*` | **Ignored** (`.gitignore`) | Database lokal, environment-specific |
| `admin/node_modules/` | **Ignored** (`.gitignore`) | Dependencies, install via npm |
| `data/data.json` | **Tracked** | Agar frontend tetap jalan di GitHub Pages tanpa backend |
| Semua file lain | **Tracked** | Source code |

**Penting:** Setiap selesai mengedit data via admin, `data.json` akan berubah. **Commit dan push `data/data.json`** agar versi terbaru CV tampil di GitHub Pages. Tanpa backend, frontend tetap bisa membaca `data.json` sebagai file statis.

---

## 10. Frontend Rendering

`js/cv-renderer.js` bekerja secara otomatis:

| Event | Aksi |
|---|---|
| `DOMContentLoaded` | Fetch `GET /data/data.json` |
| Data tersedia | Render sidebar, main content, right card |
| Data kosong | Render layout kosong (warning di console) |

**Tanpa server:** File `data.json` tetap bisa diakses langsung sebagai file statis di GitHub Pages (karena sudah di-commit ke repo). Frontend akan tetap render dengan data yang terakhir di-commit.

---

## 11. Maintenance

### Menambah/Mengubah Data
1. Buka `http://localhost:3001/admin/login`
2. Login dengan `admin / admin123`
3. Pilih section CV di sidebar kiri
4. Klik "Tambah" atau "Edit" pada item
5. Isi form, klik "Simpan"
6. `data.json` otomatis ter-update

### Reset Database
```bash
rm -f data/resume.db data/resume.db-wal data/resume.db-shm
node admin/seed.js
node admin/seed-data.js
node admin.js
```

### Ganti Password Admin
```bash
# Lewat SQLite langsung (setelah server mati)
cd admin
node -e "
const bcrypt = require('bcryptjs');
const { getDb, closeDb } = require('./db');
const db = getDb();
const hash = bcrypt.hashSync('password-baru-anda', 10);
db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hash, 'admin');
closeDb();
console.log('Password updated');
"
```

### Ubah Port Server
Edit `admin/server.js`:
```javascript
const PORT = process.env.PORT || 3001;  // ganti 3001 dengan port lain
```
Atau set environment variable:
```bash
PORT=8080 node admin.js
```

### Data Seed untuk Data CV Awal
File `admin/seed-data.js` berisi semua data CV yang tadinya hardcoded di `index.html`. Jika ingin mengubah data default saat seed, edit file tersebut.

---

## 12. Troubleshooting

| Masalah | Penyebab | Solusi |
|---|---|---|
| Login gagal | Admin user belum di-seed | Jalankan `node admin/seed.js` |
| Frontend kosong | Server mati / data.json belum ada | `node admin.js` atau commit data.json |
| Port 3001 sudah dipakai | Ada aplikasi lain | Ganti PORT di env atau edit server.js |
| Foto profil tidak muncul | Path foto tidak sesuai | Upload ulang via dashboard profile |
| Skills tidak muncul | Percentage di luar 0-100 | Input nilai 0-100 di form |

---

Dokumentasi ini diperbarui: Juni 2026.
