const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const viewsDir = path.join(__dirname, '..', 'views');

router.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  res.sendFile(path.join(viewsDir, 'login.html'));
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(viewsDir, 'dashboard.html'));
});

const pageRoutes = [
  'profile', 'contact', 'social-media', 'skills', 'abilities',
  'experiences', 'education', 'certifications', 'projects', 'awards'
];

pageRoutes.forEach(page => {
  router.get(`/${page}`, requireAuth, (req, res) => {
    res.sendFile(path.join(viewsDir, `${page}.html`));
  });
});

module.exports = router;
