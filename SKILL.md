# SKILL.md — CV Asep Resume

Dokumen ini mendeskripsikan struktur, konvensi, dan cara maintain proyek ini secara menyeluruh.

---

## 1. Gambaran Umum

Proyek ini adalah **single-page CV + Blog** berbasis HTML murni dengan CSS dan JavaScript yang dipisahkan ke folder terpisah (tidak ada framework eksternal selain Google Fonts dan Font Awesome). Terdiri dari dua halaman yang bisa diswitch via tab navigasi:

| Tab | ID Halaman | Deskripsi |
|-----|------------|-----------|
| Curriculum Vitae | `#page-cv` | CV dua-kolom (sidebar + main) |
| Blog & Tulisan | `#page-blog` | Grid kartu blog dengan detail inline |

---

## 2. Dependency Eksternal

```html
<!-- Font -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Ikon -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
```

- **Inter** → font utama (body, label, tombol)
- **Lora** → font serif untuk nama dan heading utama
- **Font Awesome 6.5** → semua ikon (`fas`, `fab`, `far`)

---

## 3. Sistem Warna (CSS Variables)

Semua warna dikelola melalui CSS custom properties di `:root`. **Jangan hardcode warna** di luar blok ini.

```css
:root {
  /* Skala Stone (netral warm-gray) */
  --stone-50  → #faf9f7   /* background terang */
  --stone-100 → #f3f1ed
  --stone-200 → #e8e4de   /* border, skill bar bg */
  --stone-300 → #d4cfc7   /* border aktif, divider */
  --stone-400 → #b0a99f   /* ikon muted */
  --stone-500 → #8c8479   /* teks muted, label */
  --stone-600 → #6b6358   /* teks sekunder */
  --stone-700 → #4a4440   /* teks sidebar */
  --stone-800 → #2e2b28   /* teks utama, nama */
  --stone-900 → #1a1815   /* paling gelap */

  /* Aksen Sage (hijau abu-abu) */
  --sage      → #7a8c7e   /* skill bar fill, ikon section main */
  --sage-light→ #e8ede9
  --sage-mid  → #c2cfc4

  /* Alias semantik */
  --sidebar-bg → #f0ede8  /* background sidebar */
  --text       → var(--stone-800)
  --muted      → var(--stone-500)
  --border     → var(--stone-200)
  --white      → #ffffff
  --shadow     → 0 12px 40px rgba(30,26,22,0.10), ...
}
```

**Cara ganti tema warna:** cukup ubah nilai di `:root`, seluruh komponen akan mengikuti.

---

## 4. Struktur Layout CV

```
.book-wrapper (max-width: 880px, centered)
└── .cv-card (CSS Grid: 248px | 1fr)
    ├── .sidebar        ← kolom kiri
    └── .cv-main        ← kolom kanan
```

### 4a. Sidebar (`.sidebar`)

Lebar tetap **248px**, background `--sidebar-bg`. Berisi bagian-bagian berikut secara vertikal:

| Bagian | Struktur HTML | Cara Edit |
|--------|---------------|-----------|
| Foto profil | `.photo-icon` (ikon `fa-user`) | Ganti `<i>` dengan `<img>` jika ada foto asli |
| Nama | `.sidebar-name` | Edit teks langsung |
| Jabatan | `.sidebar-title` | Edit teks langsung |
| Kontak | `.contact-item` (icon + teks) | Duplikasi/hapus `.contact-item` |
| Sosial media | `.social-grid > .social-item` | Grid 2 kolom, duplikasi item |
| Keahlian teknis | `.skill-item` (bar progress) | Ubah `width:XX%` di style inline |
| Kemampuan | `.ability-tag` (pill/badge) | Duplikasi/hapus `<span class="ability-tag">` |

#### Menambah skill bar baru:
```html
<div class="skill-item">
  <div class="skill-label">
    <span>Nama Skill</span>
    <span>80%</span>
  </div>
  <div class="skill-bar">
    <div class="skill-fill" style="width:80%"></div>
  </div>
</div>
```

#### Menambah ability tag baru:
```html
<span class="ability-tag">Nama Kemampuan</span>
```

