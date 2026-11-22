async function renderCV() {
  try {
    const res = await fetch('/data/data.json');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    renderSidebar(data);
    renderMain(data);
    renderRight(data);
  } catch (e) {
    console.warn('[cv] data.json not available, rendering empty CV');
  }
}

function formatDateID(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function renderSidebar(data) {
  const sidebar = document.getElementById('cv-sidebar');
  const p = data.profile || {};
  const c = data.contact || {};
  const sm = data.social_media || [];
  const skills = data.skills || [];
  const abilities = data.abilities || [];

  let html = '';

  // Profile photo
  const photoSrc = p.photo_path ? '/' + p.photo_path : 'src/images/photo_profile.jpg';
  html += `<div><div class="profile-photo-wrap"><img src="${photoSrc}" alt="${p.name || 'Profile'}" class="profile-photo"></div></div>`;

  // Contact
  if (c.phone || c.email || c.location || c.whatsapp || c.telegram) {
    html += `<div class="sidebar-section"><div class="sidebar-section-title">// Kontak</div>`;
    if (c.phone) html += `<div class="contact-item"><i class="fas fa-phone"></i> ${c.phone}</div>`;
    if (c.whatsapp) html += `<div class="contact-item"><i class="fab fa-whatsapp"></i> ${c.whatsapp}</div>`;
    if (c.telegram) html += `<div class="contact-item"><i class="fab fa-telegram"></i> ${c.telegram}</div>`;
    if (c.email) html += `<div class="contact-item"><i class="fas fa-envelope"></i> ${c.email}</div>`;
    if (c.location) html += `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${c.location}</div>`;
    html += `</div>`;
  }

  // Personal Data (Data Saya)
  const pd = data.personal_data || [];
  if (pd.length) {
    const birthRow = pd.find(r => r.type === 'date');
    const ageText = (() => {
      if (!birthRow || !birthRow.value) return '';
      const y = parseInt(String(birthRow.value).slice(0, 4), 10);
      return isNaN(y) ? '' : (new Date().getFullYear() - y) + ' Tahun';
    })();
    html += `<div class="sidebar-section"><div class="sidebar-section-title">// Data Saya</div>`;
    pd.forEach(r => {
      let val = '';
      if (r.type === 'age') val = ageText;
      else if (r.type === 'date') val = formatDateID(r.value);
      else val = r.value || '';
      if (!val) return;
      html += `<div class="contact-item"><i class="${r.icon || 'fas fa-info-circle'}"></i> <span>${val}</span></div>`;
    });
    html += `</div>`;
  }

  // Social Media
  if (sm.length) {
    html += `<div class="sidebar-section"><div class="sidebar-section-title">// Sosial Media</div><div class="social-grid">`;
    sm.forEach(s => {
      html += `<div class="social-item"><i class="${s.icon || 'fas fa-link'}"></i> ${s.url.replace(/https?:\/\/(www\.)?/,'')}</div>`;
    });
    html += `</div></div>`;
  }

  // Skills
  if (skills.length) {
    html += `<div class="sidebar-section"><div class="sidebar-section-title">// Keahlian Teknis</div>`;
    skills.forEach(s => {
      html += `<div class="skill-item"><div class="skill-label"><span>${s.name}</span><span>${s.percentage}%</span></div><div class="skill-bar"><div class="skill-fill" style="width:${s.percentage}%"></div></div></div>`;
    });
    html += `</div>`;
  }

  // Abilities
  if (abilities.length) {
    html += `<div class="sidebar-section"><div class="sidebar-section-title">// Kemampuan</div><div class="ability-tags">`;
    abilities.forEach(a => {
      html += `<span class="ability-tag">${a}</span>`;
    });
    html += `</div></div>`;
  }

  sidebar.innerHTML = html;
}

function renderMain(data) {
  const main = document.getElementById('cv-main');
  const p = data.profile || {};
  const exps = data.experiences || [];
  const edu = data.education || [];
  const certs = data.certifications || [];
  const projects = data.projects || [];

  let html = '';

  // Header
  const name = p.name || 'Your Name';
  const nameParts = name.split(' ');
  const lastName = nameParts.pop() || '';
  const firstName = nameParts.join(' ');
  html += `<div class="main-header">
    <div class="main-header-name"><strong>${firstName} </strong>${lastName}</div>
    <div class="main-header-role">// ${p.title || 'Software Engineer'}</div>
  </div>`;

  // Profile
  if (p.bio) {
    html += `<div><div class="main-section-title">// Profil Profesional</div><p class="profile-text">${p.bio}</p></div>`;
  }

  // Experience
  if (exps.length) {
    html += `<div><div class="main-section-title">// Pengalaman Kerja</div>`;
    exps.forEach((e, i) => {
      html += `<div class="exp-item">
        <div class="exp-header">
          <div class="exp-role">${e.role}</div>
          <div class="exp-period">${e.period || (e.period_start ? e.period_start + (e.period_end ? ' – ' + e.period_end : '') : '')}</div>
        </div>
        <div class="exp-company">${e.company}</div>`;
      if (e.job_desk && e.job_desk.length) {
        html += `<div class="exp-sub-title">Responsibilities</div>
        <ul class="exp-bullets">`;
        e.job_desk.forEach(j => {
          html += `<li>${j}</li>`;
        });
        html += `</ul>`;
      }
      if (e.achievements && e.achievements.length) {
        html += `<div class="exp-sub-title">Key Contributions / Achievements</div>
        <ul class="exp-bullets">`;
        e.achievements.forEach(a => {
          html += `<li>${a}</li>`;
        });
        html += `</ul>`;
      }
      html += `</div>`;
      if (i < exps.length - 1) html += `<hr class="exp-divider">`;
    });
    html += `</div>`;
  }

  // Education
  if (edu.length) {
    html += `<div><div class="main-section-title" style="margin-bottom: 30px;">// Pendidikan</div>`;
    edu.forEach(e => {
      html += `<div class="edu-item">
        <span class="edu-year">${e.period || ''}</span>
        <div class="edu-content">
          <div class="edu-header">
            <span class="edu-school">${e.institution}</span>
            <span class="edu-dash"></span>
            <span class="edu-degree">${e.degree}</span>
          </div>
          ${e.gpa ? `<div class="edu-gpa">${e.gpa}</div>` : ''}
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  // Certifications
  if (certs.length) {
    html += `<div><div class="main-section-title">// Sertifikat</div><div class="cert-grid">`;
    certs.forEach(c => {
      html += `<div class="cert-item">
        <div class="cert-icon"><i class="fas fa-certificate"></i></div>
        <div>
          <div class="cert-name">${c.name}</div>
          ${c.issuer ? `<div class="cert-issuer">${c.issuer}</div>` : ''}
        </div>
      </div>`;
    });
    html += `</div></div>`;
  }

  // Projects
  if (projects.length) {
    html += `<div><div class="main-section-title">// Proyek</div><div class="project-grid">`;
    projects.forEach(pr => {
      const tags = (pr.tech_stack || '').split(',').map(t => t.trim()).filter(Boolean);
      html += `<div class="project-item">
        <div class="project-name">${pr.name}</div>
        ${pr.description ? `<div class="project-desc">${pr.description}</div>` : ''}
        ${tags.length ? `<div class="project-tags">${tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
      </div>`;
    });
    html += `</div></div>`;
  }

  main.innerHTML = html;
}

function renderRight(data) {
  const right = document.getElementById('cv-right');
  const awards = data.awards || [];

  if (!awards.length) {
    right.innerHTML = '';
    return;
  }

  let html = `<div class="right-section"><div class="right-section-title">// Penghargaan & Sertifikasi</div>`;
  awards.forEach(a => {
    html += `<div class="achieve-item">
      <div class="achieve-icon"><i class="fas fa-medal"></i></div>
      <div class="achieve-body">
        <div class="achieve-title">${a.name}</div>
        <div class="achieve-meta">${a.issuer ? a.issuer + (a.year ? ' · ' + a.year : '') : (a.year || '')}</div>
        ${a.description ? `<div class="achieve-desc">${a.description}</div>` : ''}
      </div>
    </div>`;
  });
  html += `</div>`;

  right.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderCV);
