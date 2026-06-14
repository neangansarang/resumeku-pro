function switchPage(p, e) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  e.currentTarget.classList.add('active');
}

const posts = [
  { emoji: '⚡', category: 'Tutorial', title: 'Optimasi Performa React: Tips Mengurangi Re-render Berlebihan', excerpt: 'React memiliki mekanisme re-render yang bisa menjadi bumerang jika tidak dipahami dengan baik. Dalam artikel ini kita akan bahas useMemo, useCallback, dan React.memo secara praktis.', date: '10 Juni 2025', readTime: '8 menit', content: `<p>Salah satu keluhan terbesar developer React adalah aplikasi yang terasa lambat seiring bertambahnya kompleksitas komponen. Masalah utamanya sering kali adalah <strong>re-render yang tidak perlu</strong>.</p><h3>1. Memahami Penyebab Re-render</h3><p>Komponen React akan re-render ketika: (1) state-nya berubah, (2) props yang diterimanya berubah, atau (3) parent component-nya re-render. Poin ketiga sering diabaikan dan menjadi sumber masalah terbesar.</p><h3>2. React.memo – Memoize Komponen</h3><p>Gunakan <code>React.memo</code> untuk membungkus komponen agar hanya re-render ketika props-nya benar-benar berubah.</p><div class="modal-code">const MyComponent = React.memo(({ value }) => {\n  return &lt;div&gt;{value}&lt;/div&gt;;\n});</div><h3>3. useCallback – Stabilkan Referensi Fungsi</h3><p>Setiap render membuat instance fungsi baru. <code>useCallback</code> mempertahankan referensi fungsi selama dependency tidak berubah.</p><div class="modal-code">const handleClick = useCallback(() => {\n  doSomething(id);\n}, [id]);</div><h3>Kesimpulan</h3><p>Profil terlebih dahulu dengan React DevTools, baru optimasi di titik yang tepat. Jangan over-memoize!</p>` },
  { emoji: '🐳', category: 'DevOps', title: 'Docker untuk Developer: Dari Nol Sampai Deploy Production', excerpt: 'Docker mengubah cara kita membangun dan mendeploy aplikasi. Pelajari konsep container, image, docker-compose, dan strategi deployment yang solid dari artikel komprehensif ini.', date: '28 Mei 2025', readTime: '12 menit', content: `<p>Docker adalah teknologi containerisasi yang memungkinkan kita mengemas aplikasi beserta seluruh dependensinya ke dalam sebuah container yang ringan dan portabel.</p><h3>Mengapa Docker?</h3><ul><li><strong>Konsistensi lingkungan</strong> – "Works on my machine" tidak lagi jadi masalah</li><li><strong>Isolasi</strong> – Setiap layanan berjalan dalam sandbox-nya sendiri</li><li><strong>Skalabilitas</strong> – Mudah di-scale horizontal dengan orchestration tools</li></ul><h3>Membuat Dockerfile untuk Laravel</h3><div class="modal-code">FROM php:8.2-fpm\nWORKDIR /var/www\nCOPY . .\nRUN composer install --optimize-autoloader --no-dev\nEXPOSE 9000\nCMD ["php-fpm"]</div><h3>Tips Production</h3><ul><li>Gunakan multi-stage build untuk memperkecil ukuran image final</li><li>Simpan secret di environment variable, bukan di Dockerfile</li><li>Tambahkan health check pada setiap service</li></ul>` },
  { emoji: '🔐', category: 'Security', title: 'Best Practice Keamanan API REST yang Sering Diabaikan', excerpt: 'Membangun API yang cepat itu mudah, tapi membuatnya aman adalah cerita lain. Berikut daftar kerentanan umum dan cara mencegahnya sejak awal development.', date: '15 Mei 2025', readTime: '10 menit', content: `<p>Keamanan API sering jadi afterthought, padahal lubang keamanan bisa berdampak fatal pada data pengguna dan reputasi produk.</p><h3>1. Authentication & Authorization yang Tepat</h3><p>Gunakan JWT dengan expiry yang wajar (15-60 menit) dan implementasikan refresh token secara aman.</p><h3>2. Rate Limiting & Throttling</h3><div class="modal-code">Route::middleware(['throttle:60,1'])\n  ->group(function() {\n    Route::post('/login', [AuthController::class, 'login']);\n  });</div><h3>3. Validasi Input Ketat</h3><ul><li>Whitelist, bukan blacklist — validasi format yang diharapkan</li><li>Sanitasi semua input sebelum disimpan ke database</li><li>Gunakan parameterized query / ORM untuk mencegah SQL Injection</li></ul>` },
  { emoji: '🎨', category: 'UI/UX', title: 'Sistem Desain dari Nol: Panduan Praktis untuk Developer', excerpt: 'Design system bukan hanya untuk designer. Sebagai developer, memahami dan mengimplementasikan design system akan membuat kode lebih konsisten dan kolaborasi tim lebih lancar.', date: '2 Mei 2025', readTime: '9 menit', content: `<p>Design system adalah kumpulan komponen, aturan, dan guideline yang memastikan konsistensi visual dan fungsional di seluruh produk digital kita.</p><h3>Komponen Inti</h3><ul><li><strong>Token Desain</strong> – Warna, tipografi, spacing dalam variabel CSS</li><li><strong>Komponen Atom</strong> – Button, Input, Badge, Icon</li><li><strong>Komponen Molekul</strong> – Card, Form Group, Navbar</li></ul><h3>CSS Custom Properties sebagai Token</h3><div class="modal-code">:root {\n  --color-primary: #2563a8;\n  --spacing-md: 16px;\n  --radius-sm: 6px;\n}</div><h3>Manfaat Jangka Panjang</h3><p>Onboarding developer baru lebih cepat, konsistensi visual terjaga, dan pengembangan fitur baru jauh lebih cepat karena komponen sudah tersedia.</p>` },
  { emoji: '📈', category: 'Karier', title: 'Perjalanan 6 Tahun Menjadi Senior Developer: Pelajaran Berharga', excerpt: 'Dari junior yang sering bug hingga memimpin tim engineer, ini adalah refleksi jujur tentang apa yang benar-benar penting dalam pertumbuhan karier sebagai software developer di Indonesia.', date: '20 April 2025', readTime: '7 menit', content: `<p>Enam tahun lalu saya mulai sebagai junior developer yang sering lembur hanya untuk membenahi bug yang saya buat sendiri. Hari ini saya memimpin tim.</p><h3>1. Soft Skill Sama Pentingnya</h3><p>Kemampuan berkomunikasi, presentasi solusi, dan bernegosiasi dengan stakeholder adalah yang membedakan senior dari yang lain.</p><h3>2. Baca Kode Orang Lain</h3><p>Open source adalah universitas gratis. Membaca kode Laravel, React, atau library populer membuka perspektif baru.</p><h3>3. Build in Public</h3><p>Share progres proyekmu, tuliskan pengalamanmu, kontribusi ke open source. Reputasi online yang kuat membuka pintu peluang luar biasa.</p>` },
  { emoji: '🤖', category: 'AI & Tech', title: 'Mengintegrasikan AI ke Aplikasi Web: Mulai dari Mana?', excerpt: 'AI bukan lagi domain eksklusif data scientist. Sebagai web developer, kamu bisa mulai mengintegrasikan kemampuan AI ke aplikasimu hari ini dengan API yang sudah tersedia.', date: '5 April 2025', readTime: '11 menit', content: `<p>Era AI generatif membuka peluang baru bagi developer untuk membangun produk yang lebih cerdas tanpa harus menjadi ahli machine learning.</p><h3>Pilihan Integrasi AI</h3><ul><li><strong>OpenAI API</strong> – GPT-4 untuk text generation</li><li><strong>Anthropic Claude API</strong> – Sangat baik untuk analisis dan coding</li><li><strong>Hugging Face</strong> – Ribuan model open source gratis</li></ul><h3>Contoh Pemanggilan API</h3><div class="modal-code">const response = await fetch('https://api.anthropic.com/v1/messages', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ model: 'claude-sonnet-4-6', messages: [...] })\n});</div><h3>Tips</h3><p>Selalu tambahkan fallback jika AI gagal, cache respons yang sering diminta, dan jangan ekspos API key di frontend.</p>` }
];

