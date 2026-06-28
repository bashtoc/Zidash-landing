const categories = [
  ['phone', 'Phones & Tablets'],
  ['monitor', 'Electronics'],
  ['home', 'Home & Garden'],
  ['shirt', 'Fashion'],
  ['car', 'Vehicles'],
  ['house', 'Property'],
  ['briefcase', 'Jobs'],
  ['dots', 'More'],
];

const stats = [
  ['users', '100K+', 'Active Users'],
  ['bag', '50K+', 'Active Listings'],
  ['briefcase', '10K+', 'Jobs Posted'],
  ['shield', '100%', 'Secure & Trusted'],
];

const highlights = [
  ['trophy', 'Trusted', 'Verified users and secure'],
  ['pin', 'Local', 'Find people and opportunities near you'],
  ['briefcase', 'All in One', 'Marketplace, Jobs, Services, UGC & more'],
];

const benefits = [
  ['phone', 'Easy to Use', 'Simple and clean interface for everyone.'],
  ['lock', 'Secure Payments', 'Your safety is our priority.'],
  ['shield', 'Verified Users', 'ID verification for a safer community.'],
  ['headset', '24/7 Support', "We're here to help you anytime."],
  ['community', 'Community Driven', 'Real people, real connections.'],
];

const phoneCategories = [
  ['phone', 'Phones & Tablets'],
  ['monitor', 'Electronics'],
  ['shirt', 'Home & Garden'],
  ['bag', 'Fashion'],
  ['car', 'Vehicles'],
  ['home', 'Property'],
  ['briefcase', 'Jobs'],
  ['community', 'Services'],
  ['home', 'Agriculture'],
  ['dots', 'Sports'],
  ['shield', 'Kids & Babies'],
  ['dots', 'More'],
];

function Icon({ name }) {
  const common = {
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };

  const icons = {
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.8" /><path d="M16 3.2a4 4 0 0 1 0 7.6" /></>,
    community: <><circle cx="8" cy="7" r="3" /><circle cx="16" cy="7" r="3" /><circle cx="12" cy="16" r="3" /><path d="M10 9.5 9 13" /><path d="m14 9.5 1 3.5" /></>,
    trophy: <><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M5 5H3v2a4 4 0 0 0 4 4" /><path d="M19 5h2v2a4 4 0 0 1-4 4" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /><path d="M12 12v2" /></>,
    bag: <><path d="M6 8h12l-1 13H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
    monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8" /><path d="M12 16v4" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    house: <><path d="M4 10.5 12 4l8 6.5" /><path d="M6 9.5V20h12V9.5" /><path d="M9 20v-5h6v5" /></>,
    shirt: <><path d="M20 7 16 4h-3a2 2 0 0 1-2 0H8L4 7l3 4 1-1v10h8V10l1 1 3-4Z" /></>,
    car: <><path d="M5 17h14" /><path d="M6 17v2" /><path d="M18 17v2" /><path d="M4 13l2-5h12l2 5" /><circle cx="7" cy="13" r="1" /><circle cx="17" cy="13" r="1" /></>,
    dots: <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    headset: <><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2Z" /><path d="M20 13v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z" /><path d="M15 20h-3" /></>,
    play: <path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };

  return <svg {...common}>{icons[name]}</svg>;
}

export default function Home() {
  return (
    <main className="home-page">
      <section className="zidash-hero" id="home">
        <div className="zidash-hero__copy">
          <p className="market-pill"><Icon name="community" /> Community-first marketplace</p>
          <h1>
            Buy, Sell, Hire, and <br className="mobile-title-break" /><span className="text-green">Grow</span> Your <span className="text-orange">Business</span>
          </h1>
          <p className="zidash-hero__lead">
            Zidash connects you with real people for trusted trade, local jobs, services, UGC creators, and more.
          </p>
          <div className="zidash-hero__actions">
            <a className="z-btn z-btn--green" href="#download"><Icon name="users" /> Download the App</a>
            <a className="z-btn z-btn--outline" href="#how-it-works"><Icon name="play" /> Watch How It Works</a>
          </div>
          <div className="hero-highlights" id="how-it-works">
            {highlights.map(([icon, title, copy]) => (
              <article key={title}>
                <span><Icon name={icon} /></span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="zidash-hero__visual" aria-label="Zidash app preview">
          <div className="soft-shape soft-shape--mint" />
          <div className="soft-shape soft-shape--orange" />
          <div className="dot-field" />
          <span className="burst burst--left" />
          <span className="burst burst--right" />
          <img className="phone-mock phone-mock--front" src="/zidashphone.png" alt="Zidash marketplace app home screen" />
          <div className="phone-mock phone-mock--categories" aria-hidden="true">
            <div className="phone-shell">
              <div className="phone-notch" />
              <div className="phone-status">8:41</div>
              <div className="mini-screen-title">
                <strong>Explore Categories</strong>
                <span>View all</span>
              </div>
              <div className="phone-category-grid">
                {phoneCategories.map(([icon, label]) => (
                  <div key={label} className="phone-category">
                    <Icon name={icon} />
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Zidash marketplace statistics">
        {stats.map(([icon, value, label]) => (
          <article key={label}>
            <span><Icon name={icon} /></span>
            <div>
              <strong>{value}</strong>
              <p>{label}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="category-download-row" id="marketplace">
        <div className="top-categories">
          <div className="section-mini-heading">
            <h2>Shop from <span>Top Categories</span></h2>
            <a href="#community">Explore all categories <Icon name="arrow" /></a>
          </div>
          <div className="category-grid">
            {categories.map(([icon, label]) => (
              <a className="category-card" href={`#${label.toLowerCase().replaceAll(' ', '-')}`} key={label}>
                <span><Icon name={icon} /></span>
                <strong>{label}</strong>
              </a>
            ))}
          </div>
        </div>

        <aside className="download-card" id="download">
          <div>
            <h2>Everything You Need, All in <span>One Place</span></h2>
            <p>Buy, sell, chat, and manage everything on the go.</p>
            <div className="store-buttons">
              <a href="#" aria-label="Get it on Google Play"><img src="/downloadplaystore.png" alt="Get it on Google Play" /></a>
              <a href="#" aria-label="Download on the App Store"><img src="/downloadapple.png" alt="Download on the App Store" /></a>
            </div>
          </div>
          <div className="qr-wrap">
            <img src="/assets/scan-download.png" alt="Scan to download the Zidash app" />
          </div>
        </aside>
      </section>

      <section className="benefit-strip" id="services">
        {benefits.map(([icon, title, copy]) => (
          <article key={title}>
            <span><Icon name={icon} /></span>
            <div>
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="sr-anchor-row" aria-label="Page sections">
        <span id="jobs" />
        <span id="creators" />
        <span id="community" />
      </section>
    </main>
  );
}
