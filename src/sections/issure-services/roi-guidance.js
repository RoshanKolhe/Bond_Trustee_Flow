import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Step,
  Stepper,
  StepLabel,
  Dialog,
} from '@mui/material';
import RoiDetailCard from './roi-detail-card';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

export default function ROIGuidance() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const steps = ['1', '2', '3', '4', '5'];

  const handleStart = () => {
    // ✅ navigate using your defined route path
    navigate(paths.dashboard.issureservices.roifundform);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Stepper */}
          {/* <Grid item xs={12}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={null}
              sx={{
                justifyContent: 'center',
                '& .MuiStep-root': {
                  flex: '0 0 auto',
                  maxWidth: '100px',
                },
                '& .MuiStepLabel-root': {
                  padding: 0,
                },
              }}
            >
              {steps.map((_, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={(props) => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          border: `3px solid ${
                            props.active || props.completed ? '#ffa726' : '#ccc'
                          }`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: props.active || props.completed ? '#000' : '#000',
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {index + 1}
                      </Box>
                    )}
                  />
                </Step>
              ))}
            </Stepper>
          </Grid> */}

          {/* Main Card */}
          <Grid item xs={12}>
            {/* Illustration */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%', // take full width
              }}
            >
              <Box
                sx={{
                  maxWidth: 450,
                  height: 250,
                  mx: '10px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/assets/images/roi/roi-guidance.png"
                  alt="ROI Guidance"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                textAlign: 'center',
              }}
            >
              <Box component="span" sx={{ color: '#1976d2' }}>
                Bond 
              </Box>{' '}
              Estimation
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{ mb: 4, maxWidth: 400, mx: 'auto', textAlign: 'center' }}
            >
              Get a quick overview of your investment returns
            </Typography>

            {/* Buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 300,
                mx: 'auto',
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#1976d2',
                  textTransform: 'none',
                  fontSize: 16,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    boxShadow: 'none',
                  },
                }}
                onClick={handleStart}
              >
                Start
              </Button>

              <Button
                variant="text"
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontSize: 14,
                }}
                onClick={handleOpen}
              >
                View Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden', // hide default overflow
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <Box
          sx={{
            maxHeight: '90vh', // limit height to viewport
            overflowY: 'auto', // allow vertical scroll
            scrollbarWidth: 'none', // hide scrollbar (Firefox)
            '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar (Chrome, Edge)
          }}
        >
          <RoiDetailCard onClose={handleClose} />
        </Box>
      </Dialog>
    </>
  );
}
