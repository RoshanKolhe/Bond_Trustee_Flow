import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetSignatorie } from 'src/api/signatories';

import SignatoriesDetails from '../signatories-view-details-form';
//



// ----------------------------------------------------------------------

export default function SignatoiresDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { signatorie } = useGetSignatorie(id);
  console.log(signatorie);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Signatories', href: paths.dashboard.signatories.root },
          {
            name: signatorie?.fullName || ''

          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SignatoriesDetails currentUser={signatorie} />
    </Container>
  );
}
