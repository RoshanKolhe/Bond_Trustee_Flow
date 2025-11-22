import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function KYCHero() {
  return (
    <Container maxWidth={false} sx={{ position: 'relative', py: { xs: 6, sm: 8, md: 10 } }}>
      <Box
        component="img"
        src="/assets/images/kyc/kyc-top-right.svg"
        display={{ xs: 'none', md: 'block' }}
        alt="KYC"
        sx={{ position: 'absolute', top: 0, right: 0 }}
      />

      <Box
        component="img"
        src="/assets/images/kyc/kyc-bottom-left.svg"
        display={{ xs: 'none', md: 'block' }}
        alt="KYC"
        sx={{ position: 'absolute', bottom: 0, left: 0 }}
      />

      <MotionContainer>
        <Stack
          spacing={{ xs: 2.5, sm: 3 }}
          alignItems="center"
          justifyContent="center"
          sx={{ height: 1, textAlign: 'center', px: { xs: 2, sm: 3 } }}
        >
          <m.div variants={varFade().inUp}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 500,
                color: '#2C2889',
                textAlign: 'center',
              }}
            >
              My Name is Bond
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Box
              component="img"
              src="/assets/images/kyc/kyc-hero-img.png"
              alt="KYC Illustration"
              sx={{ width: 460, maxWidth: '100%' }}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                maxWidth: 460,
              }}
            >
              Securely manage your company’s compliance from one dashboard
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <Box
                component="img"
                src="/assets/images/kyc/kyc-guard.svg"
                alt="KYC Illustration"
                sx={{ width: 26, height: 26, maxWidth: '100%' }}
              />
              <Typography
                variant="h5"
                sx={{
                  maxWidth: 460,
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#1A2D42',
                }}
              >
                Get CIN Verified
              </Typography>
            </Stack>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Button
              component={RouterLink}
              to={paths.kycBasicInfo}
              size="large"
              variant="contained"
              sx={{
                background: 'linear-gradient(180deg, #2B7EED 0%, #184887 100%)',
                color: '#FFFFFF',
                '&:hover': {
                  background: 'linear-gradient(180deg, #2B7EED 0%, #184887 100%)',
                  boxShadow: '0 0 0 0 rgba(0,0,0,0)',
                },
              }}
            >
              Get Started
            </Button>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 560,
                fontWeight: 500,
                textAlign: 'center',
                color: '#1A2D42',
              }}
            >
              By continuing you agree to our terms
            </Typography>
          </m.div>
        </Stack>
      </MotionContainer>
    </Container>
  );
}
