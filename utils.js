// ══════════════════════════════════════════════
//  MewIQ  –  utils.js  (v4 – Final)
// ══════════════════════════════════════════════

/* ─── Discord Webhook ─── */
const WEBHOOK = 'https://discord.com/api/webhooks/1496182228516995292/ele1Vk2-tq5n5rfe-9LGj3LgqOcBjShRpKkn1ErUooYkz3fvI1gmesnRriyad0vRPLE8';

function pingDiscordVisit() {
  const msgs = [
    '🐾 مياو! زائر جديد دخل **MewIQ**',
    '🐱 مياو~ شخص جديد في **MewIQ**!',
    '😺 مياو مياو! أحد يستعد لتحدي **MewIQ**'
  ];
  fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: msgs[Math.floor(Math.random() * msgs.length)] })
  }).catch(() => {});
}

function pingDiscordResult(userData, results) {
  const ageLabels = {
    u13: 'أقل من 13', '1317': '13–17', '1824': '18–24',
    '2534': '25–34', '3544': '35–44', '45p': '45+'
  };
  const ageDisplay = ageLabels[userData.age] || userData.age || '—';
  const pct        = results.totalScore / results.maxScore;
  const colour     = pct >= 0.80 ? 0xC084FC : pct >= 0.55 ? 0x818CF8 : 0x4ADE80;

  const embed = {
    title: '🧠 نتيجة جديدة في MewIQ!',
    color: colour,
    fields: [
      { name: '👤 الاسم',         value: String(userData.name),                    inline: true },
      { name: '🎂 الفئة العمرية', value: ageDisplay,                               inline: true },
      { name: '\u200b',            value: '\u200b',                                 inline: true },
      { name: '🏅 النقاط',        value: String(results.totalScore),               inline: true },
      { name: '📊 تقدير الذكاء',  value: String(results.iqRange),                 inline: true },
      { name: '💡 نوع التفكير',   value: (results.mindType || '').replace(/[^\w\s\u0600-\u06FF]/g, '').trim(), inline: true },
      { name: '🎯 الدقة',         value: results.accuracy + '%',                   inline: true },
      { name: '⚡ السرعة',        value: results.speedPct + '%',                   inline: true },
      { name: '✅ إجابات صحيحة',  value: `${results.correct} / ${results.total}`, inline: true }
    ],
    footer:    { text: 'MewIQ 🐾 تحدي الذكاء • mewiq.netlify.app' },
    timestamp: new Date().toISOString()
  };

  fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  }).catch(() => {});
}

/* ─── Language ─── */
let currentLang = localStorage.getItem('mewiq_lang') || 'ar';

function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('mewiq_lang', currentLang);
  applyLanguage();
}

function applyLanguage() {
  const isEn = currentLang === 'en';
  const html = document.documentElement;
  const btn  = document.getElementById('langBtn');
  const back = document.getElementById('backArrow');

  html.setAttribute('lang', currentLang);
  html.setAttribute('dir', isEn ? 'ltr' : 'rtl');
  document.body.classList.toggle('lang-en', isEn);
  if (btn)  btn.textContent  = isEn ? 'AR' : 'EN';
  if (back) back.textContent = isEn ? '←' : '→';

  document.querySelectorAll('[data-ar]').forEach(el => {
    const val = el.getAttribute('data-' + currentLang);
    if (val !== null) el.textContent = val;
  });
  document.querySelectorAll('[data-placeholder-ar]').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + currentLang) || '';
  });
  document.querySelectorAll('select option[data-ar]').forEach(opt => {
    const v = opt.getAttribute('data-' + currentLang);
    if (v) opt.textContent = v;
  });
}

function t(arText, enText) {
  return currentLang === 'en' ? enText : arText;
}

/* ─── Theme ─── */
let isDark = localStorage.getItem('mewiq_theme') !== 'light';

function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('mewiq_theme', isDark ? 'dark' : 'light');
  applyTheme();
}

function applyTheme() {
  const btn = document.getElementById('themeBtn');
  document.body.classList.toggle('dark',  isDark);
  document.body.classList.toggle('light', !isDark);
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
}

/* ─── Sound ─── */
let soundOn  = localStorage.getItem('mewiq_sound') !== 'off';
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  return audioCtx;
}

function toggleSound() {
  soundOn = !soundOn;
  localStorage.setItem('mewiq_sound', soundOn ? 'on' : 'off');
  const btn = document.getElementById('soundBtn');
  if (btn) btn.textContent = soundOn ? '🔊' : '🔇';
}

