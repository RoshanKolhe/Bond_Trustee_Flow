import { Helmet } from 'react-helmet-async';
import {  SchedulerListView } from 'src/sections/scheduler/view';


// ----------------------------------------------------------------------

export default function SchedulerListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Scheduler List</title>
      </Helmet>
        <SchedulerListView />
    </>
  );
}
