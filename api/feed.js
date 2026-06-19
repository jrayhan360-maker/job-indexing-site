// api/feed.js — RSS Feed for Job Site
// Google এই Feed Subscribe করবে
// নতুন Job আসলে সাথে সাথে জানবে

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'indexforce-jobs.vercel.app';

  try {
    const jobRes = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?select=*&order=date_posted.desc&limit=50`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const jobs = await jobRes.json();

    const items = (jobs || []).map(job => `
    <item>
      <title>${job.title}</title>
      <link>https://${YOUR_DOMAIN}/api/job?id=${job.id}</link>
      <guid>https://${YOUR_DOMAIN}/api/job?id=${job.id}</guid>
      <pubDate>${new Date(job.date_posted).toUTCString()}</pubDate>
      <description>${job.description?.slice(0, 200)}</description>
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IndexForce Jobs Feed</title>
    <link>https://${YOUR_DOMAIN}</link>
    <description>Latest job postings</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://${YOUR_DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    return res.status(200).send(rss);

  } catch (error) {
    return res.status(500).json({ error: error.message });
    
  }
}
