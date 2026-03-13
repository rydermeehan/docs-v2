// ===== BJJ Kids Training App =====

// --- State ---
const DEFAULT_STATE = {
  currentWeek: 1,
  completedWeeks: [],
  completedSessions: [], // [{date, weekNum}]
  movesPracticed: {}, // {moveId: count}
  achievements: [],
  stripes: 0,
  timerSettings: { rounds: 5, work: 30, rest: 10 }
};

let state = loadState();
let screenHistory = ['home'];
let activeTimer = null;
let timerState = { running: false, seconds: 0, round: 1, phase: 'work' };
let activeLessonState = null;

// --- Persistence ---
function loadState() {
  try {
    const saved = localStorage.getItem('bjj-app-state');
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  localStorage.setItem('bjj-app-state', JSON.stringify(state));
}

// --- Navigation ---
function showScreen(name, addToHistory = true) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');

  if (addToHistory && screenHistory[screenHistory.length - 1] !== name) {
    screenHistory.push(name);
  }

  // Update back button
  const backBtn = document.getElementById('back-btn');
  const title = document.getElementById('page-title');
  if (name === 'home') {
    backBtn.classList.add('hidden');
    title.textContent = "Pierce's BJJ Academy";
  } else {
    backBtn.classList.remove('hidden');
    const titles = {
      curriculum: 'Full Program', moves: 'Move Library', timer: 'Drill Timer',
      progress: 'Progress', lesson: 'Lesson Details', 'move-detail': 'Move Details',
      'active-lesson': 'Training Session'
    };
    title.textContent = titles[name] || "Pierce's BJJ Academy";
  }

  // Update bottom nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });

  // Render screen content
  if (name === 'home') renderHome();
  else if (name === 'curriculum') renderCurriculum();
  else if (name === 'moves') renderMoves();
  else if (name === 'progress') renderProgress();
}

function goBack() {
  if (screenHistory.length > 1) {
    screenHistory.pop();
    const prev = screenHistory[screenHistory.length - 1];
    showScreen(prev, false);
  }
}

// --- Home Screen ---
function renderHome() {
  const stats = getStats();
  document.getElementById('stat-sessions').textContent = stats.totalSessions;
  document.getElementById('stat-streak').textContent = stats.streak;
  document.getElementById('stat-moves').textContent = stats.movesLearned;

  // Subtitle based on progress
  const subtitles = [
    'Let\'s train today!', 'Keep up the great work!', 'You\'re getting stronger!',
    'OSS! Ready to roll?', 'Train hard, stay humble!', 'Every rep makes you better!'
  ];
  document.getElementById('hero-subtitle').textContent = subtitles[stats.totalSessions % subtitles.length];

  // Today's lesson
  const lesson = CURRICULUM.find(l => l.week === state.currentWeek) || CURRICULUM[0];
  document.getElementById('today-lesson-title').textContent = `Week ${lesson.week}: ${lesson.title}`;
  document.getElementById('today-lesson-desc').textContent = lesson.focus;
  document.getElementById('week-badge').textContent = `Week ${state.currentWeek}`;

  const hasPartner = lesson.moves.some(m => MOVES.find(mv => mv.id === m)?.type === 'partner');
  document.getElementById('today-lesson-type').textContent = hasPartner ? 'Solo + Partner' : 'Solo';

  // Belt display
  updateBeltDisplay();

  // Recent achievements
  renderRecentAchievements();
}

function renderRecentAchievements() {
  const container = document.getElementById('recent-achievements');
  const earned = state.achievements.slice(-3).reverse();
  if (earned.length === 0) {
    container.innerHTML = '<p class="text-muted">Complete your first session to earn achievements!</p>';
    return;
  }
  container.innerHTML = earned.map(id => {
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return '';
    return `<div class="achievement-item">
      <span class="achievement-icon">${ach.emoji}</span>
      <div class="achievement-info"><h4>${ach.name}</h4><p>${ach.desc}</p></div>
    </div>`;
  }).join('');
}

