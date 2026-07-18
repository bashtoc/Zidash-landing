export default function Careers() {
  return (
    <main className="careers-page">
      <section className="careers-hero">
        <p className="eyebrow">Careers at Zidash</p>
        <h1 className="careers-hero-title">Build the Future of Nigeria's Marketplace</h1>
        <p className="careers-hero-copy">At Zidash, we're building a trusted platform where people can buy, sell, find jobs, hire creators, and connect with opportunities—all in one place.</p>
        <p className="careers-hero-copy">We're looking for passionate, creative, and driven people who want to make a real impact across Nigeria and beyond.</p>
        <p className="careers-hero-copy">Whether you're an experienced professional, a recent graduate, or a freelancer, we'd love to hear from you.</p>
      </section>

      <section className="careers-section">
        <h2 className="careers-section-title">Why Join Zidash?</h2>
        <div className="careers-perks">
          <div className="careers-perk-card">
            <div className="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <p>Work on products that impact millions of people.</p>
          </div>
          <div className="careers-perk-card">
            <div className="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <p>Be part of a fast-growing technology company.</p>
          </div>
          <div className="careers-perk-card">
            <div className="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <p>Collaborate with talented and innovative people.</p>
          </div>
          <div className="careers-perk-card">
            <div className="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <p>Flexible and remote-friendly opportunities.</p>
          </div>
          <div className="careers-perk-card">
            <div className="perk-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <p>Grow your career while helping build Africa's next digital marketplace.</p>
          </div>
        </div>
      </section>

      <section className="careers-section">
        <h2 className="careers-section-title">Current Openings</h2>
        <div className="careers-notice">
          <p>We are not actively hiring at the moment.</p>
          <p>However, we're always interested in connecting with talented individuals in the following areas:</p>
        </div>
        <div className="careers-roles-grid">
          {[
            'Software Engineering',
            'Mobile App Development',
            'UI/UX Design',
            'Product Management',
            'Customer Support',
            'Marketing & Growth',
            'Sales & Partnerships',
            'Business Development',
            'Community Management',
            'Content & Social Media',
            'UGC Creator Partnerships',
            'Data Analytics',
            'Quality Assurance (QA)',
            'Cybersecurity',
          ].map((role) => (
            <div className="careers-role-chip" key={role}>
              <span className="role-dot" />
              {role}
            </div>
          ))}
        </div>
      </section>

      <section className="careers-section careers-talent-pool">
        <div className="talent-pool-card">
          <h2 className="careers-section-title">Join Our Talent Pool</h2>
          <p>Don't see a role that matches your skills?</p>
          <p>Send your resume, portfolio, or LinkedIn profile to us. We'll keep your information on file and contact you when a suitable opportunity becomes available.</p>
          <a href="mailto:careers@zidash.com" className="btn btn-primary btn-large">careers@zidash.com</a>
        </div>
      </section>

      <section className="careers-section">
        <h2 className="careers-section-title">Our Values</h2>
        <div className="careers-values-grid">
          {[
            { title: 'Trust First', icon: '🤝' },
            { title: 'Users Come First', icon: '💚' },
            { title: 'Innovation Every Day', icon: '💡' },
            { title: 'Simplicity Wins', icon: '✨' },
            { title: 'Diversity & Inclusion', icon: '🌍' },
            { title: 'Integrity Always', icon: '🛡️' },
            { title: 'Continuous Learning', icon: '📚' },
            { title: 'Think Big, Build Better', icon: '🚀' },
          ].map((value) => (
            <div className="careers-value-card" key={value.title}>
              <span className="value-emoji">{value.icon}</span>
              <span className="value-label">{value.title}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
