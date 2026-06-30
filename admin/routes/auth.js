const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ success: true, redirect: '/admin/dashboard' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

module.exports = router;
