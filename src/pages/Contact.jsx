import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-intro">
          <p className="eyebrow">Contact Zidash</p>
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-subtitle">Have a question, need support, or interested in a partnership? We'd love to hear from you.</p>
          
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h3>General Enquiries</h3>
              <a href="mailto:info@zidash.com">info@zidash.com</a>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h3>Customer Support</h3>
              <a href="mailto:support@zidash.com">support@zidash.com</a>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Business Partnerships</h3>
              <a href="mailto:partnership@zidash.com">partnership@zidash.com</a>
            </div>
          </div>

          <div className="contact-location">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Lagos, Nigeria</span>
          </div>
        </div>

        <form className="contact-form" action="#" method="post">
          <h2 className="contact-form-heading">Send us a message</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" placeholder="Your full name" autoComplete="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" type="text" placeholder="How can we help?" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Tell us more about your enquiry…" required></textarea>
          </div>
          <button className="btn btn-primary btn-large" type="submit">Send Message</button>
        </form>
      </section>

      <section className="section contact-bottom">
        <div className="contact-bottom-card">
          <h2>Can't find what you're looking for?</h2>
          <p>Check our <Link to="/faq">FAQ page</Link> for quick answers to the most common questions about Zidash.</p>
        </div>
      </section>
    </main>
  );
}
