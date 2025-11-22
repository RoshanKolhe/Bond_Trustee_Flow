// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// utils
import { useParams } from 'src/routes/hook';
// api
import { useGetScheduler } from 'src/api/scheduler';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SchedulerNewEditForm from '../scheduler-new-edit-form';


//


// ----------------------------------------------------------------------

export default function SchedulerEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const {scheduler: currentScheduler}=useGetScheduler(id)

 console.log('currentScheduler', currentScheduler)

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
            name: 'Scheduler',
            href: paths.dashboard.scheduler.root,
          },
          {
            name: currentScheduler?.platformName,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SchedulerNewEditForm currentScheduler={currentScheduler} />
    </Container>
  );
}