### 4b. Main Content (`.cv-main`)

Padding `36px 30px`, flex column dengan `gap: 24px`. Berisi section-section:

| Section | Class section title | Isi |
|---------|---------------------|-----|
| Header nama | `.main-header` | Nama besar + role/subtitle |
| Profil | `.profile-text` | Paragraf deskripsi diri |
| Pengalaman kerja | `.exp-item` | Role, perusahaan, bullet poin |
| Pendidikan | `.edu-item` | Tahun, sekolah, gelar, IPK |
| Sertifikat | `.cert-grid > .cert-item` | Grid 2 kolom, ikon + nama + issuer |
| Proyek | `.project-grid > .project-item` | Grid 2 kolom, nama + deskripsi + tags |

#### Template `exp-item` (pengalaman kerja):
```html
<div class="exp-item">
  <div class="exp-header">
    <div class="exp-role">Nama Jabatan</div>
    <div class="exp-period">Bln YYYY – Bln YYYY</div>
  </div>
  <div class="exp-company"><i class="fas fa-building"></i>Nama Perusahaan · Kota</div>
  <ul class="exp-bullets">
    <li>Pencapaian atau tugas utama.</li>
  </ul>
</div>
<hr class="exp-divider">
```

> ⚠️ Hapus `<hr class="exp-divider">` pada item **terakhir** agar tidak ada garis berlebih.

#### Template `edu-item` (pendidikan):
```html
<div class="edu-item">
  <div class="edu-year">YYYY – YYYY</div>
  <div>
    <div class="edu-school">Nama Institusi · Kota</div>
    <div class="edu-degree">Program Studi / Jurusan</div>
    <div class="edu-gpa">IPK: X.XX / 4.00</div>
  </div>
</div>
```

#### Template `cert-item` (sertifikat):
```html
<div class="cert-item">
  <div class="cert-icon"><i class="fab fa-nama-ikon"></i></div>
  <div>
    <div class="cert-name">Nama Sertifikat</div>
    <div class="cert-issuer">Lembaga Penerbit</div>
    <div class="cert-year">YYYY</div>
  </div>
</div>
```

#### Template `project-item` (proyek):
```html
<div class="project-item">
  <div class="project-name">Nama Proyek</div>
  <div class="project-desc">Deskripsi singkat proyek.</div>
  <div class="project-tags">
    <span class="project-tag">Teknologi 1</span>
    <span class="project-tag">Teknologi 2</span>
  </div>
</div>
```

#### Judul section (main):
```html
<div class="main-section-title">
  <i class="fas fa-nama-ikon"></i> Nama Section
</div>
```
> `::after` pseudo-element otomatis menambah garis pembatas horizontal.

---

## 5. Struktur Blog

### 5a. HTML Statis

```
#page-blog
└── .blog-page
    ├── .blog-header          ← judul + subtitle
    ├── #blog-grid            ← diisi otomatis oleh JavaScript
    └── #post-detail          ← panel detail artikel (toggle .open)
```

### 5b. Data Artikel (JavaScript)

Semua konten artikel disimpan dalam array `posts` di `js/script.js`. Setiap objek post:

```javascript
{
  emoji: '⚡',                    // emoji thumbnail kartu
  category: 'Tutorial',           // label kategori
  title: 'Judul Artikel',
  excerpt: 'Ringkasan singkat...',
  date: '10 Juni 2025',
  readTime: '8 menit',
  content: `<p>Isi artikel HTML...</p>
             <h3>Sub-heading</h3>
             <div class="modal-code">kode di sini</div>`
}
```

**Cara menambah artikel baru:** tambahkan objek baru ke array `posts`:
```javascript
const posts = [
  // ... artikel lama ...
  {
    emoji: '🚀',
    category: 'Tutorial',
    title: 'Judul Artikel Baru',
    excerpt: 'Ringkasan artikel...',
    date: '14 Juni 2026',
    readTime: '5 menit',
    content: `<p>Konten artikel dalam HTML.</p>`
  }
];
```

### 5c. Format Konten Artikel

Tag HTML yang didukung di dalam `content`:

