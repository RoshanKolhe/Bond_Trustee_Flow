import { Helmet } from 'react-helmet-async';
// sections
import { SignatoriesEditView } from 'src/sections/signatories/view';

// ----------------------------------------------------------------------

export default function SignatoriesEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Signatories Edit</title>
      </Helmet>

      <SignatoriesEditView />
    </>
  );
}
