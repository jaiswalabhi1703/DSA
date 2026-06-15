/* ══════════════════════════════════════════════════════════════
   Mock DSA Round — State Machine
   ══════════════════════════════════════════════════════════════ */

const VERBAL_QUESTIONS = [
  'In your own words, explain what this problem is asking. What are the inputs, and what output are we expected to return?',
  'What is your approach to solve this problem? Walk me through your high-level algorithm step by step.',
  'What data structure(s) will you use and why? Are there any trade-offs you considered before making this choice?'
];

const EXECUTE_URL = '/.netlify/functions/execute';
const JUDGE_URL   = '/.netlify/functions/judge';

const JDOODLE_LANG = { python: 'python3', java: 'java', cpp: 'cpp17' };
const JDOODLE_VER  = { python: '3', java: '4', cpp: '0' };
const LANG_CMMODE  = { python: 'python', java: 'text/x-java', cpp: 'text/x-c++src' };

/* ── State ── */
const S = {
  apiKey: '',
  jdoodleId: '',
  jdoodleSecret: '',
  lang: 'python',
  problems: [],
  pidx: 0,            // 0 or 1
  vq: 0,              // verbal question index 0-2
  timerSec: 25 * 60,
  timerHandle: null,
  attempts: [0, 0],   // code submission attempts per problem
  lastApiError: null,
  data: [             // per-problem collected data
    { verbalAnswers: [], verbalScores: [], codePassed: false, codeAttempts: 0, tcInput: '', scInput: '', tcJustify: '', scJustify: '', tcscScore: null },
    { verbalAnswers: [], verbalScores: [], codePassed: false, codeAttempts: 0, tcInput: '', scInput: '', tcJustify: '', scJustify: '', tcscScore: null }
  ]
};

let cm = null; // CodeMirror instance

