import { Helmet } from 'react-helmet-async';
// sections
import KYCSucessfull from 'src/sections/kyc/kyc-sucessfull';

// ----------------------------------------------------------------------

export default function KYCSucessfullPage() {
  return (
    <>
      <Helmet>
        <title> Issuer: KYC Sucess</title>
      </Helmet>

      <KYCSucessfull />
    </>
  );
}
