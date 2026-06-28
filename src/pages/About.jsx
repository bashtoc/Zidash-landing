export default function About() {
  return (
    <main>
      <section className="contact-hero">
        <div>
          <p className="eyebrow">About Zidash</p>
          <h1>Empowering Local Communities.</h1>
          <p>Zidash is built to make local digital commerce easier, safer, and more connected. Whether you are selling products, looking for trusted sellers, hiring talent, finding work, or growing as a creator, Zidash gives you one place to move forward.</p>
          <div className="about-points" style={{ marginTop: '24px' }}>
            <span>Community commerce</span>
            <span>Trust and verification</span>
            <span>Local discovery</span>
            <span>Sellers, buyers, employers, job seekers, and creators</span>
          </div>
        </div>
        <div className="contact-form" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Our Parent Company</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Zidash is proudly a product of <strong>Boomger Limited</strong>. We are dedicated to building innovative platforms that bridge gaps in local economies and foster meaningful connections between individuals and businesses.
          </p>
        </div>
      </section>
    </main>
  );
}
