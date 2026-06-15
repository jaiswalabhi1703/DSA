/* Gemini proxy — kept as fallback if browser CORS ever blocks */
const GEMINI_MODEL = 'gemini-2.0-flash-lite';

export const handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { apiKey, system, userMsg } = body;
  if (!apiKey || !userMsg) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing apiKey or userMsg' }) };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system || '' }] },
      contents: [{ role: 'user', parts: [{ text: userMsg }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 900 }
    })
  });

  const data = await resp.json();
  return { statusCode: resp.status, headers, body: JSON.stringify(data) };
};