// --- Curriculum Screen ---
function renderCurriculum(phase) {
  if (!phase) phase = state.currentWeek <= 8 ? 1 : state.currentWeek <= 16 ? 2 : 3;
  showPhase(phase);
}

function showPhase(phase) {
  document.querySelectorAll('.phase-tab').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.phase) === phase);
  });
  const weeks = CURRICULUM.filter(w => w.phase === phase);
  const container = document.getElementById('curriculum-list');
  container.innerHTML = weeks.map(w => {
    const completed = state.completedWeeks.includes(w.week);
    const current = w.week === state.currentWeek;
    const cls = completed ? 'completed' : current ? 'current' : '';
    return `<div class="week-card ${cls}" onclick="showLesson(${w.week})">
      <div class="week-num">${completed ? '✓' : w.week}</div>
      <div class="week-info">
        <h4>${w.title}</h4>
        <p>${w.focus}</p>
      </div>
      ${completed ? '<span class="week-check">✅</span>' : current ? '<span class="start-arrow">▶</span>' : ''}
    </div>`;
  }).join('');
}

// --- Lesson Detail Screen ---
function showLesson(weekNum) {
  const lesson = CURRICULUM.find(l => l.week === weekNum);
  if (!lesson) return;
  const container = document.getElementById('lesson-detail');
  const totalTime = lesson.segments.reduce((sum, s) => {
    const mins = parseInt(s.time);
    return sum + (isNaN(mins) ? 0 : mins);
  }, 0);
  const completed = state.completedWeeks.includes(lesson.week);

  container.innerHTML = `
    <div class="lesson-detail-content">
      <div class="lesson-overview">
        <div class="lesson-week">Week ${lesson.week} - Phase ${lesson.phase}</div>
        <h2>${lesson.title}</h2>
        <div class="lesson-focus">${lesson.focus}</div>
        <div class="lesson-meta" style="justify-content:center; margin-top:10px;">
          <span class="tag tag-time">${totalTime} min</span>
          <span class="tag">${lesson.moves.length} moves</span>
          ${completed ? '<span class="tag" style="background:rgba(52,211,153,0.15);color:var(--success)">Completed ✓</span>' : ''}
        </div>
      </div>
      <div class="lesson-breakdown">
        <h3>Class Breakdown</h3>
        ${lesson.segments.map(seg => `
          <div class="breakdown-item">
            <span class="breakdown-time">${seg.time}</span>
            <div class="breakdown-info">
              <h4>${seg.name}</h4>
              <p>${seg.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px">
        <h3 style="font-size:15px;margin-bottom:12px;">Moves Covered</h3>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${lesson.moves.map(mId => {
            const mv = MOVES.find(m => m.id === mId);
            if (!mv) return '';
            return `<span class="tag" onclick="showMoveDetail('${mv.id}')" style="cursor:pointer;padding:6px 12px;font-size:13px;">${mv.emoji} ${mv.name}</span>`;
          }).join('')}
        </div>
      </div>
      <button class="btn btn-primary btn-block start-lesson-btn" onclick="startLesson(${lesson.week})">
        ${completed ? '🔄 Repeat Lesson' : '▶ Start Lesson'}
      </button>
    </div>`;
  showScreen('lesson');
}

function startTodaysLesson() {
  startLesson(state.currentWeek);
}

// --- Active Lesson ---
function startLesson(weekNum) {
  const lesson = CURRICULUM.find(l => l.week === weekNum);
  if (!lesson) return;
  activeLessonState = { weekNum, currentSegment: 0, completed: [] };
  renderActiveLesson(lesson);
  showScreen('active-lesson');
}

function renderActiveLesson(lesson) {
  if (!lesson) lesson = CURRICULUM.find(l => l.week === activeLessonState.weekNum);
  const container = document.getElementById('active-lesson-content');
  const seg = activeLessonState.currentSegment;
  const total = lesson.segments.length;
  const progress = ((seg) / total) * 100;

  container.innerHTML = `
    <div class="active-lesson-header">
      <h2>Week ${lesson.week}: ${lesson.title}</h2>
      <p class="text-muted">Segment ${seg + 1} of ${total}</p>
      <div class="active-lesson-progress">
        <div class="active-lesson-progress-fill" style="width:${progress}%"></div>
      </div>
    </div>
    ${lesson.segments.map((s, i) => {
      const isDone = activeLessonState.completed.includes(i);
      const isCurrent = i === seg;
      const cls = isDone ? 'done-segment' : isCurrent ? 'active-segment' : '';
      return `<div class="lesson-segment ${cls}">
        <div class="segment-header">
          <h3>${isDone ? '✅ ' : isCurrent ? '▶ ' : ''}${s.name}</h3>
          <span class="segment-time">${s.time}</span>
        </div>
        <p class="segment-desc">${s.desc}</p>
        ${isCurrent ? `
          <ul class="segment-details">
            ${s.details.map(d => `<li>${d}</li>`).join('')}
          </ul>
          <div class="segment-actions">
            <button class="btn btn-success" onclick="completeSegment()">✓ Done!</button>
            <button class="btn btn-secondary" onclick="openTimerForSegment('${s.time}')">⏱ Timer</button>
          </div>
        ` : ''}
      </div>`;
    }).join('')}`;
}

function completeSegment() {
  const lesson = CURRICULUM.find(l => l.week === activeLessonState.weekNum);
  if (!lesson) return;
  activeLessonState.completed.push(activeLessonState.currentSegment);
  if (activeLessonState.currentSegment < lesson.segments.length - 1) {
    activeLessonState.currentSegment++;
    renderActiveLesson(lesson);
    // Scroll to active segment
    setTimeout(() => {
      const active = document.querySelector('.active-segment');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  } else {
    completeLesson(lesson);
  }
}

function completeLesson(lesson) {
  const today = new Date().toISOString().split('T')[0];

  // Record session
  state.completedSessions.push({ date: today, weekNum: lesson.week });

  // Mark week complete
  if (!state.completedWeeks.includes(lesson.week)) {
    state.completedWeeks.push(lesson.week);
  }

  // Record moves practiced
  lesson.moves.forEach(mId => {
    state.movesPracticed[mId] = (state.movesPracticed[mId] || 0) + 1;
  });

  // Advance current week
  if (lesson.week === state.currentWeek && state.currentWeek < 24) {
    state.currentWeek++;
  }

  // Check for stripe milestones
  if (lesson.week === 8 && state.stripes < 1) state.stripes = 1;
  if (lesson.week === 16 && state.stripes < 2) state.stripes = 2;
  if (lesson.week === 24 && state.stripes < 3) state.stripes = 3;

  // Check achievements
  checkAchievements();
  saveState();

  // Celebration!
  const isStripe = [8, 16, 24].includes(lesson.week);
  showCelebration(
    isStripe ? '🎗️' : '🎉',
    isStripe ? `Stripe ${state.stripes} Earned!` : 'Lesson Complete!',
    isStripe
      ? `Amazing! You earned stripe #${state.stripes} on your belt!`
      : `Week ${lesson.week} done! Keep training, champion!`
  );
}

