# Zidash Consumer Web App Replication Specification

## Purpose

Use this document as the source-of-truth prompt for an AI engineer tasked with reproducing the existing Zidash Flutter mobile application as a clean, responsive consumer web application inside the existing `Zidash-landing` React/Vite project.

The web application must use the same Node.js/Express backend and database as the mobile app. It must not be a static design mockup. Public browsing should work without authentication, protected actions should use the existing consumer authentication flow, and all API-driven screens must handle loading, empty, error, unauthorized, and paginated states.

The existing landing page and every marketing, legal, policy, safety, contact, FAQ, and careers route must remain available and visually intact. Add the consumer application as a distinct `/app` route tree and add clear links from the marketing header and homepage into the web app.

## Existing technical system

### Consumer mobile app

- Flutter and Dart.
- Material 3.
- Main navigation: Home, Jobs, Communities, Messages, Profile.
- Primary brand green: `#66C665`.
- Darker action green: `#429417`.
- Primary text/ink: `#172317` or near-black.
- Muted text: `#7E867E`.
- Soft background: `#F6F7F6` / `#F6FBF6`.
- Destructive red: `#DC2626`.
- Nigerian location catalogue includes all 36 states and Abuja FCT.
- User feedback is presented through centered custom popups rather than snackbars.

### Backend

- Node.js, Express, Sequelize, MySQL.
- Redis and BullMQ.
- JWT access and refresh tokens.
- Socket.IO for chat events.
- Cloudflare-backed email and asset/storage services.
- API base path is `/api/v1`.
- Responses generally use `{ "data": ... }` and collection metadata uses `{ "meta": { "page", "limit", "total", "pages" } }`.
- Public resources use optional authentication where useful.
- UUID identifiers, timestamps, and soft deletion are standard.

### Existing website

- React 19, React Router 7, Vite 8, JavaScript.
- The original landing homepage is retired; `/landing` redirects to `/app`.
- Visiting `/` redirects directly to the consumer web app at `/app`.
- Existing pages include About, Contact, Careers, FAQ, Safety, Legal, Privacy, Terms, Cookies, Community Guidelines, Intellectual Property, Prohibited Items, Jobs policy, UGC policy, Moderation policy, Ads policy, Verification policy, Buyer/Seller safety, Scam Prevention, Business/Service policies, Contact policy, and Refund policy.
- Preserve the current package manager, Vite architecture, routes, assets, header, footer, metadata, and lockfile.

## Non-negotiable product rules

1. Do not remove or replace existing policy routes; keep the retired `/landing` URL redirected to `/app`.
2. Visiting `/` launches the consumer app at `/app`.
3. The consumer app uses its own responsive app shell. It must not render the marketing footer inside authenticated/product screens.
4. Public visitors can browse marketplace listings, product details, seller profiles, jobs, creators, and community posts.
5. Saving, liking, reporting, posting, messaging, applying, following, profile management, wallet/payment, and verification require authentication.
6. Protected actions must preserve the visitor's intended destination and return them there after sign-in.
7. Use the API as the source of truth. Do not silently display demo listings, fake jobs, fake creators, fake wallet balances, or invented analytics when the backend returns no data.
8. Use server pagination for marketplace collections. Do not fetch the entire database to filter it in the browser.
9. Use the mobile app's terminology: “Preferred products,” “Recently Posted,” “Trending,” “Jobs & Talent,” “Communities,” “UGC creators,” and “Zidash Wallet.”
10. Use Kanit for product headings, key numerals, high-emphasis buttons, category labels, and promotional display copy. Use a highly readable sans-serif such as Outfit for paragraphs, forms, tables, and long content.

## Web information architecture

### Public information routes to retain

