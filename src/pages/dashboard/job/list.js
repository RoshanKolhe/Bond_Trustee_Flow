import { Helmet } from 'react-helmet-async';
// sections

import { JobsListView } from 'src/sections/jobList/view';
import BorrowingDetails from 'src/sections/issure-services/stepThree/borrowing-details';
import CapitalDetials from 'src/sections/issure-services/stepThree/capital-details';
import FinancialDetails from 'src/sections/issure-services/stepFour/financial-details';
import MainFile from 'src/sections/issure-services/stepThree/main';
import ProfitabilityDetails from 'src/sections/issure-services/stepThree/profitable-details';
import StepFour from 'src/sections/issure-services/stepFour';
import RoiStepper from 'src/sections/issure-services/stepper';
import BondIssuePage from 'src/sections/issure-services/view/bond-isue-page';
import BondIssueDashboard from 'src/sections/issure-services/view/bond-isue-page';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job List</title>
      </Helmet>

      {/* <MainFile /> */}
      {/* <StepFour />
      <RoiStepper /> */}
      <BondIssuePage/>
    </>
  );
}
