// ══════════════════════════════════════════════
//  MewIQ  –  app.js  (v3 – One Attempt, Final)
// ══════════════════════════════════════════════

const CIRCUMF = 2 * Math.PI * 34; // timer arc circumference

let quizState = {
  questions:   [],
  currentIdx:  0,
  answers:     [],
  timerHandle: null,
  timeLeft:    15,
  userData:    { name: '', age: '', avatarURL: null },
  answered:    false
};

/* ─── One-Attempt Guard ─── */
function hasAlreadyAttempted() {
  return !!localStorage.getItem('mewiq_done');
}
function markAttempted() {
  localStorage.setItem('mewiq_done', Date.now());
}

/* ─── Intro Overlay ─── */
function showIntro() {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;
  overlay.classList.add('visible');
  setTimeout(() => playMeow(1.0), 400);
  typewriterEffect(
    'introSpeech',
    t('مياو... لديك محاولة واحدة فقط 🐾', 'Meow… you only get ONE attempt 🐾'),
    60
  );
}

function dismissIntro() {
  playCatClick();
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;
  overlay.classList.add('hiding');
  setTimeout(() => {
    overlay.classList.remove('visible', 'hiding');
    if (hasAlreadyAttempted()) {
      showAlreadyDoneScreen();
    }
  }, 400);
}

function showAlreadyDoneScreen() {
  const savedResult = loadFromStorage('last_result');
  const savedUser   = loadFromStorage('last_user');
  if (savedResult && savedUser) {
    window._lastResults  = savedResult;
    window._lastUserData = savedUser;
    showScreen('screen-results');
    renderResults(savedResult, savedUser);
  } else {
    showScreen('screen-leaderboard');
  }
}

/* ─── Typewriter Effect ─── */
function typewriterEffect(elId, text, delay) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const chars = [...text]; // handles emoji/unicode
  const timer = setInterval(() => {
    el.textContent += chars[i] || '';
    i++;
    if (i >= chars.length) clearInterval(timer);
  }, delay);
}

/* ─── Question Transition ─── */
function transitionQuestion(callback) {
  const card = document.getElementById('qCard');
  const grid = document.getElementById('optsGrid');
  if (card) card.classList.add('q-exit');
  if (grid) grid.classList.add('q-exit');
  setTimeout(() => {
    if (card) card.classList.remove('q-exit');
    if (grid) grid.classList.remove('q-exit');
    callback();
  }, 280);
}

/* ─── Start Quiz ─── */
function startQuiz() {
  playCatClick();

  if (hasAlreadyAttempted()) {
    showToast(t('🐾 لقد أكملت الاختبار مسبقاً!', '🐾 You have already completed the quiz!'));
    showAlreadyDoneScreen();
    return;
  }

  const nameEl = document.getElementById('userName');
  const ageEl  = document.getElementById('userAge');
  const name   = nameEl ? nameEl.value.trim() : '';
  const age    = ageEl  ? ageEl.value         : '';

  if (!name) {
    showToast(t('✏️ أدخل اسمك أولاً!', '✏️ Enter your name first!'));
    if (nameEl) nameEl.focus();
    return;
  }
  if (!age) {
    showToast(t('🎂 اختر عمرك من فضلك!', '🎂 Please select your age!'));
    return;
  }

  quizState = {
    questions:   shuffle(QUESTIONS),
    currentIdx:  0,
    answers:     [],
    timerHandle: null,
    timeLeft:    15,
    userData:    { name, age, avatarURL: avatarDataURL },
    answered:    false
  };

  const qn = document.getElementById('quizName');
  const qa = document.getElementById('quizAva');
  if (qn) qn.textContent = name;
  if (qa) setAvaEl(qa, avatarDataURL);

  showScreen('screen-quiz');
  loadQuestion();
}

/* ─── Load Question ─── */
function loadQuestion() {
  const { questions, currentIdx } = quizState;
  const q     = questions[currentIdx];
  const total = questions.length;
  quizState.answered = false;

  // Counter & progress bar
  const counterEl = document.getElementById('qCounter');
  const progEl    = document.getElementById('progFill');
  if (counterEl) counterEl.textContent = `${currentIdx + 1} / ${total}`;
  if (progEl)    progEl.style.width    = `${(currentIdx / total) * 100}%`;

  // Category pill
  const cat    = CATEGORIES[q.type];
  const pillEl = document.getElementById('catPill');
  if (pillEl) {
    pillEl.textContent = currentLang === 'en' ? cat.en : cat.ar;
    pillEl.setAttribute('data-type', q.type);
  }

  // Question text
  const lang   = currentLang === 'en' ? q.en : q.ar;
  const iconEl = document.getElementById('qIcon');
  const textEl = document.getElementById('qText');
  if (iconEl) iconEl.textContent = cat.icon;
  if (textEl) textEl.textContent = lang.q;

  // Re-trigger card animation
  const card = document.getElementById('qCard');
  if (card) {
    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = '';
  }

  // Options with stagger animation
  const grid = document.getElementById('optsGrid');
  if (grid) {
    grid.innerHTML = '';
    lang.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      btn.innerHTML = `<span>${opt}</span>`;
      btn.style.animationDelay = `${i * 0.07}s`;
      btn.addEventListener('click', () => selectAnswer(i, q, lang.ans));
      grid.appendChild(btn);
    });
  }

  startTimer(q.time, q);
}

