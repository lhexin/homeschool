/* progress.js — completion tracking, badge rules, Google Form logging, celebration overlay.
   To wire up real cross-device logging: create a free Google Form with fields
   childId, lessonId, subject, eventType, note, completedAt, then fill in
   GOOGLE_FORM_URL and GOOGLE_FORM_FIELDS below (get these from the Form's
   pre-filled link: File > "Get pre-filled link", fill dummy values, copy the URL). */

const GOOGLE_FORM_URL = ''; // e.g. 'https://docs.google.com/forms/d/e/XXXXX/formResponse'
const GOOGLE_FORM_FIELDS = {
  childId: 'entry.111111111',
  lessonId: 'entry.222222222',
  subject: 'entry.333333333',
  eventType: 'entry.444444444',
  note: 'entry.555555555'
};

function completedKey(childId) { return `fs:completed:${childId}`; }
function badgesKey(childId) { return `fs:badges:${childId}`; }

function getCompletedList(childId) {
  try { return JSON.parse(localStorage.getItem(completedKey(childId)) || '[]'); }
  catch (e) { return []; }
}

function isCompleted(childId, lessonId) {
  return getCompletedList(childId).some(c => c.lessonId === lessonId);
}

function countCompleted(childId, subjectId) {
  // "games" is virtual (see lessonsFor in app.js) — completions are logged
  // under the lesson's real subject, so match by lessonId membership instead.
  if (subjectId === 'games') {
    const gameLessonIds = new Set(DATA.lessons.filter(l => l.type === 'game').map(l => l.id));
    return getCompletedList(childId).filter(c => gameLessonIds.has(c.lessonId)).length;
  }
  return getCompletedList(childId).filter(c => c.subject === subjectId).length;
}

function markCompleted(childId, lessonId, subject) {
  if (isCompleted(childId, lessonId)) { checkBadges(childId); return; }
  const list = getCompletedList(childId);
  list.push({ lessonId, subject, completedAt: new Date().toISOString() });
  localStorage.setItem(completedKey(childId), JSON.stringify(list));
  submitToGoogleForm({ childId, lessonId, subject, eventType: 'completed', note: '' });
  checkBadges(childId);
  // Re-render current view so stars/progress update immediately.
  if (typeof router === 'function') router();
}

function getEarnedBadges(childId) {
  try { return JSON.parse(localStorage.getItem(badgesKey(childId)) || '[]'); }
  catch (e) { return []; }
}

function setEarnedBadges(childId, ids) {
  localStorage.setItem(badgesKey(childId), JSON.stringify(ids));
}

function toggleParentBadge(childId, badgeId) {
  const earned = getEarnedBadges(childId);
  const idx = earned.indexOf(badgeId);
  if (idx >= 0) {
    earned.splice(idx, 1);
  } else {
    earned.push(badgeId);
    submitToGoogleForm({ childId, lessonId: '', subject: '', eventType: 'badgeEarned', note: badgeId });
  }
  setEarnedBadges(childId, earned);
}

function activeDayStreak(childId) {
  const days = new Set(getCompletedList(childId).map(c => c.completedAt.slice(0, 10)));
  let streak = 0;
  let cursor = new Date();
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function checkBadges(childId) {
  if (!DATA.badges) return;
  const earned = getEarnedBadges(childId);
  const totalDone = getCompletedList(childId).length;
  let changed = false;
  let newlyEarned = null;

  DATA.badges.forEach(b => {
    if (b.parentAwarded || earned.includes(b.id) || !b.rule) return;
    let unlocked = false;
    if (b.rule.type === 'completeCount') unlocked = totalDone >= b.rule.count;
    if (b.rule.type === 'subjectCompleteCount') unlocked = countCompleted(childId, b.rule.subject) >= b.rule.count;
    if (b.rule.type === 'activeDayStreak') unlocked = activeDayStreak(childId) >= b.rule.days;
    if (unlocked) {
      earned.push(b.id);
      changed = true;
      newlyEarned = b;
      submitToGoogleForm({ childId, lessonId: '', subject: '', eventType: 'badgeEarned', note: b.id });
    }
  });

  if (changed) {
    setEarnedBadges(childId, earned);
    if (newlyEarned) showCelebration(newlyEarned);
  }
}

function showCelebration(badge) {
  const overlay = document.createElement('div');
  overlay.className = 'celebrate-overlay';
  overlay.innerHTML = `
    <div class="badge-big" style="background:#FFD23F;display:flex;align-items:center;justify-content:center">
      ${getIconSvg(badge.icon, 48, '#4A2A00')}
    </div>
    <h2>New badge! ${badge.label}</h2>
    <button id="celebrateClose">Yay!</button>
  `;
  document.body.appendChild(overlay);
  document.getElementById('celebrateClose').addEventListener('click', () => overlay.remove());
}

function submitToGoogleForm(payload) {
  if (!GOOGLE_FORM_URL) return; // logging disabled until the parent sets up the Form
  const params = new URLSearchParams();
  Object.keys(GOOGLE_FORM_FIELDS).forEach(key => {
    if (payload[key] !== undefined) params.append(GOOGLE_FORM_FIELDS[key], payload[key]);
  });
  fetch(`${GOOGLE_FORM_URL}?${params.toString()}`, { mode: 'no-cors' }).catch(() => {});
}

// Games embedded via window.location (not iframe) call this through a
// shared-storage handshake: a game posts to window.opener if opened in a
// new tab, or — since we navigate in-place — writes its result to
// localStorage under 'fs:pendingComplete' before redirecting back.
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'activityComplete') {
    const { id, childId, score, subject } = event.data;
    markCompleted(childId, id, subject);
  }
});

// Called from app.js after DATA has finished loading, so badge rules can
// actually evaluate (a plain DOMContentLoaded listener here would race
// app.js's async loadData() and silently miss the badge check).
function handlePendingComplete() {
  const pending = localStorage.getItem('fs:pendingComplete');
  if (!pending) return;
  localStorage.removeItem('fs:pendingComplete');
  try {
    const { id, childId, subject } = JSON.parse(pending);
    markCompleted(childId, id, subject);
  } catch (e) {}
}
