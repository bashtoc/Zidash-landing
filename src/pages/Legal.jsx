import { ArrowRight, BriefcaseBusiness, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const collections = [
  {
    icon: LockKeyhole,
    title: 'Account & privacy',
    copy: 'How Zidash accounts, personal information, and website technologies are governed.',
    links: [
      ['Terms of Use', '/terms'],
      ['Privacy Policy', '/privacy'],
      ['Cookie Policy', '/cookie'],
    ],
  },
  {
    icon: BriefcaseBusiness,
    title: 'Marketplace policies',
    copy: 'Standards for listings, promotions, businesses, services, jobs, and creator activity.',
    links: [
      ['Prohibited Items Policy', '/prohibited'],
      ['Advertising & Boost Policy', '/ads-policy'],
      ['Refund Policy', '/refund-policy'],
      ['Business Account Policy', '/business-policy'],
      ['Service Provider Policy', '/service-policy'],
      ['Job Posting Policy', '/job-policy'],
      ['UGC Creator Policy', '/ugc-policy'],
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Community & safety',
    copy: 'Practical guidance and platform standards created to support safer interactions.',
    links: [
      ['Community Guidelines', '/guidelines'],
      ['Content Moderation Policy', '/moderation-policy'],
      ['Safety Center', '/safety'],
      ['Buyer Safety Guide', '/buyer-safety'],
      ['Seller Safety Guide', '/seller-safety'],
      ['Scam Prevention Guide', '/scam-prevention'],
      ['Verification Policy', '/verification-policy'],
    ],
  },
  {
    icon: Scale,
    title: 'Rights & support',
    copy: 'Information about intellectual property, reporting, and getting help from Zidash.',
    links: [
      ['Intellectual Property Policy', '/ip-policy'],
      ['Contact & Support Policy', '/contact-policy'],
      ['Help Center / FAQ', '/faq'],
      ['Contact Support', '/contact'],
    ],
  },
];

export default function Legal() {
  return (
    <main className="legal-page legal-page--index">
      <section className="legal-hero">
        <p className="eyebrow">Zidash policies</p>
        <h1 className="legal-hero-title">Legal Center</h1>
        <p>Everything you need to understand the rules, rights, responsibilities, and safeguards that shape Zidash.</p>
        <div className="legal-hero__meta"><Scale size={17} /> Clear policies. Safer participation.</div>
      </section>

      <section className="legal-content legal-index-grid" aria-label="Zidash policy collections">
        {collections.map(({ icon: Icon, title, copy, links }) => (
          <article className="legal-index-card" key={title}>
            <div className="legal-index-card__heading"><span><Icon size={21} /></span><div><h2>{title}</h2><p>{copy}</p></div></div>
            <div className="legal-index-card__links">
              {links.map(([label, to]) => <Link key={to} to={to}>{label}<ArrowRight size={15} /></Link>)}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
