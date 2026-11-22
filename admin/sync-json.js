const path = require('path');
const fs = require('fs');
const { getDb } = require('./db');

const JSON_PATH = path.join(__dirname, '..', 'data', 'data.json');

function syncJson() {
  const db = getDb();

  const profile = db.prepare('SELECT * FROM profile LIMIT 1').get() || {};
  const contact = db.prepare('SELECT * FROM contact LIMIT 1').get() || {};
  const socialMedia = db.prepare('SELECT platform, url, icon FROM social_media ORDER BY sort_order').all();
  const skills = db.prepare('SELECT name, percentage FROM skills ORDER BY sort_order').all();
  const abilities = db.prepare('SELECT name FROM abilities ORDER BY id').all().map(a => a.name);
  const certifications = db.prepare('SELECT name, issuer, link FROM certifications ORDER BY sort_order').all();
  const projects = db.prepare('SELECT name, description, tech_stack, link FROM projects ORDER BY sort_order').all();
  const awards = db.prepare('SELECT name, issuer, year FROM awards ORDER BY sort_order').all();
  const personalData = db.prepare('SELECT label, value, icon, type FROM personal_data ORDER BY sort_order').all();

  const educationRows = db.prepare('SELECT * FROM education ORDER BY sort_order').all();
  const education = educationRows.map(e => ({
    degree: e.degree,
    institution: e.institution,
    gpa: e.gpa,
    period: e.period,
    description: e.description
  }));

  const expRows = db.prepare('SELECT * FROM experiences ORDER BY sort_order ASC').all();
  const getJobDesk = db.prepare('SELECT text FROM experience_job_desk WHERE experience_id = ? ORDER BY sort_order');
  const getAchievements = db.prepare('SELECT text FROM experience_achievements WHERE experience_id = ? ORDER BY sort_order');
  const experiences = expRows.map(e => ({
    role: e.role,
    company: e.company,
    period: e.period_end ? `${e.period_start} - ${e.period_end}` : e.period_start,
    period_start: e.period_start,
    period_end: e.period_end,
    description: e.description,
    job_desk: getJobDesk.all(e.id).map(j => j.text),
    achievements: getAchievements.all(e.id).map(a => a.text)
  }));

  const data = {
    profile: {
      name: profile.name || '',
      title: profile.title || '',
      bio: profile.bio || '',
      photo_path: profile.photo_path || ''
    },
    contact: {
      phone: contact.phone || '',
      email: contact.email || '',
      location: contact.location || '',
      whatsapp: contact.whatsapp || '',
      telegram: contact.telegram || ''
    },
    social_media: socialMedia,
    skills: skills,
    abilities: abilities,
    experiences: experiences,
    education: education,
    certifications: certifications,
    projects: projects,
    awards: awards,
    personal_data: personalData
  };

  const dir = path.dirname(JSON_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[sync] data.json generated at ${JSON_PATH}`);

  return data;
}

module.exports = { syncJson };
