// src/_mock/company.js
import { _mock } from './_mock';

// Mock company list
export const _companyList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  companyName: _mock.company(index), // mock company name
  address: _mock.address.full(index), // full address
  phoneNumber: _mock.phoneNumber(index), // phone number
  email: _mock.email(index), // email
//   : ['active', 'inactive', 'pending'][index % 3], status// status options
//   role: ['Supplier', 'Client', 'Partner'][index % 3], // company role type
  createdAt: _mock.time(index), // creation date
}));
