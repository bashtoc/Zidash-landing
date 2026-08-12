import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { footerNavigation } from '../footerNavigation';

function FooterNavigationDropdown({ title, links, isOpen, onToggle, onNavigate }) {
  return (
    <div className={`nav-dropdown footer-nav-dropdown ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="nav-dropdown-toggle"
        onClick={() => onToggle(title)}
        aria-expanded={isOpen}
        aria-label={`${title} navigation`}
      >
        {title}
        <svg className="nav-dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      <div className="nav-dropdown-menu footer-nav-dropdown-menu">
        {links.map((item) => item.to ? (
          <Link key={item.label} to={item.to} onClick={onNavigate}>{item.label}</Link>
        ) : (
          <a key={item.label} href={item.href} onClick={onNavigate}>{item.label}</a>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [footerMenuOpen, setFooterMenuOpen] = useState(null);
  const location = useLocation();
  const headerRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleHashClick = (e, hash) => {
    e.preventDefault();
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', hash);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setFooterMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setFooterMenuOpen(null);
  }, [location.pathname]);

  const closeNavigation = () => {
    setIsOpen(false);
    setFooterMenuOpen(null);
  };

  const toggleFooterMenu = (title) => {
    setFooterMenuOpen((current) => current === title ? null : title);
  };

  return (
    <header ref={headerRef} className={`site-header ${isOpen ? 'nav-open' : ''} ${location.pathname === '/about' ? 'site-header--about' : ''}`}>
      <Link className="brand" to="/app" aria-label="Open Zidash web app" onClick={closeNavigation}>
        <img src="/goodzidash-logo.png" alt="Zidash Logo" className="brand-logo" />
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
          {footerNavigation.map((column) => <FooterNavigationDropdown key={column.title} {...column} isOpen={footerMenuOpen === column.title} onToggle={toggleFooterMenu} onNavigate={closeNavigation} />)}
        </nav>
        <div className="header-actions">
          <Link className="btn btn-secondary header-webapp-link" to="/app" onClick={() => setIsOpen(false)}>Open Web App</Link>
          <Link className="btn btn-primary" to="#download" onClick={(e) => handleHashClick(e, '#download')}>Download App</Link>
        </div>
      </div>
    </header>
  );
}
