import { Helmet } from 'react-helmet-async';
// sections

import { JobsDetailsView } from 'src/sections/jobList/view';

// ----------------------------------------------------------------------

export default function JobDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Job Details</title>
      </Helmet>

      <JobsDetailsView />
    </>
  );
}
