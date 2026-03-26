// ══════════════════════════════════════════════
//  MewIQ  –  leaderboard.js  (v5 – Firebase Global, Fixed)
//  Uses window.db set by firebase-config.js
// ══════════════════════════════════════════════

const LB_MAX = 10;

/* ─── Slug (document ID from name) ─── */
function _slug(name) {
  return String(name)
    .trim().toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\u0600-\u06FF]/g, '')
    .substring(0, 30) || 'player';
}

/* ─── LocalStorage Fallback ─── */
function _lbGetLocal() {
  try {
    const raw = localStorage.getItem('mewiq_lb_entries');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function _lbSetLocal(arr) {
  try {
    localStorage.setItem('mewiq_lb_entries', JSON.stringify(arr));
  } catch (e) {}
}

/* ─── Add Entry ─── */
async function addToLeaderboard(entry) {
  if (!entry || !entry.name) return;

  // Always update localStorage first (instant fallback)
  let local = _lbGetLocal();
  const li = local.findIndex(e =>
    e.name && e.name.trim().toLowerCase() === entry.name.trim().toLowerCase()
  );
  if (li >= 0) {
    if (entry.totalScore > local[li].totalScore) local[li] = entry;
  } else {
    local.push(entry);
  }
  local.sort((a, b) => b.totalScore - a.totalScore);
  _lbSetLocal(local.slice(0, LB_MAX));

  // Firebase write
  if (!window.db) {
    console.warn('Firestore not ready – saved locally only');
    return;
  }

  try {
    const docId  = _slug(entry.name);
    const docRef = window.db.collection('leaderboard').doc(docId);
    const snap   = await docRef.get();

    if (!snap.exists || entry.totalScore > (snap.data().totalScore || 0)) {
      await docRef.set({
        name:       entry.name,
        age:        entry.age        || '',
        totalScore: entry.totalScore || 0,
        rawScore:   entry.rawScore   || 0,
        accuracy:   entry.accuracy   || 0,
        speedPct:   entry.speedPct   || 0,
        iqRange:    entry.iqRange    || '',
        mindType:   entry.mindType   || '',
        date:       Date.now()
      });
      console.log('✅ Leaderboard saved to Firestore');
    }
  } catch (e) {
    console.warn('Firestore write error:', e.message);
  }
}

/* ─── Fetch Leaderboard Data ─── */
async function _fetchLeaderboard() {
  // Try Firestore first
  if (window.db) {
    try {
      const snap = await window.db.collection('leaderboard')
        .orderBy('totalScore', 'desc')
        .limit(LB_MAX)
        .get();

      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore read error:', e.message);
    }
  }
  // Fallback to localStorage
  return _lbGetLocal();
}

/* ─── Colorful Initials Avatar ─── */
function _initials(name) {
  const words = String(name).trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return String(name).substring(0, 2).toUpperCase();
}

function _initialsColor(name) {
  const colors = [
    '#c084fc', '#818cf8', '#f0abfc', '#4ade80',
    '#fbbf24', '#60a5fa', '#fb7185', '#34d399'
  ];
  let hash = 0;
  for (const c of String(name)) hash = c.charCodeAt(0) + (hash << 5) - hash;
  return colors[Math.abs(hash) % colors.length];
}

/* ─── Render Leaderboard ─── */
async function renderLeaderboard() {
  const list = document.getElementById('lbList');
  if (!list) return;

  // Show loading spinner
  list.innerHTML = `
    <div class="lb-loading">
      <div class="lb-spinner"></div>
      <p>${t('جاري التحميل...', 'Loading...')}</p>
    </div>`;

  const lb = await _fetchLeaderboard();

  if (!lb.length) {
    list.innerHTML = `
      <div class="empty-lb">
        <span class="empty-paw">🐾</span>
        <p>${t('لا يوجد أحد بعد – كن الأول!', 'No entries yet – be the first!')}</p>
      </div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const rClass = ['top1', 'top2', 'top3'];

  list.innerHTML = lb.map((e, i) => {
    const rank    = i < 3 ? medals[i] : `#${i + 1}`;
    const cls     = i < 3 ? rClass[i] : '';
    const col     = _initialsColor(e.name);
    const iniAva  = `<div style="width:100%;height:100%;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:800;color:#fff">${_initials(e.name)}</div>`;
    const dateStr = e.date
      ? new Date(e.date).toLocaleDateString(
          currentLang === 'en' ? 'en-US' : 'ar-SA',
          { month: 'short', day: 'numeric' }
        )
      : '';
    const mindClean = (e.mindType || '').replace(/[🧬🔮⚡🚀🌱🌟]/g, '').trim();

    return `
      <div class="lb-item ${cls}" style="animation:fadeInUp .3s ease ${i * 0.06}s both">
        <div class="lb-rank">${rank}</div>
        <div class="lb-ava">${iniAva}</div>
        <div class="lb-info">
          <div class="lb-uname">${escapeHtml(e.name)}</div>
          <div class="lb-meta">${escapeHtml(mindClean)} · ${dateStr}</div>
        </div>
        <div class="lb-score">
          <div class="lb-pts">${e.totalScore}</div>
          <div class="lb-iq">${escapeHtml(e.iqRange || '')}</div>
        </div>
      </div>`;
  }).join('');
}

/* ─── HTML Escape ─── */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─── Get User Rank ─── */
async function getUserRank(score) {
  const lb = await _fetchLeaderboard();
  if (!lb.length) return 1;
  const idx = lb.findIndex(e => score >= e.totalScore);
  return idx === -1 ? lb.length + 1 : idx + 1;
}
