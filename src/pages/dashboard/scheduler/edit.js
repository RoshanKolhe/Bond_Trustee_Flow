import { Helmet } from 'react-helmet-async';
import { SchedulerEditView } from 'src/sections/scheduler/view';



// ----------------------------------------------------------------------

export default function SchedulerEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Scheduler Edit</title>
      </Helmet>
    <SchedulerEditView/>
    </>
  );
}
