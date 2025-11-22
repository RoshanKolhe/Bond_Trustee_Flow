import { Helmet } from 'react-helmet-async';
import { DesignationCreateView } from 'src/sections/designation/view';



// ----------------------------------------------------------------------

export default function DesignationNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Designation New</title>
      </Helmet>
      <DesignationCreateView />
    </> 
  );
}
