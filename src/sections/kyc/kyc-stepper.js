// @mui
import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';

export default function KYCStepper({ percent = 0 }) {
  const steps = [
    { number: 1, lines: ['KYC', 'Verification'] },
    { number: 2, lines: ['Address', 'Information'] },
    { number: 3, lines: ['Company', 'Details'] },
    { number: 4, lines: ['Bank & Demat', 'Details'] },
    { number: 5, lines: ['Audit', 'Financial'] },
    { number: 6, lines: ['Signatory'] },
    { number: 7, lines: ['Review'] },
  ];

  // Color logic based on percent
  const getColorByPercent = (percent) => {
    if (percent <= 25) return { border: '#ef4444', text: '#ef4444' }; // red
    if (percent <= 50) return { border: '#f59e0b', text: '#f59e0b' }; // yellow
    if (percent <= 75) return { border: '#22c55e', text: '#22c55e' }; // green
    return { border: '#15803d', text: '#15803d' }; // dark green
  };

  const percentColor = getColorByPercent(percent);

  // Detect active step from URL
  const currentStep = window.location.pathname;

  const getActiveStep = () => {
    if (currentStep.includes('basic-info')) return 1;
    if (currentStep.includes('address-info')) return 2;
    if (currentStep.includes('company-details')) return 3;
    if (currentStep.includes('bank-details')) return 4;
    if (currentStep.includes('audited-financial')) return 5;
    if (currentStep.includes('signatories')) return 6;
    if (currentStep.includes('review-and-submit')) return 7;
    return 1;
  };

  const activeStep = getActiveStep();

  const getPath = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return '/kyc/basic-info';
      case 2:
        return '/kyc/address-info';
      case 3:
        return '/kyc/company-details';
      case 4:
        return '/kyc/bank-details';
      case 5:
        return '/kyc/audited-financial';
      case 6:
        return '/kyc/signatories';
      case 7:
        return '/kyc/review-and-submit';
      default:
        return null;
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent={{ xs: 'flex-start', md: 'space-between' }}
      spacing={{ xs: 2, sm: 3, md: 4 }}
      sx={{
        width: '100%',
        pt: 6,
        overflowX: { xs: 'auto', md: 'visible' },
        pb: { xs: 1, md: 0 },
      }}
    >
      {steps.map((step) => {
        const isActive = step.number === activeStep;

        // Only active step gets progress and color
        const colorToUse = isActive ? percentColor : { border: '#d1d5db', text: '#6b7280' }; // grey for inactive

        const to = getPath(step.number);

        return (
          <Stack
            key={step.number}
            alignItems="center"
            spacing={{ xs: 1, sm: 1.25 }}
            sx={{
              minWidth: { xs: 80, sm: 96 },
              textDecoration: 'none',
              cursor: to ? 'pointer' : 'default',
              flexShrink: 0,
            }}
            {...(to ? { component: RouterLink, to } : {})}
          >
            {/* ------ CIRCLE WITH PROGRESS ------ */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="16" stroke="#e5e7eb" strokeWidth="3" fill="none" />

                {/* Progress circle (only on active step) */}
                {isActive && (
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    stroke={colorToUse.border}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="100"
                    strokeDashoffset={100 - percent}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                )}
              </svg>

              {/* number in center */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                  }}
                >
                  {step.number}
                </Typography>
              </Box>
            </Box>

            {/* Step labels */}
            <Box sx={{ textAlign: 'center' }}>
              {step.lines.map((line, i) => (
                <Typography
                  key={i}
                  variant="caption"
                  sx={{
                    lineHeight: 1.2,
                    color: colorToUse.text,
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
