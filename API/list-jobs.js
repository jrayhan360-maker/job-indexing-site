// api/list-jobs.js — Job List API
// Homepage এ সব Job দেখাবে

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  try {
    const jobRes = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?select=*&order=date_posted.desc&limit=20`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const jobs = await jobRes.json();

    return res.status(200).json({
      success: true,
      jobs: jobs || []
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
