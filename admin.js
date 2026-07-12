const { execSync } = require('child_process');
const path = require('path');

// Seed default admin user
try {
  execSync('node seed.js', { cwd: path.join(__dirname, 'admin'), stdio: 'inherit' });
} catch (e) {
  console.error('[admin] Seed failed:', e.message);
}

// Start server
try {
  execSync('node server.js', { cwd: path.join(__dirname, 'admin'), stdio: 'inherit' });
} catch (e) {
  console.error('[admin] Server error:', e.message);
}
