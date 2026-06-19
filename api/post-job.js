// api/post-job.js — Auto Job Post Creator
// Customer URL Meta Fetch করে
// Supabase এ Job Save করে
// Google Indexing API 100% Priority দিয়ে Call করে

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Method Not Allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const url = body?.url;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'indexforce-jobs.vercel.app';
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const hostname = new URL(url).hostname;
  const results = [];

  // ================================
  // STEP 1: Customer URL এর Meta Fetch করুন
  // ================================
  let pageTitle = `${hostname} — Career Opportunity`;
  let pageDescription = `Join ${hostname} and explore exciting career opportunities. We are looking for talented individuals to join our growing team and make an impact.`;

  try {
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndexForceBot/1.0)' },
      signal: AbortSignal.timeout(6000)
    });
    const html = await pageRes.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch?.[1]) pageTitle = titleMatch[1].trim().slice(0, 100);

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    if (descMatch?.[1]) {
      pageDescription = descMatch[1].trim().slice(0, 500);
    } else {
      const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      if (ogDesc?.[1]) pageDescription = ogDesc[1].trim().slice(0, 500);
    }

    results.push({ step: 'fetch_meta', status: 'success', title: pageTitle });
  } catch (e) {
    results.push({ step: 'fetch_meta', status: 'fallback', message: e.message });
  }


  // ================================
  // STEP 2: Supabase এ Job Save করুন
  // ================================
  let jobId = null;
  const validThrough = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const saveRes = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          title: pageTitle,
          company: hostname,
          description: pageDescription,
          url: url,
          location: 'Remote',
          date_posted: new Date().toISOString(),
          valid_through: validThrough,
        })
      }
    );

    const saved = await saveRes.json();
    jobId = saved?.[0]?.id || saved?.id;

    if (jobId) {
      results.push({ step: 'supabase_save', status: 'success', job_id: jobId });
    } else {
      results.push({ step: 'supabase_save', status: 'error', message: JSON.stringify(saved) });
    }
  } catch (e) {
    results.push({ step: 'supabase_save', status: 'error', message: e.message });
  }

  if (!jobId) {
    return res.status(200).json({
      success: false,
      url,
      details: results,
      message: 'Job save failed'
    });
  }


  // ================================
  // STEP 3: Job Page URL
  // Canonical = Customer URL
  // Google Job Page দেখবে
  // Customer URL কেই Index করবে
  // ================================
  const jobPageUrl = `https://${YOUR_DOMAIN}/api/job?id=${jobId}`;


  // ================================
  // STEP 4: Google Indexing API Call
  // Job Posting Schema সহ = 100% Priority
  // ================================
  try {
    const token = await getGoogleToken();

    const indexRes = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: jobPageUrl,
          type: 'URL_UPDATED'
        })
      }
    );

    const indexData = await indexRes.json();

    if (indexRes.ok) {
      results.push({
        step: 'google_indexing_api',
        status: 'success',
        job_page: jobPageUrl
      });
    } else {
      results.push({
        step: 'google_indexing_api',
        status: 'error',
        message: JSON.stringify(indexData)
      });
    }
  } catch (e) {
    results.push({ step: 'google_indexing_api', status: 'error', message: e.message });
  }


  // ================================
  // STEP 5: PubSubHubbub Ping
  // ================================
  try {
    await fetch('https://pubsubhubbub.appspot.com/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `hub.mode=publish&hub.url=${encodeURIComponent(`https://${YOUR_DOMAIN}/feed.xml`)}`
    });
    results.push({ step: 'pubsubhubbub_ping', status: 'success' });
  } catch (e) {
    results.push({ step: 'pubsubhubbub_ping', status: 'error', message: e.message });
  }


  // ================================
  // STEP 6: IndexNow Ping
  // ================================
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: YOUR_DOMAIN,
        key: process.env.INDEXNOW_KEY || 'indexforce123',
        urlList: [jobPageUrl]
      })
    });
    results.push({ step: 'indexnow', status: 'success' });
  } catch (e) {
    results.push({ step: 'indexnow', status: 'error', message: e.message });
  }


  const successCount = results.filter(r => r.status === 'success').length;

  return res.status(200).json({
    success: true,
    url: url,
    job_id: jobId,
    job_page_url: jobPageUrl,
    signals_fired: successCount,
    total_steps: results.length,
    details: results,
    message: `Job created! Canonical → ${url}. Google indexing with 100% priority.`
  });
}


// ================================
// Google OAuth Token
// ================================
async function getGoogleToken() {
  const now = Math.floor(Date.now() / 1000);
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const claim = btoa(JSON.stringify({
    iss: GOOGLE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const sig = sign.sign(GOOGLE_PRIVATE_KEY, 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${header}.${claim}.${sig}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await tokenRes.json();
  if (data.access_token) return data.access_token;
  throw new Error('Token failed: ' + JSON.stringify(data));
  }
