import { Helmet } from 'react-helmet-async';
// sections
import { KYCView } from 'src/sections/kyc/view';

// ----------------------------------------------------------------------

export default function TrusteeKycPage() {
  return (
    <>
      <Helmet>
        <title> Trustee: KYC</title>
      </Helmet>

      <KYCView />
    </>
  );
}
