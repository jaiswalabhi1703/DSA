/* ══ Mock DSA Round ══ */

const VERBAL_QUESTIONS = [
  'In your own words, explain what this problem is asking. What are the inputs, and what output are we expected to return?',
  'What is your approach to solve this problem? Walk me through your high-level algorithm step by step.',
  'What data structure(s) will you use and why? Are there any trade-offs you considered before making this choice?'
];

const S = {
  lang: 'python',
  problems: [],
  pidx: 0,
  vq: 0,
  timerSec: 25 * 60,
  timerHandle: null,
  codeByLang: { python: '', java: '', cpp: '' },
  data: [
    { verbalAnswers: [], code: '', lang: 'python', tc: '', sc: '', tcJustify: '', scJustify: '' },
    { verbalAnswers: [], code: '', lang: 'python', tc: '', sc: '', tcJustify: '', scJustify: '' }
  ]
};

/* ── Screen ── */
function show(id) {
  document.querySelectorAll('.mock-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s-' + id).classList.add('active');
}

/* ── Timer ── */
const ALL_TIMERS = ['readTimer', 'verbalTimer', 'codeTimer'];

function startTimer() {
  clearInterval(S.timerHandle);
  S.timerSec = 25 * 60;
  updateTimerDisplays();
  S.timerHandle = setInterval(() => {
    S.timerSec--;
    updateTimerDisplays();
    if (S.timerSec <= 0) { clearInterval(S.timerHandle); handleTimerExpired(); }
  }, 1000);
}

function pauseTimer() { clearInterval(S.timerHandle); }

function updateTimerDisplays() {
  const m = String(Math.floor(S.timerSec / 60)).padStart(2, '0');
  const s = String(S.timerSec % 60).padStart(2, '0');
  const txt = m + ':' + s;
  const urgent = S.timerSec < 300;
  ALL_TIMERS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = txt;
    el.classList.toggle('timer-urgent', urgent);
  });
}

function handleTimerExpired() {
  const cur = document.querySelector('.mock-screen.active')?.id;
  if (cur === 's-verbal') {
    while (S.vq < 3) { S.data[S.pidx].verbalAnswers.push('(no answer — time expired)'); S.vq++; }
    loadCoding();
  } else if (cur === 's-coding') {
    doneCode();
  }
}

/* ── Setup ── */
document.querySelectorAll('.lpbtn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.lpbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    S.lang = btn.dataset.lang;
  };
});

document.getElementById('verbalAnswer').addEventListener('input', function () {
  const words = this.value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('wordCount').textContent = words + ' word' + (words !== 1 ? 's' : '');
});

document.getElementById('codeEditor').addEventListener('keydown', function (e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 4;
  }
});

/* ── Start round ── */
function pickProblems() {
  const easyTopic = EASY_TOPICS[Math.floor(Math.random() * EASY_TOPICS.length)];
  let hardTopic   = HARD_TOPICS[Math.floor(Math.random() * HARD_TOPICS.length)];
  const pool1 = MOCK_BANK[easyTopic];
  const pool2 = MOCK_BANK[hardTopic];
  const p1 = pool1[Math.floor(Math.random() * pool1.length)];
  const p2 = pool2[Math.floor(Math.random() * pool2.length)];
  return [p1, p2];
}

function startRound() {
  S.problems = pickProblems();
  S.pidx = 0;
  S.lang = document.querySelector('.lpbtn.active')?.dataset.lang || 'python';
  S.data = [
    { verbalAnswers: [], code: '', lang: S.lang, tc: '', sc: '', tcJustify: '', scJustify: '' },
    { verbalAnswers: [], code: '', lang: S.lang, tc: '', sc: '', tcJustify: '', scJustify: '' }
  ];
  loadReading();
}

