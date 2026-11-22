const express = require('express');
const { getDb } = require('../db');
const { syncJson } = require('../sync-json');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

function touchProfile() {
  getDb().prepare("UPDATE profile SET updated_at = datetime('now') WHERE id = 1").run();
}

// ─── Profile ───
router.get('/profile', (req, res) => {
  const p = getDb().prepare('SELECT * FROM profile LIMIT 1').get() || {};
  res.json(p);
});

router.put('/profile', (req, res) => {
  const { name, title, bio, photo_path } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM profile LIMIT 1').get();
  if (existing) {
    db.prepare('UPDATE profile SET name = ?, title = ?, bio = ?, photo_path = ?, updated_at = datetime(\'now\') WHERE id = 1')
      .run(name, title, bio, photo_path || '');
  } else {
    db.prepare('INSERT INTO profile (name, title, bio, photo_path) VALUES (?, ?, ?, ?)')
      .run(name, title, bio, photo_path || '');
  }
  syncJson();
  res.json({ success: true });
});

// ─── Contact ───
router.get('/contact', (req, res) => {
  const c = getDb().prepare('SELECT * FROM contact LIMIT 1').get() || {};
  res.json(c);
});

router.put('/contact', (req, res) => {
  const { phone, email, location, whatsapp, telegram } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM contact LIMIT 1').get();
  if (existing) {
    db.prepare('UPDATE contact SET phone = ?, email = ?, location = ?, whatsapp = ?, telegram = ? WHERE id = 1')
      .run(phone, email, location, whatsapp || '', telegram || '');
  } else {
    db.prepare('INSERT INTO contact (phone, email, location, whatsapp, telegram) VALUES (?, ?, ?, ?, ?)')
      .run(phone, email, location, whatsapp || '', telegram || '');
  }
  syncJson();
  res.json({ success: true });
});

// ─── Social Media ───
router.get('/social-media', (req, res) => {
  const items = getDb().prepare('SELECT * FROM social_media ORDER BY sort_order').all();
  res.json(items);
});

router.post('/social-media', (req, res) => {
  const { platform, url, icon } = req.body;
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM social_media').get().next;
  db.prepare('INSERT INTO social_media (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)')
    .run(platform, url, icon || '', maxOrder);
  syncJson();
  res.json({ success: true });
});

