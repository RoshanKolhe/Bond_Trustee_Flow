// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetSignatorie, useGetSignatories } from 'src/api/signatories';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SignatoriesNewEditForm from '../signatories-new-edit-form';


//


// ----------------------------------------------------------------------

export default function SignatoriesEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { signatorie } = useGetSignatorie(id);

 console.log('currentSignatories', signatorie)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Signatories',
            href: paths.dashboard.signatories.root,
          },
          {
            name: signatorie?.fullName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SignatoriesNewEditForm currentSignatories={signatorie} />
    </Container>
  );
}
