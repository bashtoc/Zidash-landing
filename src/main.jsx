/* oxlint-disable react/only-export-components -- this is the application entry point and route manifest. */
import { lazy, StrictMode, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  Navigate,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider, RequireAuth } from './webapp/AuthContext.jsx';
import { PopupProvider } from './webapp/PopupContext.jsx';
import './index.css';

const CHUNK_LOAD_ERROR = /ChunkLoadError|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .* failed/i;

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && typeof error.message === 'string') return error.message;
  return '';
}

function isChunkLoadError(error) {
  return CHUNK_LOAD_ERROR.test(getErrorMessage(error));
}

function refreshAfterStaleChunk(error) {
  if (!isChunkLoadError(error)) return false;

  const message = getErrorMessage(error);
  const assetUrl = message.match(/https?:\/\/\S+|\/assets\/\S+/)?.[0] || message;
  const marker = `zidash:stale-chunk:${assetUrl.slice(-220)}`;

  try {
    if (window.sessionStorage.getItem(marker)) return false;
    window.sessionStorage.setItem(marker, 'reloaded');
  } catch {
    // If storage is unavailable, avoid risking a reload loop and show the error UI.
    return false;
  }

  window.location.reload();
  return true;
}

function RouteErrorPage() {
  const error = useRouteError();
  const staleChunk = isChunkLoadError(error);
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    if (staleChunk) refreshAfterStaleChunk(error);
  }, [error, staleChunk]);

  return (
    <main className="route-error" role="alert">
      <section className="route-error__card">
        <img src="/goodzidash.png" alt="Zidash" />
        <p className="route-error__eyebrow">{notFound ? 'Page not found' : 'Let’s get you back in'}</p>
        <h1>{staleChunk ? 'Zidash was just updated' : 'This page could not be loaded'}</h1>
        <p>
          {staleChunk
            ? 'Refresh to load the latest version of the app.'
            : 'Please refresh the page. If the problem continues, return to the marketplace.'}
        </p>
        <div className="route-error__actions">
          <button type="button" onClick={() => window.location.reload()}>Refresh page</button>
          <a href="/app">Go to marketplace</a>
        </div>
      </section>
    </main>
  );
}

window.addEventListener('vite:preloadError', (event) => {
  if (refreshAfterStaleChunk(event.payload)) {
    event.preventDefault();
  }
});

