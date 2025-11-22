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
import { Icon } from '@iconify/react';
import { useTheme, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

const BOND_TYPES = [
  {
    key: 'fast-issuance',
    icon: '/assets/images/home/why-choose-issuerpro/fast-issurance.svg',
    title: 'Fast Issuance',
    description: 'Launch bonds in days, not months',
  },
  {
    key: 'secure-platform',
    icon: '/assets/images/home/why-choose-issuerpro/secure-platform.svg',
    title: 'Secure Platform',
    description: 'Bank-grade security and compliance',
  },
  {
    key: 'ai-suggestions',
    icon: '/assets/images/home/why-choose-issuerpro/ai-suggestions.svg',
    title: 'AI Suggestions',
    description: 'Get AI suggestions based on your portfolio',
  },
  {
    key: 'market-analysis',
    icon: '/assets/images/home/why-choose-issuerpro/market-analysis.svg',
    title: 'Market Analysis',
    description: 'Real-time insights and reporting',
  },
];

const StyledSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0, 0, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0, 0, 0),
  },
}));

export default function HomeWhyChooseIssuerPro() {
  const theme = useTheme();
  return (
    <StyledSection>
      <Container>
        <Grid container spacing={5} alignItems="center">
          <Grid xs={12}>
            <MotionContainer>
              <m.div variants={varFade().inUp}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 300,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/home/why-choose-issuerpro/arrow.svg"
                    alt="Arrow"
                    sx={{
                      width: { xs: 40, md: 60 },
                      height: 'auto',
                    }}
                  />
                  Why Choose BondIssuer Pro
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    color: 'text.secondary',
                    pl: { md: 9.5, xs: 7 },
                  }}
                >
                  Your journey from registration to successful bond issuance
                </Typography>
              </m.div>
            </MotionContainer>
          </Grid>
        </Grid>
        <Grid container spacing={{ xs: 2.5, sm: 3.5, md: 4.5 }} sx={{ mt: { xs: 0, md: 0 } }}>
          {BOND_TYPES.map((item) => {
            const isHighlighted = Boolean(item.highlighted);
            return (
              <Grid key={item.key} item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: { xs: 3, md: 3 },
                    py: { xs: 5, md: 8 },
                    borderRadius: 2,
                    // Use transparent border so layout doesn't shift; appears on hover
                    border: '1px solid',
                    borderColor: isHighlighted ? theme.palette.warning.main : 'transparent',
                    bgcolor: isHighlighted
                      ? alpha(theme.palette.grey[500], 0.06)
                      : 'background.paper',
                    boxShadow: isHighlighted
                      ? `0 8px 22px ${alpha(theme.palette.primary.main, 0.18)}`
                      : 'none',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.warning.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      boxShadow: `0 8px 22px ${alpha(theme.palette.primary.main, 0.18)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 1.5,
                      display: 'grid',
                      placeItems: 'center',
                      color: theme.palette.primary.main,
                      mb: 2.5,
                    }}
                  >
                    <img src={item.icon} width={100} height={100} alt="" />
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 500 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="subtitle1" color="#637381" sx={{ mt: 1.2, fontWeight: 300 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </StyledSection>
  );
}
