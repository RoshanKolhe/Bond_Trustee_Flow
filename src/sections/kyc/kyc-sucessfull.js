import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: '0 auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: 100,
  height: 100,
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.success.main, 0.1),
//   border: `solid 2px ${theme.palette.success.main}`,
  '& svg': {
    width: 60,
    height: 60,
    color: theme.palette.success.main,
  },
}));

export default function KYCSucessfull() {
  return (
    <Container maxWidth="md" sx={{ position: 'relative', py: { xs: 2, sm: 4, md: 5 } }}>
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 1200,
          mx: 'auto',
          p: { xs: 3, sm: 5 },
          borderRadius: 2,
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          boxShadow: '0px 0px 10.8px 0px #0000005E',
          backgroundColor: 'background.paper',
        }}
      >
        <MotionContainer>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <m.div variants={varFade().inUp}>
              <Box
                component="img"
                src="\assets\images\kyc\kyc-success.svg"
                alt="KYC Success"
                sx={{
                  width: 520,
                  height: 520,
                  mb: 3,
                  display: 'block',
                  mx: 'auto',
                }}
              />
              <StyledIcon>
                <Icon icon="mdi:check-circle" width="100%" height="100%" />
              </StyledIcon>
            </m.div>
          </Box>

          <m.div variants={varFade().inUp}>
            <Typography variant="h5" sx={{ mb: 1, color: '#FFAB00' }}>
              Congratulations!
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
              Registration & KYC Successful!
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
              Your corporate Bond issuer application has been submitted for compliance review
            </Typography>
          </m.div>

        </MotionContainer>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <m.div variants={varFade().inUp}>
          <Button
            component={RouterLink}
            href={paths.dashboard.root}
            size="large"
            variant="contained"
          >
            Continue
          </Button>
        </m.div>
      </Box>
    </Container>
  );
}
