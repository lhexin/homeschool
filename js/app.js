/* app.js — routing, rendering, icon lookup. Data-driven: subjects.json and
   lessons.json control what shows; this file should not need subject-specific
   edits when new content is added. */

const DATA = { children: [], subjects: [], lessons: [], badges: [] };

const ICONS = {
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  flask: '<path d="M9 3v6l-5 9a1.5 1.5 0 0 0 1.3 2.2h13.4A1.5 1.5 0 0 0 20 18l-5-9V3"/><line x1="7" y1="3" x2="17" y2="3"/>',
  speech: '<path d="M21 11.5a8.38 8.38 0 0 1-4.06 7.19L12 22l-1-3.44A8.38 8.38 0 1 1 21 11.5Z"/><path d="M8 10h8M8 13.5h5"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  music: '<circle cx="9" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M12 18V6l8-2v10"/>',
  mask: '<path d="M4 6c2.5-2 5.5-2 8 0s5.5 2 8 0v6c0 6-4 10-8 10S4 18 4 12Z"/><path d="M8.5 11.5h.01M15.5 11.5h.01M9 15.5c1.2 1 3.8 1 5 0"/>',
  ballet: '<path d="M6 17c0-4 2-6 2-9a2 2 0 1 1 4 0c0 1-.5 2-.5 3.5S13 15 13 17"/><path d="M6 17h9a2 2 0 0 1 2 2v1H6Z"/><path d="M17 8l2-2M18 11l2.5-.5"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
  flame: '<path d="M12 2c2 4-2 6-2 10a4 4 0 0 0 8 0c0-2-1-3-1-3s2 1 2 5a7 7 0 0 1-14 0c0-6 5-6 7-12Z"/>',
  controller: '<rect x="2" y="8" width="20" height="10" rx="5"/><line x1="7" y1="11" x2="7" y2="15"/><line x1="5" y1="13" x2="9" y2="13"/><circle cx="16" cy="12" r="1"/><circle cx="18" cy="15" r="1"/>',
  star: '<polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.6.7 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'
};

function getIconSvg(name, size, strokeColor, fillColor) {
  const body = ICONS[name] || ICONS.star;
  const isFilled = name === 'star';
  if (isFilled && fillColor) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fillColor}">${body}</svg>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function mascotSvg(theme) {
  if (theme === 'space') {
    return `<svg width="60" height="60" viewBox="0 0 100 100">
      <ellipse cx="50" cy="30" rx="22" ry="28" fill="#4E8CFF"/>
      <circle cx="50" cy="30" r="10" fill="#12163A"/>
      <circle cx="50" cy="30" r="7" fill="#8FC4FF"/>
      <path d="M28 45 Q18 60 24 78 L36 62 Z" fill="#E6483C"/>
      <path d="M72 45 Q82 60 76 78 L64 62 Z" fill="#E6483C"/>
      <path d="M38 60 L62 60 L56 84 L44 84 Z" fill="#D9DEE8"/>
      <path d="M44 84 L50 96 L56 84 Z" fill="#FFB020"/>
    </svg>`;
  }
  return `<svg width="66" height="66" viewBox="0 0 120 120">
    <path d="M78 30 L92 8 L86 34 Z" fill="#FFD873"/>
    <ellipse cx="66" cy="56" rx="34" ry="30" fill="#FFFFFF"/>
    <path d="M50 30 Q60 44 76 34 Q66 26 50 30" fill="#FF6FA8"/>
    <path d="M52 24 Q64 36 80 28 Q68 18 52 24" fill="#A85CFF"/>
    <path d="M54 40 Q64 50 78 44 Q68 34 54 40" fill="#4E8CFF"/>
    <circle cx="82" cy="52" r="5" fill="#2A1B14"/>
    <ellipse cx="70" cy="66" rx="7" ry="5" fill="#FFC2DC"/>
    <ellipse cx="30" cy="70" rx="12" ry="16" fill="#FFFFFF"/>
    <ellipse cx="20" cy="88" rx="10" ry="14" fill="#FFFFFF"/>
  </svg>`;
}

async function loadData() {
  const [children, subjects, lessons, badges] = await Promise.all([
    fetch('data/children.json').then(r => r.json()),
    fetch('data/subjects.json').then(r => r.json()),
    fetch('data/lessons.json').then(r => r.json()),
    fetch('data/badges.json').then(r => r.json())
  ]);
  DATA.children = children;
  DATA.subjects = subjects;
  DATA.lessons = lessons;
  DATA.badges = badges;
}

