import { ArrowRight, BriefcaseBusiness, Clock3, LifeBuoy, Mail, MapPin, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const channels = [
  [Mail, 'General enquiries', 'Questions about Zidash, the platform, or media requests.', 'info@zidash.com'],
  [LifeBuoy, 'Customer support', 'Account help, technical issues, safety reports, or product support.', 'support@zidash.com'],
  [BriefcaseBusiness, 'Business partnerships', 'Brand campaigns, collaborations, advertising, and partnerships.', 'partnership@zidash.com'],
];

export default function Contact() {
  return (
    <main className="contact-modern">
      <section className="contact-modern__hero">
        <div>
          <p className="contact-modern__eyebrow"><MessagesSquare size={15} /> Contact Zidash</p>
          <h1>Let’s get you to the right team.</h1>
          <p>Whether you need help, want to explore a partnership, or simply have a question, choose the channel that best fits your enquiry.</p>
          <div className="contact-modern__location"><MapPin size={16} /> Lagos, Nigeria</div>
        </div>
        <aside className="contact-modern__support-card">
          <span><LifeBuoy size={22} /></span>
          <p>Need help with your account or a safety concern?</p>
          <strong>Our support team is the best place to start.</strong>
          <a href="mailto:support@zidash.com?subject=Zidash%20support%20request">Email support <ArrowRight size={17} /></a>
        </aside>
      </section>

      <section className="contact-modern__channels" aria-label="Contact options">
        {channels.map(([Icon, title, copy, email]) => (
          <article key={email}>
            <span><Icon size={21} /></span>
            <h2>{title}</h2>
            <p>{copy}</p>
            <a href={`mailto:${email}`}>{email}<ArrowRight size={15} /></a>
          </article>
        ))}
      </section>

      <section className="contact-modern__expectations">
        <div>
          <p className="contact-modern__eyebrow"><Clock3 size={15} /> Before you write</p>
          <h2>A little context helps us help you faster.</h2>
        </div>
        <div className="contact-modern__steps">
          <article><span>01</span><div><h3>Use the right inbox</h3><p>Choose support, general information, or partnerships so your message reaches the right team.</p></div></article>
          <article><span>02</span><div><h3>Include useful details</h3><p>Add your account email, relevant listing or profile, and a clear description of what happened.</p></div></article>
          <article><span>03</span><div><h3>Keep sensitive data private</h3><p>Never send passwords, one-time codes, banking PINs, or other confidential security details.</p></div></article>
        </div>
      </section>

      <section className="contact-modern__cta">
        <div><p>Looking for a quick answer?</p><h2>Our FAQ covers the most common Zidash questions.</h2></div>
        <Link to="/faq">Browse FAQs <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
