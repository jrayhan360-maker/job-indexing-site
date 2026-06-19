// api/job.js — Static HTML Job Page
// Server Side Render — JavaScript ছাড়া
// Canonical = Customer URL
// Google সাথে সাথে Content দেখবে

export default async function handler(req, res) {

  const { id } = req.query;
  if (!id) return res.status(400).send('Job ID required');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'indexforce-jobs.vercel.app';

  try {
    const jobRes = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const jobs = await jobRes.json();
    const job = jobs?.[0];
    if (!job) return res.status(404).send('Job not found');

    // ================================
    // Job Posting Schema
    // Google এটা দেখে 100% Priority দেয়
    // ================================
    const jobSchema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": new Date(job.date_posted).toISOString().split('T')[0],
      "validThrough": new Date(job.valid_through).toISOString().split('T')[0],
      "url": job.url,
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company,
        "sameAs": job.url
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Remote",
          "addressCountry": "BD"
        }
      },
      "employmentType": "FULL_TIME",
      "workHours": "40 hours per week",
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "value": 1000,
          "unitText": "MONTH"
        }
      }
    };

    // ================================
    // Server Side Static HTML
    // JavaScript ছাড়া — Google সাথে সাথে দেখবে
    // Canonical = Customer URL
    // ================================
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Canonical = Customer URL — Google এটাই Index করবে -->
<link rel="canonical" href="${job.url}">

<title>${job.title} at ${job.company}</title>
<meta name="description" content="${job.description?.slice(0, 160)}">
<meta name="robots" content="index, follow">

<!-- Open Graph -->
<meta property="og:title" content="${job.title}">
<meta property="og:description" content="${job.description?.slice(0, 200)}">
<meta property="og:url" content="${job.url}">
<meta property="og:type" content="website">

<!-- Job Posting Schema — Google 100% Priority -->
<script type="application/ld+json">
${JSON.stringify(jobSchema, null, 2)}
</script>

<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; }
  header { background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 20px; text-align: center; }
  header h2 { font-size: 16px; opacity: 0.8; font-weight: normal; }
  .container { max-width: 800px; margin: 30px auto; padding: 0 20px; }
  .breadcrumb { font-size: 13px; color: #888; margin-bottom: 16px; }
  .breadcrumb a { color: #1a73e8; text-decoration: none; }
  .job-card { background: white; border-radius: 10px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .job-title { font-size: 26px; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; line-height: 1.3; }
  .job-company { font-size: 16px; color: #1a73e8; font-weight: 600; margin-bottom: 16px; }
  .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .meta-item { background: #f8f9fa; border-radius: 8px; padding: 12px; }
  .meta-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .meta-value { font-size: 14px; font-weight: 600; color: #333; }
  .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }
  .section-title { font-size: 16px; font-weight: 700; color: #333; margin-bottom: 12px; }
  .job-desc { font-size: 15px; line-height: 1.8; color: #444; white-space: pre-line; }
  .requirements { margin-top: 20px; }
  .requirements ul { padding-left: 20px; }
  .requirements li { font-size: 14px; line-height: 2; color: #444; }
  .apply-section { margin-top: 30px; background: #e8f0fe; border-radius: 10px; padding: 24px; text-align: center; }
  .apply-title { font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
  .apply-desc { font-size: 14px; color: #555; margin-bottom: 16px; }
  .apply-btn { display: inline-block; background: #1a73e8; color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 700; }
  .apply-btn:hover { background: #1557b0; }
  .source-url { margin-top: 12px; font-size: 13px; color: #888; word-break: break-all; }
  .source-url a { color: #1a73e8; }
  footer { text-align: center; padding: 30px; color: #999; font-size: 13px; margin-top: 30px; }
  @media (max-width: 600px) {
    .job-title { font-size: 20px; }
    .job-card { padding: 20px; }
  }
</style>
</head>
<body>

<header>
  <h1>💼 IndexForce Jobs</h1>
  <h2>Job opportunities from top companies worldwide</h2>
</header>

<div class="container">
  <p class="breadcrumb">
    <a href="/">Home</a> → <a href="/">Jobs</a> → ${job.title}
  </p>

  <div class="job-card">

    <div class="job-title">${job.title}</div>
    <div class="job-company">🏢 ${job.company}</div>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">Location</div>
        <div class="meta-value">🌍 Remote</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Job Type</div>
        <div class="meta-value">💼 Full Time</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Posted</div>
        <div class="meta-value">📅 ${new Date(job.date_posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Valid Until</div>
        <div class="meta-value">⏰ ${new Date(job.valid_through).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </div>
    </div>

    <hr class="divider">

    <div class="section-title">📋 Job Description</div>
    <div class="job-desc">${job.description}</div>

    <div class="requirements">
      <div class="section-title" style="margin-top: 20px;">✅ Requirements</div>
      <ul>
        <li>Experience in related field at ${job.company}</li>
        <li>Strong communication and teamwork skills</li>
        <li>Ability to work independently in remote environment</li>
        <li>Detail-oriented with problem-solving abilities</li>
        <li>Passion for learning and growth</li>
      </ul>
    </div>

    <div class="apply-section">
      <div class="apply-title">Ready to Apply?</div>
      <div class="apply-desc">Click below to view the full job posting and apply directly</div>
      <a href="${job.url}" class="apply-btn" target="_blank" rel="noopener">
        Apply Now →
      </a>
      <div class="source-url">
        Job source: <a href="${job.url}" target="_blank">${job.url}</a>
      </div>
    </div>

  </div>
</div>

<footer>
  <p>© 2026 IndexForce Jobs — <a href="/" style="color: #1a73e8;">Browse All Jobs</a></p>
</footer>

</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).send(html);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
