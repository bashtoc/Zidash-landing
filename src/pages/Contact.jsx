export default function Contact() {
  return (
    <main>
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Contact Zidash</p>
          <h1 className="contact-hero-title">Talk to us about support, partnerships, and community growth.</h1>
          <p>Send a message to the Zidash team for app support, marketplace questions, creator partnerships, business inquiries, or account help.</p>
          <div className="contact-links">
            <a href="mailto:support@zidash.com">support@zidash.com</a>
            <a href="tel:07000000000">07000000000</a>
            <span className="contact-location-chip">Lagos, Nigeria</span>
          </div>
        </div>
        <form className="contact-form" action="#" method="post">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
          
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" type="text" required />
          
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="6" required></textarea>
          
          <button className="btn btn-primary btn-large" type="submit">Send Message</button>
        </form>
      </section>
      
      <section className="section contact-details">
        <article>
          <h2>Social links</h2>
          <p>Follow Zidash for product updates, local commerce tips, creator spotlights, and community stories.</p>
          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">LinkedIn</a>
            <a href="#">X</a>
          </div>
        </article>
        <article>
          <h2>Short FAQ</h2>
          <details open>
            <summary>What can I contact Zidash about?</summary>
            <p>Support, business partnerships, app feedback, account questions, creator discovery, jobs, and marketplace questions.</p>
          </details>
          <details>
            <summary>How do I delete my account?</summary>
            <p>Request account deletion through app settings when available or email support@zidash.com.</p>
          </details>
          <details>
            <summary>Can brands work with Zidash creators?</summary>
            <p>Yes. Business inquiries can be sent to partnerships@zidash.com.</p>
          </details>
        </article>
      </section>
    </main>
  );
}
