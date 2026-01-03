/* eslint-disable no-useless-escape */
import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import PropTypes from 'prop-types';

export default function FinancialDetails({
  currentDetails,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const MainSchema = Yup.object().shape({
    debtEquityRatio: Yup.string().required('Equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Return on equity is required'),
    returnOnAssets: Yup.string().required('Return on Assets (ROA) is required'),
    debtServiceCoverageRatio: Yup.string().required('DSCR is required'),
  });

  const randomRatio = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

  const defaultValues = useMemo(
    () => ({
      debtEquityRatio: currentDetails?.debtEquityRatio || randomRatio(0.2, 3),
      currentRatio: currentDetails?.currentRatio || randomRatio(0.5, 2.5),
      netWorth: currentDetails?.netWorth || randomRatio(1, 500), // crores/lakhs depending on unit
      quickRatio: currentDetails?.quickRatio || randomRatio(0.3, 2),
      returnOnEquity: currentDetails?.returnOnEquity || randomRatio(5, 25), // %
      returnOnAssets: currentDetails?.returnOnAssets || randomRatio(2, 15), // %
      debtServiceCoverageRatio: currentDetails?.debtServiceCoverageRatio || randomRatio(0.5, 2),
    }),
    [currentDetails]
  );

  const methods = useForm({
    resolver: yupResolver(MainSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const requiredFields = [
    'debtEquityRatio',
    'currentRatio',
    'netWorth',
    'quickRatio',
    'returnOnEquity',
    'returnOnAssets',
    'debtServiceCoverageRatio',
  ];

  const calculatePercent = () => {
    let completed = 0;

    requiredFields.forEach((field) => {
      if (values[field]) completed++;
    });

    const percentVal = (completed / requiredFields.length) * 50; // 50% weight
    setPercent?.(percentVal);
  };

  useEffect(() => {
    calculatePercent();
  }, [values]);

  useEffect(() => {
    if (currentDetails && Object.keys(currentDetails).length > 0) {
      reset(defaultValues);

      setProgress?.(true);
      setPercent?.(50);
    }
  }, [currentDetails, reset, defaultValues, setProgress, setPercent]);

  return (
    <FormProvider methods={methods} >
      <Box display="flex" flexDirection="column" gap={3}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" color="primary" fontWeight='bold'>
            Financial Ratios
          </Typography>
          <Typography variant="body2" mb={3}>
            Provide your companies key financial ratios to assess financial health
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="debtEquityRatio" label="Debt-Equity Ratio (DER)" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="currentRatio" label="Current Ratio" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="netWorth" label="Net Worth" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="quickRatio" label="Quick Ratio" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="returnOnEquity" label="Return on Equity (ROE)" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="returnOnAssets" label="Return on Assets (ROA)" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="debtServiceCoverageRatio"
                label="Debt Service Coverage Ratio (DSCR)"
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </FormProvider>
  );
}

FinancialDetails.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object,
  onSave: PropTypes.func,
  percent: PropTypes.func,
};
