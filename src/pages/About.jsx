import { ArrowRight, BriefcaseBusiness, HeartHandshake, ShieldCheck, Sparkles, Store, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    icon: Store,
    title: 'Trade with confidence',
    copy: 'Discover products and services from people and businesses around you, with the tools to make better decisions.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Find your next opportunity',
    copy: 'Explore jobs, talent, and collaborations that help people turn everyday skills into meaningful progress.',
  },
  {
    icon: UsersRound,
    title: 'Build real connections',
    copy: 'Connect through communities, conversations, and creator profiles designed for useful, human interaction.',
  },
];

const values = [
  ['01', 'Trust by design', 'Clear profiles, safer interactions, and thoughtful product decisions keep trust at the centre.'],
  ['02', 'Local first', 'The best opportunities often start nearby, so Zidash helps people discover what is close and relevant.'],
  ['03', 'Progress together', 'We make it easier for buyers, sellers, businesses, job seekers, and creators to grow side by side.'],
];

export default function About() {
  return (
    <main className="about-modern">
      <section className="about-modern-hero">
        <div className="about-modern-hero__content">
          <p className="about-modern-eyebrow"><Sparkles size={15} /> About Zidash</p>
          <h1>Where local life finds <span>new momentum.</span></h1>
          <p className="about-modern-hero__lead">Zidash brings buying, selling, hiring, discovering, and connecting into one trusted space built for everyday opportunity.</p>
          <div className="about-modern-actions">
            <Link className="about-modern-button about-modern-button--primary" to="/app">Explore Zidash <ArrowRight size={17} /></Link>
            <a className="about-modern-button about-modern-button--quiet" href="#about-platform">See how it works</a>
          </div>
          <div className="about-modern-proof" aria-label="What Zidash brings together">
            <span><strong>Buy</strong> locally</span>
            <span><strong>Grow</strong> boldly</span>
            <span><strong>Connect</strong> meaningfully</span>
          </div>
        </div>

        <div className="about-modern-hero__visual" aria-label="The Zidash ecosystem">
          <p className="about-modern-visual-label">One connected ecosystem</p>
          <div className="about-modern-orbit">
            <span className="about-modern-orbit__line about-modern-orbit__line--one" />
            <span className="about-modern-orbit__line about-modern-orbit__line--two" />
            <div className="about-modern-orbit__core"><span>z</span><strong>Zidash</strong><small>local opportunity, connected</small></div>
            <span className="about-modern-orbit__node about-modern-orbit__node--buy">Buy</span>
            <span className="about-modern-orbit__node about-modern-orbit__node--jobs">Jobs</span>
            <span className="about-modern-orbit__node about-modern-orbit__node--creators">Creators</span>
            <span className="about-modern-orbit__node about-modern-orbit__node--community">Community</span>
          </div>
          <p className="about-modern-visual-note">A marketplace for products, services, jobs, businesses, creators, and the people behind them.</p>
        </div>
      </section>

      <section className="about-modern-intro" id="about-platform">
        <div>
          <p className="about-modern-kicker">Built around real life</p>
          <h2>More than a marketplace. A place to move forward.</h2>
        </div>
        <div className="about-modern-intro__copy">
          <p>Zidash was created for the way people actually live and work. One person may be looking for a great deal in the morning, a job in the afternoon, and a creator or customer by evening.</p>
          <p>Instead of sending people across disconnected platforms, Zidash gives every side of that journey a more natural home—simple to explore, easier to trust, and made to grow with you.</p>
        </div>
      </section>

      <section className="about-modern-pillars">
        <div className="about-modern-section-heading">
          <div>
            <p className="about-modern-kicker">The Zidash difference</p>
            <h2>Designed for useful connections.</h2>
          </div>
          <p>Every part of Zidash is shaped around helping people discover value and take the next step with confidence.</p>
        </div>
        <div className="about-modern-pillar-grid">
          {pillars.map(({ icon: Icon, title, copy }) => (
            <article className="about-modern-pillar" key={title}>
              <span className="about-modern-pillar__icon"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="about-modern-pillar__arrow"><ArrowRight size={18} /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="about-modern-values">
        <div className="about-modern-values__intro">
          <p className="about-modern-kicker">What guides us</p>
          <h2>Good platforms are built on good principles.</h2>
          <p>We are building Zidash to feel useful, welcoming, and dependable at every touchpoint.</p>
          <div className="about-modern-values__badge"><HeartHandshake size={18} /> People first, always</div>
        </div>
        <div className="about-modern-values__list">
          {values.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-modern-cta">
        <div className="about-modern-cta__icon"><ShieldCheck size={25} /></div>
        <div><p className="about-modern-kicker">Ready when you are</p><h2>Find your next opportunity on Zidash.</h2><p>Start exploring products, jobs, creators, and communities built around where you are going.</p></div>
        <Link className="about-modern-button about-modern-button--light" to="/app">Open the web app <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
