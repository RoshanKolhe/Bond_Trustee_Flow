import { Helmet } from 'react-helmet-async';
// sections
import { JwtRegisterView } from 'src/sections/auth/jwt';
import JwtRegisterTrusteeByMobileView from 'src/sections/auth/jwt/jwt-register-phone-trustee-view';

// ----------------------------------------------------------------------

export default function RegisterPhonePage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterTrusteeByMobileView />
    </>
  );
}
