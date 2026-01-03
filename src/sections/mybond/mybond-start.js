import React, { useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Stack } from '@mui/material';

import Iconify from 'src/components/iconify';
import MybondStepper from './stepper';
import { paths } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import axiosInstance from 'src/utils/axios';

const features = [
  { icon: 'mdi:file-document-edit-outline', text: 'Easy Compliance' },
  { icon: 'mdi:lock-check-outline', text: 'Secure & Transparent' },
  { icon: 'mdi:trending-up', text: 'Faster Fundraising' },
  { icon: 'mdi:cash-check', text: 'Lowest Cost Funding' },
];

export default function MyBondStart() {
  const navigate = useNavigate();
  const [showStepper, setShowStepper] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/bonds-pre-issue/new-application');


      if (response.data.success) {
        navigate(paths.dashboard.mybond.bondIssue(response.data?.application?.id));
      }
    } catch (error) {
      console.error('error while starting bond application :', error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', py: 5 }}>
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h2" sx={{ lineHeight: 1.3, fontWeight: 700 }}>
                Issue Bonds, Grow your Business
              </Typography>

              <Typography variant="h4" color="primary" sx={{ mb: 4 }}>
                Fuel business expansion with low cost bond funding
              </Typography>

              <Stack spacing={2} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Stack key={index} direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Iconify icon={feature.icon} width={22} />
                    </Box>

                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: { md: '20px', xs: '14px' } }}
                    >
                      {feature.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                loading={isLoading}
                variant="contained"
                size="large"
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: 6,
                  py: 1.5,
                  mb: 2,
                }}
                onClick={handleStart}
              >
                Start Issuing Bonds
              </Button>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="mdi:check-circle" width={20} color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Trusted by issuers across industries
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Right Content - Image */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src="/assets/images/mybond/start-full-image.png"
                alt="Bond Illustration"
                sx={{
                  width: '100%',
                  maxWidth: 700,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
