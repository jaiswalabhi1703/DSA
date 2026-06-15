/* Local dev server — mirrors Netlify behaviour
   Serves static files + /.netlify/functions/judge proxy
   Usage: node dev-server.js [port]          default port 8080
*/
const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const PORT = parseInt(process.argv[2] || '8080');
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function proxyHttps(hostname, path, payload, extraHeaders, res) {
  const options = {
    hostname, path, method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      ...extraHeaders
    }
  };
  const pr = https.request(options, proxyRes => {
    let data = '';
    proxyRes.on('data', chunk => data += chunk);
    proxyRes.on('end', () => { res.writeHead(proxyRes.statusCode, CORS_HEADERS); res.end(data); });
  });
  pr.on('error', err => { res.writeHead(502, CORS_HEADERS); res.end(JSON.stringify({ error: err.message })); });
  pr.write(payload);
  pr.end();
}

function handleExecute(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let parsed;
    try { parsed = JSON.parse(body); }
    catch { res.writeHead(400, CORS_HEADERS); res.end(JSON.stringify({ error: 'Invalid JSON' })); return; }
    proxyHttps('api.jdoodle.com', '/v1/execute', JSON.stringify(parsed), {}, res);
  });
}

function handleJudge(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let parsed;
    try { parsed = JSON.parse(body); }
    catch { res.writeHead(400, CORS_HEADERS); res.end(JSON.stringify({ error: 'Invalid JSON' })); return; }

    const { apiKey, system, userMsg } = parsed;
    if (!apiKey || !userMsg) {
      res.writeHead(400, CORS_HEADERS);
      res.end(JSON.stringify({ error: 'Missing apiKey or userMsg' }));
      return;
    }

    const model = 'gemini-2.0-flash-lite';
    const geminiPath = `/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = JSON.stringify({
      systemInstruction: { parts: [{ text: system || '' }] },
      contents: [{ role: 'user', parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 900 }
    });

    proxyHttps('generativelanguage.googleapis.com', geminiPath, payload, {}, res);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  const pathname = parsed.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end(); return;
  }

  // Netlify function proxies
  if (pathname === '/.netlify/functions/execute') { handleExecute(req, res); return; }
  if (pathname === '/.netlify/functions/judge')   { handleJudge(req, res);   return; }

  // Static files
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  if (!path.extname(filePath)) filePath += '.html';

  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) { res.writeHead(404); res.end('Not found: ' + pathname); return; }
    serveFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log('\n  DSA Command Center — local dev server');
  console.log('  ─────────────────────────────────────');
  console.log('  http://localhost:' + PORT);
  console.log('  http://localhost:' + PORT + '/mock_round.html');
  console.log('\n  Ctrl+C to stop\n');
});
