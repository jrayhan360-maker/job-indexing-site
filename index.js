// pages/index.js
// Job Indexing Site - Homepage

export default function Home() {
  return (
    <>
      <head>
        <title>Job Indexing Service</title>
        <meta name="description" content="Fast URL indexing service powered by Google Indexing API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #fff; }
          .hero {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
          }
          .badge {
            background: #00ff88;
            color: #000;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 30px;
          }
          h1 {
            font-size: clamp(36px, 6vw, 72px);
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 20px;
          }
          h1 span { color: #00ff88; }
          .subtitle {
            font-size: 18px;
            color: #888;
            max-width: 500px;
            line-height: 1.6;
            margin-bottom: 50px;
          }
          .stats {
            display: flex;
            gap: 40px;
            margin-bottom: 50px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .stat { text-align: center; }
          .stat-number { font-size: 36px; font-weight: 900; color: #00ff88; }
          .stat-label { font-size: 12px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
          .form-box {
            background: #111;
            border: 1px solid #222;
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 500px;
          }
          .form-title {
            font-size: 14px;
            color: #00ff88;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 20px;
          }
          textarea {
            width: 100%;
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 16px;
            color: #fff;
            font-size: 14px;
            resize: vertical;
            min-height: 120px;
            outline: none;
            font-family: monospace;
          }
          textarea:focus { border-color: #00ff88; }
          .url-count { text-align: right; font-size: 12px; color: #555; margin-top: 8px; }
          button {
            width: 100%;
            background: #00ff88;
            color: #000;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            margin-top: 16px;
            transition: opacity 0.2s;
          }
          button:hover { opacity: 0.9; }
          button:disabled { opacity: 0.5; cursor: not-allowed; }
          .result {
            margin-top: 16px;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            display: none;
          }
          .result.success { background: #0d2818; border: 1px solid #00ff88; color: #00ff88; }
          .result.error { background: #2a0a0a; border: 1px solid #ff4444; color: #ff4444; }
          .how-it-works {
            padding: 80px 20px;
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
          }
          .section-title {
            font-size: 12px;
            color: #555;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 40px;
          }
          .steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
          }
          .step {
            background: #111;
            border: 1px solid #222;
            border-radius: 12px;
            padding: 30px 20px;
            text-align: left;
          }
          .step-num { font-size: 32px; font-weight: 900; color: #333; margin-bottom: 12px; }
          .step-title { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
          .step-desc { font-size: 14px; color: #666; line-height: 1.5; }
        `}</style>
      </head>
      <body>
        <div className="hero">
          <div className="badge">⚡ SYSTEM ONLINE</div>
          <h1>Index Any URL<br /><span>In Minutes</span></h1>
          <p className="subtitle">
            Submit your URLs and our engine fires Google Indexing API signals to get your content crawled fast.
          </p>
          <div className="stats">
            <div className="stat">
              <div className="stat-number">~15min</div>
              <div className="stat-label">Avg Index Time</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Google API</div>
            </div>
            <div className="stat">
              <div className="stat-number">Auto</div>
              <div className="stat-label">Process</div>
            </div>
          </div>

          <div className="form-box">
            <div className="form-title">// Submit URL for Indexing</div>
            <textarea
              id="urlInput"
              placeholder="https://yourblog.com/2026/06/your-post-title"
            />
            <div className="url-count" id="urlCount">0 URLs</div>
            <button id="submitBtn" onclick="submitURL()">
              ⚡ Start Indexing Now
            </button>
            <div className="result" id="result"></div>
          </div>
        </div>

        <div className="how-it-works">
          <div className="section-title">// How It Works</div>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-title">Submit URL</div>
              <div className="step-desc">আপনার যেকোনো URL এখানে দিন</div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-title">Job Post তৈরি</div>
              <div className="step-desc">Schema.org Job Post তৈরি হয় automatically</div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-title">Google API Call</div>
              <div className="step-desc">সরাসরি Google Indexing API তে submit হয়</div>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <div className="step-title">Index হয়!</div>
              <div className="step-desc">~15 মিনিটের মধ্যে Google এ দেখা যায়</div>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          const urlInput = document.getElementById('urlInput');
          const urlCount = document.getElementById('urlCount');
          
          urlInput.addEventListener('input', function() {
            const urls = this.value.split('\\n').filter(u => u.trim());
            urlCount.textContent = urls.length + ' URL' + (urls.length !== 1 ? 's' : '');
          });

          async function submitURL() {
            const btn = document.getElementById('submitBtn');
            const result = document.getElementById('result');
            const url = urlInput.value.trim();

            if (!url) {
              result.style.display = 'block';
              result.className = 'result error';
              result.textContent = '❌ Please enter a URL';
              return;
            }

            btn.disabled = true;
            btn.textContent = '⏳ Processing...';
            result.style.display = 'none';

            try {
              const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
              });
              const data = await response.json();

              result.style.display = 'block';
              if (data.success) {
                result.className = 'result success';
                result.textContent = '✅ Submitted! Google indexing: ' + data.googleIndexing;
              } else {
                result.className = 'result error';
                result.textContent = '❌ Error: ' + (data.error || 'Unknown error');
              }
            } catch(e) {
              result.style.display = 'block';
              result.className = 'result error';
              result.textContent = '❌ Network error. Please try again.';
            }

            btn.disabled = false;
            btn.textContent = '⚡ Start Indexing Now';
          }
        `}} />
      </body>
    </>
  );
}
