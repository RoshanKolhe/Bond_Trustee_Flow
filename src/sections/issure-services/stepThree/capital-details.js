import React, { useEffect } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';

export default function CapitalDetails() {
  const { watch, setValue } = useFormContext();

  const shareCapital = watch('shareCapital');
  const reserveSurplus = watch('reserveSurplus');

  // ✅ Auto-calculate Net Worth
  useEffect(() => {
    const total =
      (parseFloat(shareCapital) || 0) + (parseFloat(reserveSurplus) || 0);
    setValue('netWorth', total.toFixed(2)); // keep 2 decimals
  }, [shareCapital, reserveSurplus, setValue]);

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="h3" fontWeight={600} color="#1874ED" mb={2}>
          Capital Details
        </Typography>

        <Grid container spacing={1} alignItems="center">
          {/* Share Capital */}
          <Grid item xs={12} md={3}>
            <RHFTextField
              name="shareCapital"
              label="Share Capital"
              fullWidth
              type="number"
            />
          </Grid>

          {/* + symbol */}
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              +
            </Typography>
          </Grid>

          {/* Reserve Surplus */}
          <Grid item xs={12} md={3}>
            <RHFTextField
              name="reserveSurplus"
              label="Reserve Surplus"
              fullWidth
              type="number"
            />
          </Grid>

          {/* = symbol */}
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              =
            </Typography>
          </Grid>

          {/* Net Worth (auto-calculated) */}
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="netWorth"
              label="Net Worth"
              fullWidth
              type="number"
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}