const lazyNamed = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));
const About = lazy(() => import('./pages/About.jsx'));
const Safety = lazy(() => import('./pages/Safety.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Cookie = lazy(() => import('./pages/Cookie.jsx'));
const Guidelines = lazy(() => import('./pages/Guidelines.jsx'));
const IntellectualProperty = lazy(() => import('./pages/IntellectualProperty.jsx'));
const Prohibited = lazy(() => import('./pages/Prohibited.jsx'));
const JobPolicy = lazy(() => import('./pages/JobPolicy.jsx'));
const UGCPolicy = lazy(() => import('./pages/UGCPolicy.jsx'));
const ModerationPolicy = lazy(() => import('./pages/ModerationPolicy.jsx'));
const AdsPolicy = lazy(() => import('./pages/AdsPolicy.jsx'));
const VerificationPolicy = lazy(() => import('./pages/VerificationPolicy.jsx'));
const BuyerSafety = lazy(() => import('./pages/BuyerSafety.jsx'));
const SellerSafety = lazy(() => import('./pages/SellerSafety.jsx'));
const ScamPrevention = lazy(() => import('./pages/ScamPrevention.jsx'));
const BusinessAccountPolicy = lazy(() => import('./pages/BusinessAccountPolicy.jsx'));
const ServiceProviderPolicy = lazy(() => import('./pages/ServiceProviderPolicy.jsx'));
const ContactSupportPolicy = lazy(() => import('./pages/ContactSupportPolicy.jsx'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy.jsx'));
const Careers = lazy(() => import('./pages/Careers.jsx'));
const WebAppShell = lazy(() => import('./webapp/WebAppShell.jsx'));
const marketplacePages = () => import('./webapp/pages/MarketplacePages.jsx');
const jobsCreatorsPages = () => import('./webapp/pages/JobsCreatorsPages.jsx');
const communityMessagesPages = () => import('./webapp/pages/CommunityMessagesPages.jsx');
const accountPages = () => import('./webapp/pages/AccountPages.jsx');

const MarketplaceHome = lazyNamed(marketplacePages, 'MarketplaceHome');
const CategoriesPage = lazyNamed(marketplacePages, 'CategoriesPage');
const ListingsResultsPage = lazyNamed(marketplacePages, 'ListingsResultsPage');
const ListingDetailPage = lazyNamed(marketplacePages, 'ListingDetailPage');
const SellerPage = lazyNamed(marketplacePages, 'SellerPage');
const SavedProductsPage = lazyNamed(marketplacePages, 'SavedProductsPage');
const JobsHubPage = lazyNamed(jobsCreatorsPages, 'JobsHubPage');
const JobsListPage = lazyNamed(jobsCreatorsPages, 'JobsListPage');
const JobDetailPage = lazyNamed(jobsCreatorsPages, 'JobDetailPage');
const PostJobPage = lazyNamed(jobsCreatorsPages, 'PostJobPage');
const MyJobsPage = lazyNamed(jobsCreatorsPages, 'MyJobsPage');
const EditJobPage = lazyNamed(jobsCreatorsPages, 'EditJobPage');
const CreatorsPage = lazyNamed(jobsCreatorsPages, 'CreatorsPage');
const CreatorDetailPage = lazyNamed(jobsCreatorsPages, 'CreatorDetailPage');
const BecomeCreatorPage = lazyNamed(jobsCreatorsPages, 'BecomeCreatorPage');
const CommunityPage = lazyNamed(communityMessagesPages, 'CommunityPage');
const MyCommunityPostsPage = lazyNamed(communityMessagesPages, 'MyCommunityPostsPage');
const MessagesPage = lazyNamed(communityMessagesPages, 'MessagesPage');
const NewConversationPage = lazyNamed(communityMessagesPages, 'NewConversationPage');
const ChatPage = lazyNamed(communityMessagesPages, 'ChatPage');
const AuthPage = lazyNamed(accountPages, 'AuthPage');
const ProfilePage = lazyNamed(accountPages, 'ProfilePage');
const SellPage = lazyNamed(accountPages, 'SellPage');
const MyListingsPage = lazyNamed(accountPages, 'MyListingsPage');
const EditListingPage = lazyNamed(accountPages, 'EditListingPage');
const BoostListingPage = lazyNamed(accountPages, 'BoostListingPage');
const WalletPage = lazyNamed(accountPages, 'WalletPage');
const VerificationPage = lazyNamed(accountPages, 'VerificationPage');

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/app" replace />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'safety',
        element: <Safety />,
      },
      {
        path: 'legal',
        element: <Legal />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'cookie',
        element: <Cookie />,
      },
      {
        path: 'guidelines',
        element: <Guidelines />,
      },
      {
        path: 'ip-policy',
        element: <IntellectualProperty />,
      },
      {
        path: 'prohibited',
        element: <Prohibited />,
      },
      {
        path: 'job-policy',
        element: <JobPolicy />,
      },
      {
        path: 'ugc-policy',
        element: <UGCPolicy />,
      },
      {
        path: 'moderation-policy',
        element: <ModerationPolicy />,
      },
      {
        path: 'ads-policy',
        element: <AdsPolicy />,
      },
      {
        path: 'verification-policy',
        element: <VerificationPolicy />,
      },
      {
        path: 'buyer-safety',
        element: <BuyerSafety />,
      },
      {
        path: 'seller-safety',
        element: <SellerSafety />,
      },
      {
        path: 'scam-prevention',
        element: <ScamPrevention />,
      },
      {
        path: 'business-policy',
        element: <BusinessAccountPolicy />,
      },
      {
        path: 'service-policy',
        element: <ServiceProviderPolicy />,
      },
      {
        path: 'contact-policy',
        element: <ContactSupportPolicy />,
      },
      {
        path: 'refund-policy',
        element: <RefundPolicy />,
      },
      {
        path: 'careers',
        element: <Careers />,
      },
    ],
  },
  {
    path: '/landing',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/app',
    element: <WebAppShell />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <MarketplaceHome /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'category/:categoryId', element: <ListingsResultsPage categoryOnly /> },
      { path: 'search', element: <ListingsResultsPage /> },
      { path: 'listing/:listingId', element: <ListingDetailPage /> },
      { path: 'seller/:sellerId', element: <SellerPage /> },
      { path: 'jobs', element: <JobsHubPage /> },
      { path: 'jobs/find', element: <JobsListPage /> },
      { path: 'jobs/:jobId', element: <JobDetailPage /> },
      { path: 'creators', element: <CreatorsPage /> },
      { path: 'creators/:creatorId', element: <CreatorDetailPage /> },
      { path: 'community', element: <CommunityPage /> },
      {
        path: 'saved',
        element: <RequireAuth><SavedProductsPage /></RequireAuth>,
      },
      {
        path: 'sell',
        element: <RequireAuth><SellPage /></RequireAuth>,
      },
      {
        path: 'my-listings',
        element: <RequireAuth><MyListingsPage /></RequireAuth>,
      },
      {
        path: 'my-listings/:listingId/boost',
        element: <RequireAuth><BoostListingPage /></RequireAuth>,
      },
      {
        path: 'my-listings/:listingId/edit',
        element: <RequireAuth><EditListingPage /></RequireAuth>,
      },
      {
        path: 'jobs/post',
        element: <RequireAuth><PostJobPage /></RequireAuth>,
      },
      {
        path: 'jobs/mine',
        element: <RequireAuth><MyJobsPage /></RequireAuth>,
      },
      {
        path: 'jobs/:jobId/edit',
        element: <RequireAuth><EditJobPage /></RequireAuth>,
      },
      {
        path: 'creators/become',
        element: <RequireAuth><BecomeCreatorPage /></RequireAuth>,
      },
      {
        path: 'community/mine',
        element: <RequireAuth><MyCommunityPostsPage /></RequireAuth>,
      },
      {
        path: 'messages',
        element: <RequireAuth><MessagesPage /></RequireAuth>,
      },
      {
        path: 'messages/new',
        element: <RequireAuth><NewConversationPage /></RequireAuth>,
      },
      {
        path: 'messages/:conversationId',
        element: <RequireAuth><ChatPage /></RequireAuth>,
      },
      {
        path: 'profile',
        element: <RequireAuth><ProfilePage /></RequireAuth>,
      },
      {
        path: 'profile/verification',
        element: <RequireAuth><VerificationPage /></RequireAuth>,
      },
      {
        path: 'wallet',
        element: <RequireAuth><WalletPage /></RequireAuth>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PopupProvider>
      <AuthProvider>
        <Suspense fallback={<div className="route-loader" role="status">Loading Zidash…</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </PopupProvider>
  </StrictMode>,
);