/* ─── Timer ─── */
function startTimer(seconds, q) {
  clearInterval(quizState.timerHandle);
  quizState.timeLeft = seconds;
  updateTimerDisplay(seconds, seconds);

  quizState.timerHandle = setInterval(() => {
    quizState.timeLeft--;
    updateTimerDisplay(quizState.timeLeft, seconds);

    if (quizState.timeLeft <= 3 && quizState.timeLeft > 0) {
      playTone('tick');
    }

    if (quizState.timeLeft <= 0) {
      clearInterval(quizState.timerHandle);
      if (!quizState.answered) {
        vibrate([100, 50, 100]);
        timeOut(q);
      }
    }
  }, 1000);
}

function updateTimerDisplay(left, max) {
  const numEl = document.getElementById('tNum');
  const arcEl = document.getElementById('tArc');
  if (numEl) numEl.textContent = left;

  const offset = CIRCUMF * (1 - left / max);
  if (arcEl) {
    arcEl.style.strokeDasharray  = CIRCUMF;
    arcEl.style.strokeDashoffset = offset;
    const danger = left <= 4;
    if (numEl) numEl.classList.toggle('danger', danger);
    arcEl.classList.toggle('danger', danger);
  }
}

/* ─── Select Answer ─── */
function selectAnswer(idx, q, correct) {
  if (quizState.answered) return;
  quizState.answered = true;
  clearInterval(quizState.timerHandle);

  const isCorrect = idx === correct;
  const timeUsed  = q.time - quizState.timeLeft;
  const btns      = document.querySelectorAll('.opt-btn');

  btns.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === correct)           btn.classList.add('correct');
    if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  quizState.answers.push({
    questionId: q.id, correct: isCorrect,
    timeUsed, maxTime: q.time, points: q.points
  });

  if (isCorrect) {
    playTone('correct');
    vibrate(50);
    if (btns[correct]) btns[correct].classList.add('pulse-correct');
  } else {
    playTone('wrong');
    vibrate([80, 40, 80]);
    const card = document.getElementById('qCard');
    if (card) {
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
    }
  }

  setTimeout(nextQuestion, 950);
}

/* ─── Time Out ─── */
function timeOut(q) {
  quizState.answered = true;
  const lang = currentLang === 'en' ? q.en : q.ar;
  const btns = document.querySelectorAll('.opt-btn');

  btns.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === lang.ans) btn.classList.add('correct');
  });

  quizState.answers.push({
    questionId: q.id, correct: false,
    timeUsed: q.time, maxTime: q.time, points: q.points
  });
  vibrate([100, 50, 100]);
  setTimeout(nextQuestion, 950);
}

/* ─── Next Question ─── */
function nextQuestion() {
  quizState.currentIdx++;
  if (quizState.currentIdx >= quizState.questions.length) {
    finishQuiz();
  } else {
    transitionQuestion(() => loadQuestion());
  }
}

/* ─── Finish Quiz ─── */
async function finishQuiz() {
  clearInterval(quizState.timerHandle);
  const progEl = document.getElementById('progFill');
  if (progEl) progEl.style.width = '100%';

  // Lock – one attempt only
  markAttempted();

  const results  = calculateResults(quizState.answers);
  const userData = quizState.userData;

  // Save locally so returning visitors can see their result
  saveToStorage('last_result', results);
  saveToStorage('last_user', { name: userData.name, age: userData.age, avatarURL: null });

  // Save to Firebase leaderboard
  await addToLeaderboard({
    name:       userData.name,
    age:        userData.age,
    avatarURL:  userData.avatarURL,
    totalScore: results.totalScore,
    rawScore:   results.rawScore,
    accuracy:   results.accuracy,
    speedPct:   results.speedPct,
    iqRange:    results.iqRange,
    mindType:   results.mindType,
    date:       Date.now()
  });

  // Discord rich embed (delayed)
  setTimeout(() => pingDiscordResult(userData, results), 1000);

  window._lastResults  = results;
  window._lastUserData = userData;

  showScreen('screen-results');
  renderResults(results, userData);
}

/* ─── Share ─── */
function shareResult() {
  playCatClick();
  const r = window._lastResults;
  const u = window._lastUserData;
  if (!r || !u) return;

  const text = generateShareText({
    name: u.name, score: r.totalScore,
    iqRange: r.iqRange, mindType: r.mindType,
    speed: r.speedPct, accuracy: r.accuracy
  });

  if (navigator.share) {
    navigator.share({ title: 'MewIQ 🐾', text }).catch(() => copyToClipboard(text));
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(t('✅ تم نسخ النتيجة!', '✅ Result copied!')))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  showToast(t('✅ تم نسخ النتيجة!', '✅ Result copied!'));
}

/* ─── Page Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Always show intro overlay first
  showIntro();
  // Show home screen underneath (unless already attempted)
  if (!hasAlreadyAttempted()) {
    showScreen('screen-home');
  }
});
