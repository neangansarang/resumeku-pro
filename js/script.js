function switchPage(p, e) {
  // Tutup panel detail yang sedang terbuka sebelum pindah halaman
  if (openSection) closePost(openSection);

  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  e.currentTarget.classList.add('active');
}

/* ── NAVBAR: melebar selama konten tidak di paling atas, mengecil saat kembali ke atas ── */
const navbarEl = document.querySelector('.navbar');
const NAV_TOP_LIMIT = 24;   // di bawah ini (paling atas), navbar kembali ke kondisi semula

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > NAV_TOP_LIMIT) navbarEl.classList.add('expanded');
  else navbarEl.classList.remove('expanded');
}, { passive: true });

const posts = [
  { img: 'src/images/blog-react.svg', category: 'Tutorial', title: 'Optimasi Performa React: Tips Mengurangi Re-render Berlebihan', excerpt: 'React memiliki mekanisme re-render yang bisa menjadi bumerang jika tidak dipahami dengan baik. Dalam artikel ini kita akan bahas useMemo, useCallback, dan React.memo secara praktis.', date: '10 Juni 2025', readTime: '8 menit', content: `<p>Salah satu keluhan terbesar developer React adalah aplikasi yang terasa lambat seiring bertambahnya kompleksitas komponen. Masalah utamanya sering kali adalah <strong>re-render yang tidak perlu</strong>.</p><h3>1. Memahami Penyebab Re-render</h3><p>Komponen React akan re-render ketika: (1) state-nya berubah, (2) props yang diterimanya berubah, atau (3) parent component-nya re-render. Poin ketiga sering diabaikan dan menjadi sumber masalah terbesar.</p><h3>2. React.memo – Memoize Komponen</h3><p>Gunakan <code>React.memo</code> untuk membungkus komponen agar hanya re-render ketika props-nya benar-benar berubah.</p><div class="modal-code">const MyComponent = React.memo(({ value }) => {\n  return &lt;div&gt;{value}&lt;/div&gt;;\n});</div><h3>3. useCallback – Stabilkan Referensi Fungsi</h3><p>Setiap render membuat instance fungsi baru. <code>useCallback</code> mempertahankan referensi fungsi selama dependency tidak berubah.</p><div class="modal-code">const handleClick = useCallback(() => {\n  doSomething(id);\n}, [id]);</div><h3>Kesimpulan</h3><p>Profil terlebih dahulu dengan React DevTools, baru optimasi di titik yang tepat. Jangan over-memoize!</p>` },
  { img: 'src/images/blog-docker.svg', category: 'DevOps', title: 'Docker untuk Developer: Dari Nol Sampai Deploy Production', excerpt: 'Docker mengubah cara kita membangun dan mendeploy aplikasi. Pelajari konsep container, image, docker-compose, dan strategi deployment yang solid dari artikel komprehensif ini.', date: '28 Mei 2025', readTime: '12 menit', content: `<p>Docker adalah teknologi containerisasi yang memungkinkan kita mengemas aplikasi beserta seluruh dependensinya ke dalam sebuah container yang ringan dan portabel.</p><h3>Mengapa Docker?</h3><ul><li><strong>Konsistensi lingkungan</strong> – "Works on my machine" tidak lagi jadi masalah</li><li><strong>Isolasi</strong> – Setiap layanan berjalan dalam sandbox-nya sendiri</li><li><strong>Skalabilitas</strong> – Mudah di-scale horizontal dengan orchestration tools</li></ul><h3>Membuat Dockerfile untuk Laravel</h3><div class="modal-code">FROM php:8.2-fpm\nWORKDIR /var/www\nCOPY . .\nRUN composer install --optimize-autoloader --no-dev\nEXPOSE 9000\nCMD ["php-fpm"]</div><h3>Tips Production</h3><ul><li>Gunakan multi-stage build untuk memperkecil ukuran image final</li><li>Simpan secret di environment variable, bukan di Dockerfile</li><li>Tambahkan health check pada setiap service</li></ul>` },
  { img: 'src/images/blog-security.svg', category: 'Security', title: 'Best Practice Keamanan API REST yang Sering Diabaikan', excerpt: 'Membangun API yang cepat itu mudah, tapi membuatnya aman adalah cerita lain. Berikut daftar kerentanan umum dan cara mencegahnya sejak awal development.', date: '15 Mei 2025', readTime: '10 menit', content: `<p>Keamanan API sering jadi afterthought, padahal lubang keamanan bisa berdampak fatal pada data pengguna dan reputasi produk.</p><h3>1. Authentication & Authorization yang Tepat</h3><p>Gunakan JWT dengan expiry yang wajar (15-60 menit) dan implementasikan refresh token secara aman.</p><h3>2. Rate Limiting & Throttling</h3><div class="modal-code">Route::middleware(['throttle:60,1'])\n  ->group(function() {\n    Route::post('/login', [AuthController::class, 'login']);\n  });</div><h3>3. Validasi Input Ketat</h3><ul><li>Whitelist, bukan blacklist — validasi format yang diharapkan</li><li>Sanitasi semua input sebelum disimpan ke database</li><li>Gunakan parameterized query / ORM untuk mencegah SQL Injection</li></ul>` },
  { img: 'src/images/blog-design.svg', category: 'UI/UX', title: 'Sistem Desain dari Nol: Panduan Praktis untuk Developer', excerpt: 'Design system bukan hanya untuk designer. Sebagai developer, memahami dan mengimplementasikan design system akan membuat kode lebih konsisten dan kolaborasi tim lebih lancar.', date: '2 Mei 2025', readTime: '9 menit', content: `<p>Design system adalah kumpulan komponen, aturan, dan guideline yang memastikan konsistensi visual dan fungsional di seluruh produk digital kita.</p><h3>Komponen Inti</h3><ul><li><strong>Token Desain</strong> – Warna, tipografi, spacing dalam variabel CSS</li><li><strong>Komponen Atom</strong> – Button, Input, Badge, Icon</li><li><strong>Komponen Molekul</strong> – Card, Form Group, Navbar</li></ul><h3>CSS Custom Properties sebagai Token</h3><div class="modal-code">:root {\n  --color-primary: #2563a8;\n  --spacing-md: 16px;\n  --radius-sm: 6px;\n}</div><h3>Manfaat Jangka Panjang</h3><p>Onboarding developer baru lebih cepat, konsistensi visual terjaga, dan pengembangan fitur baru jauh lebih cepat karena komponen sudah tersedia.</p>` },
  { img: 'src/images/blog-career.svg', category: 'Karier', title: 'Perjalanan 6 Tahun Menjadi Senior Developer: Pelajaran Berharga', excerpt: 'Dari junior yang sering bug hingga memimpin tim engineer, ini adalah refleksi jujur tentang apa yang benar-benar penting dalam pertumbuhan karier sebagai software developer di Indonesia.', date: '20 April 2025', readTime: '7 menit', content: `<p>Enam tahun lalu saya mulai sebagai junior developer yang sering lembur hanya untuk membenahi bug yang saya buat sendiri. Hari ini saya memimpin tim.</p><h3>1. Soft Skill Sama Pentingnya</h3><p>Kemampuan berkomunikasi, presentasi solusi, dan bernegosiasi dengan stakeholder adalah yang membedakan senior dari yang lain.</p><h3>2. Baca Kode Orang Lain</h3><p>Open source adalah universitas gratis. Membaca kode Laravel, React, atau library populer membuka perspektif baru.</p><h3>3. Build in Public</h3><p>Share progres proyekmu, tuliskan pengalamanmu, kontribusi ke open source. Reputasi online yang kuat membuka pintu peluang luar biasa.</p>` },
  { img: 'src/images/blog-ai.svg', category: 'AI & Tech', title: 'Mengintegrasikan AI ke Aplikasi Web: Mulai dari Mana?', excerpt: 'AI bukan lagi domain eksklusif data scientist. Sebagai web developer, kamu bisa mulai mengintegrasikan kemampuan AI ke aplikasimu hari ini dengan API yang sudah tersedia.', date: '5 April 2025', readTime: '11 menit', content: `<p>Era AI generatif membuka peluang baru bagi developer untuk membangun produk yang lebih cerdas tanpa harus menjadi ahli machine learning.</p><h3>Pilihan Integrasi AI</h3><ul><li><strong>OpenAI API</strong> – GPT-4 untuk text generation</li><li><strong>Anthropic Claude API</strong> – Sangat baik untuk analisis dan coding</li><li><strong>Hugging Face</strong> – Ribuan model open source gratis</li></ul><h3>Contoh Pemanggilan API</h3><div class="modal-code">const response = await fetch('https://api.anthropic.com/v1/messages', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ model: 'claude-sonnet-4-6', messages: [...] })\n});</div><h3>Tips</h3><p>Selalu tambahkan fallback jika AI gagal, cache respons yang sering diminta, dan jangan ekspos API key di frontend.</p>` }
];

