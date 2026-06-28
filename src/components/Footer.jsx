import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  const getHashLink = (hash) => {
    return location.pathname === '/' ? hash : `/${hash}`;
  };

  const handleHashClick = (e, hash) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', hash);
      }
    }
  };

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
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/contact">Contact</Link>
        <Link to={getHashLink('#marketplace')} onClick={(e) => handleHashClick(e, '#marketplace')}>Marketplace</Link>
        <Link to={getHashLink('#jobs')} onClick={(e) => handleHashClick(e, '#jobs')}>Jobs</Link>
        <Link to={getHashLink('#creators')} onClick={(e) => handleHashClick(e, '#creators')}>UGC Creators</Link>
        <Link to={getHashLink('#community')} onClick={(e) => handleHashClick(e, '#community')}>Community</Link>
      </nav>
      <p className="copyright">Copyright &copy; {new Date().getFullYear()} Zidash. All rights reserved.</p>
    </footer>
  );
}
