import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand" to="/">
          <img src="/zidashlogo.png" alt="Zidash Logo" className="brand-logo" />
        </Link>
        <p>Zidash helps people buy and sell items, discover jobs, hire local talent, connect with UGC creators, and build trusted community commerce.</p>
        <div className="store-buttons small">
          <a href="#" aria-label="Download on the App Store"><img src="/downloadapple.png" alt="Download on the App Store" className="store-badge" /></a>
          <a href="#" aria-label="Get it on Google Play"><img src="/downloadplaystore.png" alt="Get it on Google Play" className="store-badge" /></a>
        </div>
      </div>
      <div className="footer-links" aria-label="Footer navigation">
        <div className="footer-col">
          <h3>Company</h3>
          <Link to="/about">About Zidash</Link>
          <Link to="/careers">Careers</Link>
          <a href="mailto:info@zidash.com">General Enquiries</a>
          <a href="mailto:support@zidash.com">Customer Support</a>
          <a href="mailto:partnership@zidash.com">Business Partnerships</a>
        </div>
        <div className="footer-col">
          <h3>Safety</h3>
          <Link to="/safety">Safety Center</Link>
          <Link to="/buyer-safety">Buyer Safety Guide</Link>
          <Link to="/seller-safety">Seller Safety Guide</Link>
          <Link to="/scam-prevention">Scam Prevention Guide</Link>
          <Link to="/verification-policy">Verification Policy</Link>
          <Link to="/contact">Report a Problem</Link>
        </div>
        <div className="footer-col">
          <h3>Legal</h3>
          <Link to="/legal">Legal Center</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookie">Cookie Policy</Link>
          <Link to="/guidelines">Community Guidelines</Link>
          <Link to="/ip-policy">Intellectual Property Policy</Link>
          <Link to="/prohibited">Prohibited Items Policy</Link>
          <Link to="/ads-policy">Advertising & Boost Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/business-policy">Business Account Policy</Link>
          <Link to="/service-policy">Service Provider Policy</Link>
          <Link to="/job-policy">Job Posting Policy</Link>
          <Link to="/ugc-policy">UGC Creator Policy</Link>
          <Link to="/moderation-policy">Content Moderation Policy</Link>
        </div>
        <div className="footer-col">
          <h3>Support</h3>
          <Link to="/faq">Help Center / FAQ</Link>
          <Link to="/contact">Contact Support</Link>
          <Link to="/contact">Report Abuse</Link>
          <Link to="/contact-policy">Contact & Support Policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">Copyright &copy; {new Date().getFullYear()} Zidash. All rights reserved.</p>
        <div className="social-links">
          <a href="#" aria-label="X"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2h3.4l-7.5 8.6L23.6 22h-6.9l-5.4-7.1L5.1 22H1.7l8-9.2L1.2 2h7.1l4.9 6.5L18.9 2Zm-1.2 18h1.9L7.2 3.9h-2L17.7 20Z" /></svg></a>
          <a href="#" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="#" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        </div>
      </div>
    </footer>
  );
}
