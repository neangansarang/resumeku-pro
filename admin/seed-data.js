const { getDb, closeDb } = require('./db');

const db = getDb();

// Check if data already exists
const profileCount = db.prepare('SELECT COUNT(*) as c FROM profile').get().c;
if (profileCount > 0) {
  console.log('[seed-data] Data already exists, skipping');
  closeDb();
  process.exit(0);
}

// Profile
db.prepare('INSERT INTO profile (name, title, bio) VALUES (?, ?, ?)').run(
  'Asep Septiadi',
  'Software Engineer - 6+ Tahun Pengalaman - S1 Teknik Informatika',
  'Saya adalah seorang Full Stack Developer berpengalaman dengan lebih dari 6 tahun membangun produk digital dari hulu ke hilir. Spesialisasi dalam pengembangan aplikasi web berbasis React dan Laravel, serta memiliki ketertarikan kuat pada arsitektur sistem yang skalabel dan pengalaman pengguna yang intuitif. Saya terbiasa bekerja dalam tim lintas fungsi dan mampu memimpin proyek dari tahap perencanaan hingga deployment produksi.'
);

// Contact
db.prepare('INSERT INTO contact (phone, email, location) VALUES (?, ?, ?)').run(
  '+62813 2409 1141',
  'septiadi.imail@gmail.com',
  'Jakasetia, Bekasi Selatan'
);

// Social Media
const socialMedia = [
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/aspsptyd', icon: 'fab fa-linkedin-in' },
  { platform: 'GitHub', url: 'https://github.com/aspsptyd', icon: 'fab fa-github' },
  { platform: 'Instagram', url: 'https://instagram.com/aspsptyd', icon: 'fab fa-instagram' },
  { platform: 'Twitter', url: 'https://twitter.com/aspsptyd', icon: 'fab fa-twitter' }
];
const insSocial = db.prepare('INSERT INTO social_media (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)');
socialMedia.forEach((s, i) => insSocial.run(s.platform, s.url, s.icon, i + 1));

// Skills
const skills = [
  { name: 'JavaScript', percentage: 90 },
  { name: 'PHP / Laravel', percentage: 85 },
  { name: 'React.js', percentage: 88 },
  { name: 'Node.js', percentage: 80 },
  { name: 'Vue.js', percentage: 75 },
  { name: 'Python', percentage: 70 },
  { name: 'MySQL / PostgreSQL', percentage: 82 },
  { name: 'Docker / Linux', percentage: 72 },
  { name: 'HTML / CSS / Tailwind', percentage: 95 },
  { name: 'Git / CI-CD', percentage: 85 }
];
const insSkill = db.prepare('INSERT INTO skills (name, percentage, sort_order) VALUES (?, ?, ?)');
skills.forEach((s, i) => insSkill.run(s.name, s.percentage, i + 1));

// Abilities
const abilities = [
  'Leadership', 'Project Management', 'Problem Solving', 'Komunikasi',
  'Teamwork', 'Adaptif', 'Initiatif', 'Analisis Data', 'Agile / Scrum'
];
const insAbility = db.prepare('INSERT INTO abilities (name) VALUES (?)');
abilities.forEach(a => insAbility.run(a));

