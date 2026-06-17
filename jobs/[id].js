// pages/jobs/[id].js
// প্রতিটা Job Post এর Page - Google Job Schema সহ

export default function JobPage({ job }) {
  if (!job) {
    return <div>Job not found</div>;
  }

  // Google Job Schema - এটাই Google কে বলে "এটা Job Post"
  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": `Latest opportunity. Visit: ${job.customerUrl}`,
    "datePosted": job.datePosted,
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Global Opportunities",
      "sameAs": job.customerUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": 50000,
        "maxValue": 100000,
        "unitText": "YEAR"
      }
    }
  };

  return (
    <>
      <head>
        <title>{job.title}</title>
        <meta name="description" content={`Job opportunity - ${job.title}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <main style={{ fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>{job.title}</h1>
        <p><strong>Posted:</strong> {new Date(job.datePosted).toLocaleDateString()}</p>
        <p><strong>Type:</strong> Full Time</p>
        <p><strong>Location:</strong> Remote / Global</p>
        <hr />
        <h2>About This Opportunity</h2>
        <p>We are excited to share this opportunity with qualified candidates.</p>
        <p>For more details, please visit the official listing.</p>
        <a href={job.customerUrl} style={{
          display: 'inline-block',
          background: '#0070f3',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          marginTop: '20px'
        }}>
          View Full Details →
        </a>
      </main>
    </>
  );
}

export async function getServerSideProps({ params }) {
  // Production এ Supabase থেকে আনুন
  // এখন simple response
  return {
    props: {
      job: {
        id: params.id,
        title: `Job Opportunity #${params.id}`,
        datePosted: new Date().toISOString(),
        customerUrl: 'https://example.com'
      }
    }
  };
}