/* ══ Screen Management ══ */
function show(id) {
  document.querySelectorAll('.mock-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('s-' + id).classList.add('active');
}

/* ══ Timer ══ */
const ALL_TIMERS = ['readTimer', 'verbalTimer', 'codeTimer', 'tcscTimer'];

function startTimer() {
  clearInterval(S.timerHandle);
  S.timerSec = 25 * 60;
  updateTimerDisplays();
  S.timerHandle = setInterval(() => {
    S.timerSec--;
    updateTimerDisplays();
    if (S.timerSec <= 0) {
      clearInterval(S.timerHandle);
      handleTimerExpired();
    }
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
  alert('⏰ Time is up for this problem! Moving forward…');
  // Force move: if in verbal, skip to coding; if coding, skip to TC/SC; if tcsc, finalize
  const cur = document.querySelector('.mock-screen.active').id;
  if (cur === 's-verbal') { while (S.vq < 3) { S.data[S.pidx].verbalAnswers.push('(no answer — time expired)'); S.vq++; } loadCoding(); }
  else if (cur === 's-coding') { S.data[S.pidx].codePassed = false; loadTCSC(); }
  else if (cur === 's-tcsc') { finalizeProblem(); }
}

/* ══ Setup Screen ══ */
function toggleKey() {
  const inp = document.getElementById('apiKeyInput');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

document.querySelectorAll('.lpbtn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.lpbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    S.lang = btn.dataset.lang;
  };
});

document.getElementById('apiKeyInput').addEventListener('input', () => {
  const val = document.getElementById('apiKeyInput').value.trim();
  const status = document.getElementById('keyStatus');
  if (val.length > 15) {
    status.textContent = '✓ Key accepted';
    status.className = 'key-status ok';
    localStorage.setItem('mock_api_key', val);
  } else if (val.length > 0) {
    status.textContent = '⚠ Key looks too short';
    status.className = 'key-status warn';
  } else {
    status.textContent = '';
    status.className = 'key-status';
  }
});

document.getElementById('verbalAnswer').addEventListener('input', function () {
  const words = this.value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('wordCount').textContent = words + ' word' + (words !== 1 ? 's' : '');
});

// Restore saved credentials
(function () {
  const key = localStorage.getItem('mock_api_key');
  if (key) {
    document.getElementById('apiKeyInput').value = key;
    document.getElementById('keyStatus').textContent = '✓ Key restored from last session';
    document.getElementById('keyStatus').className = 'key-status ok';
  }
  const jid = localStorage.getItem('mock_jdoodle_id');
  const jsec = localStorage.getItem('mock_jdoodle_secret');
  if (jid) document.getElementById('jdoodleId').value = jid;
  if (jsec) document.getElementById('jdoodleSecret').value = jsec;
  if (jid && jsec) {
    document.getElementById('execStatus').textContent = '✓ JDoodle credentials restored';
    document.getElementById('execStatus').className = 'key-status ok';
  }
})();

function pickProblems() {
  const em = MOCK_BANK.easyMedium;
  const mh = MOCK_BANK.mediumHard;
  const p1 = em[Math.floor(Math.random() * em.length)];
  let p2 = mh[Math.floor(Math.random() * mh.length)];
  return [p1, p2];
}

function startRound() {
  S.apiKey = document.getElementById('apiKeyInput').value.trim();
  S.jdoodleId = document.getElementById('jdoodleId').value.trim();
  S.jdoodleSecret = document.getElementById('jdoodleSecret').value.trim();

  if (!S.jdoodleId || !S.jdoodleSecret) {
    document.getElementById('execStatus').textContent = '⚠ JDoodle credentials required to run test cases';
    document.getElementById('execStatus').className = 'key-status warn';
    return;
  }
  localStorage.setItem('mock_jdoodle_id', S.jdoodleId);
  localStorage.setItem('mock_jdoodle_secret', S.jdoodleSecret);

  if (!S.apiKey) {
    document.getElementById('keyStatus').textContent = '⚠ No Gemini key — AI feedback will be skipped';
    document.getElementById('keyStatus').className = 'key-status warn';
  }
  // Reset state
  S.problems = pickProblems();
  S.pidx = 0;
  S.data = [
    { verbalAnswers: [], verbalScores: [], codePassed: false, codeAttempts: 0, tcInput: '', scInput: '', tcJustify: '', scJustify: '', tcscScore: null },
    { verbalAnswers: [], verbalScores: [], codePassed: false, codeAttempts: 0, tcInput: '', scInput: '', tcJustify: '', scJustify: '', tcscScore: null }
  ];
  loadReading();
}

/* ══ Reading Screen ══ */
function loadReading() {
  const p = S.problems[S.pidx];
  document.getElementById('readProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('readDiff').textContent = p.difficulty;
  document.getElementById('readDiff').className = 'tb-diff diff-' + p.diffClass;
  document.getElementById('probTitle').textContent = p.title;

  document.getElementById('probTags').innerHTML = p.tags.map(t =>
    '<span class="prob-tag">' + t + '</span>').join('');

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

  document.getElementById('probConstraints').innerHTML = p.constraints.map(c =>
    '<li>' + c + '</li>').join('');

  startTimer();
  show('reading');
}

/* ══ Verbal Screen ══ */
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
  if (S.vq < 3) {
    loadVerbalQ();
  } else {
    loadCoding();
  }
}

/* ══ Coding Screen ══ */
function loadCoding() {
  const p = S.problems[S.pidx];
  document.getElementById('codeProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('codeTitle').textContent = p.title;

  document.querySelectorAll('.ltab').forEach(t => t.classList.toggle('active', t.dataset.lang === S.lang));

  // Test cases
  document.getElementById('testCaseList').innerHTML = p.testCases.map((tc, i) =>
    `<div class="tc-item" id="tc-${i}">
      <span class="tc-num">${i + 1}</span>
      <span class="tc-label">${tc.label}</span>
      <span class="tc-status" id="tcs-${i}">–</span>
    </div>`).join('');

  document.getElementById('testResults').className = 'test-results hidden';
  document.getElementById('attemptBadge').textContent = 'Attempt 1 / 3';
  S.data[S.pidx].codeAttempts = 0;

  // Show screen FIRST so CodeMirror can measure container dimensions
  show('coding');

  if (!cm) {
    cm = CodeMirror(document.getElementById('codeEditor'), {
      mode: LANG_CMMODE[S.lang],
      theme: 'dracula',
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
      indentWithTabs: false,
      lineWrapping: false,
      autofocus: true,
      extraKeys: { Tab: function(editor) { editor.replaceSelection('    '); } }
    });
    cm.setSize(null, 'calc(100vh - 57px)');
  } else {
    cm.setOption('mode', LANG_CMMODE[S.lang]);
    cm.refresh();
  }
  cm.setValue(p.starterCode[S.lang]);
  cm.focus();
}

function switchLang(lang) {
  S.lang = lang;
  document.querySelectorAll('.ltab').forEach(t => t.classList.toggle('active', t.dataset.lang === lang));
  const p = S.problems[S.pidx];
  if (cm) {
    cm.setOption('mode', LANG_CMMODE[lang]);
    cm.setValue(p.starterCode[lang]);
  }
}

async function runCode(code, input) {
  const resp = await fetch(EXECUTE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: S.jdoodleId,
      clientSecret: S.jdoodleSecret,
      script: code,
      stdin: input,
      language: JDOODLE_LANG[S.lang],
      versionIndex: JDOODLE_VER[S.lang]
    })
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error);
  // JDoodle returns combined stdout+stderr in `output`
  return (data.output || '').replace(/JDoodle\s*$/i, '').trimEnd();
}

function normalize(str) { return str.trim().replace(/\r\n/g, '\n'); }

async function runTests() {
  const p = S.problems[S.pidx];
  const code = cm.getValue();
  const btn = document.getElementById('runBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Running…';

  const results = [];
  for (let i = 0; i < p.testCases.length; i++) {
    const tc = p.testCases[i];
    document.getElementById('tcs-' + i).textContent = '…';
    try {
      const raw = await runCode(code, tc.input);
      const actual = normalize(raw);
      const expected = normalize(tc.expected);
      const pass = actual === expected;
      results.push({ pass, actual, expected });
      const statusEl = document.getElementById('tcs-' + i);
      statusEl.textContent = pass ? '✓' : '✗';
      statusEl.className = 'tc-status ' + (pass ? 'pass' : 'fail');
      document.getElementById('tc-' + i).className = 'tc-item ' + (pass ? 'tc-pass' : 'tc-fail');
    } catch (e) {
      results.push({ pass: false, actual: 'Error', expected: tc.expected, stderr: e.message });
      document.getElementById('tcs-' + i).textContent = '✗';
      document.getElementById('tc-' + i).className = 'tc-item tc-fail';
    }
  }

  btn.disabled = false;
  btn.textContent = '▶ Run Tests';
  showTestResults(results);
}

function showTestResults(results) {
  const passed = results.filter(r => r.pass).length;
  const div = document.getElementById('testResults');
  div.className = 'test-results';
  div.innerHTML = `<div class="tr-summary ${passed === results.length ? 'tr-all-pass' : 'tr-partial'}">
    ${passed === results.length ? '✓ All ' + results.length + ' tests passed' : passed + ' / ' + results.length + ' tests passed'}
  </div>` +
    results.map((r, i) => r.pass ? '' :
      `<div class="tr-fail-row">
        <b>Test ${i + 1} failed</b><br>
        Expected: <code>${r.expected}</code><br>
        Got: <code>${r.actual || '(no output)'}</code>
        ${r.stderr ? '<br><span class="tr-err">' + r.stderr.substring(0, 200) + '</span>' : ''}
      </div>`).join('');
}

async function submitCode() {
  const p = S.problems[S.pidx];
  S.data[S.pidx].codeAttempts++;
  const attempt = S.data[S.pidx].codeAttempts;
  document.getElementById('attemptBadge').textContent = 'Attempt ' + attempt + ' / 3';

  const btn = document.getElementById('submitCodeBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Judging…';

  const code = cm.getValue();
  let allPass = true;
  const results = [];

  for (const tc of p.testCases) {
    try {
      const raw = await runCode(code, tc.input);
      const actual = normalize(raw);
      const pass = actual === normalize(tc.expected);
      results.push({ pass, actual, expected: tc.expected });
      if (!pass) allPass = false;
    } catch (e) {
      results.push({ pass: false, actual: 'Error', expected: tc.expected, stderr: e.message });
      allPass = false;
    }
  }

  btn.disabled = false;
  btn.textContent = 'Submit Solution';

  // Update test case indicators
  results.forEach((r, i) => {
    const statusEl = document.getElementById('tcs-' + i);
    if (statusEl) {
      statusEl.textContent = r.pass ? '✓' : '✗';
      statusEl.className = 'tc-status ' + (r.pass ? 'pass' : 'fail');
      document.getElementById('tc-' + i).className = 'tc-item ' + (r.pass ? 'tc-pass' : 'tc-fail');
    }
  });
  showTestResults(results);

  S.data[S.pidx].codePassed = allPass;
  S.data[S.pidx].codeCode = code;

  if (allPass) {
    loadTCSC();
  } else if (attempt >= 3) {
    alert('3 attempts used. Moving to complexity analysis — the grader will note the partial submission.');
    loadTCSC();
  }
}

/* ══ TC/SC Screen ══ */
function loadTCSC() {
  document.getElementById('tcscProbLabel').textContent = 'Problem ' + (S.pidx + 1) + ' / 2';
  document.getElementById('tcInput').value = '';
  document.getElementById('scInput').value = '';
  document.getElementById('tcJustify').value = '';
  document.getElementById('scJustify').value = '';
  show('tcsc');
}

async function submitTCSC() {
  const tc = document.getElementById('tcInput').value.trim();
  const sc = document.getElementById('scInput').value.trim();
  const tcj = document.getElementById('tcJustify').value.trim();
  const scj = document.getElementById('scJustify').value.trim();
  if (!tc || !sc) { alert('Please enter both time and space complexity.'); return; }

  S.data[S.pidx].tcInput = tc;
  S.data[S.pidx].scInput = sc;
  S.data[S.pidx].tcJustify = tcj;
  S.data[S.pidx].scJustify = scj;

  finalizeProblem();
}

/* ══ Transition / Judging ══ */
async function finalizeProblem() {
  pauseTimer();
  show('transition');
  document.getElementById('transIcon').textContent = '⏳';
  document.getElementById('transHeading').textContent = 'Judging your responses…';
  document.getElementById('transSub').textContent = 'Please wait while we evaluate your answers with Gemini AI.';
  document.getElementById('transSpinner').style.display = 'block';
  document.getElementById('transBtn').className = 'mock-btn-primary hidden';

  S.lastApiError = null;
  await judgeVerbal(S.pidx);
  await judgeTCSC(S.pidx);

  document.getElementById('transSpinner').style.display = 'none';
  if (S.lastApiError) {
    document.getElementById('transSub').textContent = '⚠ Gemini error: ' + S.lastApiError;
  }

  if (S.pidx === 0) {
    document.getElementById('transIcon').textContent = '✓';
    document.getElementById('transHeading').textContent = 'Problem 1 Complete!';
    document.getElementById('transSub').textContent = 'Great work. Now let\'s tackle the second problem.';
    document.getElementById('transBtn').textContent = 'Move to Problem 2 →';
    document.getElementById('transBtn').className = 'mock-btn-primary';
  } else {
    document.getElementById('transIcon').textContent = '🎉';
    document.getElementById('transHeading').textContent = 'Round Complete!';
    document.getElementById('transSub').textContent = 'Generating your full feedback…';
    await generateFeedback();
    show('feedback');
  }
}

function nextProblem() {
  S.pidx = 1;
  S.data[1] = { verbalAnswers: [], verbalScores: [], codePassed: false, codeAttempts: 0, tcInput: '', scInput: '', tcJustify: '', scJustify: '', tcscScore: null };
  loadReading();
}

/* ══ Gemini API — routed through server proxy to handle all key formats ══ */
async function callGemini(system, userMsg) {
  if (!S.apiKey) return null;
  let resp;
  try {
    resp = await fetch(JUDGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: S.apiKey, system, userMsg })
    });
  } catch (e) {
    S.lastApiError = 'Network error: ' + e.message;
    return null;
  }

  let data;
  try { data = await resp.json(); }
  catch (e) { S.lastApiError = 'Invalid response (HTTP ' + resp.status + ')'; return null; }

  if (data.error) {
    S.lastApiError = data.error.message || JSON.stringify(data.error);
    console.error('[Gemini] API error:', data.error);
    return null;
  }

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  S.lastApiError = 'No response from Gemini. Finish reason: ' +
    (data.candidates?.[0]?.finishReason || 'unknown');
  return null;
}

