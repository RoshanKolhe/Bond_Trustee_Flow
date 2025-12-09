import { Helmet } from 'react-helmet-async';
// sections
import KYCBankDetails from 'src/sections/account/profile-bank-details';



// ----------------------------------------------------------------------

export default function TrusteeProfliesDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Details </title>
      </Helmet>

      {/* <UserProfileView /> */}
     <KYCBankDetails />
    </>
  );
}
