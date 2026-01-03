import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
export default function ProfitabilityDetails({
  currentDetails,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const profitableSchema = Yup.object().shape({
    netProfit: Yup.number()
      .typeError('Net Profit must be a number')
      .required('Net Profit is required'),
    ebidta: Yup.number().typeError('EBIDTA must be a number').required('EBIDTA amount is required'),
  });

  const defaultValues = useMemo(
    () => ({
      netProfit: currentDetails?.netProfit || '',
      ebidta: currentDetails?.EBIDTA || '',
    }),
    [currentDetails]
  );

  const methods = useForm({
    resolver: yupResolver(profitableSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const REQUIRED_FIELDS = ['netProfit', 'ebidta'];

  // 🔹 SAME percent logic pattern (50% weight)
  const calculatePercent = () => {
    let completed = 0;

    REQUIRED_FIELDS.forEach((field) => {
      if (values[field]) completed++;
    });

    const percentVal = (completed / REQUIRED_FIELDS.length) * 50;
    setPercent?.(percentVal);
  };

  useEffect(() => {
    calculatePercent();
  }, [values]);

  // 🔹 Restore on refresh / edit
  useEffect(() => {
    if (currentDetails && Object.keys(currentDetails).length > 0) {
      reset(defaultValues);
      setProgress?.(true);
      setPercent?.(50);
    }
  }, [currentDetails, reset, defaultValues, setProgress, setPercent]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form Submitted Data:', data);
      saveStepData(data);
      setProgress?.(true);
      setPercent?.(50);
      enqueueSnackbar('Fund position saved (Mocked)', { variant: 'success' });
    } catch (error) {
      console.error('Mocked submit error:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h5" color="primary" fontWeight='bold' mb={2}>
            Profitability Details
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <RHFTextField name="netProfit" label="Net Profit" fullWidth type="number" />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="ebidta" label="Enter EBIDTA Amount" fullWidth type="number" />
            </Grid>
          </Grid>

          {/* <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
                Save
              </LoadingButton>
            </Grid>
          </Grid> */}
        </Card>
      </Box>
    </FormProvider>
  );
}

ProfitabilityDetails.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object,
  onSave: PropTypes.func,
  setCurrentFormCount: PropTypes.func,
};