async function testApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  const btn = document.getElementById('testKeyBtn');
  const status = document.getElementById('keyStatus');
  if (!key) { status.textContent = '⚠ Enter a key first'; status.className = 'key-status warn'; return; }

  btn.disabled = true;
  btn.textContent = '⏳ Testing…';
  status.textContent = 'Contacting Gemini API…';
  status.className = 'key-status';

  S.apiKey = key;
  S.lastApiError = null;
  const result = await callGemini('You are a helpful assistant.', 'Reply with exactly one word: Hello');

  btn.disabled = false;
  btn.textContent = 'Test Key';

  if (result) {
    status.textContent = '✓ API key works! Ready to start.';
    status.className = 'key-status ok';
    localStorage.setItem('mock_api_key', key);
  } else {
    status.textContent = '✗ ' + (S.lastApiError || 'Unknown error — check browser console');
    status.className = 'key-status warn';
  }
}

async function testExecution() {
  const id = document.getElementById('jdoodleId').value.trim();
  const secret = document.getElementById('jdoodleSecret').value.trim();
  const btn = document.getElementById('testExecBtn');
  const status = document.getElementById('execStatus');
  if (!id || !secret) {
    status.textContent = '⚠ Enter both Client ID and Client Secret first';
    status.className = 'key-status warn'; return;
  }
  btn.disabled = true; btn.textContent = '⏳';
  status.textContent = 'Running test…'; status.className = 'key-status';

  S.jdoodleId = id; S.jdoodleSecret = secret;
  // Temporarily set lang to python for a trivial test
  const savedLang = S.lang; S.lang = 'python';
  try {
    const out = await runCode('print("ok")', '');
    S.lang = savedLang;
    if (out.trim() === 'ok') {
      status.textContent = '✓ Code execution works!';
      status.className = 'key-status ok';
      localStorage.setItem('mock_jdoodle_id', id);
      localStorage.setItem('mock_jdoodle_secret', secret);
    } else {
      status.textContent = '⚠ Got unexpected output: ' + out.trim();
      status.className = 'key-status warn';
    }
  } catch (e) {
    S.lang = savedLang;
    status.textContent = '✗ ' + e.message;
    status.className = 'key-status warn';
  }
  btn.disabled = false; btn.textContent = 'Test';
}

