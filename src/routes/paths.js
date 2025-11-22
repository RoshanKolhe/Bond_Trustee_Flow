// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';
import KYCBankDetails from 'src/sections/kyc/kyc-bank-details';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  kyc: '/kyc',
  kycBasicInfo: '/kyc/basic-info',
  kycCompanyDetails: '/kyc/company-details',
  KYCBankDetails: '/kyc/bank-details',
  KYCReviewAndSubmit: '/kyc/review-and-submit',
  KYCSucessfull: '/kyc/sucessfull',
  KYCSignatories: '/kyc/signatories',
  KYCPending: '/kyc/pending',

  // kycCompanyDetails: '/kyc/kyc-company-details',
  kycAddressInfo: '/kyc/kyc-address-info',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/kAYnYYdib0aQPNKZpgJT6J/%5BPreview%5D-Minimal-Web.v5.0.0?type=design&node-id=0%3A1&t=Al4jScQq97Aly0Mn-1',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,

    general: {
      analytics: `${ROOTS.DASHBOARD}/analytics`,
    },

    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      // cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      // account: `${ROOTS.DASHBOARD}/user/account`,
      // edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      // demo: {
      //   edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      // },
    },
    company: {
      root: `${ROOTS.DASHBOARD}/company`,
      new: `${ROOTS.DASHBOARD}/company/new`,
      list: `${ROOTS.DASHBOARD}/company/list`,
      // cards: `${ROOTS.DASHBOARD}/company/cards`,
      profile: `${ROOTS.DASHBOARD}/company/profile`,
      // account: `${ROOTS.DASHBOARD}/company/account`,
      // edit: (id) => `${ROOTS.DASHBOARD}/company/${id}/edit`,
      // demo: {
      //   edit: `${ROOTS.DASHBOARD}/company/${MOCK_ID}/edit`,
      // },
    },
    issureservices: {
      root: `${ROOTS.DASHBOARD}/issureservices`,
      roi: `${ROOTS.DASHBOARD}/issureservices/roi`,
      roifundform: `${ROOTS.DASHBOARD}/issureservices/fund-position-form`,
      view: `${ROOTS.DASHBOARD}/issureservices/view`,
    },
    //   product: {
    //     root: `${ROOTS.DASHBOARD}/product`,
    //     new: `${ROOTS.DASHBOARD}/product/new`,
    //     details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
    //     edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    //     demo: {
    //       details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
    //       edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
    //     },
    //   },
    //   invoice: {
    //     root: `${ROOTS.DASHBOARD}/invoice`,
    //     new: `${ROOTS.DASHBOARD}/invoice/new`,
    //     details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
    //     edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
    //     demo: {
    //       details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
    //       edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
    //     },
    //   },
    //   post: {
    //     root: `${ROOTS.DASHBOARD}/post`,
    //     new: `${ROOTS.DASHBOARD}/post/new`,
    //     details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
    //     edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
    //     demo: {
    //       details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
    //       edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
    //     },
    //   },
    //   order: {
    //     root: `${ROOTS.DASHBOARD}/order`,
    //     details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
    //     demo: {
    //       details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
    //     },
    //   },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      list: `${ROOTS.DASHBOARD}/job/list`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    reactflow: {
      root: `${ROOTS.DASHBOARD}/reactflow`,
      new: `${ROOTS.DASHBOARD}/reactflow/new`,
      list: `${ROOTS.DASHBOARD}/reactflow/list`,
      details: (id) => `${ROOTS.DASHBOARD}/workflow/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/workflow/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/workflow/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/workflow/${MOCK_ID}/edit`,
      },
    },

    scheduler: {
      root: `${ROOTS.DASHBOARD}/scheduler`,
      new: `${ROOTS.DASHBOARD}/scheduler/new`,
      list: `${ROOTS.DASHBOARD}/scheduler/list`,
      details: (id) => `${ROOTS.DASHBOARD}/scheduler/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/scheduler/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/scheduler/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/scheduler/${MOCK_ID}/edit`,
      },
    },

    designation: {
      root: `${ROOTS.DASHBOARD}/designation`,
      new: `${ROOTS.DASHBOARD}/designation/new`,
      list: `${ROOTS.DASHBOARD}/designation/list`,
      details: (id) => `${ROOTS.DASHBOARD}/designation/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/designation/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/designation/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/designation/${MOCK_ID}/edit`,
      },
    },
    //   tour: {
    //     root: `${ROOTS.DASHBOARD}/tour`,
    //     new: `${ROOTS.DASHBOARD}/tour/new`,
    //     details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
    //     edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
    //     demo: {
    //       details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
    //       edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
    //     },
    //   },
    // },
  },
};
