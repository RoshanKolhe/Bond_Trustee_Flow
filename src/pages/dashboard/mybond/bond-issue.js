import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
// sections
import { BondIssueStepperView } from 'src/sections/mybond/view';
// ----------------------------------------------------------------------

export default function MyBondNewIssuePage() {
  const { id } = useParams();
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Create</title>
      </Helmet>

      <BondIssueStepperView applicationId={id} />
    </>
  );
}
