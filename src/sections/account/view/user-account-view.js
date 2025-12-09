import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import AccountChangePassword from '../account-change-password';
import KYCBasicInfo from '../profile-basic-info';
import KYCCompanyDetails from '../profile-company-details';
import TrusteeBankPage from '../bank-detail-view';
import AddressNewForm from '../trustee-profile-account-address';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Company Basic Info' },
  { value: 'address', label: 'Address' },
  { value: 'details', label: 'Company Details' },
  { value: 'bank', label: 'Bank Details' },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('basic');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Account"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Account' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'basic' && <KYCBasicInfo />}

      {currentTab === 'address' && <AddressNewForm />}

      {currentTab === 'details' && <KYCCompanyDetails />}

      {currentTab === 'bank' && <TrusteeBankPage />}

      {currentTab === 'security' && <AccountChangePassword />}
    </Container>
  );
}