/* ─── Cat Meow (synthesized) ─── */
function playMeow(pitch = 1.0) {
  if (!soundOn) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  try {
    const now        = ctx.currentTime;
    const osc1       = ctx.createOscillator();
    const osc2       = ctx.createOscillator();
    const gain       = ctx.createGain();
    const filter     = ctx.createBiquadFilter();
    const masterGain = ctx.createGain();

    osc1.connect(filter); osc2.connect(filter);
    filter.connect(gain); gain.connect(masterGain);
    masterGain.connect(ctx.destination);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800 * pitch,  now);
    filter.frequency.linearRampToValueAtTime(2200 * pitch, now + 0.25);
    filter.frequency.linearRampToValueAtTime(700 * pitch,  now + 0.65);
    filter.Q.value = 6;

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(260 * pitch, now);
    osc1.frequency.linearRampToValueAtTime(520 * pitch, now + 0.18);
    osc1.frequency.linearRampToValueAtTime(220 * pitch, now + 0.6);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(520 * pitch, now);
    osc2.frequency.linearRampToValueAtTime(1040 * pitch, now + 0.18);
    osc2.frequency.linearRampToValueAtTime(440 * pitch,  now + 0.6);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    masterGain.gain.value = 0.5;

    osc1.start(now); osc1.stop(now + 0.75);
    osc2.start(now); osc2.stop(now + 0.75);
  } catch (e) {}
}

/* ─── Tiny cat click chirp ─── */
function playCatClick() {
  if (!soundOn) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  try {
    const now  = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.start(now); osc.stop(now + 0.09);
  } catch (e) {}
}

/* ─── Tones ─── */
function playTone(type) {
  if (!soundOn) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  try {
    const now = ctx.currentTime;
    switch (type) {
      case 'click':
        playCatClick();
        break;

      case 'correct': {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        g.gain.setValueAtTime(0.2, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        break;
      }
      case 'wrong': {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(150, now + 0.12);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now); osc.stop(now + 0.28);
        break;
      }
      case 'finish':
        [0, .12, .24, .38].forEach((d, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sine';
          o.frequency.value = [523, 659, 784, 1047][i];
          g.gain.setValueAtTime(0.18, now + d);
          g.gain.exponentialRampToValueAtTime(0.001, now + d + 0.35);
          o.start(now + d); o.stop(now + d + 0.35);
        });
        break;

      case 'tick': {
        const osc = ctx.createOscillator(), g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'square'; osc.frequency.value = 880;
        g.gain.setValueAtTime(0.06, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
        break;
      }
    }
  } catch (e) {}
}

/* ─── Vibration ─── */
function vibrate(p) {
  try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {}
}

/* ─── Toast ─── */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ─── Screen Navigation ─── */
let prevScreen = 'screen-home';
function showScreen(id) {
  const cur = document.querySelector('.screen.active');
  if (cur) prevScreen = cur.id;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
  applyLanguage();
  if (id === 'screen-leaderboard') renderLeaderboard();
}
function goBack() { showScreen(prevScreen || 'screen-home'); }

/* ─── Avatar ─── */
let avatarDataURL = null;
function handleAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = ev => {
    avatarDataURL = ev.target.result;
    const img = document.getElementById('avatarImg');
    if (img) img.innerHTML = `<img src="${avatarDataURL}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`;
  };
  r.readAsDataURL(file);
}
function setAvaEl(el, url) {
  if (!el) return;
  el.innerHTML = url
    ? `<img src="${url}" alt="av" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`
    : '<span>🐾</span>';
}

/* ─── Storage Helpers ─── */
function saveToStorage(key, val) {
  try { localStorage.setItem('mewiq_' + key, JSON.stringify(val)); } catch (e) {}
}
function loadFromStorage(key) {
  try {
    const v = localStorage.getItem('mewiq_' + key);
    return v ? JSON.parse(v) : null;
  } catch (e) { return null; }
}

/* ─── Shuffle ─── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Share Text ─── */
function generateShareText(d) {
  const line = '🐾🐾🐾🐾🐾';
  if (currentLang === 'en') {
    return `${line}\n🧠 MewIQ Brain Challenge\n\n👤 ${d.name}\n🏅 Score: ${d.score} pts\n📊 IQ Range: ${d.iqRange}\n💡 Mind Type: ${d.mindType}\n⚡ Speed: ${d.speed}%  🎯 Accuracy: ${d.accuracy}%\n\nCan you beat me? → mewiq.netlify.app\n${line}`;
  }
  return `${line}\n🧠 تحدي MewIQ للذكاء\n\n👤 ${d.name}\n🏅 النقاط: ${d.score}\n📊 تقدير الذكاء: ${d.iqRange}\n💡 نوع التفكير: ${d.mindType}\n⚡ السرعة: ${d.speed}%  🎯 الدقة: ${d.accuracy}%\n\nهل تتحداني؟ → mewiq.netlify.app\n${line}`;
}

/* ─── Confetti ─── */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.pointerEvents = 'none';

  const colors = ['#c084fc', '#f0abfc', '#818cf8', '#4ade80', '#fbbf24', '#60a5fa', '#fb7185'];
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 12 + 4, h: Math.random() * 7 + 3,
    r: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - .5) * 2.5,
    vy: Math.random() * 3.5 + 1.5,
    vr: (Math.random() - .5) * 7
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.r * Math.PI / 180);
      ctx.fillStyle    = p.color;
      ctx.globalAlpha  = Math.max(0, 1 - frame / 130);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
    });
    frame++;
    if (frame < 140) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyLanguage();
  const sb = document.getElementById('soundBtn');
  if (sb) sb.textContent = soundOn ? '🔊' : '🔇';
  // Delayed visit ping – no personal data
  setTimeout(pingDiscordVisit, 3000);
});
