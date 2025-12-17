import { Helmet } from 'react-helmet-async';
import { AssignedIssuesListView } from 'src/sections/assigned-issues/view';



// ----------------------------------------------------------------------

export default function AssignedIssueListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Assigned Issues List</title>
      </Helmet>

      <AssignedIssuesListView/>
    </>
  );
}
