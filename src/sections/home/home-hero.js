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

const StyledHero = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  background: 'linear-gradient(180deg, #DFDDFF 0%, #C5DAFF 100%)',
  padding: theme.spacing(7),
  overflow: 'hidden',
  [theme.breakpoints.only('xs')]: {
    padding: theme.spacing(2),
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2.5),
  [theme.breakpoints.only('md')]: {
    padding: theme.spacing(0, 5),
  },
}));

export default function HomeHero() {
  return (
    <Container sx={{ pt: { xs: 10, md: 15 } }}>
      <StyledHero>
        <Grid container spacing={5} alignItems="center">
          <Grid xs={12} md={8}>
            <MotionContainer>
              <StyledContent>
                <m.div variants={varFade().inUp}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 3,
                    }}
                  >
                    Welcome to BondIssuer Pro
                  </Typography>
                </m.div>

                <m.div variants={varFade().inUp}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 400,
                      color: 'text.secondary',
                      mb: 5,
                    }}
                  >
                    Register your company in minutes and access global capital markets with
                    AI-powered insights
                  </Typography>
                </m.div>

                <m.div variants={varFade().inUp}>
                  <Stack direction={{md:"row", xs:"column"}} spacing={2}>
                    <Button
                      component={RouterLink}
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: '#000000',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        px: 4,
                        '&:hover': {
                          bgcolor: '#333333',
                        },
                        '& .MuiButton-label': {
                          typography: 'h5',
                          fontWeight: 500,
                          textTransform: 'none',
                          letterSpacing: 0,
                        },
                      }}
                    >
                      Start Registration
                    </Button>
                    <Button
                      component={RouterLink}
                      variant="outlined"
                      size="large"
                      sx={{
                        bgcolor: '#FFFFFF',
                        color: '#000000',
                        borderRadius: '10px',
                        px: 4,
                        '&:hover': {
                          bgcolor: '#F5F5F5',
                          color: '#000000',
                        },
                        '& .MuiButton-label': {
                          typography: 'h5',
                          fontWeight: 500,
                          textTransform: 'none',
                          letterSpacing: 0,
                        },
                      }}
                    >
                      Learn More About Us
                    </Button>
                  </Stack>
                </m.div>
              </StyledContent>
            </MotionContainer>
          </Grid>

          <Grid xs={12} md={4}>
            <m.div 
              variants={varFade().inUp}
              style={{
                display: 'flex',
                justifyContent: { md:'flex-end', xs:'center' },
                width: '100%',
                height: '100%',
              }}
            >
              <Box
                component="img"
                src="/assets/images/home/hero/hand_shake.png"
                alt="Hand shake"
                sx={{
                  maxWidth: '100%',
                  height: { md:'300px', xs:'auto' },
                  objectFit: 'contain',
                  display: 'block',
                  mt: { xs: 5, md: 0 },
                }}
              />
            </m.div>
          </Grid>
        </Grid>
      </StyledHero>
    </Container>
  );
}