function getChild(id) { return DATA.children.find(c => c.id === id); }
function subjectsFor(childId) { return DATA.subjects.filter(s => s.forChild.includes(childId)); }
function lessonsFor(childId, subjectId) {
  // "games" is a virtual subject: it aggregates every game-type lesson for
  // this child regardless of which real subject it's filed under, so the
  // "Game time" tile always has something rather than requiring lessons to
  // be double-tagged.
  if (subjectId === 'games') {
    return DATA.lessons.filter(l => l.forChild.includes(childId) && l.type === 'game');
  }
  return DATA.lessons.filter(l => l.forChild.includes(childId) && l.subject === subjectId);
}
function allLessonsFor(childId) { return DATA.lessons.filter(l => l.forChild.includes(childId)); }

function starsFor(childId, subjectId) {
  const total = lessonsFor(childId, subjectId).length;
  if (total === 0) return 0;
  const done = countCompleted(childId, subjectId);
  return Math.max(0, Math.min(3, Math.round((done / total) * 3)));
}

function renderStars(n) {
  let html = '<div class="star-row">';
  for (let i = 0; i < 3; i++) {
    const filled = i < n;
    html += filled
      ? getIconSvg('star', 14, null, 'var(--star-fill)')
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.5">${ICONS.star}</svg>`;
  }
  return html + '</div>';
}

function pickFeatured(childId) {
  const lessons = allLessonsFor(childId).filter(l => l.type !== 'milestone');
  if (lessons.length === 0) return null;
  return lessons.slice().sort((a, b) => (a.addedOn < b.addedOn ? 1 : -1))[0];
}

function navigate(hash) { window.location.hash = hash; }

function renderKidHome(childId) {
  const child = getChild(childId);
  if (!child) { document.getElementById('app').innerHTML = '<p style="padding:20px">Unknown child.</p>'; return; }
  localStorage.setItem('fs:lastChild', childId);

  const subjects = subjectsFor(childId);
  const featured = pickFeatured(childId);
  const otherChild = DATA.children.find(c => c.id !== childId);
  const earnedBadges = getEarnedBadges(childId);

  let starfieldHtml = '';
  if (child.theme === 'space') {
    starfieldHtml = `<svg class="starfield" width="390" height="220" viewBox="0 0 390 220" style="position:absolute;top:0;left:0" aria-hidden="true">
      <circle cx="30" cy="36" r="2" fill="#FFFFFF"/><circle cx="70" cy="70" r="1.6" fill="#FFFFFF"/>
      <circle cx="340" cy="40" r="2" fill="#FFFFFF"/><circle cx="360" cy="90" r="1.6" fill="#FFFFFF"/>
      <circle cx="200" cy="24" r="1.6" fill="#FFFFFF"/><circle cx="120" cy="50" r="1.4" fill="#FFFFFF"/>
      <circle cx="300" cy="150" r="1.4" fill="#FFFFFF"/>
      <circle cx="350" cy="180" r="20" fill="#3A2E6E"/><circle cx="342" cy="172" r="5" fill="#241C4A"/><circle cx="358" cy="190" r="4" fill="#241C4A"/>
    </svg>`;
  } else {
    starfieldHtml = `<svg class="starfield" width="390" height="220" viewBox="0 0 390 220" style="position:absolute;top:0;left:0" aria-hidden="true">
      <g class="sparkle"><path d="M40 40 L44 50 L54 54 L44 58 L40 68 L36 58 L26 54 L36 50 Z" fill="#FFFFFF"/></g>
      <g class="sparkle"><path d="M340 70 L343 78 L351 81 L343 84 L340 92 L337 84 L329 81 L337 78 Z" fill="#FFFFFF"/></g>
      <g class="sparkle"><path d="M300 30 L303 38 L311 41 L303 44 L300 52 L297 44 L289 41 L297 38 Z" fill="#FFFFFF"/></g>
    </svg>`;
  }

  const greetingSub = child.theme === 'space' ? 'Mission control is ready' : "Let's play and learn!";
  const featuredLabel = child.theme === 'space' ? "Today's mission" : "Today's pick";

  let html = `
    <div class="app-header">
      ${starfieldHtml}
      <div class="mascot" style="position:relative">${mascotSvg(child.theme)}</div>
      <div class="greeting" style="position:relative">
        <div class="name">Hi ${child.name}!</div>
        <div class="sub">${greetingSub}</div>
      </div>
    </div>
    <button class="gate-btn" id="gateBtn" aria-label="Parent settings">${getIconSvg('gear', 18, 'var(--gate-icon)')}</button>
    <div class="panel">
  `;

  if (featured) {
    html += `
      <button class="featured-tile" style="background:${child.avatarColor}22;border:2px solid ${child.avatarColor}" data-lesson="${featured.id}">
        <div class="featured-icon">${getIconSvg(iconForSubject(featured.subject), 26, child.avatarColor)}</div>
        <div>
          <div class="featured-label" style="color:${child.avatarColor}">${featuredLabel}</div>
          <div class="featured-title" style="color:var(--panel-heading)">${featured.title}</div>
        </div>
      </button>
    `;
  }

  html += `<div class="panel-heading" style="margin-top:18px">Pick a subject</div><div class="subject-grid">`;
  subjects.forEach(s => {
    const n = starsFor(childId, s.id);
    html += `
      <button class="subject-tile" style="background:${s.color};box-shadow:0 4px 0 ${shade(s.color, -20)}" data-subject="${s.id}">
        ${getIconSvg(s.icon, 30, '#FFFFFF')}
        <div class="subject-title">${s.label}</div>
        ${renderStars(n)}
      </button>
    `;
  });
  html += `</div>`;

  html += `<div class="badge-shelf">`;
  DATA.badges.forEach(b => {
    const earned = earnedBadges.includes(b.id);
    html += `<button class="badge-chip ${earned ? '' : 'locked'}" style="background:${earned ? '#FFD23F' : '#00000022'}" data-badge="${b.id}" aria-label="${b.label}">
      ${getIconSvg(earned ? b.icon : 'lock', 18, earned ? '#4A2A00' : 'currentColor')}
    </button>`;
  });
  html += `</div>`;

  if (otherChild) {
    html += `
      <div class="switch-link">
        <button class="switch-btn" id="switchBtn">Not ${child.name}?</button>
      </div>
    `;
  }

  html += `</div>`;
  document.body.className = `theme-${child.theme}`;
  document.getElementById('app').innerHTML = html;

  document.getElementById('switchBtn')?.addEventListener('click', () => navigate(`#/kid/${otherChild.id}`));
  let pressTimer;
  const gateBtn = document.getElementById('gateBtn');
  gateBtn.addEventListener('touchstart', () => { pressTimer = setTimeout(() => navigate('#/parent'), 800); });
  gateBtn.addEventListener('touchend', () => clearTimeout(pressTimer));
  gateBtn.addEventListener('mousedown', () => { pressTimer = setTimeout(() => navigate('#/parent'), 800); });
  gateBtn.addEventListener('mouseup', () => clearTimeout(pressTimer));

  document.querySelectorAll('[data-subject]').forEach(el => {
    el.addEventListener('click', () => navigate(`#/subject/${childId}/${el.dataset.subject}`));
  });
  document.querySelector('[data-lesson]')?.addEventListener('click', (e) => {
    openLesson(childId, e.currentTarget.dataset.lesson);
  });
}

