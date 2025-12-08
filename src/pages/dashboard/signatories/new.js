import { Helmet } from 'react-helmet-async';
import { SignatoriesCreateView } from 'src/sections/signatories/view';

// sections



// ----------------------------------------------------------------------

export default function SignatoriesCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new job</title>
      </Helmet>

      <SignatoriesCreateView />
    </>
  );
}
