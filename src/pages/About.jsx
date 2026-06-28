export default function About() {
  return (
    <main>
      <section className="contact-hero">
        <div>
          <p className="eyebrow">About Zidash</p>
          <h1 className="about-hero-title">Empowering Local Communities.</h1>
          <p>Zidash is built to make local digital commerce easier, safer, and more connected. Whether you are selling products, looking for trusted sellers, hiring talent, finding work, or growing as a creator, Zidash gives you one place to move forward.</p>
          <div className="about-points" style={{ marginTop: '24px' }}>
            <span>Community commerce</span>
            <span>Trust and verification</span>
            <span>Local discovery</span>
            <span>Sellers, buyers, employers, job seekers, and creators</span>
          </div>
        </div>
        <div className="contact-form about-company-card">
          <h2>Our Parent Company</h2>
          <p>
            Zidash is proudly a product of <strong>Boomger Limited</strong>. We are dedicated to building innovative platforms that bridge gaps in local economies and foster meaningful connections between individuals and businesses.
          </p>
        </div>
      </section>
    </main>
  );
}
