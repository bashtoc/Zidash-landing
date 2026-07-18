import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
    setIsOpen(false);
    setFeaturesOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setFeaturesOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header ${isOpen ? 'nav-open' : ''}`}>
      <Link className="brand" to="/" aria-label="Zidash home" onClick={() => setIsOpen(false)}>
        <img src="/zidashlogo.png" alt="Zidash Logo" className="brand-logo" />
      </Link>
      <button 
        className="menu-toggle" 
        type="button" 
        aria-label={isOpen ? "Close navigation" : "Open navigation"} 
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <span className="menu-toggle-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div className="header-menu">
        <nav className="site-nav" aria-label="Primary navigation">
          <Link className={location.pathname === '/' ? 'active' : ''} to="/" onClick={() => setIsOpen(false)}>Home</Link>
          
          <div className={`nav-dropdown ${featuresOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button
              type="button"
              className="nav-dropdown-toggle"
              onClick={() => setFeaturesOpen(!featuresOpen)}
              aria-expanded={featuresOpen}
            >
              Features
              <svg className="nav-dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div className="nav-dropdown-menu">
              <Link to={getHashLink('#marketplace')} onClick={(e) => handleHashClick(e, '#marketplace')}>
                <span className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </span>
                <span>
                  <strong>Marketplace</strong>
                  <small>Buy and sell products</small>
                </span>
              </Link>
              <Link to={getHashLink('#jobs')} onClick={(e) => handleHashClick(e, '#jobs')}>
                <span className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </span>
                <span>
                  <strong>Jobs</strong>
                  <small>Find and post opportunities</small>
                </span>
              </Link>
              <Link to={getHashLink('#creators')} onClick={(e) => handleHashClick(e, '#creators')}>
                <span className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </span>
                <span>
                  <strong>UGC Creators</strong>
                  <small>Connect with content creators</small>
                </span>
              </Link>
              <Link to={getHashLink('#community')} onClick={(e) => handleHashClick(e, '#community')}>
                <span className="dropdown-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
                <span>
                  <strong>Community</strong>
                  <small>Join the Zidash community</small>
                </span>
              </Link>
            </div>
          </div>

          <Link className={location.pathname === '/about' ? 'active' : ''} to="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link className={location.pathname === '/contact' ? 'active' : ''} to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
        <div className="header-actions">
          <Link className="btn btn-primary" to={getHashLink('#download')} onClick={(e) => handleHashClick(e, '#download')}>Download App</Link>
        </div>
      </div>
    </header>
  );
}