/* ── ACHIEVE & CONTRIBUTE (dummy) ── */
const achievements = [
  // Achievement
  { icon: 'fas fa-trophy', category: 'Achievement', title: 'Juara 1 Hackathon Nasional 2024', excerpt: 'Tim kami memenangkan kompetisi hackathon nasional dengan membangun platform smart logistics dalam 24 jam. Juri menyoroti arsitektur sistem yang skalabel dan presentasi yang matang.', date: '18 Agustus 2024', readTime: '5 menit', content: `<p>Hackathon nasional 2024 diikuti oleh <strong>148 tim</strong> dari berbagai universitas dan perusahaan teknologi di Indonesia. Tim kami terdiri dari 4 orang dengan peran berbeda: frontend, backend, data, dan UI/UX.</p><h3>Tantangan Utama</h3><ul><li><strong>Waktu 24 jam</strong> – dari ide mentah sampai demo berjalan</li><li><strong>Data realtime</strong> – memproses ribuan titik per menit</li><li><strong>Demo di depan juri</strong> – harus jelas dalam 5 menit</li></ul><h3>Solusi Kami</h3><div class="modal-code">stack: React + Laravel + Redis\ndeploy: Docker Compose + VPS\n realtime: WebSocket + Queue</div><h3>Hasil</h3><p>Menjuarai 1 dari 148 tim, dengan penilaian tertinggi pada kategori <strong>Technical Implementation</strong> dan <strong>Potential Impact</strong>.</p>` },
  { icon: 'fas fa-microphone-lines', category: 'Achievement', title: 'Speaker Jakarta.js Meetup #42', excerpt: 'Berbagi pengalaman membangun design system yang konsisten di proyek React berskala besar, dihadiri 120+ developer dari berbagai perusahaan teknologi.', date: '12 Maret 2025', readTime: '4 menit', content: `<p>Jakarta.js Meetup adalah salah satu komunitas JavaScript terbesar di Indonesia. Di edisi ke-42, saya mendapat kepercayaan untuk menjadi speaker utama.</p><h3>Topik yang Dibahas</h3><ul><li><strong>Token Desain</strong> – menjaga konsistensi warna, spacing, dan tipografi</li><li><strong>Component API</strong> – menulis komponen yang mudah dipakai tim lain</li><li><strong>Migrasi bertahap</strong> – memindahkan aplikasi lama tanpa rewrite total</li></ul><h3>Dampak</h3><p>Materi dibagikan ke komunitas dan menjadi rujukan beberapa tim engineering untuk memulai inisiatif design system mereka.</p>` },
  { icon: 'fas fa-cloud', category: 'Achievement', title: 'Sertifikasi AWS Cloud Practitioner', excerpt: 'Lulus sertifikasi AWS Certified Cloud Practitioner dengan skor 892/1000. Memperkuat fondasi dalam merancang arsitektur cloud yang aman dan hemat biaya.', date: '7 Januari 2025', readTime: '3 menit', content: `<p>Sertifikasi ini menutup kebutuhan dasar pemahaman cloud untuk peran system analyst dan full stack developer di tim saya.</p><h3>Area yang Dikuasai</h3><ul><li><strong>Core Services</strong> – EC2, S3, RDS, Lambda</li><li><strong>Security</strong> – IAM, security group, enkripsi</li><li><strong>Well-Architected</strong> – reliabilitas, efisiensi biaya, performa</li></ul><h3>Penerapan di Kerja</h3><p>Langsung dipakai saat mengevaluasi biaya infrastruktur proyek, dan menghasilkan rekomendasi penghematan <strong>±30%</strong> lewat penggunaan auto-scaling dan reserved instances.</p>` },
  { icon: 'fas fa-code-branch', category: 'Achievement', title: 'Top Contributor Laravel Indonesia', excerpt: 'Masuk dalam 10 kontributor teraktif di komunitas Laravel Indonesia selama 2025, membantu menjawab ratusan pertanyaan dan menyusun dokumentasi onboarding.', date: '30 Desember 2025', readTime: '4 menit', content: `<p>Kontribusi dilakukan secara konsisten sepanjang 2025 melalui forum resmi dan grup komunitas.</p><h3>Bentuk Kontribusi</h3><ul><li><strong>Menjawab pertanyaan</strong> – 380+ thread terjawab</li><li><strong>Dokumentasi</strong> – menyusun panduan onboarding contributor baru</li><li><strong>Review materi</strong> – memeriksa materi workshop komunitas</li></ul><h3>Kenapa Penting</h3><p>Komunitas yang sehat menurunkan biaya belajar developer baru. Kontribusi kecil yang konsisten berdampak lebih besar daripada sekali besar.</p>` },
  { icon: 'fas fa-star', category: 'Achievement', title: 'Employee of the Quarter', excerpt: 'Diakui sebagai karyawan terbaik kuartal berkat kepemimpinan migrasi platform utama yang selesai lebih cepat dari jadwal tanpa downtime.', date: '15 Oktober 2025', readTime: '3 menit', content: `<p>Penghargaan ini diberikan setelah evaluasi kinerja triwulanan oleh manajemen dan rekan lintas tim.</p><h3>Kontribusi Utama</h3><ul><li><strong>Migrasi platform</strong> – selesai 2 minggu lebih awal</li><li><strong>Zero downtime</strong> – tidak ada gangguan saat cutover</li><li><strong>Dokumentasi proses</strong> – membuat playbook untuk tim berikutnya</li></ul><h3>Resepnya</h3><p>Perencanaan yang detail, komunikasi risiko lebih awal, dan rollback plan yang selalu disiapkan sebelum eksekusi.</p>` },
  // Contribution
  { icon: 'fas fa-git-alt', category: 'Contribution', title: 'Kontribusi ke Laravel Framework', excerpt: 'Mengirim beberapa perbaikan dokumentasi dan peningkatan pesan error ke repository Laravel, memudahkan developer pemula memahami masalahnya.', date: '20 Februari 2025', readTime: '5 menit', content: `<p>Masuk ke repository besar seperti Laravel terasa menakutkan di awal. Ternyata jalur kontribusi dokumentasi adalah pintu masuk yang paling ramah.</p><h3>Alur Kerja</h3><ul><li><strong>Fork & branch</strong> – satu topik per pull request</li><li><strong>Reproduksi</strong> – buktikan masalah sebelum memperbaiki</li><li><strong>Review</strong> – siap menerima koreksi dari maintainer</li></ul><h3>Hasil</h3><div class="modal-code">docs: 6 pull request merged\nimprovement: 2 pesan error diperjelas\nreview: 3 PR orang lain saya bantu</div>` },
  { icon: 'fas fa-react', category: 'Contribution', title: 'Open Source: React Scroll Toolkit', excerpt: 'Membuat dan memelihara library kecil untuk animasi scroll berbasis IntersectionObserver, kini digunakan 400+ proyek di npm.', date: '9 Juli 2025', readTime: '6 menit', content: `<p>Library ini lahir dari kebutuhan pribadi: terlalu banyak proyek yang memakai library besar hanya untuk satu efek scroll.</p><h3>Fitur</h3><ul><li><strong>Ringan</strong> – kurang dari 2KB, tanpa dependensi</li><li><strong>Hook-based</strong> – <code>useScrollReveal()</code> langsung siap pakai</li><li><strong>Aksesibel</strong> – hormati prefers-reduced-motion</li></ul><h3>Perawatan</h3><p>Dirilis rutin, issue dijawab maksimal 48 jam, dan setiap perubahan besar didiskusikan publik lewat discussion sebelum dieksekusi.</p>` },
  { icon: 'fas fa-people-group', category: 'Contribution', title: 'Mentoring 20+ Junior Developer', excerpt: 'Secara rutin membimbing junior developer lewat program mentoring internal dan komunitas: dari dasar JavaScript sampai persiapan interview.', date: 'Berjalan sejak 2023', readTime: '5 menit', content: `<p>Mentoring dimulai dari kebutuhan tim sendiri, lalu berkembang menjadi program terbuka untuk komunitas.</p><h3>Format</h3><ul><li><strong>1-on-1</strong> – sesi mingguan selama 8 minggu</li><li><strong>Code review</strong> – review PR latihan dengan catatan terstruktur</li><li><strong>Mock interview</strong> – simulasi teknis sebelum interview asli</li></ul><h3>Hasil</h3><p>Dari 20+ mentee, sebagian besar kini menempati posisi mid-level, dan beberapa menjadi mentor di program berikutnya.</p>` },
  { icon: 'fas fa-pen-nib', category: 'Contribution', title: '30+ Artikel Teknis Terpublikasi', excerpt: 'Menulis panduan praktis seputar React, Laravel, dan arsitektur sistem di blog pribadi serta media teknologi lokal sepanjang 2024–2025.', date: 'Berjalan sejak 2024', readTime: '4 menit', content: `<p>Menulis dipakai sebagai cara belajar: kalau tidak bisa dijelaskan dengan sederhana, berarti belum benar-benar paham.</p><h3>Topik Favorit</h3><ul><li><strong>Performa</strong> – profiling dan optimasi React</li><li><strong>Basis data</strong> – indexing dan query yang sehat</li><li><strong>DevOps</strong> – pipeline CI/CD untuk tim kecil</li></ul><h3>Prinsip</h3><p>Artikel harus bisa langsung dipraktikkan pembaca. Setiap tulisan minimal satu contoh kode yang berjalan.</p>` },
  { icon: 'fas fa-hand-holding-heart', category: 'Contribution', title: 'Relawan Teknologi untuk UKM', excerpt: 'Membangun sistem pemesanan dan kasir digital gratis untuk puluhan UMKM binaan yayasan sosial, lengkap dengan pelatihan pemakaiannya.', date: 'Berjalan sejak 2023', readTime: '6 menit', content: `<p>Banyak UMKM masih mencatat transaksi di buku fisik. Sistem yang tepat bisa menghemat waktu dan mengurangi selisih hitung.</p><h3>Yang Dikerjakan</h3><ul><li><strong>Aplikasi kasir offline-first</strong> – tetap jalan saat sinyal mati</li><li><strong>Pelatihan</strong> – 3 sesi untuk pemilik dan pegawai</li><li><strong>Dukungan</strong> – pendampingan 3 bulan pertama</li></ul><h3>Dampak</h3><p>Rekapan harian yang dulu butuh 1 jam kini selesai dalam 5 menit, dan laporan bulanan otomatis tersedia.</p>` }
];

