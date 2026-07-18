import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import About from './pages/About.jsx';
import Safety from './pages/Safety.jsx';
import Legal from './pages/Legal.jsx';
import FAQ from './pages/FAQ.jsx';
import Cookie from './pages/Cookie.jsx';
import Guidelines from './pages/Guidelines.jsx';
import IntellectualProperty from './pages/IntellectualProperty.jsx';
import Prohibited from './pages/Prohibited.jsx';
import JobPolicy from './pages/JobPolicy.jsx';
import UGCPolicy from './pages/UGCPolicy.jsx';
import ModerationPolicy from './pages/ModerationPolicy.jsx';
import AdsPolicy from './pages/AdsPolicy.jsx';
import VerificationPolicy from './pages/VerificationPolicy.jsx';
import BuyerSafety from './pages/BuyerSafety.jsx';
import SellerSafety from './pages/SellerSafety.jsx';
import ScamPrevention from './pages/ScamPrevention.jsx';
import BusinessAccountPolicy from './pages/BusinessAccountPolicy.jsx';
import ServiceProviderPolicy from './pages/ServiceProviderPolicy.jsx';
import ContactSupportPolicy from './pages/ContactSupportPolicy.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';
import Careers from './pages/Careers.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
