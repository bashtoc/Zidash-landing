import { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerNavigation } from '../footerNavigation';

function FooterColumn({ title, links }) {
  const [expanded, setExpanded] = useState(false);
  const visibleLinks = expanded ? links : links.slice(0, 5);

  return (
    <div className="footer-col">
      <h3>{title}</h3>
      {visibleLinks.map((item) => item.to ? <Link key={item.label} to={item.to}>{item.label}</Link> : <a key={item.label} href={item.href}>{item.label}</a>)}
      {links.length > 5 && <button type="button" className="footer-see-more" onClick={() => setExpanded((current) => !current)}>{expanded ? 'See less' : 'See more'}</button>}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand" to="/app">
          <img src="/goodzidash-logo.png" alt="Zidash Logo" className="brand-logo" />
        </Link>
        <p>Zidash helps people buy and sell items, discover jobs, hire local talent, connect with UGC creators, and build trusted community commerce.</p>
        <div className="store-buttons small" id="download">
          <a href="#" aria-label="Download on the App Store"><img src="/downloadapple.png" alt="Download on the App Store" className="store-badge" /></a>
          <a href="#" aria-label="Get it on Google Play"><img src="/downloadplaystore.png" alt="Get it on Google Play" className="store-badge" /></a>
        </div>
      </div>
      <div className="footer-links" aria-label="Footer navigation">
        {footerNavigation.map((column) => <FooterColumn key={column.title} {...column} />)}
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
