import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

export default function CapitalDetails({ currentCapitals, onSave, setCurrentFormCount }) {





  const capitalSchema = Yup.object().shape({
    shareCapital: Yup.number()
      .typeError('Share Capital must be a number')
      .min(0, 'Cannot be negative')
      .required('Share Capital is required'),

    reserveSurplus: Yup.number()
      .typeError('Reserve Surplus must be a number')
      .min(0, 'Cannot be negative')
      .required('Reserve Surplus is required'),

    netWorth: Yup.number()
      .typeError('Net Worth must be a number')
      .required('Net Worth is required'),
  });

  const defaultValues = useMemo(
    () => ({
      shareCapital: currentCapitals?.shareCapital || null,
      reserveSurplus: currentCapitals?.reserveSurplus || null,
      netWorth: currentCapitals?.netWorth || null,

    }),
    [currentCapitals]
  );

  const methods = useForm({
    resolver: yupResolver(capitalSchema),
    defaultValues,
    mode: 'onSubmit',
  });


  const { control, setValue, watch, handleSubmit, reset } = methods;

  const shareCapital = watch('shareCapital');
  const reserveSurplus = watch('reserveSurplus');

  useEffect(() => {
    const total =
      (parseFloat(shareCapital) || 0) + (parseFloat(reserveSurplus) || 0);
    setValue('netWorth', total.toFixed(2)); // keep 2 decimals
  }, [shareCapital, reserveSurplus, setValue]);




  useEffect(() => {
    if (currentCapitals) reset(defaultValues);
  }, [currentCapitals, reset, defaultValues]);

  const onSubmit = (data) => {
    console.log('✅ Full Form Data:', data);
    onSave(data);
    setCurrentFormCount(2);
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
          <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                sx={{ color: '#fff' }}
              >
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </FormProvider>
  );
}

CapitalDetails.propTypes = {
  setActiveStep: PropTypes.func,
  currentCapitals: PropTypes.object,
  onSave: PropTypes.func,
  setCurrentFormCount: PropTypes.func
};