function renderBlog() {
  document.getElementById('blog-grid').innerHTML = posts.map((p, i) => `
    <div class="blog-card" onclick="openPost(${i})">
      <div class="blog-thumb">${p.emoji}</div>
      <div class="blog-card-body">
        <div class="blog-category">${p.category}</div>
        <div class="blog-card-title">${p.title}</div>
        <div class="blog-card-excerpt">${p.excerpt}</div>
        <div class="blog-card-meta"><i class="far fa-calendar-alt"></i>${p.date} &nbsp;·&nbsp; <i class="far fa-clock"></i>${p.readTime}</div>
        <button class="read-more-btn">Baca selengkapnya <i class="fas fa-arrow-right" style="font-size:9px"></i></button>
      </div>
    </div>`).join('');
}

function openPost(i) {
  const p = posts[i];
  // Fill detail panel
  document.getElementById('post-detail-category').textContent = p.category;
  document.getElementById('post-detail-title').textContent = p.title;
  document.getElementById('post-detail-meta').innerHTML = `<span><i class="far fa-calendar-alt"></i> ${p.date}</span><span><i class="far fa-clock"></i> ${p.readTime} baca</span>`;
  document.getElementById('post-detail-body').innerHTML = p.content;

  // Highlight active card, remove others
  document.querySelectorAll('.blog-card').forEach((c, idx) => c.classList.toggle('active', idx === i));

  // Show panel
  const detail = document.getElementById('post-detail');
  detail.classList.add('open');

  // Scroll to detail panel smoothly
  setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
}

function closePost() {
  document.getElementById('post-detail').classList.remove('open');
  document.querySelectorAll('.blog-card').forEach(c => c.classList.remove('active'));
  // Scroll back to grid
  document.getElementById('blog-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closePost(); });
renderBlog();
