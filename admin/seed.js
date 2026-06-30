const bcrypt = require('bcryptjs');
const { getDb, closeDb } = require('./db');

const db = getDb();

const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!existing) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('[seed] Admin user created: admin / admin123');
} else {
  console.log('[seed] Admin user already exists');
}

closeDb();
