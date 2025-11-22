// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api

import { useGetDesignation } from 'src/api/designation';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DesignationNewEditForm from '../designation-new-edit-form';


//


// ----------------------------------------------------------------------

export default function DesignationEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;


  const{designation:currentDesignation}= useGetDesignation(id)
  console.log('currentDesignation', currentDesignation)

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
            name: 'Designation',
            href: paths.dashboard.designation.root,
          },
          {
            name: currentDesignation?.designation,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DesignationNewEditForm currentDesignation={currentDesignation} />
    </Container>
  );
}
