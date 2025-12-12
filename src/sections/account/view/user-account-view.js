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
import { useSearchParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hook';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'basic',
    label: 'Company Basic Info',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'address',
    label: 'Address',
    icon: <Iconify icon="solar:clipboard-list-bold" width={24} />,
  },
  {
    value: 'details',
    label: 'Company Details',
    icon: <Iconify icon="solar:buildings-2-bold" width={24} />,
  },
  {
    value: 'bank',
    label: 'Bank Details',
    icon: <Iconify icon="fluent:building-bank-16-filled" width={24} />,
  },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'basic';

  const [currentTab, setCurrentTab] = useState(tabFromUrl);

  const handleChangeTab = useCallback(
    (event, newValue) => {
      setCurrentTab(newValue);
      router.push(`?tab=${newValue}`);
    },
    [router]
  );

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
