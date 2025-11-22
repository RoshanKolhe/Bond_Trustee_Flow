import { Helmet } from 'react-helmet-async';
// sections
import KYCPending from 'src/sections/kyc/kyc-pending';

// ----------------------------------------------------------------------

export default function KYCPendingPage() {
  return (
    <>
      <Helmet>
        <title> Issuer: KYC Pending</title>
      </Helmet>

      <KYCPending />
    </>
  );
}