function safeParseJSON(str) {
  if (!str) return null;
  try {
    const match = str.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch { return null; }
}

async function judgeVerbal(pidx) {
  const p = S.problems[pidx];
  const answers = S.data[pidx].verbalAnswers;
  const scores = [];

  for (let i = 0; i < answers.length; i++) {
    const system = `You are a senior FAANG technical interviewer. Judge the candidate's verbal answer concisely and return ONLY a JSON object.`;
    const prompt = `Problem: "${p.title}"
Problem statement: ${p.statement.replace(/<[^>]+>/g, '')}

The candidate was asked: "${VERBAL_QUESTIONS[i]}"
Their answer: "${answers[i]}"

Score from 1-5 (5=excellent, interview-ready; 3=acceptable; 1=incorrect/missing).
Return exactly: {"score": N, "feedback": "2-sentence specific feedback", "hint": "1-sentence improvement tip or empty string"}`;

    const raw = await callGemini(system, prompt);
    const parsed = safeParseJSON(raw);
    scores.push(parsed || { score: 3, feedback: 'Unable to evaluate (API unavailable).', hint: '' });
  }

  S.data[pidx].verbalScores = scores;
}

async function judgeTCSC(pidx) {
  const p = S.problems[pidx];
  const { tcInput, scInput, tcJustify, scJustify } = S.data[pidx];

  const system = `You are a FAANG technical interviewer evaluating complexity analysis. Return ONLY valid JSON.`;
  const prompt = `Problem: "${p.title}"
Optimal Time Complexity: ${p.expectedTC}
Optimal Space Complexity: ${p.expectedSC}

Candidate's answers:
- Time Complexity: ${tcInput} (justification: "${tcJustify}")
- Space Complexity: ${scInput} (justification: "${scJustify}")

Score each 1-3 (3=correct, 2=partially correct, 1=wrong).
Return exactly: {"tc_score": N, "sc_score": N, "tc_feedback": "one sentence", "sc_feedback": "one sentence"}`;

  const raw = await callGemini(system, prompt);
  S.data[pidx].tcscScore = safeParseJSON(raw) || { tc_score: 2, sc_score: 2, tc_feedback: 'Unable to evaluate.', sc_feedback: 'Unable to evaluate.' };
}

async function generateFeedback() {
  const p0 = S.problems[0], p1 = S.problems[1];
  const d0 = S.data[0], d1 = S.data[1];

  const avgVerbal = (d) => {
    if (!d.verbalScores.length) return 0;
    return (d.verbalScores.reduce((s, v) => s + (v.score || 0), 0) / d.verbalScores.length).toFixed(1);
  };

  // Build DOM directly — also call Claude for overall assessment
  const system = `You are a senior FAANG interviewer writing a post-round assessment. Be honest, specific, and constructive. Return ONLY plain text (no JSON), 3-4 sentences.`;
  const prompt = `Candidate completed a mock DSA interview round.

Problem 1: ${p0.title} (${p0.difficulty})
- Verbal avg score: ${avgVerbal(d0)}/5
- Code: ${d0.codePassed ? 'PASSED' : 'FAILED'} (${d0.codeAttempts} attempt(s))
- TC given: ${d0.tcInput}, expected: ${p0.expectedTC} | SC given: ${d0.scInput}, expected: ${p0.expectedSC}

Problem 2: ${p1.title} (${p1.difficulty})
- Verbal avg score: ${avgVerbal(d1)}/5
- Code: ${d1.codePassed ? 'PASSED' : 'FAILED'} (${d1.codeAttempts} attempt(s))
- TC given: ${d1.tcInput}, expected: ${p1.expectedTC} | SC given: ${d1.scInput}, expected: ${p1.expectedSC}

Write a 3-4 sentence overall assessment covering strengths, weaknesses, and one specific actionable tip.`;

  const overallText = await callGemini(system, prompt);

  renderFeedback(overallText);
}

function renderFeedback(overallText) {
  function stars(score, max) {
    const filled = Math.round(score);
    return '●'.repeat(filled) + '○'.repeat(max - filled);
  }

  function verbalBlock(d, p) {
    if (!d.verbalScores.length) return '<div class="fb-note">Verbal answers not evaluated (no API key).</div>';
    return d.verbalScores.map((v, i) => `
      <div class="fb-verbal-row">
        <div class="fb-vq">Q${i + 1}: <em>${VERBAL_QUESTIONS[i].substring(0, 60)}…</em></div>
        <div class="fb-vscore">${stars(v.score, 5)} <span class="fb-snum">${v.score}/5</span></div>
        <div class="fb-vfeedback">${v.feedback}</div>
        ${v.hint ? '<div class="fb-vhint">💡 ' + v.hint + '</div>' : ''}
      </div>`).join('');
  }

  function tcscBlock(d, p) {
    const ts = d.tcscScore;
    if (!ts) return '<div class="fb-note">Complexity not evaluated.</div>';
    return `
      <div class="fb-complexity-row">
        <span class="fb-cx-label">Time:</span>
        <span class="fb-cx-given">${d.tcInput || '—'}</span>
        <span class="fb-cx-expected">(expected ${p.expectedTC})</span>
        <span class="fb-cx-score score-${ts.tc_score}">${['', '✗', '~', '✓'][ts.tc_score]}</span>
      </div>
      <div class="fb-cx-note">${ts.tc_feedback}</div>
      <div class="fb-complexity-row">
        <span class="fb-cx-label">Space:</span>
        <span class="fb-cx-given">${d.scInput || '—'}</span>
        <span class="fb-cx-expected">(expected ${p.expectedSC})</span>
        <span class="fb-cx-score score-${ts.sc_score}">${['', '✗', '~', '✓'][ts.sc_score]}</span>
      </div>
      <div class="fb-cx-note">${ts.sc_feedback}</div>`;
  }

  const html = S.problems.map((p, i) => {
    const d = S.data[i];
    const codeBadge = d.codePassed
      ? '<span class="fb-badge fb-pass">✓ Passed</span>'
      : '<span class="fb-badge fb-fail">✗ Did Not Pass</span>';
    return `
    <div class="fb-problem-card">
      <div class="fb-prob-header">
        <span class="fb-prob-num">Problem ${i + 1}</span>
        <span class="fb-prob-title">${p.title}</span>
        <span class="fb-prob-diff diff-${p.diffClass}">${p.difficulty}</span>
      </div>

      <div class="fb-section-title">Verbal Questions</div>
      ${verbalBlock(d, p)}

      <div class="fb-section-title">Code Submission ${codeBadge} <span class="fb-attempts">(${d.codeAttempts} attempt${d.codeAttempts !== 1 ? 's' : ''})</span></div>

      <div class="fb-section-title">Complexity Analysis</div>
      ${tcscBlock(d, p)}
    </div>`;
  }).join('');

  document.getElementById('fbProblems').innerHTML = html;
  document.getElementById('fbOverall').innerHTML = overallText
    ? `<div class="fb-overall-title">Overall Assessment</div><p class="fb-overall-text">${overallText}</p>`
    : '';

  // Compute overall score
  let total = 0, count = 0;
  S.data.forEach(d => {
    d.verbalScores.forEach(v => { total += v.score; count++; });
    if (d.codePassed) { total += 5; count++; }
    if (d.tcscScore) { total += d.tcscScore.tc_score + d.tcscScore.sc_score; count += 2; }
  });
  const pct = count ? Math.round(total / count * 20) : 0;
  document.getElementById('fbSub').textContent = `Overall score: ${pct}% — ${pct >= 75 ? 'Strong candidate 🌟' : pct >= 50 ? 'Solid with areas to improve 📈' : 'Keep practicing — you got this 💪'}`;
}
