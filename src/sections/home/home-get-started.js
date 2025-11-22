import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
// components

// ----------------------------------------------------------------------

export default function HomeGetStarted() {
  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 15 } }}>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #AFCBFF 0%, #8979FF 100%)',
          borderRadius: '6px',
          p: { xs: 3, md: 5 },
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 500 }}>
          Ready to Get Started?
        </Typography>
        
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 400}}>
          Complete your registration today and join 500+ issuers raising capital on our platform
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              fontWeight: 500,
              px: 4,
              py: 1.5,
              borderRadius: '3px',
            }}
          >
            Start Registration
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'black',
              borderColor: 'black',
              borderWidth: '1px',
              fontWeight: 500,
              px: 4,
              py: 1.5,
              borderRadius: '3px',
              '&:hover': {
                borderColor: 'black',
                borderWidth: '1px',
                borderRadius: '3px',
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              },
            }}
          >
            Learn More About Us
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