router.put('/social-media/:id', (req, res) => {
  const { platform, url, icon } = req.body;
  getDb().prepare('UPDATE social_media SET platform = ?, url = ?, icon = ? WHERE id = ?')
    .run(platform, url, icon || '', req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/social-media/:id', (req, res) => {
  getDb().prepare('DELETE FROM social_media WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Skills ───
router.get('/skills', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM skills ORDER BY sort_order').all());
});

router.post('/skills', (req, res) => {
  const { name, percentage } = req.body;
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM skills').get().next;
  db.prepare('INSERT INTO skills (name, percentage, sort_order) VALUES (?, ?, ?)')
    .run(name, percentage, maxOrder);
  syncJson();
  res.json({ success: true });
});

router.put('/skills/:id', (req, res) => {
  const { name, percentage } = req.body;
  getDb().prepare('UPDATE skills SET name = ?, percentage = ? WHERE id = ?')
    .run(name, percentage, req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/skills/:id', (req, res) => {
  getDb().prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Abilities ───
router.get('/abilities', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM abilities ORDER BY id').all());
});

router.post('/abilities', (req, res) => {
  const { name } = req.body;
  getDb().prepare('INSERT INTO abilities (name) VALUES (?)').run(name);
  syncJson();
  res.json({ success: true });
});

router.put('/abilities/:id', (req, res) => {
  getDb().prepare('UPDATE abilities SET name = ? WHERE id = ?').run(req.body.name, req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/abilities/:id', (req, res) => {
  getDb().prepare('DELETE FROM abilities WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Experiences ───
router.get('/experiences', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM experiences ORDER BY sort_order ASC').all();
  const getJobDesk = db.prepare('SELECT * FROM experience_job_desk WHERE experience_id = ? ORDER BY sort_order');
  const getAchievements = db.prepare('SELECT * FROM experience_achievements WHERE experience_id = ? ORDER BY sort_order');
  const result = items.map(item => ({
    ...item,
    job_desk: getJobDesk.all(item.id),
    achievements: getAchievements.all(item.id)
  }));
  res.json(result);
});

router.post('/experiences', (req, res) => {
  const { role, company, period_start, period_end, description, job_desk, achievements } = req.body;
  const db = getDb();
  const minOrder = db.prepare('SELECT COALESCE(MIN(sort_order), 0) - 1 AS next FROM experiences').get().next;
  const result = db.prepare('INSERT INTO experiences (role, company, period_start, period_end, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    .run(role, company, period_start || '', period_end || '', description || '', minOrder);
  const expId = result.lastInsertRowid;

  if (job_desk && job_desk.length) {
    const insertJobDesk = db.prepare('INSERT INTO experience_job_desk (experience_id, text, sort_order) VALUES (?, ?, ?)');
    job_desk.forEach((text, i) => insertJobDesk.run(expId, text, i));
  }
  if (achievements && achievements.length) {
    const insertAchievement = db.prepare('INSERT INTO experience_achievements (experience_id, text, sort_order) VALUES (?, ?, ?)');
    achievements.forEach((text, i) => insertAchievement.run(expId, text, i));
  }
  syncJson();
  res.json({ success: true, id: expId });
});

router.put('/experiences/reorder', (req, res) => {
  const { ids } = req.body;
  const db = getDb();
  const stmt = db.prepare('UPDATE experiences SET sort_order = ? WHERE id = ?');
  const tx = db.transaction(() => {
    ids.forEach((id, i) => stmt.run(i + 1, id));
  });
  tx();
  syncJson();
  res.json({ success: true });
});

router.put('/experiences/:id', (req, res) => {
  const { role, company, period_start, period_end, description, job_desk, achievements } = req.body;
  const db = getDb();
  db.prepare('UPDATE experiences SET role = ?, company = ?, period_start = ?, period_end = ?, description = ? WHERE id = ?')
    .run(role, company, period_start || '', period_end || '', description || '', req.params.id);

  db.prepare('DELETE FROM experience_job_desk WHERE experience_id = ?').run(req.params.id);
  if (job_desk && job_desk.length) {
    const insertJobDesk = db.prepare('INSERT INTO experience_job_desk (experience_id, text, sort_order) VALUES (?, ?, ?)');
    job_desk.forEach((text, i) => insertJobDesk.run(req.params.id, text, i));
  }

  db.prepare('DELETE FROM experience_achievements WHERE experience_id = ?').run(req.params.id);
  if (achievements && achievements.length) {
    const insertAchievement = db.prepare('INSERT INTO experience_achievements (experience_id, text, sort_order) VALUES (?, ?, ?)');
    achievements.forEach((text, i) => insertAchievement.run(req.params.id, text, i));
  }
  syncJson();
  res.json({ success: true });
});

router.delete('/experiences/:id', (req, res) => {
  getDb().prepare('DELETE FROM experiences WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Education ───
router.get('/education', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM education ORDER BY sort_order').all());
});

router.post('/education', (req, res) => {
  const { degree, institution, gpa, period, description } = req.body;
  console.log('[POST /education] creating new:', { degree, institution });
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM education').get().next;
  const result = db.prepare('INSERT INTO education (degree, institution, gpa, period, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    .run(degree, institution, gpa || '', period || '', description || '', maxOrder);
  console.log('[POST /education] inserted id:', result.lastInsertRowid);
  syncJson();
  res.json({ success: true });
});

router.put('/education/:id', (req, res) => {
  const { degree, institution, gpa, period, description } = req.body;
  console.log('[PUT /education/:id] updating id:', req.params.id, { degree, institution });
  getDb().prepare('UPDATE education SET degree = ?, institution = ?, gpa = ?, period = ?, description = ? WHERE id = ?')
    .run(degree, institution, gpa || '', period || '', description || '', req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/education/:id', (req, res) => {
  getDb().prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Certifications ───
router.get('/certifications', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM certifications ORDER BY sort_order').all());
});

router.post('/certifications', (req, res) => {
  const { name, issuer, link } = req.body;
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM certifications').get().next;
  db.prepare('INSERT INTO certifications (name, issuer, link, sort_order) VALUES (?, ?, ?, ?)')
    .run(name, issuer || '', link || '', maxOrder);
  syncJson();
  res.json({ success: true });
});

router.put('/certifications/:id', (req, res) => {
  const { name, issuer, link } = req.body;
  getDb().prepare('UPDATE certifications SET name = ?, issuer = ?, link = ? WHERE id = ?')
    .run(name, issuer || '', link || '', req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/certifications/:id', (req, res) => {
  getDb().prepare('DELETE FROM certifications WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Projects ───
router.get('/projects', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM projects ORDER BY sort_order').all());
});

router.post('/projects', (req, res) => {
  const { name, description, tech_stack, link } = req.body;
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM projects').get().next;
  db.prepare('INSERT INTO projects (name, description, tech_stack, link, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(name, description || '', tech_stack || '', link || '', maxOrder);
  syncJson();
  res.json({ success: true });
});

router.put('/projects/:id', (req, res) => {
  const { name, description, tech_stack, link } = req.body;
  getDb().prepare('UPDATE projects SET name = ?, description = ?, tech_stack = ?, link = ? WHERE id = ?')
    .run(name, description || '', tech_stack || '', link || '', req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/projects/:id', (req, res) => {
  getDb().prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Awards ───
router.get('/awards', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM awards ORDER BY sort_order').all());
});

router.post('/awards', (req, res) => {
  const { name, issuer, year } = req.body;
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM awards').get().next;
  db.prepare('INSERT INTO awards (name, issuer, year, sort_order) VALUES (?, ?, ?, ?)')
    .run(name, issuer || '', year || '', maxOrder);
  syncJson();
  res.json({ success: true });
});

router.put('/awards/:id', (req, res) => {
  const { name, issuer, year } = req.body;
  getDb().prepare('UPDATE awards SET name = ?, issuer = ?, year = ? WHERE id = ?')
    .run(name, issuer || '', year || '', req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/awards/:id', (req, res) => {
  getDb().prepare('DELETE FROM awards WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Personal Data (Data Saya) ───
router.get('/personal-data', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM personal_data ORDER BY sort_order').all());
});

router.post('/personal-data', (req, res) => {
  const { label, value, icon, type } = req.body;
  const db = getDb();
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM personal_data').get().next;
  db.prepare('INSERT INTO personal_data (label, value, icon, type, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(label, value || '', icon || '', type || 'text', maxOrder);
  syncJson();
  res.json({ success: true });
});

router.put('/personal-data/:id', (req, res) => {
  const { label, value, icon, type } = req.body;
  getDb().prepare('UPDATE personal_data SET label = ?, value = ?, icon = ?, type = ? WHERE id = ?')
    .run(label, value || '', icon || '', type || 'text', req.params.id);
  syncJson();
  res.json({ success: true });
});

router.delete('/personal-data/:id', (req, res) => {
  getDb().prepare('DELETE FROM personal_data WHERE id = ?').run(req.params.id);
  syncJson();
  res.json({ success: true });
});

// ─── Photo Upload ───
const multer = require('multer');
const path = require('path');
const uploadDir = path.join(__dirname, '..', '..', 'src', 'images');
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, 'photo_profile' + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/upload-photo', upload.single('photo'), (req, res) => {
  res.json({ success: true, photo_path: 'src/images/photo_profile' + path.extname(req.file.originalname) });
});

// ─── Manual Sync ───
router.post('/sync', (req, res) => {
  syncJson();
  res.json({ success: true, message: 'Sync completed' });
});

module.exports = router;