// Experiences
const insExp = db.prepare('INSERT INTO experiences (role, company, period_start, period_end, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
const insJobDesk = db.prepare('INSERT INTO experience_job_desk (experience_id, text, sort_order) VALUES (?, ?, ?)');
const insAchievement = db.prepare('INSERT INTO experience_achievements (experience_id, text, sort_order) VALUES (?, ?, ?)');

const exp1 = insExp.run('Senior Full Stack Developer', 'PT Tokopedia Teknologi', 'Jan 2022', 'Sekarang', '', 5);
['Memimpin tim 5 engineer dalam membangun fitur checkout baru.',
  'Merancang arsitektur microservice menggunakan Node.js dan Docker.',
  'Mengintegrasikan sistem notifikasi real-time dengan WebSocket dan Redis Pub/Sub.'
].forEach((t, i) => insJobDesk.run(exp1.lastInsertRowid, t, i + 1));
['Meningkatkan konversi checkout sebesar 23%.'].forEach((t, i) => insAchievement.run(exp1.lastInsertRowid, t, i + 1));

const exp2 = insExp.run('Frontend Developer', 'PT Gojek Indonesia', 'Mar 2020', 'Des 2021', '', 4);
['Mengembangkan dashboard analytics internal menggunakan React.js dan D3.js.',
  'Mengoptimalkan performa halaman web (Core Web Vitals).'
].forEach((t, i) => insJobDesk.run(exp2.lastInsertRowid, t, i + 1));
['LCP turun dari 4.2s ke 1.8s.'].forEach((t, i) => insAchievement.run(exp2.lastInsertRowid, t, i + 1));

const exp3 = insExp.run('Backend Developer', 'PT Bukalapak', 'Jun 2019', 'Feb 2020', '', 3);
['Membangun RESTful API menggunakan Laravel untuk modul manajemen produk dan stok.',
  'Mengimplementasikan caching dengan Redis.'
].forEach((t, i) => insJobDesk.run(exp3.lastInsertRowid, t, i + 1));
['Mengurangi waktu respons API sebesar 40%.'].forEach((t, i) => insAchievement.run(exp3.lastInsertRowid, t, i + 1));

const exp4 = insExp.run('Web Developer (Freelance)', 'Berbagai Klien', 'Jan 2018', 'Mei 2019', '', 2);
['Membangun website company profile dan e-commerce untuk UMKM menggunakan WordPress dan PHP.']
  .forEach((t, i) => insJobDesk.run(exp4.lastInsertRowid, t, i + 1));
['Berhasil menyelesaikan 12+ proyek website.'].forEach((t, i) => insAchievement.run(exp4.lastInsertRowid, t, i + 1));

const exp5 = insExp.run('Junior Web Developer', 'CV Kreasi Digital Nusantara', 'Jul 2017', 'Des 2017', '', 1);
['Mengembangkan sistem informasi manajemen sekolah berbasis PHP native.']
  .forEach((t, i) => insJobDesk.run(exp5.lastInsertRowid, t, i + 1));
['Magang dan bekerja penuh selama 6 bulan.'].forEach((t, i) => insAchievement.run(exp5.lastInsertRowid, t, i + 1));

// Education
const insEdu = db.prepare('INSERT INTO education (degree, institution, gpa, period, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
insEdu.run('S1 Teknik Informatika', 'Universitas Telkom', 'IPK Akhir: 3.72 / 4.00 · Cumlaude', '2013 – 2017', 'Bandung', 2);
insEdu.run('Rekayasa Perangkat Lunak (RPL)', 'SMK Negeri 4', 'Nilai rata-rata: 87.5 · Lulusan Terbaik', '2010 – 2013', 'Bandung', 1);

// Certifications
const insCert = db.prepare('INSERT INTO certifications (name, issuer, sort_order) VALUES (?, ?, ?)');
insCert.run('AWS Certified Solutions Architect', 'Amazon Web Services', 5);
insCert.run('Google Cloud Professional', 'Google Cloud', 4);
insCert.run('Meta React Developer', 'Meta / Coursera', 3);
insCert.run('CompTIA Security+', 'CompTIA', 2);
insCert.run('Professional Scrum Master I', 'Scrum.org', 1);

// Projects
const insProj = db.prepare('INSERT INTO projects (name, description, tech_stack, sort_order) VALUES (?, ?, ?, ?)');
insProj.run('E-Commerce Platform', 'Platform belanja online lengkap dengan fitur multi-vendor, payment gateway, dan dashboard analitik real-time untuk seller.', 'Laravel, React, MySQL', 5);
insProj.run('HR Management System', 'Sistem manajemen SDM meliputi absensi, penggajian, penilaian kinerja, dan manajemen cuti berbasis web.', 'Vue.js, Node.js, PostgreSQL', 4);
insProj.run('Telemedicine App', 'Aplikasi konsultasi dokter online dengan video call, resep digital, dan integrasi apotek untuk 50K+ pengguna aktif.', 'React Native, WebRTC, Firebase', 3);
insProj.run('CI/CD Pipeline Tool', 'Alat otomasi deployment berbasis Docker dan GitHub Actions untuk mempercepat proses rilis dari 4 jam menjadi 15 menit.', 'Docker, GitHub Actions, Bash', 2);
insProj.run('LMS – Learning Platform', 'Platform e-learning dengan kursus video, kuis interaktif, sertifikat, dan sistem tracking progres siswa.', 'PHP, MySQL, FFmpeg', 1);

// Awards
const insAward = db.prepare('INSERT INTO awards (name, issuer, year, sort_order) VALUES (?, ?, ?, ?)');
insAward.run('Best Developer Award 2024', 'PT Tech Innovasi', '2024', 4);
insAward.run('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2023', 3);
insAward.run('Juara 1 Hackathon Nasional 2023', 'Kemenkominfo', '2023', 2);
insAward.run('Google Project Management Certificate', 'Google / Coursera', '2023', 1);

console.log('[seed-data] All CV data imported successfully!');
closeDb();