/* ── Section config: blog & achieve memakai struktur/kelas yang sama ── */
const SECTIONS = {
  blog:    { items: () => posts,        gridId: 'blog-grid',     rootId: 'page-blog',    pfx: 'post-detail' },
achieve: { items: () => achievements, gridId: 'achieve-grid', filterId: 'achieve-filter', rootId: 'page-achieve', pfx: 'achieve-detail',
              filters: ['Achievement', 'Contribution'] }
};
let openSection = null;
const activeFilter = { blog: 'all', achieve: 'all' };

function renderSection(key) {
  const cfg = SECTIONS[key];

// Badge filter (rendered in dedicated container above grid)
  if (cfg.filters) {
    const opts = [{ v: 'all', l: 'SEMUA' }].concat(cfg.filters.map(f => ({ v: f, l: f.toUpperCase() })));
    const filterHtml = `<div class="blog-filter">` +
      opts.map(o => `<button type="button" class="filter-badge${activeFilter[key] === o.v ? ' active' : ''}" data-value="${o.v}"
        onclick="setFilter('${key}','${o.v}')">${o.l}</button>`).join('') +
      `</div>`;
    const filterEl = document.getElementById(cfg.filterId);
    if (filterEl) filterEl.innerHTML = filterHtml;
  }

  document.getElementById(cfg.gridId).innerHTML = cfg.items().map((p, i) => `
    <div class="blog-card" onclick="openPost('${key}', ${i})">
      ${p.icon
        ? `<div class="blog-thumb blog-thumb-icon"><i class="${p.icon}"></i></div>`
        : `<div class="blog-thumb"><img src="${p.img}" alt="${p.title}"></div>`}
      <div class="blog-card-body">
        <div class="blog-category">${p.category}</div>
        <div class="blog-card-title">${p.title}</div>
        <div class="blog-card-excerpt">${p.excerpt}</div>
        <div class="blog-card-meta"><i class="far fa-calendar-alt"></i>${p.date} &nbsp;·&nbsp; <i class="far fa-clock"></i>${p.readTime}</div>
      </div>
    </div>`).join('');

  // Terapkan filter tersimpan (saat render ulang)
  if (cfg.filters) applyFilter(key);
}