/* ── Reading ── */
function loadReading() {
  const p = S.problems[S.pidx];
  document.getElementById('readProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('readTopic').textContent = p.topic;
  document.getElementById('readDiff').textContent = p.difficulty;
  document.getElementById('readDiff').className = 'tb-diff diff-' + p.diffClass;
  document.getElementById('probTitle').textContent = p.title;
  document.getElementById('probTags').innerHTML = p.tags.map(t => '<span class="prob-tag">' + t + '</span>').join('');
  document.getElementById('probStatement').innerHTML = p.statement;
  document.getElementById('probExamples').innerHTML = p.examples.map((ex, i) =>
    `<div class="prob-example">
      <div class="ex-label">Example ${i + 1}</div>
      <div class="ex-body">
        <div class="ex-row"><span class="ex-key">Input:</span> <code>${ex.input}</code></div>
        <div class="ex-row"><span class="ex-key">Output:</span> <code>${ex.output}</code></div>
        ${ex.explanation ? '<div class="ex-row"><span class="ex-key">Explanation:</span> ' + ex.explanation + '</div>' : ''}
      </div>
    </div>`).join('');
  document.getElementById('probConstraints').innerHTML = p.constraints.map(c => '<li>' + c + '</li>').join('');
  startTimer();
  show('reading');
}

/* ── Verbal ── */
function markReady() {
  S.vq = 0;
  S.data[S.pidx].verbalAnswers = [];
  loadVerbalQ();
  show('verbal');
}

function loadVerbalQ() {
  document.getElementById('verbalProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('verbalStep').textContent = 'Question ' + (S.vq + 1) + ' / 3';
  document.getElementById('verbalQuestion').textContent = VERBAL_QUESTIONS[S.vq];
  document.getElementById('verbalAnswer').value = '';
  document.getElementById('wordCount').textContent = '0 words';
  document.getElementById('verbalTip').textContent = '';
  [0, 1, 2].forEach(i => {
    const d = document.getElementById('vd' + i);
    d.className = 'vp-dot' + (i < S.vq ? ' done' : i === S.vq ? ' active' : '');
  });
}

function submitVerbal() {
  const ans = document.getElementById('verbalAnswer').value.trim();
  if (ans.length < 10) {
    document.getElementById('verbalTip').textContent = '⚠ Please write at least a sentence before submitting.';
    return;
  }
  S.data[S.pidx].verbalAnswers.push(ans);
  S.vq++;
  if (S.vq < 3) loadVerbalQ();
  else loadCoding();
}

/* ── Coding ── */
function loadCoding() {
  const p = S.problems[S.pidx];
  document.getElementById('codeProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('codeTitle').textContent = p.title;

  S.codeByLang = {
    python: p.starterCode.python,
    java:   p.starterCode.java,
    cpp:    p.starterCode.cpp
  };

  document.querySelectorAll('.ltab').forEach(t => t.classList.toggle('active', t.dataset.lang === S.lang));
  document.getElementById('codeEditor').value = S.codeByLang[S.lang];

  document.getElementById('doneCodeBtn').innerHTML = 'Done — Complexity Analysis <span class="btn-arrow">→</span>';

  show('coding');
  document.getElementById('codeEditor').focus();
}

function switchLang(lang) {
  S.codeByLang[S.lang] = document.getElementById('codeEditor').value;
  S.lang = lang;
  document.querySelectorAll('.ltab').forEach(t => t.classList.toggle('active', t.dataset.lang === lang));
  document.getElementById('codeEditor').value = S.codeByLang[lang];
  document.getElementById('codeEditor').focus();
}

function doneCode() {
  S.data[S.pidx].code = document.getElementById('codeEditor').value;
  S.data[S.pidx].lang = S.lang;
  pauseTimer();

  loadTCSC();
}

/* ── TC/SC ── */
function loadTCSC() {
  document.getElementById('tcscProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('tcInput').value = '';
  document.getElementById('scInput').value = '';
  document.getElementById('tcJustify').value = '';
  document.getElementById('scJustify').value = '';
  show('tcsc');
}

function submitTCSC() {
  const tc = document.getElementById('tcInput').value.trim();
  const sc = document.getElementById('scInput').value.trim();
  if (!tc || !sc) {
    alert('Please enter both Time and Space complexity before continuing.');
    return;
  }
  S.data[S.pidx].tc = tc;
  S.data[S.pidx].sc = sc;
  S.data[S.pidx].tcJustify = document.getElementById('tcJustify').value.trim();
  S.data[S.pidx].scJustify = document.getElementById('scJustify').value.trim();

  if (S.pidx === 0) {
    S.pidx = 1;
    S.data[1] = { verbalAnswers: [], code: '', lang: S.lang, tc: '', sc: '', tcJustify: '', scJustify: '' };
    loadReading();
  } else {
    generateDoc();
  }
}

/* ── Document generation ── */
function buildDoc() {
  const [p0, p1] = S.problems;
  const [d0, d1] = S.data;
  const stripHtml = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  const verbalSection = (d) => VERBAL_QUESTIONS.map((q, i) =>
    `Q${i + 1}: ${q}\nA${i + 1}: ${d.verbalAnswers[i] || '(no answer provided)'}`
  ).join('\n\n');

  const complexitySection = (d) =>
    `Time Complexity:  ${d.tc || '(not provided)'}` +
    (d.tcJustify ? `\nReasoning:        ${d.tcJustify}` : '') +
    `\nSpace Complexity: ${d.sc || '(not provided)'}` +
    (d.scJustify ? `\nReasoning:        ${d.scJustify}` : '');

  const problemBlock = (p, d, num) => `
${'═'.repeat(60)}
PROBLEM ${num}: ${p.title}  [${p.difficulty}]
${'═'.repeat(60)}

${stripHtml(p.statement)}

Examples:
${p.examples.map((e, i) => `  Example ${i + 1}:\n    Input:  ${e.input}\n    Output: ${e.output}${e.explanation ? '\n    Note:   ' + e.explanation : ''}`).join('\n')}

Constraints:
${p.constraints.map(c => '  • ' + c).join('\n')}

${'─'.repeat(60)}
VERBAL Q&A  (Problem ${num})
${'─'.repeat(60)}

${verbalSection(d)}

${'─'.repeat(60)}
CODE  (Problem ${num} — ${d.lang})
${'─'.repeat(60)}

${d.code || '(no code submitted)'}

${'─'.repeat(60)}
COMPLEXITY ANALYSIS  (Problem ${num})
${'─'.repeat(60)}

${complexitySection(d)}
`;

  return `You are a senior FAANG technical interviewer. A candidate just completed a 2-problem mock DSA interview. Evaluate their performance and give detailed, honest feedback.

For each problem, provide:
  • Verbal score (1–10) — clarity, correctness of approach, data structure reasoning
  • Code score   (1–10) — correctness, approach quality, edge case handling, style
  • Complexity score (1–10) — compare candidate's stated TC/SC with what the code actually achieves; is their reasoning correct?
  • Inferred actual time & space complexity of their code
  • 2 specific strengths
  • 2 specific improvements

After both problems, provide:
  • Overall score (1–10)
  • Hiring verdict: Strong Hire | Hire | Borderline | No Hire
  • 3–4 sentence overall summary
  • Top 2 strengths and top 2 actionable improvements across the full round

${'═'.repeat(60)}
INTERVIEW TRANSCRIPT
${'═'.repeat(60)}
${problemBlock(p0, d0, 1)}
${problemBlock(p1, d1, 2)}
${'═'.repeat(60)}
END OF TRANSCRIPT — please provide your evaluation now.
${'═'.repeat(60)}`;
}

function generateDoc() {
  const doc = buildDoc();
  document.getElementById('docOutput').value = doc;
  show('doc');
}

function copyDoc() {
  const ta = document.getElementById('docOutput');
  ta.select();
  ta.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(ta.value).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
  }).catch(() => {
    document.execCommand('copy');
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
  });
}

function downloadDoc() {
  const text = document.getElementById('docOutput').value;
  const [p0, p1] = S.problems;
  const filename = 'mock-dsa-' + p0.title.replace(/\s+/g, '-').toLowerCase() + '-' + p1.title.replace(/\s+/g, '-').toLowerCase() + '.txt';
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
