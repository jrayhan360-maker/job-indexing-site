// pages/api/submit.js
// এই API এ customer URL আসবে → Job Post তৈরি হবে → Google Indexing API call হবে

import { GoogleAuth } from 'google-auth-library';

// In-memory storage (Vercel এ Supabase ব্যবহার করতে পারেন)
let jobs = [];
let jobIdCounter = 1;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'URL required' });
      }

      // ১. Job Post তৈরি করুন
      const jobId = jobIdCounter++;
      const job = {
        id: jobId,
        customerUrl: url,
        title: `Opportunity - ${new Date().toISOString().split('T')[0]}`,
        datePosted: new Date().toISOString(),
        jobUrl: `${process.env.SITE_URL}/jobs/${jobId}`
      };
      jobs.push(job);

      // ২. Google Indexing API call করুন
      let googleResult = null;
      try {
        googleResult = await callGoogleIndexingAPI(job.jobUrl);
      } catch (err) {
        console.error('Google API error:', err.message);
      }

      return res.status(200).json({
        success: true,
        jobId: jobId,
        jobUrl: job.jobUrl,
        customerUrl: url,
        googleIndexing: googleResult ? 'submitted' : 'failed',
        message: 'Job created and submitted to Google!'
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // GET - সব jobs দেখুন
  if (req.method === 'GET') {
    return res.status(200).json({ jobs, total: jobs.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Google Indexing API Function
async function callGoogleIndexingAPI(pageUrl) {
  const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

  const auth = new GoogleAuth({
    credentials: serviceAccountKey,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const response = await fetch(
    'https://indexing.googleapis.com/v3/urlNotifications:publish',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pageUrl,
        type: 'URL_UPDATED',
      }),
    }
  );

  const data = await response.json();
  return data;
}
