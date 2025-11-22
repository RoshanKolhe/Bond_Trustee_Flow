import { Helmet } from 'react-helmet-async';
// sections
import { KYCView } from 'src/sections/kyc/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Issuer: KYC</title>
      </Helmet>

      <KYCView />
    </>
  );
}
