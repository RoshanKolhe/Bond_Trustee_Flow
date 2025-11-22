import { Helmet } from 'react-helmet-async';
// import PreliminaryBondRequirements from 'src/sections/issure-services/preliminary-bond-requirements';
// sections
// import FundPositionForm from 'src/sections/issure-services/fund-positions';
import RoiStepper from 'src/sections/issure-services/stepper';
import BondIssuePage from 'src/sections/issure-services/view/bond-isue-page';
// ----------------------------------------------------------------------

export default function AfterCompleteRoiStagePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Complete</title>
      </Helmet>

      {/* <PreliminaryBondRequirements /> */}
      <BondIssuePage/>
    </>
  );
}