| Tag | Kegunaan |
|-----|----------|
| `<p>` | Paragraf biasa |
| `<h3>` | Sub-heading |
| `<ul><li>` | Daftar bullet |
| `<strong>` | Teks tebal |
| `<code>` | Kode inline |
| `<div class="modal-code">` | Blok kode (monospace, background gelap) |

### 5d. Fungsi JavaScript

| Fungsi | Tugas |
|--------|-------|
| `renderBlog()` | Render semua kartu blog ke `#blog-grid` |
| `openPost(i)` | Tampilkan detail artikel ke-`i`, scroll ke panel |
| `closePost()` | Sembunyikan panel detail, scroll kembali ke grid |
| `switchPage(p, e)` | Ganti halaman aktif (CV / Blog) |

> `renderBlog()` dipanggil otomatis saat halaman dimuat.

---

## 6. Navigasi Tab

```html
<button class="nav-tab active" onclick="switchPage('cv', event)">...</button>
<button class="nav-tab" onclick="switchPage('blog', event)">...</button>
```

- Tab aktif mendapat class `.active` → background `--stone-800`, teks terang.
- Untuk menambah halaman baru: buat `<div id="page-namabaru" class="page">`, lalu tambah tombol nav dengan `onclick="switchPage('namabaru', event)"`.

---

## 7. Efek Visual

| Efek | Implementasi |
|------|--------------|
| Page-fold sudut kanan bawah | `.book-wrapper::after` dengan `clip-path: polygon` |
| Shadow kartu CV | `--shadow` di `.cv-card` |
| Garis section | `::after` pseudo-element pada `.main-section-title` dan `.sidebar-section-title` |
| Skill bar fill | `<div class="skill-fill" style="width:XX%">` — warna `--sage` |

---

## 8. Cara Mengganti Foto Profil

Saat ini foto menggunakan ikon placeholder:
```html
<div class="photo-icon"><i class="fas fa-user"></i></div>
```

Untuk menggunakan foto asli:
```html
<div class="photo-icon" style="padding:0; overflow:hidden;">
  <img src="foto.jpg" alt="Nama" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
</div>
```

---

## 9. Checklist Maintenance

Ketika ingin mengupdate CV, periksa urutan ini:

- [ ] **Identitas:** nama di `.sidebar-name`, `.main-header-name`, dan `<title>`
- [ ] **Jabatan:** `.sidebar-title` dan `.main-header-role`
- [ ] **Kontak:** 4x `.contact-item` (telepon, email, lokasi, website)
- [ ] **Sosial:** 4x `.social-item` di `.social-grid`
- [ ] **Skill bar:** `width:%` di setiap `.skill-fill`
- [ ] **Kemampuan:** `.ability-tag` di sidebar
- [ ] **Pengalaman:** `.exp-item` (terbaru di atas, hapus `<hr>` terakhir)
- [ ] **Pendidikan:** `.edu-item`
- [ ] **Sertifikat:** `.cert-item` di `.cert-grid`
- [ ] **Proyek:** `.project-item` di `.project-grid`
- [ ] **Blog:** tambah/edit objek di array `posts` di `js/script.js`

---

## 10. Struktur File Proyek

```
resume-asep/
├── index.html          ← HTML utama (struktur halaman)
├── css/
│   └── style.css       ← Semua stylesheet
├── js/
│   └── script.js       ← Semua JavaScript (data blog, fungsi interaktif)
└── SKILL.md            ← Dokumentasi ini
```

## 11. Catatan Tambahan

- Proyek ini bergantung pada Google Fonts dan Font Awesome (butuh koneksi internet untuk tampil sempurna).
- CSS dan JavaScript sudah dipisahkan ke folder masing-masing (`css/` dan `js/`) untuk kemudahan maintenance.
- Tidak ada JavaScript framework — semua manipulasi DOM menggunakan vanilla JS.
- Untuk **print/PDF**: tambahkan `@media print { .nav-tabs { display: none; } #page-blog { display: none; } }` agar hanya CV yang tercetak.
- Bahasa konten: **Indonesia** (`lang="id"`).
