/* eslint-disable react/no-unescaped-entities */
import { m } from 'framer-motion';
import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const StyledTimelineContent = styled(Box)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: theme.spacing(3),
  //   borderRadius: theme.shape.borderRadius * 2,
  //   boxShadow: theme.shadows[2],
  position: 'relative',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(2),
  },
}));

const BackgroundGradient = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: 'radial-gradient(circle at center, #e6fff2 0%, #e8f8ff 40%, #ffffff 100%)',
}));

// ----------------------------------------------------------------------

const STEPS = [
  {
    id: 1,
    title: 'Login / Sign Up',
    subtitle: 'Create Your Issuer Account',
    description: `Get started by registering your business as a verified bond issuer. Enter your basic details — company name, registration number, and contact information — to set up your issuer dashboard.
    
Already registered? Log in with your credentials to continue your bond issuance journey.`,
    icon: 'mdi:account-plus',
    color: '#E7000B',
  },
  {
    id: 2,
    title: 'KYC Completion',
    subtitle: 'Complete Issuer KYC Verification',
    description: `Submit essential identification and business verification documents to ensure compliance and credibility. This includes your CIN, PAN, board resolution, and authorized signatory details.
    
Our secure system validates your documents quickly so you can move to the next step seamlessly.`,
    icon: 'mdi:shield-check',
    color: '#2f89fc',
  },
  {
    id: 3,
    title: 'Document Uploading',
    subtitle: 'Upload Regulatory & Financial Documents',
    description: `Provide the required regulatory and supporting documents such as audited financial statements, credit rating reports, and trust deeds. Each file is securely stored and verified to maintain transparency.
    
You can save your progress and resume later — no need to upload everything at once.`,
    icon: 'mdi:file-upload',
    color: '#ff9f1c',
  },
  {
    id: 4,
    title: 'AI ROI Suggestions',
    subtitle: 'Get AI-Powered ROI & Credit Insights',
    description: `Our intelligent algorithm analyzes your company's financial health, debt-equity ratio, and DSCR to suggest an optimal ROI range and credit strength rating.
    
Get a preview of potential investor returns and improve your issuance structure before launching.`,
    icon: 'mdi:brain',
    color: '#6c63ff',
  },
  {
    id: 5,
    title: 'Bond Issuance',
    subtitle: 'Launch & Manage Your Bond Issue',
    description: `Once documents and financials are verified, you can launch your bond issue directly from the dashboard. Set subscription windows, publish the prospectus, and monitor investor participation in real time.
    
Your bond is now live — listed, compliant, and open to investors.`,
    icon: 'mdi:bank',
    color: '#00c48c',
  },
];

// ----------------------------------------------------------------------

export default function IssuerProcessTimeline() {
  const theme = useTheme();

  return (
    <Container sx={{ position: 'relative', py: { xs: 10, md: 15 } }}>
      {/* <BackgroundGradient /> */}

      <Stack spacing={2} sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1c1c1e' }}>
          Issuer Onboarding Journey
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Follow these five simple steps to list and launch your bond successfully.
        </Typography>
      </Stack>

      <Timeline
        position="alternate"
        sx={{
          direction: 'rtl',
          m: 0,
          p: 0,
          '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 },
        }}
      >
        {STEPS.map((step, index) => (
          <TimelineItem key={step.id}>
            <TimelineOppositeContent sx={{ display: { xs: 'none', md: 'block' } }} />
            <TimelineSeparator>
              <TimelineDot sx={{ bgcolor: step.color, boxShadow: 'none', p: 2 }}>
                <Iconify icon={step.icon} width={28} color="#fff" />
              </TimelineDot>
              {index < STEPS.length - 1 && (
                <TimelineConnector sx={{ bgcolor: alpha(step.color, 0.4), width: 3 }} />
              )}
            </TimelineSeparator>
            <TimelineContent sx={{ py: 2, px: { xs: 0, md: 2 }, textAlign: 'center' }}>
              <StyledTimelineContent>
                <Typography variant="h6" sx={{ fontWeight: 600, color: step.color, mb: 0.5 }}>
                  {step.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                  {step.subtitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}
                >
                  {step.description}
                </Typography>
              </StyledTimelineContent>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}
