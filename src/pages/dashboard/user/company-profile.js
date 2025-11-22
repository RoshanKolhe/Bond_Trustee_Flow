import { Helmet } from 'react-helmet-async';
// sections
import { CompanyProfileView } from 'src/sections/company/view';


// ----------------------------------------------------------------------

export default function CompanyProfilePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Profile</title>
      </Helmet>

      <CompanyProfileView />
    </>
  );
}
