import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="hero section-band">
        <div className="hero-content">
          <p className="eyebrow">Community-first marketplace app</p>
          <h1>Buy, Sell, Hire, and Grow Within Your Community</h1>
          <p className="hero-copy">Zidash brings marketplace listings, local jobs, UGC creators, and trusted community connections into one simple app.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-large" href="#download">Download Zidash</a>
            <a className="btn btn-ghost btn-large" href="#features">Explore Features</a>
          </div>
          <div className="trust-row" aria-label="Zidash highlights">
            <span>Verified profiles</span>
            <span>Local discovery</span>
            <span>Direct messaging</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Zidash mobile app preview">
          <img src="/zidashphone.png" alt="Zidash mobile app preview" className="phone phone-main" />
          <div className="floating-card floating-left">
            <span className="icon-bubble">ID</span>
            <strong>Identity verified</strong>
            <small>Selfie + ID checks</small>
          </div>
          <div className="floating-card floating-right">
            <span className="icon-bubble">UGC</span>
            <strong>Creators nearby</strong>
            <small>Packages, niches, portfolios</small>
          </div>
        </div>
      </section>

      <section className="section section-intro" id="features">
        <div className="section-heading reveal-on-scroll">
          <p className="eyebrow">One app, many local opportunities</p>
          <h2>Everything your community needs to trade, hire, and grow.</h2>
        </div>
        <div className="feature-grid">
          <article className="feature-card reveal-on-scroll" id="marketplace">
            <span className="feature-icon">M</span>
            <h3>Marketplace</h3>
            <p>List products, compare sellers, and message directly before you buy.</p>
            <ul>
              <li>Upload items for sale with multiple product images.</li>
              <li>Add category, subcategory, price, condition, tags, and negotiable status.</li>
              <li>View seller profiles, similar listings, and message sellers directly.</li>
            </ul>
          </article>
          <article className="feature-card reveal-on-scroll" id="jobs">
            <span className="feature-icon">J</span>
            <h3>Jobs</h3>
            <p>Find local roles or post openings for people already in your area.</p>
            <ul>
              <li>Browse open jobs with search and filters.</li>
              <li>Post jobs as an employer.</li>
              <li>View job details, requirements, and salary range.</li>
            </ul>
          </article>
          <article className="feature-card reveal-on-scroll" id="creators">
            <span className="feature-icon">C</span>
            <h3>UGC Creators</h3>
            <p>Help brands discover creators with real local context and clear packages.</p>
            <ul>
              <li>Become a UGC creator and add niches, bio, audience size, and engagement rate.</li>
              <li>Show pricing packages and portfolio work.</li>
              <li>Let brands discover UGC influencers for campaigns.</li>
            </ul>
          </article>
          <article className="feature-card reveal-on-scroll" id="community">
            <span className="feature-icon">Q</span>
            <h3>Community</h3>
            <p>Post, filter, like, and message inside a chat-style local feed.</p>
            <ul>
              <li>Share community posts and items for sale.</li>
              <li>Filter posts by location.</li>
              <li>Like posts and message posters safely.</li>
            </ul>
          </article>
          <article className="feature-card trust-card">
            <span className="feature-icon">V</span>
            <h3>Trust &amp; Verification</h3>
            <p>Build confidence with verification signals and seller trust profiles.</p>
            <ul>
              <li>Email, phone, and name verification.</li>
              <li>Identity verification with selfie and ID.</li>
              <li>Seller trust score and verified seller profile.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section soft-section">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Start with trust, then move quickly.</h2>
        </div>
        <div className="steps">
          <article className="reveal-on-scroll">
            <span>01</span>
            <h3>Create your Zidash account</h3>
            <p>Sign up and set up a profile people can recognize.</p>
          </article>
          <article className="reveal-on-scroll">
            <span>02</span>
            <h3>Verify your profile</h3>
            <p>Add email, phone, name, and identity checks for stronger trust signals.</p>
          </article>
          <article className="reveal-on-scroll">
            <span>03</span>
            <h3>Buy, sell, hire, or create</h3>
            <p>List items, post jobs, apply for roles, or publish creator packages.</p>
          </article>
          <article className="reveal-on-scroll">
            <span>04</span>
            <h3>Connect safely nearby</h3>
            <p>Message people, review profiles, and build commerce inside your community.</p>
          </article>
        </div>
      </section>

      <section className="section app-preview">
        <div className="section-heading">
          <p className="eyebrow">App screens preview</p>
          <h2>Designed around real marketplace workflows.</h2>
        </div>
        <div className="screen-strip" aria-label="Zidash app screen mockups">
          <article className="screen-card welcome-screen">
            <div className="screen-header"></div>
            <h3>Welcome</h3>
            <p>Trade, work, and grow locally.</p>
            <span className="screen-button">Get started</span>
          </article>
          <article className="screen-card">
            <div className="screen-title">Home</div>
            <div className="mock-listing"></div>
            <div className="mock-listing small"></div>
            <div className="mock-listing"></div>
            <small>Marketplace listings</small>
          </article>
          <article className="screen-card">
            <div className="screen-title">Sell item</div>
            <div className="upload-grid"><span></span><span></span><span></span></div>
            <div className="field-line"></div>
            <div className="field-line short"></div>
            <small>Photos, price, condition</small>
          </article>
          <article className="screen-card">
            <div className="screen-title">Product</div>
            <div className="product-hero"></div>
            <h3>Camera kit</h3>
            <p>$340 - Negotiable</p>
            <small>Seller profile + similar listings</small>
          </article>
          <article className="screen-card">
            <div className="screen-title">Verify</div>
            <div className="check-row active">Email verified</div>
            <div className="check-row active">Phone verified</div>
            <div className="check-row">Selfie + ID</div>
            <small>Trust score builder</small>
          </article>
          <article className="screen-card">
            <div className="screen-title">Jobs</div>
            <div className="job-chip">Retail Associate</div>
            <div className="job-chip">Content Editor</div>
            <div className="job-chip">Delivery Partner</div>
            <small>Search and salary filters</small>
          </article>
          <article className="screen-card">
            <div className="screen-title">UGC</div>
            <div className="creator-row"><span></span><strong>Beauty</strong></div>
            <div className="creator-row"><span></span><strong>Tech</strong></div>
            <div className="creator-row"><span></span><strong>Food</strong></div>
            <small>Influencer discovery</small>
          </article>
          <article className="screen-card">
            <div className="screen-title">Community</div>
            <div className="message-bubble">Is this still available?</div>
            <div className="message-bubble alt">Yes, pickup today.</div>
            <small>Feed, likes, messages</small>
          </article>
        </div>
      </section>


      <section className="section soft-section faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Questions people ask before joining Zidash.</h2>
        </div>
        <div className="faq-list">
          <details>
            <summary>What is Zidash?</summary>
            <p>Zidash is a community marketplace app for buying, selling, hiring, job discovery, UGC creator discovery, and local community commerce.</p>
          </details>
          <details>
            <summary>Can I sell items on Zidash?</summary>
            <p>Yes. You can upload items, add images, set a price and condition, and message interested buyers.</p>
          </details>
          <details>
            <summary>Can I post jobs?</summary>
            <p>Yes. Employers can publish local job openings with details, filters, and salary ranges.</p>
          </details>
          <details>
            <summary>Can I become a UGC creator?</summary>
            <p>Yes. Creators can add niches, pricing packages, audience details, engagement rates, and portfolio examples.</p>
          </details>
          <details className="reveal-on-scroll">
            <summary>How does verification work?</summary>
            <p>Zidash can support email, phone, name, and identity verification with selfie and ID checks.</p>
          </details>
          <details className="reveal-on-scroll">
            <summary>Can I message sellers or posters?</summary>
            <p>Yes. Direct messaging helps users ask questions and coordinate next steps before transacting.</p>
          </details>
          <details className="reveal-on-scroll">
            <summary>Is Zidash location-based?</summary>
            <p>Yes. Location filters help people discover nearby listings, jobs, creators, and community posts.</p>
          </details>
          <details className="reveal-on-scroll">
            <summary>How do I delete my account?</summary>
            <p>Users should be able to request account deletion through app settings or by contacting support@zidash.com.</p>
          </details>
        </div>
      </section>

      <section className="download-section reveal-on-scroll" id="download">
        <div>
          <p className="eyebrow">Download Zidash</p>
          <h2>Bring your local marketplace, jobs, creators, and community into one app.</h2>
        </div>
        <div className="store-buttons" aria-label="App download links">
          <a href="#" aria-label="Download on the App Store"><img src="/downloadapple.png" alt="Download on the App Store" className="store-badge" /></a>
          <a href="#" aria-label="Get it on Google Play"><img src="/downloadplaystore.png" alt="Get it on Google Play" className="store-badge" /></a>
        </div>
      </section>
    </main>
  );
}
