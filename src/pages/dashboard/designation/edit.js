import { Helmet } from 'react-helmet-async';
import { DesignationEditView } from 'src/sections/designation/view';



// ----------------------------------------------------------------------

export default function DesignationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Designation Edit</title>
      </Helmet>
    <DesignationEditView/>
    </>
  );
}