- `/about`
- `/contact`
- `/careers`
- `/faq`
- `/safety`
- `/legal`
- `/privacy`
- `/terms`
- `/cookie`
- `/guidelines`
- `/ip-policy`
- `/prohibited`
- `/job-policy`
- `/ugc-policy`
- `/moderation-policy`
- `/ads-policy`
- `/verification-policy`
- `/buyer-safety`
- `/seller-safety`
- `/scam-prevention`
- `/business-policy`
- `/service-policy`
- `/contact-policy`
- `/refund-policy`

### Consumer application routes

- `/app` — marketplace home.
- `/app/categories` — all marketplace categories and subcategories.
- `/app/category/:categoryId` — category listing results.
- `/app/search` — marketplace search with filters and URL state.
- `/app/listing/:listingId` — product/listing detail.
- `/app/seller/:sellerId` — seller storefront/profile.
- `/app/saved` — preferred products; authenticated.
- `/app/sell` — create listing; authenticated.
- `/app/my-listings` — manage listings; authenticated.
- `/app/my-listings/:listingId/edit` — edit listing; authenticated.
- `/app/my-listings/:listingId/boost` — promotion review/payment; authenticated.
- `/app/jobs` — jobs and talent hub.
- `/app/jobs/find` — searchable jobs.
- `/app/jobs/:jobId` — job detail/application.
- `/app/jobs/post` — create job; authenticated.
- `/app/jobs/mine` — manage job posts; authenticated.
- `/app/creators` — discover UGC creators.
- `/app/creators/become` — create creator profile; authenticated.
- `/app/creators/:creatorId` — creator profile/portfolio.
- `/app/community` — community feed with location selection.
- `/app/community/mine` — manage own posts; authenticated.
- `/app/messages` — conversation list; authenticated.
- `/app/messages/:conversationId` — conversation; authenticated.
- `/app/profile` — account and seller profile; authenticated.
- `/app/profile/edit` — edit profile and location; authenticated.
- `/app/profile/verification` — phone/identity verification; authenticated.
- `/app/wallet` — balance, promotion-payment context, and available transactions; authenticated.
- `/auth` — email authentication entry.
- `/auth/verify` — six-digit email OTP verification.

Routes may be nested differently if the existing router requires it, but all destinations and capabilities must remain addressable by URL and browser back/forward navigation.

## Responsive application shell

### Desktop, 1024px and wider

- Sticky top header with Zidash logo, global search, location selector, “Sell an item” button, preferred products, messages, and profile/avatar.
- Left navigation rail or compact secondary navigation for Marketplace, Jobs, Community, Creators, and account tools.
- Main content centered with a maximum width between 1280px and 1440px.
- Marketplace grids use four columns on wide desktop and three on smaller desktop.
- Filters appear in a left panel or dismissible drawer; never cover the full screen without a close control.

### Tablet, 768px–1023px

- Compact header and horizontally scrollable primary navigation.
- Two- or three-column cards depending on width.
- Filters use a modal drawer with visible close and apply controls.

### Mobile, below 768px

- Header includes logo, location, search, and concise actions.
- Sticky bottom navigation mirrors the Flutter app: Home, Jobs, Communities, Messages, Profile.
- Two-column product cards when space permits, falling to one column on very narrow screens.
- Sheets/dialogs must respect safe areas, fit the viewport, and scroll internally.
- Touch targets are at least 44px.

The app shell should not replace the marketing site's header/footer on existing pages. The `/app` route tree should use its own layout.

## Design system

### Colors

- `--z-green: #66C665`
- `--z-green-dark: #429417`
- `--z-green-soft: #F1F8ED`
- `--z-ink: #172317`
- `--z-muted: #7E867E`
- `--z-page: #F7FAF7`
- `--z-surface: #FFFFFF`
- `--z-border: #E5EBE5`
- `--z-danger: #DC2626`
- `--z-warning: #F59E0B`

### Typography

- Import Kanit weights 400, 500, 600, 700, and 800.
- Product headlines and display text use Kanit.
- Body copy and form content use Outfit or the existing readable landing font.
- Avoid oversized headings in dense app pages; desktop page titles should normally be 28–36px and mobile titles 22–28px.

