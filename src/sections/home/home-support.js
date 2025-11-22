import { Link } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function HomeSupport() {
  return (
    <Container sx={{ py: { xs: 6, md: 15 } }}>
      <Box
        sx={{
          border: '1px dashed #637381',
          borderRadius: '20px',
          p: { xs: 3, md: 5 },
          textAlign: 'center',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Need Assistance with Registration?
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 300, color: '#637381' }}>
            Our support team is available Monday to Friday, 9 AM - 6 PM IST
          </Typography>
          
          <Box sx={{ width: '100%' }}>
            <Typography variant="h5" component="div" sx={{ color: '#637381', mb: { xs: 1, md: 0 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Box component="span">Email:</Box>
              <Link href="mailto:support@bondissuerpro.com" color="primary" sx={{ textDecoration: 'none' }}>
                support@bondissuerpro.com
              </Link>
            </Typography>
            <Typography variant="h5" component="div" sx={{ color: '#637381', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Box component="span">Phone:</Box>
              <Link href="tel:+912212345678" color="primary" sx={{ textDecoration: 'none' }}>
                +91-22-1234-5678
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