/* ── Filter kartu di area blog-grid ── */
function setFilter(key, value) {
  const cfg = SECTIONS[key];
  if (!cfg.filters) return;

  // Tutup panel detail dulu supaya tidak ada kartu tersembunyi yang panelnya masih terbuka
  if (openSection === key) closePost(key);

  activeFilter[key] = value;

  // Update class active badge (scoped ke halaman section ini)
  const root = document.getElementById(cfg.rootId);
  root.querySelectorAll('.filter-badge').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-value') === value);
  });

  applyFilter(key);
}

function applyFilter(key) {
  const cfg = SECTIONS[key];
  const value = activeFilter[key];
  const root = document.getElementById(cfg.rootId);

  root.querySelectorAll('.blog-card').forEach((card, idx) => {
    const item = cfg.items()[idx];
    const show = value === 'all' || (item && item.category === value);
    card.classList.toggle('hide-filtered', !show);
  });
}

function openPost(key, i) {
  const cfg = SECTIONS[key];
  const root = document.getElementById(cfg.rootId);
  const p = cfg.items()[i];

  // Fill detail panel (scoped to this page)
  root.querySelector('#' + cfg.pfx + '-category').textContent = p.category;
  root.querySelector('#' + cfg.pfx + '-title').textContent = p.title;
  root.querySelector('#' + cfg.pfx + '-meta').innerHTML = `<span><i class="far fa-calendar-alt"></i> ${p.date}</span><span><i class="far fa-clock"></i> ${p.readTime} baca</span>`;
  root.querySelector('#' + cfg.pfx + '-body').innerHTML = p.content;

  // Highlight active card, hide others (scoped to this page's grid)
  root.querySelectorAll('.blog-card').forEach((c, idx) => {
    c.classList.toggle('active', idx === i);
    c.classList.toggle('hide-card', idx !== i);
  });

  // Show panel
  root.querySelector('.post-detail-wrap').classList.add('open');
  root.querySelector('.blog-page').classList.add('has-detail');
  openSection = key;
}

function closePost(key) {
  const k = key || openSection;
  if (!k) return;
  const cfg = SECTIONS[k];
  const root = document.getElementById(cfg.rootId);

  root.querySelector('.post-detail-wrap').classList.remove('open');
  root.querySelector('.blog-page').classList.remove('has-detail');
  root.querySelectorAll('.blog-card').forEach(c => {
    c.classList.remove('active', 'hide-card');
  });
  document.getElementById(cfg.gridId).scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (openSection === k) openSection = null;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closePost(); });
renderSection('blog');
renderSection('achieve');