function iconForSubject(subjectId) {
  const s = DATA.subjects.find(s => s.id === subjectId);
  return s ? s.icon : 'star';
}

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function renderSubjectView(childId, subjectId) {
  const child = getChild(childId);
  const subject = DATA.subjects.find(s => s.id === subjectId);
  const lessons = lessonsFor(childId, subjectId);
  document.body.className = `theme-${child.theme}`;

  let html = `
    <div class="panel" style="margin-top:0;border-radius:0;min-height:100vh">
      <button class="back-link" id="backBtn" style="background:none;padding:16px 0 0;font-size:15px;color:var(--panel-heading)">&larr; ${child.name}'s home</button>
      <div class="panel-heading" style="font-size:20px;margin-top:8px">${subject.label}</div>
      <div style="margin-top:16px;display:flex;flex-direction:column;gap:12px">
  `;
  if (lessons.length === 0) {
    html += `<p style="color:var(--panel-heading)">Nothing here yet — check back soon!</p>`;
  }
  lessons.forEach(l => {
    const done = isCompleted(childId, l.id);
    html += `
      <button class="featured-tile" style="background:${subject.color}22;border:2px solid ${subject.color};color:var(--panel-heading)" data-lesson="${l.id}">
        <div class="featured-icon">${getIconSvg(l.type === 'game' ? 'controller' : (l.type === 'milestone' ? 'star' : 'book'), 22, subject.color)}</div>
        <div style="flex-grow:1">
          <div class="featured-title" style="color:var(--panel-heading)">${l.title}</div>
          ${l.note ? `<div style="font-size:13px;color:var(--header-sub);margin-top:2px">${l.note}</div>` : ''}
        </div>
        ${done ? getIconSvg('star', 18, null, subject.color) : ''}
      </button>
    `;
  });
  html += `</div></div>`;
  document.getElementById('app').innerHTML = html;
  document.getElementById('backBtn').addEventListener('click', () => navigate(`#/kid/${childId}`));
  document.querySelectorAll('[data-lesson]').forEach(el => {
    el.addEventListener('click', () => openLesson(childId, el.dataset.lesson));
  });
}

