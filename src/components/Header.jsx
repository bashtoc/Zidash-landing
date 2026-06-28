import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
  };

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
          <Link to={getHashLink('#marketplace')} onClick={(e) => handleHashClick(e, '#marketplace')}>Marketplace</Link>
          <Link to={getHashLink('#jobs')} onClick={(e) => handleHashClick(e, '#jobs')}>Jobs</Link>
          <Link to={getHashLink('#creators')} onClick={(e) => handleHashClick(e, '#creators')}>UGC Creators</Link>
          <Link to={getHashLink('#community')} onClick={(e) => handleHashClick(e, '#community')}>Community</Link>
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