### Components

- Rounded cards: 16–24px radius.
- Soft borders and restrained shadows.
- Pills for status, condition, filters, and locations.
- Lucide icons or another consistent existing icon package; do not use mixed icon styles.
- Custom branded feedback modal with success, info, warning, and error variants.
- Skeleton loaders for initial cards and lists.
- Inline retry state for failed sections.
- Destructive confirmations identify the exact item and explain the effect.
- Empty states contain a relevant action when possible.

## Authentication and session flow

Replicate the mobile email OTP journey:

1. Ask for email.
2. Offer automatic mode or explicit login/signup mode.
3. For signup, collect first and last name.
4. Call `POST /auth/request-otp`.
5. Show six individual code inputs that support full clipboard paste, keyboard navigation, and browser autofill using `autocomplete="one-time-code"`.
6. Call `POST /auth/verify-otp`.
7. Save the returned `accessToken` and `refreshToken` according to the chosen web-session policy.
8. Call `GET /app/bootstrap` to hydrate the account, seller profile, creator profile, verification, wallet balance, and listing count.
9. Redirect to the preserved intended route.

Also support the backend's password register/login endpoints if product wants a secondary web-specific path, but do not present unfinished Google or Apple buttons without complete provider integration.

Implement one refresh attempt through `POST /auth/refresh` after an access-token 401, then retry the original request once. On refresh failure, clear the session and redirect protected actions to auth. Call `POST /auth/logout` and clear local session state on logout.

Do not expose admin authentication or admin navigation in the consumer application.

## Marketplace home

The `/app` page should adapt the Flutter home screen to desktop rather than stretching a phone UI.

Required sections in order:

1. Location and welcome context.
2. Large search bar: “Search for items, categories, or sellers.”
3. Filter control and visible active-filter chips.
4. Marketplace categories loaded from backend taxonomy.
5. Service/jobs/creator shortcuts.
6. Featured Listings.
7. Promotion/boost callout for sellers.
8. Recently Posted.
9. Trending, loaded in batches with infinite scroll or an accessible “Load more” fallback.
10. Floating or fixed support control that opens an email prompt to `support@zidash.com`.

Do not use hardcoded fallback categories. If taxonomy fails or is empty, show “Categories could not be loaded” with Retry.

### Listing card

Show image, title, formatted NGN price, location, condition, promoted/verified state where real, and preferred toggle. Use lazy-loaded images, resilient image fallbacks, and consistent aspect ratios. The entire card opens the detail route while the preferred control remains independently operable.

## Search, category, and pagination

Use URL parameters such as:

- `q`
- `categoryId`
- `condition`
- `minPrice`
- `maxPrice`
- `sort`
- `page`
- `location` when supported

Use debounced search and abort stale requests. Filters must include the backend's current taxonomy and subcategories. Sort choices include newest, oldest, price low-to-high, price high-to-low, and trending. Use a default page size of 20 or 24 and preserve scroll/query state when opening a listing and returning.

## Listing detail

Show:

- image gallery;
- title, price, condition, location, creation time;
- description and metadata/specifications;
- preferred toggle;
- report product action;
- seller card with avatar, display name, verification/trust/rating/follower data where available;
- follow/unfollow seller;
- open seller storefront;
- call and WhatsApp buttons only when the seller phone exists;
- chat/message seller;
- similar products, with no empty reserved block when there are none.

If a phone number, seller profile, email client, call handler, or WhatsApp handler is unavailable, show the branded centered popup. Do not show a snackbar. Provide a small deliberate gap between seller details and the next section.

## Seller storefront

Show seller cover image, avatar, display name, bio, location, member-since date, trust score, ratings, followers, follow action, contact/message action, report seller action, and seller listings. If the seller profile does not exist, show a vertically and horizontally centered empty state.

## Preferred products

