// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';

// icons
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

// ----------------------------------------------------------------------

export default function KYCFooter() {
  return (
    <Container sx={{ position: 'relative', py: { xs: 3, sm: 4, md: 6 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={{ xs: 2.5, md: 3 }}
      >
        {/* Left: Security note */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ maxWidth: { md: 560 } }}>
          <img
            src="/assets/images/kyc/kyc-basic-info/kyc-guard.svg"
            height={24}
            width={24}
            alt="kyc-guard"
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Your data is secure and confidential.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All documents you upload are protected using advanced encryption standards and stored
              on secure servers, ensuring complete privacy and compliance with regulatory
              requirements.
            </Typography>
          </Box>
        </Stack>

        {/* Divider removed on mobile */}
        <Divider flexItem sx={{ display: 'none', width: '100%' }} />

        {/* Right: Need help */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ maxWidth: { md: 560 } }}>
          <img src="/assets/images/kyc/kyc-basic-info/kyc-chat.svg" alt="kyc-chat" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Need Help?
            </Typography>
            <Link
              href="tel:1800XXXXXXX"
              underline="hover"
              sx={{ display: { xs: 'block', md: 'inline' } }}
            >
              Call 1800-XXX-XXXX
            </Link>
            <Typography
              component="span"
              sx={{ mx: 0.5, display: { xs: 'none', md: 'inline' } }}
              color="text.disabled"
            >
              |
            </Typography>
            <Link
              href="mailto:support@domain.com"
              underline="hover"
              sx={{ display: { xs: 'block', md: 'inline' }, mt: { xs: 0.5, md: 0 } }}
            >
              Email support@domain.com
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