function openTimerForSegment(timeStr) {
  const mins = parseInt(timeStr);
  if (!isNaN(mins)) {
    state.timerSettings.work = mins * 60;
    state.timerSettings.rounds = 1;
    state.timerSettings.rest = 0;
  }
  showScreen('timer');
  updateTimerDisplay();
}

// --- Move Library ---
function renderMoves(filter) {
  filter = filter || 'all';
  const container = document.getElementById('moves-list');
  const filtered = filter === 'all' ? MOVES : MOVES.filter(m => m.type === filter);
  container.innerHTML = filtered.map(m => {
    const practiced = state.movesPracticed[m.id] || 0;
    const mastery = Math.min(practiced * 20, 100);
    return `<div class="move-card" onclick="showMoveDetail('${m.id}')">
      <div class="move-emoji">${m.emoji}</div>
      <h4>${m.name}</h4>
      <span class="move-type">${m.type === 'solo' ? 'Solo Drill' : m.type === 'partner' ? 'With Partner' : 'With Dummy'}</span>
      <div class="move-mastery-bar"><div class="move-mastery-fill" style="width:${mastery}%"></div></div>
    </div>`;
  }).join('');
}

function filterMoves(filter) {
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === filter);
  });
  renderMoves(filter);
}

// --- Move Detail ---
function showMoveDetail(moveId) {
  const move = MOVES.find(m => m.id === moveId);
  if (!move) return;
  const practiced = state.movesPracticed[moveId] || 0;
  const mastery = Math.min(practiced * 20, 100);
  const container = document.getElementById('move-detail-content');

  container.innerHTML = `
    <div class="move-detail-header">
      <span class="move-emoji">${move.emoji}</span>
      <h2>${move.name}</h2>
      <span class="tag">${move.type === 'solo' ? 'Solo Drill' : move.type === 'partner' ? 'With Partner' : 'With Dummy'}</span>
      <span class="tag">${move.category}</span>
    </div>
    <div class="detail-section">
      <h3>About This Move</h3>
      <p>${move.desc}</p>
    </div>
    <div class="detail-section">
      <h3>Steps</h3>
      <ol>${move.steps.map(s => `<li>${s}</li>`).join('')}</ol>
    </div>
    ${move.visual ? `<div class="detail-section">
      <h3>Visual Guide</h3>
      <div class="visual-guide">${move.visual}</div>
    </div>` : ''}
    <div class="detail-section">
      <h3>Coaching Tip</h3>
      <div class="coaching-tip"><p><strong>💡 Tip:</strong> ${move.tip}</p></div>
    </div>
    <div class="detail-section">
      <h3>Drill Variations</h3>
      <div class="drill-variations">
        ${move.drills.map(d => `
          <div class="drill-var">
            <span class="var-icon">${d.icon}</span>
            <div><h4>${d.name}</h4><p>${d.desc}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="detail-section">
      <h3>Your Progress</h3>
      <p>Practiced ${practiced} time${practiced !== 1 ? 's' : ''}</p>
      <div class="move-mastery-bar" style="height:8px;margin-top:8px;">
        <div class="move-mastery-fill" style="width:${mastery}%"></div>
      </div>
      <p class="text-muted" style="margin-top:6px;">${mastery >= 100 ? 'Mastered! 🏆' : `${mastery}% mastery`}</p>
    </div>
    <button class="btn btn-primary btn-block" onclick="practiceMoveFromDetail('${moveId}')">🥋 Mark as Practiced</button>`;
  showScreen('move-detail');
}

function practiceMoveFromDetail(moveId) {
  state.movesPracticed[moveId] = (state.movesPracticed[moveId] || 0) + 1;
  checkAchievements();
  saveState();
  showMoveDetail(moveId); // Re-render
  showCelebration('🥋', 'Nice Rep!', `${MOVES.find(m => m.id === moveId)?.name} practiced!`);
}

// --- Timer ---
function updateTimerDisplay() {
  document.getElementById('round-count').textContent = state.timerSettings.rounds;
  document.getElementById('work-time').textContent = state.timerSettings.work;
  document.getElementById('rest-time').textContent = state.timerSettings.rest;
  document.getElementById('timer-total-rounds').textContent = state.timerSettings.rounds;

  if (!timerState.running) {
    document.getElementById('timer-display').textContent = formatTime(state.timerSettings.work);
    document.getElementById('timer-display').className = 'timer-display';
    document.getElementById('timer-round').textContent = '1';
  }
}

function adjustTimer(type, delta) {
  if (timerState.running) return;
  if (type === 'rounds') state.timerSettings.rounds = Math.max(1, Math.min(20, state.timerSettings.rounds + delta));
  else if (type === 'work') state.timerSettings.work = Math.max(5, Math.min(300, state.timerSettings.work + delta));
  else if (type === 'rest') state.timerSettings.rest = Math.max(0, Math.min(120, state.timerSettings.rest + delta));
  saveState();
  updateTimerDisplay();
}

function setTimerPreset(rounds, work, rest) {
  state.timerSettings = { rounds, work, rest };
  saveState();
  updateTimerDisplay();
}

function toggleTimer() {
  if (timerState.running) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (!timerState.running) {
    if (timerState.seconds === 0) {
      timerState = { running: true, seconds: state.timerSettings.work, round: 1, phase: 'work' };
    } else {
      timerState.running = true;
    }
  }
  document.getElementById('timer-start-btn').textContent = 'PAUSE';
  tickTimer();
}

function pauseTimer() {
  timerState.running = false;
  if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
  document.getElementById('timer-start-btn').textContent = 'RESUME';
}

function resetTimer() {
  timerState = { running: false, seconds: 0, round: 1, phase: 'work' };
  if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
  document.getElementById('timer-start-btn').textContent = 'START';
  updateTimerDisplay();
}

function tickTimer() {
  if (!timerState.running) return;

  const display = document.getElementById('timer-display');
  display.textContent = formatTime(timerState.seconds);
  display.className = 'timer-display ' + timerState.phase;
  document.getElementById('timer-round').textContent = timerState.round;

  if (timerState.seconds <= 0) {
    // Phase ended
    if (timerState.phase === 'work') {
      if (state.timerSettings.rest > 0 && timerState.round < state.timerSettings.rounds) {
        timerState.phase = 'rest';
        timerState.seconds = state.timerSettings.rest;
        playBeep(2);
      } else if (timerState.round < state.timerSettings.rounds) {
        timerState.round++;
        timerState.seconds = state.timerSettings.work;
        playBeep(1);
      } else {
        // All done!
        timerState.running = false;
        document.getElementById('timer-start-btn').textContent = 'START';
        display.textContent = 'DONE!';
        display.className = 'timer-display';
        playBeep(3);
        return;
      }
    } else {
      // Rest ended, next round
      timerState.phase = 'work';
      timerState.round++;
      timerState.seconds = state.timerSettings.work;
      playBeep(1);
    }
  }

  timerState.seconds--;
  activeTimer = setTimeout(tickTimer, 1000);
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function playBeep(count) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = count === 3 ? 880 : 660;
        gain.gain.value = 0.3;
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }, i * 200);
    }
  } catch {
    // Audio not available
  }
}

// --- Progress Screen ---
function renderProgress() {
  updateBeltVisual();
  renderCalendar();
  renderAllAchievements();
  renderMasteryList();
}

function updateBeltVisual() {
  const beltIdx = Math.min(state.stripes, BELT_PROGRESSION.length - 1);
  const belt = BELT_PROGRESSION[beltIdx];
  const container = document.getElementById('belt-visual');
  container.innerHTML = `
    <div class="belt-bar" style="background:${belt.color}">
      ${Array(belt.stripes).fill('<div class="belt-stripe"></div>').join('')}
    </div>`;
  document.getElementById('belt-status').textContent = belt.name;

  const milestone = document.getElementById('next-milestone');
  if (state.stripes < 3) {
    const nextStripeWeek = state.stripes === 0 ? 8 : state.stripes === 1 ? 16 : 24;
    const weeksLeft = nextStripeWeek - state.currentWeek + 1;
    milestone.innerHTML = `Next stripe in ~${Math.max(0, weeksLeft)} weeks! Keep training! 💪`;
  } else {
    milestone.innerHTML = '🏆 All stripes earned! You\'re amazing!';
  }
}

function renderCalendar() {
  const container = document.getElementById('calendar-view');
  const today = new Date();
  const days = [];

  // Show last 28 days
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const trained = state.completedSessions.some(s => s.date === dateStr);
    const isToday = i === 0;
    days.push(`<div class="calendar-day ${trained ? 'trained' : ''} ${isToday ? 'today' : ''}">${d.getDate()}</div>`);
  }
  container.innerHTML = days.join('');
}

function renderAllAchievements() {
  const container = document.getElementById('all-achievements');
  container.innerHTML = ACHIEVEMENTS.map(a => {
    const earned = state.achievements.includes(a.id);
    return `<div class="achievement-grid-item ${earned ? '' : 'locked'}">
      <span class="achievement-icon">${a.emoji}</span>
      <h4>${a.name}</h4>
    </div>`;
  }).join('');
}

function renderMasteryList() {
  const container = document.getElementById('mastery-list');
  const practicedMoves = MOVES.filter(m => (state.movesPracticed[m.id] || 0) > 0);
  if (practicedMoves.length === 0) {
    container.innerHTML = '<p class="text-muted">Complete lessons to build your move mastery!</p>';
    return;
  }
  container.innerHTML = practicedMoves
    .sort((a, b) => (state.movesPracticed[b.id] || 0) - (state.movesPracticed[a.id] || 0))
    .map(m => {
      const count = state.movesPracticed[m.id] || 0;
      const mastery = Math.min(count * 20, 100);
      return `<div class="mastery-item">
        <span class="mastery-emoji">${m.emoji}</span>
        <div class="mastery-info">
          <h4>${m.name}</h4>
          <div class="mastery-bar"><div class="mastery-fill" style="width:${mastery}%"></div></div>
        </div>
        <span class="mastery-label">${mastery}%</span>
      </div>`;
    }).join('');
}

// --- Belt Display ---
function updateBeltDisplay() {
  const beltIdx = Math.min(state.stripes, BELT_PROGRESSION.length - 1);
  const belt = BELT_PROGRESSION[beltIdx];
  document.getElementById('mini-belt').style.background = belt.color;
  document.getElementById('stripe-dots').innerHTML =
    Array(belt.stripes).fill('<span class="stripe-dot"></span>').join('');
}

// --- Stats ---
function getStats() {
  const sessions = state.completedSessions;
  const totalSessions = sessions.length;
  const movesLearned = Object.keys(state.movesPracticed).length;

  // Calculate streak
  let streak = 0;
  if (sessions.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    const todayOrYesterday = dates[0] === today || dates[0] === getYesterday();
    if (todayOrYesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (prev - curr) / (1000 * 60 * 60 * 24);
        if (diff <= 1) streak++;
        else break;
      }
    }
  }

  return { totalSessions, streak, movesLearned, stripes: state.stripes, completedWeeks: state.completedWeeks };
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// --- Achievements ---
function checkAchievements() {
  const stats = getStats();
  let newAchievements = [];
  ACHIEVEMENTS.forEach(a => {
    if (!state.achievements.includes(a.id) && a.condition(stats)) {
      state.achievements.push(a.id);
      newAchievements.push(a);
    }
  });
  return newAchievements;
}

// --- Celebration Modal ---
function showCelebration(emoji, title, text) {
  document.getElementById('celebration-emoji').textContent = emoji;
  document.getElementById('celebration-title').textContent = title;
  document.getElementById('celebration-text').textContent = text;
  document.getElementById('celebration-modal').classList.remove('hidden');
}

function closeCelebration() {
  document.getElementById('celebration-modal').classList.add('hidden');
}

// --- Reset ---
function resetProgress() {
  state = { ...DEFAULT_STATE };
  saveState();
  showScreen('home');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
  showScreen('home', false);
});
