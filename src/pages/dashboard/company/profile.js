import { Helmet } from 'react-helmet-async';
// sections
import { CompanyAccountView } from 'src/sections/company-account/view';


// ----------------------------------------------------------------------

export default function UserProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Profile</title>
      </Helmet>

      {/* <UserProfileView /> */}
     <CompanyAccountView/>
    </>
  );
}
