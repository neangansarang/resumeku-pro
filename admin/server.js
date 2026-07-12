const path = require('path');
const express = require('express');
const session = require('express-session');
const { getDb, closeDb } = require('./db');
const { syncJson } = require('./sync-json');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'resume-admin-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files for data.json
app.use('/data', express.static(path.join(__dirname, '..', 'data')));
app.use('/src', express.static(path.join(__dirname, '..', 'src')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/admin', express.static(path.join(__dirname, 'views')));

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Root - redirect to index.html (public site)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Initialize DB and sync on startup
getDb();
syncJson();

app.listen(PORT, () => {
  console.log(`[server] Admin dashboard running at http://localhost:${PORT}/admin/login`);
  console.log(`[server] Public site at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  closeDb();
  process.exit();
});
