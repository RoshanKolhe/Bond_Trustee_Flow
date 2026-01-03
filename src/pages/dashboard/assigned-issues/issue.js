import { Helmet } from 'react-helmet-async';
import { AssignedIssuesView } from 'src/sections/assigned-issues/view';



// ----------------------------------------------------------------------

export default function AssignedIssuePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Assigned Issues </title>
      </Helmet>

      <AssignedIssuesView/>
    </>
  );
}
