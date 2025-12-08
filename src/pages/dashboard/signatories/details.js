import { Helmet } from 'react-helmet-async';
import { SignatoriesDetailsView } from 'src/sections/signatories/view';

// sections



// ----------------------------------------------------------------------

export default function SignatoriesDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Signatoires Details</title>
      </Helmet>

      <SignatoriesDetailsView />
    </>
  );
}
