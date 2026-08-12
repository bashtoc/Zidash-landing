# Zidash Web

The Zidash website now centers on the responsive consumer marketplace web app, with supporting policy and information pages.

- Visiting `/` launches the consumer web app at `/app`.
- The retired marketing homepage is no longer public; `/landing` redirects to `/app`. Policy pages remain under `/about`, `/safety`, `/legal`, and the existing policy routes.
- Google and email OTP authentication are available at `/auth`.
- The implementation brief and API map are in [`docs/ZIDASH_MOBILE_TO_WEB_REPLICATION_SPEC.md`](docs/ZIDASH_MOBILE_TO_WEB_REPLICATION_SPEC.md).

## Local development

Requirements: a current Node.js runtime and the `zidash-backend` API running on port `4000`.

```bash
npm install
npm run dev
```

Vite proxies `/api/v1` and `/socket.io` to the configured backend in development. Open the URL printed by Vite to launch the web app.

## Production configuration

Set `VITE_API_URL` when the API is hosted on another origin:

```env
VITE_API_URL=https://api.example.com/api/v1
```

To enable Google sign-in, create an OAuth 2.0 client with the **Web application** type, add the local and deployed web origins to its Authorized JavaScript origins, and set:

```env
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

Add that same Web client ID to the backend's comma-separated `GOOGLE_CLIENT_IDS` value. Keep the existing iOS client ID in that list so both Flutter and web tokens remain valid.

The backend must allow the web origin through CORS and Socket.IO origin settings. For same-origin hosting, leave `VITE_API_URL=/api/v1` and proxy `/api/v1` plus `/socket.io` to the backend at the web server or edge layer.

## Quality checks

```bash
npm run lint
npm run build
```

The built static site is written to `dist/`. Configure production hosting with SPA history fallback so direct links such as `/app/listing/:id` and existing policy URLs resolve to `index.html`.
