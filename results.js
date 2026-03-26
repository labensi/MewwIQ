// ══════════════════════════════════════════════
//  MewIQ  –  results.js  (v3 – Final)
// ══════════════════════════════════════════════

function calculateResults(answers) {
  const total    = answers.length;
  const correct  = answers.filter(a => a.correct).length;
  const rawScore = answers.reduce((sum, a) => sum + (a.correct ? a.points : 0), 0);
  const maxRaw   = QUESTIONS.reduce((s, q) => s + q.points, 0);

  const accuracy = Math.round((correct / total) * 100);

  const speedRatio = answers.reduce((sum, a) => {
    if (!a.correct) return sum;
    return sum + (1 - (a.timeUsed / a.maxTime)) * 0.8 + 0.2;
  }, 0) / Math.max(correct, 1);
  const speedPct = Math.round(speedRatio * 100);

  const speedBonus = Math.round(speedPct * 0.3);
  const totalScore = Math.min(rawScore + speedBonus, maxRaw + 30);

  const pct = totalScore / (maxRaw + 30);
  let iqRange, mindType, mindIcon, analysis;

  if (pct >= 0.92) {
    iqRange  = '135 – 145+';
    mindType = t('مستوى العبقري 🧬', 'Genius Level 🧬');
    mindIcon = '🧬';
    analysis = t(
      'أداء معرفي استثنائي. تعالج الأنماط المعقدة بسرعة ودقة فائقة. أنت ضمن أفضل 1٪ في هذا التحدي!',
      'Extraordinary cognitive performance. You process complex patterns with exceptional speed and precision. Top 1% of this challenge!'
    );
  } else if (pct >= 0.80) {
    iqRange  = '120 – 134';
    mindType = t('سيد الأنماط 🔮', 'Pattern Master 🔮');
    mindIcon = '🔮';
    analysis = t(
      'مهارات تحليلية رائعة! ترى أنماطاً يفوتها الآخرون وتحل المشكلات بمنطق أنيق. أنت في أعلى 10٪!',
      'Outstanding analytical skills! You see patterns others miss and solve problems with elegant logic. Top 10%!'
    );
  } else if (pct >= 0.68) {
    iqRange  = '110 – 119';
    mindType = t('مفكر حاد ⚡', 'Sharp Thinker ⚡');
    mindIcon = '⚡';
    analysis = t(
      'ذكاء فوق المتوسط مع منطق قوي. تتعامل مع المسائل المجردة بثقة وسرعة ملحوظة.',
      'Above-average intelligence with strong logical reasoning. You handle abstract problems with confidence and speed.'
    );
  } else if (pct >= 0.52) {
    iqRange  = '95 – 109';
    mindType = t('مفكر سريع 🚀', 'Fast Thinker 🚀');
    mindIcon = '🚀';
    analysis = t(
      'أداء متوسط جيد مع سرعة ملحوظة. وقت استجابتك ممتاز ومنطقك سليم. المحاولة الوحيدة لم تخذلك!',
      'Solid average performance with good speed. Your reaction time is excellent and your reasoning is sound.'
    );
  } else if (pct >= 0.36) {
    iqRange  = '82 – 94';
    mindType = t('عقل فضولي 🌱', 'Curious Mind 🌱');
    mindIcon = '🌱';
    analysis = t(
      'تُظهر فضولاً ورغبة في مواجهة المسائل الصعبة. هذه كانت محاولتك الوحيدة وقدّمت كل ما لديك!',
      'You show curiosity and willingness to tackle hard problems. This was your one shot – you gave it your all!'
    );
  } else {
    iqRange  = '70 – 81';
    mindType = t('نجم صاعد 🌟', 'Rising Star 🌟');
    mindIcon = '🌟';
    analysis = t(
      'كل خبير كان مبتدئاً في يوم ما! شجاعتك في مواجهة هذا التحدي تدل على عزيمة حقيقية.',
      'Every expert was once a beginner! Your courage in facing this challenge shows real determination.'
    );
  }

  return {
    rawScore, totalScore,
    maxScore: maxRaw + 30,
    accuracy, speedPct,
    correct, total,
    iqRange, mindType, mindIcon, analysis
  };
}

async function renderResults(results, userData) {
  // ── Avatar ──
  const resAva = document.getElementById('resAva');
  if (resAva) {
    resAva.innerHTML = userData.avatarURL
      ? `<img src="${userData.avatarURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`
      : '<span>🐾</span>';
  }

  const resName = document.getElementById('resName');
  if (resName) resName.textContent = userData.name;

  // ── Score ring ──
  const scoreEl = document.getElementById('scoreVal');
  const ringEl  = document.getElementById('srFill');
  const circumf = 2 * Math.PI * 85;
  const pct     = results.totalScore / results.maxScore;
  const offset  = circumf * (1 - Math.min(pct, 1));

  // Animated score count-up
  let n = 0;
  const target = results.totalScore;
  const step   = target / (1500 / 16);
  const anim   = setInterval(() => {
    n = Math.min(n + step, target);
    if (scoreEl) scoreEl.textContent = Math.round(n);
    if (n >= target) clearInterval(anim);
  }, 16);

  // Animated ring
  setTimeout(() => {
    if (!ringEl) return;
    ringEl.style.strokeDasharray  = circumf;
    ringEl.style.strokeDashoffset = offset;
    const svg = ringEl.closest('svg');
    if (svg && !svg.querySelector('#scoreGrad')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `<linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#c084fc"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>`;
      svg.prepend(defs);
    }
    if (ringEl) ringEl.setAttribute('stroke', 'url(#scoreGrad)');
  }, 200);

  // ── Metrics ──
  const iqNum     = document.getElementById('iqNum');
  const mindIcon  = document.getElementById('mindIcon');
  const mindLabel = document.getElementById('mindLabel');
  const bkSpeed   = document.getElementById('bkSpeed');
  const bkAcc     = document.getElementById('bkAcc');
  const bkRaw     = document.getElementById('bkRaw');
  const analysisEl = document.getElementById('analysisBox');
  const rankEl    = document.getElementById('userRankDisplay');

  if (iqNum)     iqNum.textContent     = results.iqRange;
  if (mindIcon)  mindIcon.textContent  = results.mindIcon;
  if (mindLabel) mindLabel.textContent = results.mindType;
  if (bkSpeed)   bkSpeed.textContent   = results.speedPct + '%';
  if (bkAcc)     bkAcc.textContent     = results.accuracy + '%';
  if (bkRaw)     bkRaw.textContent     = results.rawScore + ' / ' + QUESTIONS.reduce((s, q) => s + q.points, 0);
  if (analysisEl) analysisEl.textContent = results.analysis;

  // ── Async rank (Firebase) ──
  if (rankEl) {
    rankEl.textContent = t('جاري حساب الترتيب...', 'Calculating rank...');
    try {
      const rank = await getUserRank(results.totalScore);
      rankEl.textContent = t(`ترتيبك العالمي: #${rank}`, `Global Rank: #${rank}`);
    } catch (e) {
      rankEl.textContent = '';
    }
  }

  // ── Confetti & finish sound ──
  if (results.accuracy >= 60) setTimeout(launchConfetti, 600);
  setTimeout(() => playTone('finish'), 300);
}
