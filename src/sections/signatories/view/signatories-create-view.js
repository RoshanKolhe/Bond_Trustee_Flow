// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SignatoriesNewEditForm from '../signatories-new-edit-form';
//



// ----------------------------------------------------------------------

export default function SignatoriesCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Signatoires"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Signatories',
            href: paths.dashboard.signatories.root,
          },
          { name: 'New Signatories' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SignatoriesNewEditForm/>
    </Container>
  );
}
