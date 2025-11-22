import { Helmet } from 'react-helmet-async';
import { DesignationListView } from 'src/sections/designation/view';



// ----------------------------------------------------------------------
export default function DesignationListPage()
{
  return(
    <>
    <Helmet>
      <title>Dashboard: Designation List</title>
    </Helmet>
    <DesignationListView />
    </>
  )
}