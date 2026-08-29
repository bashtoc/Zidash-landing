import { Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { BriefcaseBusiness, ChevronDown, Headset, Heart, Home, LifeBuoy, MapPin, Megaphone, Menu, MessageCircle, PlusCircle, Store, UserRound, UsersRound, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { useAuth } from './auth-context'
import { NIGERIAN_LOCATIONS } from './data'
import { usePopup } from './popup-context'
import './WebApp.css'

const nav = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/app/community', label: 'Communities', icon: UsersRound },
  { to: '/app/messages', label: 'Messages', icon: MessageCircle, protected: true },
  { to: '/app/profile', label: 'Profile', icon: UserRound, protected: true },
]

function MarketplaceHomeSkeleton() {
  return <div className="app-page marketplace-home-skeleton" role="status" aria-live="polite">
    <span className="marketplace-home-skeleton__label">Loading marketplace</span>
    <div className="marketplace-home-skeleton__hero" aria-hidden="true">
      <div className="marketplace-home-skeleton__hero-copy">
        <span className="marketplace-home-skeleton__line marketplace-home-skeleton__line--eyebrow" />
        <span className="marketplace-home-skeleton__line marketplace-home-skeleton__line--title" />
        <span className="marketplace-home-skeleton__line marketplace-home-skeleton__line--title marketplace-home-skeleton__line--short" />
        <span className="marketplace-home-skeleton__line marketplace-home-skeleton__line--body" />
        <span className="marketplace-home-skeleton__line marketplace-home-skeleton__line--body marketplace-home-skeleton__line--medium" />
      </div>
      <span className="marketplace-home-skeleton__hero-art" />
    </div>
    <div className="marketplace-home-skeleton__search" aria-hidden="true"><span /><i /></div>
    <section className="marketplace-home-skeleton__section" aria-hidden="true">
      <div className="marketplace-home-skeleton__heading"><span /><i /></div>
      <div className="marketplace-home-skeleton__categories">{Array.from({ length: 8 }, (_, index) => <div key={index}><span /><i /><b /></div>)}</div>
    </section>
    <section className="marketplace-home-skeleton__section" aria-hidden="true">
      <div className="marketplace-home-skeleton__heading"><span /><i /></div>
      <div className="marketplace-home-skeleton__cards">{Array.from({ length: 4 }, (_, index) => <div key={index}><span /><i /><b /></div>)}</div>
    </section>
  </div>
}

function ConsumerRouteLoader({ home }) {
  if (home) return <MarketplaceHomeSkeleton />
  return <div className="app-page consumer-route-loader" role="status" aria-live="polite"><span>Loading page</span></div>
}

export default function WebAppShell() {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { showPopup } = usePopup()
  const [menuOpen, setMenuOpen] = useState(false)
  const [appLocation, setAppLocation] = useState(() => {
    const savedLocation = window.localStorage.getItem('zidash_location')
    return NIGERIAN_LOCATIONS.includes(savedLocation) && savedLocation !== 'All' ? savedLocation : 'Lagos'
  })

  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = previousScrollRestoration }
  }, [])

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    scrollToTop()
    const frame = window.requestAnimationFrame(scrollToTop)
    return () => window.cancelAnimationFrame(frame)
  }, [location.key])

  function protectedNavigation(event, item) {
    if (!item.protected || auth.isAuthenticated) return
    event.preventDefault()
    navigate(`/auth?returnTo=${encodeURIComponent(item.to)}`)
  }

  function contactSupport() {
    showPopup({
      title: 'Contact Zidash support',
      message: 'Send us an email at support@zidash.com and our support team will help you.',
      action: {
        label: 'Open email app',
        onClick: () => { window.location.href = 'mailto:support@zidash.com?subject=Zidash%20Support%20Request' },
      },
    })
  }

  const userName = auth.user ? `${auth.user.firstName || ''} ${auth.user.lastName || ''}`.trim() : ''

  return <div className="consumer-app">
    <header className="consumer-header">
      <div className="consumer-header__inner">
        <button type="button" className="consumer-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open app menu"><Menu size={23} /></button>
        <Link to="/app" className="consumer-brand" aria-label="Zidash marketplace"><img src="/goodzidash-logo.png" alt="Zidash" /></Link>
        <label className="location-picker"><MapPin size={16} /><select value={appLocation} onChange={(event) => { setAppLocation(event.target.value); window.localStorage.setItem('zidash_location', event.target.value) }} aria-label="Your location">{NIGERIAN_LOCATIONS.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>

        <div className="consumer-header__actions">
          <Link className="header-icon-link" to={auth.isAuthenticated ? '/app/saved' : `/auth?returnTo=${encodeURIComponent('/app/saved')}`} aria-label="Preferred products"><Heart size={21} /></Link>
          <Link className="header-icon-link" to={auth.isAuthenticated ? '/app/messages' : `/auth?returnTo=${encodeURIComponent('/app/messages')}`} aria-label="Messages"><MessageCircle size={21} /></Link>
          <Link className="app-button app-button--primary header-sell" to={auth.isAuthenticated ? '/app/sell' : `/auth?returnTo=${encodeURIComponent('/app/sell')}`}><PlusCircle size={17} /> Sell an item</Link>
          {auth.isAuthenticated ? <Link to="/app/profile" className="header-account"><span>{userName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2) || 'ZD'}</span><small>{userName || 'My profile'}</small></Link> : <Link className="app-button app-button--outline" to={`/auth?returnTo=${encodeURIComponent(location.pathname)}`}>Sign in</Link>}
        </div>
      </div>
    </header>

    <div className="consumer-layout">
      <aside className={`consumer-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="consumer-sidebar__mobile-head"><img src="/goodzidash-logo.png" alt="Zidash" /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close app menu"><X size={22} /></button></div>
        <nav aria-label="Zidash app navigation">
          {nav.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={(event) => protectedNavigation(event, item)} className={({ isActive }) => isActive ? 'is-active' : ''}><item.icon size={20} /><span>{item.label}</span></NavLink>)}
        </nav>
        <div className="consumer-sidebar__extra">
          <Link to="/app/categories"><Store size={19} /> All categories</Link>
          <Link to="/app/creators"><UsersRound size={19} /> UGC creators</Link>
          <Link to={auth.isAuthenticated ? '/app/my-listings' : `/auth?returnTo=${encodeURIComponent('/app/my-listings')}`}><Megaphone size={19} /> Promote an item</Link>
          <button type="button" onClick={contactSupport}><LifeBuoy size={19} /> Contact support</button>
        </div>
        <div className="consumer-sidebar__download">
          <strong>Download app</strong>
          <div className="store-buttons small consumer-sidebar__download-badges">
            <a href="#download" aria-label="Download on the App Store"><img src="/downloadapple.png" alt="Download on the App Store" className="store-badge" /></a>
            <a href="#download" aria-label="Get it on Google Play"><img src="/downloadplaystore.png" alt="Get it on Google Play" className="store-badge" /></a>
          </div>
        </div>
      </aside>
      {menuOpen && <button className="consumer-sidebar-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
      <main className="consumer-main"><Suspense fallback={<ConsumerRouteLoader home={location.pathname === '/app'} />}><Outlet context={{ appLocation }} /></Suspense></main>
    </div>
    <Footer />

    <nav className="consumer-bottom-nav" aria-label="Mobile app navigation">{nav.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={(event) => protectedNavigation(event, item)} className={({ isActive }) => isActive ? 'is-active' : ''}><item.icon size={21} /><span>{item.label}</span></NavLink>)}</nav>
    <button className="support-fab" type="button" onClick={contactSupport} aria-label="Contact Zidash support"><Headset size={24} strokeWidth={2} /><span>Support</span></button>
  </div>
}
