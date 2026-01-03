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
import DebentureTrusteeListView from '../../intermediates/debenture-trustees/view/debenture-trustee-list-view';

// tabs pages

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'debenture_trustee',
    label: 'Debenture Trustee',
    icon: <Iconify icon="solar:shield-check-bold" width={22} />,
  },
  {
    value: 'rta',
    label: 'RTA',
    icon: <Iconify icon="solar:document-text-bold" width={22} />,
  },
  {
    value: 'lead_manager',
    label: 'Lead Manager',
    icon: <Iconify icon="solar:user-star-bold" width={22} />,
  },
  {
    value: 'legal_advisor',
    label: 'Legal Advisor',
    icon: <Iconify icon="solar:scale-bold" width={22} />,
  },
  {
    value: 'valuer',
    label: 'Valuer',
    icon: <Iconify icon="solar:calculator-bold" width={22} />,
  },
  {
    value: 'credit_rating',
    label: 'Credit Rating Agency',
    icon: <Iconify icon="solar:chart-bold" width={22} />,
  },
];

// ----------------------------------------------------------------------

export default function IntermediariesView() {
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('debenture_trustee');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Intermediaries"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Intermediaries' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {currentTab === 'debenture_trustee' && <DebentureTrusteeListView />}
      {/* {currentTab === 'rta' && <RtaSelection />}
      {currentTab === 'lead_manager' && <LeadManagerSelection />}
      {currentTab === 'legal_advisor' && <LegalAdvisorSelection />}
      {currentTab === 'valuer' && <ValuerSelection />}
      {currentTab === 'credit_rating' && <CreditRatingSelection />} */}
    </Container>
  );
}
