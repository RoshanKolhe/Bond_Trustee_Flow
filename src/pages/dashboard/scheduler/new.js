import { Helmet } from 'react-helmet-async';
import { SchedulerCreateView } from 'src/sections/scheduler/view';



// ----------------------------------------------------------------------

export default function SchedulerNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Scheduler New</title>
      </Helmet>
      <SchedulerCreateView />
    </> 
  );
}
