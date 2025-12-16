import { Helmet } from 'react-helmet-async';
import PendingAppointmentsCardList from 'src/sections/pending-appointments/view/pending-appointments-cards-list';


// ----------------------------------------------------------------------

export default function PendingAppointmentsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job List</title>
      </Helmet>

      {/* <MainFile /> */}
      {/* <StepFour />
      <RoiStepper /> */}
      <PendingAppointmentsCardList/>
    </>
  );
}
