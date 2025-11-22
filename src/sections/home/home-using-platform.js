import { m } from 'framer-motion';
import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify'; // optional if you use icons

// ----------------------------------------------------------------------

const StyledRoot = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(180deg, #CDE0FF 0%, #E1DCFF 100%)',
  borderRadius: 30,
  padding: theme.spacing(6, 4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
  },
  '& .MuiCardContent-root': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(3),
  },
  '& .card-content-wrapper': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  '& .card-link': {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

const steps = [
  {
    number: '1',
    title: 'Complete Your Onboarding',
    description:
      'After approval, complete the 7-step issuer onboarding flow covering company details, financial information, compliance verification, and bond structuring preferences.',
    linkText: 'Preview Onboarding Flow →',
  },
  {
    number: '2',
    title: 'Create Your First Bond',
    description:
      'Use our intuitive bond creation wizard to structure your debt instrument. Define terms, coupon rates, maturity dates, and investor eligibility criteria.',
    linkText: 'See Bond Creation Form →',
  },
  {
    number: '3',
    title: 'Launch & Manage Issues',
    description:
      'Configure subscription windows, publish prospectus, and manage the entire lifecycle from launch to allotment and exchange listing.',
    linkText: 'Explore Issuer Management →',
  },
  {
    number: '4',
    title: 'Monitor & Report',
    description:
      'Access real-time market analytics, AI-powered portfolio insights, and comprehensive reporting tools to track bond performance and investor sentiment.',
    linkText: 'View Market Analysis →',
  },
];

// ----------------------------------------------------------------------

export default function HomeUsingPlatform() {
  return (
    <Container sx={{ pt: { xs: 10, md: 15 } }}>
      <StyledRoot>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Using the Platform
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
          A quick guide to get you started after registration
        </Typography>

        <Grid container spacing={3}>
          {steps.map((step) => (
            <Grid key={step.number} item xs={12} sm={6}>
              <StyledCard component={m.div} whileHover={{ scale: 1.02 }}>
                <CardContent>
                  <div className="card-content-wrapper">
                    <div>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            flexShrink: 0,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: '#1E5EFF',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {step.number}
                        </Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {step.description}
                      </Typography>
                    </div>
                    <Typography variant="body2" className="card-link" sx={{ color: '#1E5EFF', fontWeight: 600 }}>
                      {step.linkText}
                    </Typography>
                  </div>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledRoot>
    </Container>
  );
}