Authenticated page listing saved products with pagination or incremental loading. Users can remove an item without leaving the page. Use optimistic UI only if it rolls back and explains an API error.

## Create and manage listings

### Create listing

Collect:

- category and subcategory from live marketplace taxonomy;
- title;
- description;
- price and currency;
- condition: new, like new, used, refurbished;
- seller-selected Nigerian state/FCT location;
- up to eight images;
- category-specific metadata where applicable.

Upload images through `POST /uploads` as multipart form data, then create through `POST /app/listings`. Show that new listings may be paused/pending admin review according to backend behavior.

### My listings

Tabs/filters for listed, active, and closed. Support edit, close, reopen, delete, and boost. Keep mutations synchronized with the current list.

### Boost and payment

Offer only Zidash Wallet and Bank Transfer. Show current wallet balance under the wallet option. Promotion durations are 7 or 30 days. Bank transfer displays the configured/dummy bank details returned by the API and an “I have made the transfer” action. After confirmation, show: “Your promo will start automatically once your payment is confirmed.”

Use `POST /app/my-listings/:id/promotion-payment`. Treat a bank transfer as pending until the backend confirms it. Never mark it complete in browser state alone.

## Jobs and talent

The jobs hub should contain four primary actions:

- Find a job.
- Post a job.
- Find UGC creators.
- Become a UGC creator.

### Job discovery

Show searchable/filterable jobs with title, company, location, salary range when provided, employment type, status, and created time. Add job detail and an authenticated application form with cover letter and optional resume URL/upload. Do not render hardcoded fallback jobs when the API is empty.

### Job posting and management

Create/edit fields: category, title, company, description, location, employment type, salary minimum/maximum, and status. Users can close, reopen, edit, or delete their own job posts.

## UGC creators

Creator discovery supports search by creator, niche, bio, and portfolio text, plus niche chips and availability. Creator cards show avatar/initials, display name, niches, follower count, engagement rate, pricing summary, and availability.

Creator detail shows full bio, linked user identity, categories/niches, portfolio media, metrics, packages, and a campaign-request entry point. Campaign requests use the existing `/campaign-requests` resource. Do not claim the campaign flow is live unless the create call is connected and validated.

The Become a Creator form collects a biography, one to five categories/niches, followers, engagement rate, pricing packages, and optional portfolio media. Submit through `POST /app/creators`.

## Communities

Public feed with:

- All plus the 36 Nigerian states and Abuja FCT;
- posts loaded for the selected location;
- author information;
- image/media;
- sale title, description, price, and location parsed from the stored body format;
- like, comment count, share count, report, and message seller actions;
- auction display when a post has an auction.

Authenticated users can create a sale post, choose a location and scope, upload media, like, report, edit/delete their own posts, and message a poster. Use the security notice: “For your security, verify purchases, do not make payment to unverified merchants.”

The current custom feed endpoint accepts location but does not yet expose robust pagination. Implement pagination in the backend before claiming infinite community loading.

## Messaging

Messages require authentication.

### Conversation list

Show participant avatar/name, listing thumbnail where present, last message, relative time, unread count, and category. Selecting a participant opens their seller storefront when appropriate; selecting the conversation opens chat.

### Chat

- Conversation header links to the seller/store profile.
- Read-only product/listing context card when linked.
- Text, image, voice, and product message rendering.
- Composer with send state and retry.
- Socket.IO live `message:new` updates with HTTP fallback.
- Prevent duplicated optimistic/socket messages.
- Security notice exactly as specified above.
- Preserve scroll position when loading older messages.

The current message endpoint is not cursor-paginated. Add cursor pagination before loading large histories in production.

## Profile, store, and account

Profile home shows avatar, name, email, seller header/cover, Zidash Wallet balance, listing count, verification states, and grouped account tools.

Include:

- edit personal and seller profile;
- change/remove avatar;
- change seller header image;
- choose seller location;
- My Store dashboard;
- My Listings;
- Preferred Products;
- My Community Posts;
- My Job Posts;
- verification;
- wallet;
- contact support;
- privacy policy;
- logout under Account;
- delete account as a separate destructive action without a “Danger Zone” heading.

Do not show the mobile admin shortcut in the consumer web app. Admin users should use the separate admin console. Preserve the existing rule that `support@zidash.com` does not display the mobile admin-panel shortcut.

## Verification

### Phone verification

Collect phone, BVN/NIN method, and optional valid 11-digit identity number. Request OTP, support complete clipboard paste/autofill, and verify the six-digit code.

### Identity verification

Collect document type, selfie, document front, optional back, and notes. Upload files first and submit URLs with `submittedFrom: "web"`. Show pending, approved, and rejected status from bootstrap.

Private verification files must not be cached publicly, exposed in logs, or included in analytics events.

## Wallet

The current consumer backend exposes wallet balance through `/app/bootstrap` and promotion payments through the listing endpoints. Show available and pending balance distinctly. Do not add unsupported wallet top-up, withdrawal, transfer, or transaction-history promises unless the backend implements them.

## Support

Provide a support button on marketplace/app pages. Open a branded confirmation popup that says the user can email `support@zidash.com`, then launch a `mailto:` link. If the email client cannot open, show the address in a custom popup with a copy action.

## Exact API map

### Public or optional-auth reads

- `GET /taxonomy?section=marketplace|services|jobs|ugc`
- `GET /listings?page=&limit=&section=&categoryId=&category=&q=&minPrice=&maxPrice=&sort=`
- `GET /listings/:id`
- `GET /seller-profiles/:id`
- `GET /jobs?page=&limit=`
- `GET /jobs/:id`
- `GET /creators?page=&limit=`
- `GET /creators/:id`
- `GET /app/community/posts?location=`

### Consumer authentication

- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Account/bootstrap

- `GET /app/bootstrap`
- `PATCH /app/profile`
- `POST /app/signup-complete`
- `DELETE /app/account`
- `POST /uploads`

### Marketplace user actions

- `POST /app/listings`
- `GET /app/my-listings?status=`
- `PATCH /app/my-listings/:id`
- `POST /app/my-listings/:id/close`
- `POST /app/my-listings/:id/reopen`
- `DELETE /app/my-listings/:id`
- `POST /app/my-listings/:id/boost`
- `POST /app/my-listings/:id/promotion-payment`
- `GET /app/preferred-products`
- `POST /app/preferred-products/:id/toggle`
- `POST /listings/:id/save`
- `GET /app/seller-profiles/:id/follow-status`
- `POST /app/seller-profiles/:id/follow-toggle`

### Community

- `POST /app/community/posts`
- `GET /app/my-community-posts`
- `PATCH /app/my-community-posts/:id`
- `DELETE /app/my-community-posts/:id`
- `POST /app/community/posts/:id/like`
- generic reporting can use `POST /reports` with authenticated reporter ID until dedicated convenience routes are added.

### Jobs and creators

- `POST /app/jobs`
- `GET /app/my-jobs?status=`
- `PATCH /app/my-jobs/:id`
- `POST /app/my-jobs/:id/close`
- `POST /app/my-jobs/:id/reopen`
- `DELETE /app/my-jobs/:id`
- `POST /app/jobs/:id/apply`
- `POST /app/creators`
- CRUD `/campaign-requests`
- CRUD `/creator-portfolios`

### Messaging

- `GET /app/conversations`
- `POST /app/conversations/start`
- `GET /app/conversations/:id/messages`
- `POST /app/conversations/:id/messages`

### Verification

- `POST /app/phone-verifications/request`
- `POST /app/phone-verifications/verify`
- `POST /app/identity-verifications`

## Known API mismatches to handle explicitly

