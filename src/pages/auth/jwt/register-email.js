import { Helmet } from 'react-helmet-async';
// sections
import JwtRegisterTrusteeByEmailView from 'src/sections/auth/jwt/jwt-register-email-trustee-view';

// ----------------------------------------------------------------------

export default function RegisterEmailPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtRegisterTrusteeByEmailView />
    </>
  );
}
