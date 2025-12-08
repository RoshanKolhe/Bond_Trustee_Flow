import { Helmet } from 'react-helmet-async';
// sections

import { SignatoriesListView } from 'src/sections/signatories/view';

// ----------------------------------------------------------------------

export default function SignatoriesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job List</title>
      </Helmet>

      {/* <MainFile /> */}
      {/* <StepFour />
      <RoiStepper /> */}
      <SignatoriesListView/>
    </>
  );
}