1. The Flutter client calls dedicated report endpoints for community posts, listings, and sellers, but the current `appRoutes.js` file does not register them. The generic authenticated `/reports` CRUD route exists. Either add the dedicated routes to the backend or have the web client create a generic report with `reporterId`, `subjectType`, `subjectId`, `reason`, and optional details.
2. Community feed pagination is not exposed through the custom `/app/community/posts` validator/service even though the UI may need infinite loading.
3. Conversation messages currently return a full history rather than cursor pagination.
4. Wallet transaction history is not exposed as a consumer endpoint.
5. Google and Apple sign-in require correctly configured production client IDs and real provider tokens. Do not add decorative provider buttons that send incomplete payloads.
6. Location filtering is implemented for community posts; marketplace location filtering is not currently part of the listing query API.
7. Some mobile screens historically rendered demo jobs when APIs were empty. The web app must render honest empty states.

## Client architecture

- Keep API access in one typed/documented client module.
- Normalize `{ data, meta }` responses in one place.
- Add automatic token attachment and one-time refresh/retry.
- Use an authentication context/provider for session and bootstrap data.
- Use route guards for protected pages and protected mutations.
- Keep remote list query state in the URL.
- Abort stale search/list requests.
- Centralize money/date/relative-time/image helpers.
- Centralize custom modal and toast-free feedback.
- Centralize Nigerian locations and avoid spelling variants.
- Keep feature components small enough to test independently.

## Accessibility, performance, and safety

- Semantic headings and landmarks.
- Keyboard-accessible menus, dialogs, filters, galleries, and pagination.
- Trap focus in modal dialogs and restore focus when dismissed.
- Visible focus states and sufficient contrast.
- Announce asynchronous errors and results using appropriate live regions.
- Lazy-load routes and noncritical images where sensible.
- Provide width/height or aspect ratio to prevent layout shifts.
- Debounce search and cache taxonomy.
- Never interpolate unsanitized HTML from listing, community, job, message, or creator content.
- Validate file count/type/size before upload and rely on backend validation too.
- Do not expose JWTs or personal data through URLs, logs, or analytics.
- Require explicit confirmation for deletion, account deletion, and paid promotion.
- Report buttons must not disclose reporter identity to the subject.

## Acceptance criteria

The implementation is ready when:

1. `/landing` and `/` redirect to `/app`, and all existing policy URLs still render.
2. `/app` renders a responsive marketplace homepage using real API data.
3. Taxonomy, listings, search, filters, category pages, listing detail, and seller store are connected.
4. Email OTP sign-in works, including six-digit paste/autofill and return-to-route.
5. Preferred, seller follow, sell/manage listings, and promotion-payment flows are protected and connected.
6. Jobs, applications, creator discovery/onboarding, community feed/posting, conversations/chat, profile, verification, and wallet state have usable web routes.
7. Every remote section has loading, empty, error, and retry behavior.
8. Pagination works for large listing collections and Trending loads in batches.
9. Mobile bottom navigation and desktop app navigation both work without overflow.
10. Kanit is used intentionally for display/product typography without reducing long-form readability.
11. There are no snackbar-style scaffold notices; feedback uses branded popups or accessible inline messages.
12. Production build and lint pass, and existing legal content is unchanged.

## Suggested delivery order

1. Preserve routes and introduce `/app` shell, design tokens, shared components, API client, auth context, and popup provider.
2. Marketplace home, taxonomy, listing cards, category/search/filter/pagination, listing detail, seller store, preferred products.
3. Email OTP auth, bootstrap, profile, location, uploads, create/manage listing.
4. Jobs and applications.
5. UGC creators and campaign requests.
6. Community feed, location selection, posting, likes, reporting, and own-post management.
7. Conversations and chat with Socket.IO.
8. Wallet/promotion payment and verification.
9. Responsive/accessibility/performance pass and browser regression of all retained landing routes.

Do not claim full parity for any route whose backend operation is missing. Surface the gap, implement the safe available behavior, and document the exact backend addition needed.
