//
import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/auth/me',
    login: '/auth/trustee-login',
    register: '/register',
    forgotPassword: '/auth/forget-password/send-email-otp',
    newPassword: '/auth/forget-password/verify-email-otp',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  scheduler: {
    list: '/schedulers',
    filterList: (filter) => `/schedulers?filter=${filter}`,
    details: (id) => `/schedulers/${id}`,
  },
  signatories: {
    list: '/trustee-profiles/authorize-signatory',
    filterList: (filter) => `/trustee-profiles/authorize-signatory?filter=${filter}`,
    details: (signatoryId) => `/trustee-profiles/authorize-signatory/${signatoryId}`,
  },
  companyInfo: {
    list: '/api/kyc/issuer_kyc/company-info/',
    filterList: (filter) => `/api/kyc/issuer_kyc/company-info/?filter=${filter}`,
    details: (id) => `/api/kyc/issuer_kyc/company-info//${id}`,
  },
  designation: {
    list: '/designations',
    filterList: (filter) => `/designations?filter=${filter}`,
    details: (id) => `/designations/${id}`,
  },
  entityType: {
    list: '/company-entity-types',
    filterList: (filter) => `/company-entity-types?filter=${filter}`,
    details: (id) => `/company-entity-types/${id}`,
  },
  documentByScreen: (route) => `/screens/documents-by-screen/${encodeURIComponent(route)}`,
  trusteeKyc: {
    kycProgress: (sessionId) => `/trustee-profiles/kyc-progress/${sessionId}`,
    getSection: (section, profileId, route = '') =>
      `/trustee-profiles/kyc-get-data/${section}/${profileId}?route=${encodeURIComponent(route)}`,
    details: (id) => `/trustee-profiles/bank-details/${id}`,
    getBankDetails: `/trustee-profiles/bank-details`,
    getDocuments: `/trustee-profiles/documents`,
    getProfileData: `/trustee-profiles/me`,
  },
  trusteeEntityType: {
    list: '/trustee-entity-types',
    filterList: (filter) => `/trustee-entity-types?filter=${filter}`,
    details: (id) => `/trustee-entity-types/${id}`,
  },
  sector: {
    list: '/company-sector-types',
    filterList: (filter) => `/company-sector-types?filter=${filter}`,
    details: (id) => `/company-sector-types/${id}`,
  },
};
