import { Helmet } from 'react-helmet-async';
// sections
import KYCSignatories from 'src/sections/kyc/kyc-signatories';

// ----------------------------------------------------------------------

export default function KYCSignatoriesPage() {
  return (
    <>
      <Helmet>
        <title> Issuer: KYC Signatories</title>
      </Helmet>

      <KYCSignatories />
    </>
  );
}
