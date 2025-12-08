// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetSignatories } from 'src/api/signatories';
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

  const {signatories: currentSignatories}=useGetSignatories(id)

 console.log('currentSignatories', currentSignatories)

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
            name: currentSignatories?.platformName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SignatoriesNewEditForm currentSignatories={currentSignatories} />
    </Container>
  );
}
