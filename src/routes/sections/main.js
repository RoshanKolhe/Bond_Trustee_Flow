import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import MainLayout from 'src/layouts/main';
import SimpleLayout from 'src/layouts/simple';
import CompactLayout from 'src/layouts/compact';
// components
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const FaqsPage = lazy(() => import('src/pages/faqs'));
const AboutPage = lazy(() => import('src/pages/about-us'));
const ContactPage = lazy(() => import('src/pages/contact-us'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const PaymentPage = lazy(() => import('src/pages/payment'));
const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));
// PRODUCT
const ProductListPage = lazy(() => import('src/pages/product/list'));
const ProductDetailsPage = lazy(() => import('src/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));
// BLOG
const PostListPage = lazy(() => import('src/pages/post/list'));
const PostDetailsPage = lazy(() => import('src/pages/post/details'));

const KYCViewPage = lazy(() => import('src/pages/kyc/kyc'));
const KYCBasicInfoPage = lazy(() => import('src/pages/kyc/kyc-basic-info'));
const KYCCompanyDetailsPage = lazy(() => import('src/pages/kyc/kyc-company-details'));
const KYCBankDetailsPage = lazy(() => import('src/pages/kyc/kyc-bank-details'))
const KYCReviewAndSubmitPage = lazy(() => import('src/pages/kyc/kyc-review-and-submit'));
const KYCSucessfullPage = lazy(() => import('src/pages/kyc/kyc-sucessfull'));
const KYCPendingPage = lazy(() => import('src/pages/kyc/kyc-pending'));
const KYCSignatoriesPage = lazy(() => import('src/pages/kyc/kyc-signatories'));
// KYC
const KycPage = lazy(() => import('src/pages/kyc/kyc'));
const KycAddressInfoPage = lazy(() => import('src/pages/kyc/kyc-address-info'));
const KycCompanyDetailsPage = lazy(() => import('src/pages/kyc/kyc-company-details'));
// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      { path: 'about-us', element: <AboutPage /> },
      { path: 'contact-us', element: <ContactPage /> },
      { path: 'faqs', element: <FaqsPage /> },
      // { path: 'kyc', element: <KycPage /> },
      
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'checkout', element: <ProductCheckoutPage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <PostListPage />, index: true },
          { path: 'list', element: <PostListPage /> },
          { path: ':title', element: <PostDetailsPage /> },
        ],
      },
      { path: 'kyc', element: <KYCViewPage /> },
      { path: 'kyc/basic-info', element: <KYCBasicInfoPage /> },
      { path: 'kyc/company-details', element: <KYCCompanyDetailsPage /> },
      { path: 'kyc/bank-details', element: <KYCBankDetailsPage /> },
      { path: 'kyc/review-and-submit', element: <KYCReviewAndSubmitPage /> },
      { path: 'kyc/sucessfull', element: <KYCSucessfullPage /> },
      { path: 'kyc/pending', element: <KYCPendingPage /> },
      { path: 'kyc/signatories', element: <KYCSignatoriesPage /> },
      { path: 'kyc/address-info', element: <KycAddressInfoPage /> },
    ],
  },
  {
    element: (
      <SimpleLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </SimpleLayout>
    ),
    children: [
      { path: 'pricing', element: <PricingPage /> },
      { path: 'payment', element: <PaymentPage /> },
    ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      { path: 'coming-soon', element: <ComingSoonPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];