function openLesson(childId, lessonId) {
  const lesson = DATA.lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  if (lesson.type === 'milestone') {
    markCompleted(childId, lessonId, lesson.subject);
    return;
  }
  if (lesson.type === 'video') {
    showVideoModal(lesson, () => markCompleted(childId, lessonId, lesson.subject));
    return;
  }
  if (lesson.type === 'game') {
    window.location.href = `${lesson.gameFile}${lesson.gameFile.includes('?') ? '&' : '?'}childId=${childId}&lessonId=${lessonId}&subject=${lesson.subject}`;
  }
}

function showVideoModal(lesson, onWatched) {
  const overlay = document.createElement('div');
  overlay.className = 'celebrate-overlay';
  overlay.innerHTML = `
    <button id="dismissVideo" aria-label="Close without marking watched"
      style="position:absolute;top:18px;right:18px;width:40px;height:40px;border-radius:50%;
      background:rgba(255,255,255,0.15);color:#FFFFFF;font-size:20px;line-height:1;padding:0;">&times;</button>
    <div style="width:100%;max-width:360px;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden">
      <iframe width="100%" height="100%" src="${lesson.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <button id="closeVideo">I watched this!</button>
  `;
  document.body.appendChild(overlay);
  document.getElementById('dismissVideo').addEventListener('click', () => {
    overlay.remove();
  });
  document.getElementById('closeVideo').addEventListener('click', () => {
    overlay.remove();
    onWatched();
  });
}

function renderParentDashboard() {
  document.body.className = '';
  let html = `<div class="parent-view">
    <button class="back-link" id="backBtn" style="background:none">&larr; Back</button>
    <h1>Parent dashboard</h1>
  `;

  DATA.children.forEach(child => {
    html += `<h2 style="font-size:16px;margin-top:24px;color:${child.avatarColor}">${child.name}</h2>`;
    subjectsFor(child.id).forEach(s => {
      const total = lessonsFor(child.id, s.id).length;
      const done = countCompleted(child.id, s.id);
      const pct = total ? Math.round((done / total) * 100) : 0;
      html += `
        <div class="progress-row">
          <span style="width:90px;font-size:13px;color:#6B6656">${s.label}</span>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%;background:${s.color}"></div></div>
          <span style="font-size:12px;color:#8A8577;width:40px;text-align:right">${done}/${total}</span>
        </div>
      `;
    });

    const earned = getEarnedBadges(child.id);
    html += `<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px">`;
    DATA.badges.forEach(b => {
      const has = earned.includes(b.id);
      if (b.parentAwarded) {
        html += `<button class="award-btn ${has ? 'awarded' : ''}" data-award="${child.id}:${b.id}">${b.label}${has ? ' ✓' : ''}</button>`;
      } else {
        html += `<span class="award-btn" style="opacity:${has ? 1 : 0.4}">${b.label}${has ? ' ✓' : ''}</span>`;
      }
    });
    html += `</div>`;
  });

  html += `
    <p style="margin-top:28px;font-size:13px;color:#8A8577">
      To add a lesson, subject, or milestone: edit the matching file in <code>/data</code> and push to GitHub — it goes live in about a minute.
    </p>
    <p style="font-size:13px;color:#8A8577">
      Full activity log: <a href="#" id="sheetLink">open the Google Sheet</a> (set your Sheet URL in <code>js/progress.js</code>).
    </p>
  </div>`;

  document.getElementById('app').innerHTML = html;
  document.getElementById('backBtn').addEventListener('click', () => {
    const last = localStorage.getItem('fs:lastChild') || DATA.children[0]?.id;
    navigate(`#/kid/${last}`);
  });
  document.querySelectorAll('[data-award]').forEach(el => {
    el.addEventListener('click', () => {
      const [childId, badgeId] = el.dataset.award.split(':');
      toggleParentBadge(childId, badgeId);
      renderParentDashboard();
    });
  });
}

async function router() {
  const hash = window.location.hash || '';
  const parts = hash.replace('#/', '').split('/');
  if (parts[0] === 'parent') { renderParentDashboard(); return; }
  if (parts[0] === 'subject' && parts[1] && parts[2]) { renderSubjectView(parts[1], parts[2]); return; }
  if (parts[0] === 'kid' && parts[1]) { renderKidHome(parts[1]); return; }
  const last = localStorage.getItem('fs:lastChild');
  const target = (last && getChild(last)) ? last : DATA.children[0]?.id;
  if (target) navigate(`#/kid/${target}`); else document.getElementById('app').innerHTML = '<p>No children configured.</p>';
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  if (typeof handlePendingComplete === 'function') handlePendingComplete();
  router();
});
