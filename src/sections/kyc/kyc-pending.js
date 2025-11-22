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
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  border: '2px solid #E17100',
  paddingRight: theme.spacing(2),
  borderRadius: '24px',
  '& .icon-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#FFF8E6',
    '& svg': {
      width: 24,
      height: 24,
      color: '#E17100',
    },
  },
  '& .status-text': {
    color: '#E17100',
    fontWeight: 500,
    fontSize: '1.0rem',
  },
}));

export default function KYCPending() {
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
          backgroundColor: '#FFFBEB',
        }}
      >
        <MotionContainer>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <m.div variants={varFade().inUp}>
              <Box
                component="img"
                src="\assets\images\kyc\kyc-pending.svg"
                alt="KYC Success"
                sx={{
                  width: 520,
                  height: 520,
                  mb: 3,
                  display: 'block',
                  mx: 'auto',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <StyledIcon>
                  <div className="icon-container">
                    <Icon icon="mdi:clock-time-four-outline" width="100%" height="100%" />
                  </div>
                  <div className="status-text">Pending Compliance Review</div>
                </StyledIcon>
              </div>
            </m.div>
          </Box>

          <m.div variants={varFade().inUp}>
            <Typography variant="h5" sx={{ mb: 1, color: '#000' }}>
              Our compliance team will review your application within{' '}
              <Box component="span" sx={{ pl: 0.2, color: 'error.main' }}>
                2-3 business days
              </Box>
              . You'll receive email updates on your application status.
            </Typography>
          </m.div>
        </MotionContainer>
      </Box>
      <Box sx={{ textAlign: 'center', py: 6, maxWidth: 400, mx: 'auto' }}>
        <m.div variants={varFade().inUp}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 1,
              p: 2,
              mb: 2,
              textAlign: 'center',
              border: '0.8px solid #ABABAB',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 'medium' }}>
              Next Step:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: 'success.main' }}>
                •
              </Box>
              <span>You'll receive an email confirmation shortly</span>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Box component="span" sx={{ mr: 1, color: 'success.main' }}>
                •
              </Box>
              <span>Our team may contact you for additional documents</span>
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box component="span" sx={{ mr: 1, color: 'success.main' }}>
                •
              </Box>
              <span>Once approved, you can start issuing bonds</span>
            </Typography>
          </Box>
        </m.div>
      </Box>
    </Container>
  );
}
