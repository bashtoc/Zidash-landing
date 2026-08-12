import { ArrowRight, Globe2, Laptop2, Rocket, Sparkles, UsersRound } from 'lucide-react';

const perks = [
  [UsersRound, 'Meaningful impact', 'Build products that make everyday commerce and opportunity easier for real people.'],
  [Rocket, 'Room to grow', 'Join an ambitious team where ownership, curiosity, and thoughtful execution are rewarded.'],
  [Laptop2, 'Flexible by design', 'Do focused work with a remote-friendly mindset and a culture built around outcomes.'],
  [Globe2, 'Built for Africa', 'Help shape a platform designed around local realities with the potential to scale further.'],
];

const roles = [
  'Software Engineering', 'Mobile App Development', 'UI/UX Design', 'Product Management',
  'Customer Support', 'Marketing & Growth', 'Sales & Partnerships', 'Business Development',
  'Community Management', 'Content & Social Media', 'UGC Creator Partnerships', 'Data Analytics',
  'Quality Assurance', 'Cybersecurity',
];

export default function Careers() {
  return (
    <main className="careers-modern">
      <section className="careers-modern__hero">
        <div>
          <p className="careers-modern__eyebrow"><Sparkles size={15} /> Careers at Zidash</p>
          <h1>Build useful things for a growing community.</h1>
          <p>Help us create a trusted place where people can trade, find work, hire talent, and discover opportunity across Nigeria.</p>
          <a className="careers-modern__button" href="mailto:careers@zidash.com">Join our talent pool <ArrowRight size={17} /></a>
        </div>
        <aside className="careers-modern__hero-card">
          <span>Currently building</span>
          <strong>A simpler, safer way to move local opportunity forward.</strong>
          <div><span>Product</span><span>Engineering</span><span>Growth</span><span>Community</span></div>
        </aside>
      </section>

      <section className="careers-modern__section">
        <div className="careers-modern__heading"><p>Why Zidash</p><h2>Do work that stays close to people.</h2></div>
        <div className="careers-modern__perk-grid">
          {perks.map(([Icon, title, copy]) => <article key={title}><span><Icon size={21} /></span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="careers-modern__roles">
        <div className="careers-modern__roles-copy">
          <p className="careers-modern__eyebrow">Future opportunities</p>
          <h2>There are no active openings right now.</h2>
          <p>We still enjoy meeting thoughtful people. If your experience fits one of these areas, send us your CV, portfolio, or LinkedIn profile for future consideration.</p>
          <a href="mailto:careers@zidash.com">careers@zidash.com <ArrowRight size={16} /></a>
        </div>
        <div className="careers-modern__role-grid">{roles.map((role) => <span key={role}>{role}</span>)}</div>
      </section>
    </main>
  );
}
