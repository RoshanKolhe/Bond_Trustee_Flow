import { Helmet } from 'react-helmet-async';
import PendingAppointmentsCardList from 'src/sections/pending-appointments/view/pending-appointments-cards-list';


// ----------------------------------------------------------------------

export default function PendingAppointmentsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pending Appointment List</title>
      </Helmet>
      
      <PendingAppointmentsCardList/>
    </>
  );
}
