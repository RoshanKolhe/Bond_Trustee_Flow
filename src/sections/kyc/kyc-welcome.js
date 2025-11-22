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

// ----------------------------------------------------------------------

export default function HomeHero() {
  return (
    <Container sx={{ pt: { xs: 10, md: 15 } }}>
      <Typography variant="h3" sx={{ mb: 5 }}>
        KYC Verification
      </Typography>
    </Container>
  );
}
