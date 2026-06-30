function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  if (req.xhr || req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.redirect('/admin/login');
}

module.exports = { requireAuth };
