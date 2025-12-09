import { Helmet } from 'react-helmet-async';
import KYCBankDetails from 'src/sections/account/profile-bank-details';
// sections


// ----------------------------------------------------------------------

export default function TrusteeProfileNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trustee Profiles New</title>
      </Helmet>

      <KYCBankDetails />
    </>
  );
}
