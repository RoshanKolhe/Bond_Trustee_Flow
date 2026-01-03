import React, { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useParams } from 'src/routes/hook';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import axiosInstance from 'src/utils/axios';

export default function CapitalDetails({
  setPercent,
  setProgress,
}) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'capital_details');
  const [capitalDetailsData, setCapitalDetailsData] = useState(null);

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
      shareCapital: capitalDetailsData?.shareCapital || '',
      reserveSurplus: capitalDetailsData?.reserveSurplus || '',
      netWorth: capitalDetailsData?.netWorth || '',
    }),
    [capitalDetailsData]
  );

  const methods = useForm({
    resolver: yupResolver(capitalSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { setValue, watch, handleSubmit, reset } = methods;

  const shareCapital = watch('shareCapital');
  const reserveSurplus = watch('reserveSurplus');

  useEffect(() => {
    const total = (parseFloat(shareCapital) || 0) + (parseFloat(reserveSurplus) || 0);
    setValue('netWorth', total.toFixed(2));
  }, [shareCapital, reserveSurplus, setValue]);

  useEffect(() => {
    let completed = 0;

    const isShareValid = shareCapital !== null && shareCapital !== '' && !isNaN(shareCapital);

    const isReserveValid =
      reserveSurplus !== null && reserveSurplus !== '' && !isNaN(reserveSurplus);

    if (isShareValid) completed++;
    if (isReserveValid) completed++;

    const percentVal = (completed / 2) * 50;

    setPercent?.(percentVal);
  }, [shareCapital, reserveSurplus, setPercent]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axiosInstance.patch(`/bonds-pre-issue/capital-details/${applicationId}`, data);
      if (response.data.success) {
        setProgress(true);
        enqueueSnackbar('Capital details saved', { variant: 'success' });
      }
    } catch (error) {
      const message =
        error?.error?.message || 'Error while updating capital details in bond estimations :';
      enqueueSnackbar(message, { variant: 'error' });
      console.error(error);
    }
  });

  useEffect(() => {
    if (stepData && !stepDataLoading) {
      setCapitalDetailsData(stepData);
      setProgress(true);
    }
  }, [stepData, stepDataLoading]);

  useEffect(() => {
    if (capitalDetailsData) {
      reset(defaultValues);
    }
  }, [capitalDetailsData, reset, defaultValues]);

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
        <Typography variant="h5"  fontWeight="bold" color="primary" mb={2}>
            Capital Details
          </Typography>

          <Grid container spacing={1} alignItems="center">
            {/* Share Capital */}
            <Grid item xs={12} md={3}>
              <RHFTextField name="shareCapital" label="Share Capital" fullWidth type="number" />
            </Grid>

            {/* + symbol */}
            <Grid item xs={12} md={1} textAlign="center">
              <Typography variant="h6" color="text.secondary">
                +
              </Typography>
            </Grid>

            {/* Reserve Surplus */}
            <Grid item xs={12} md={3}>
              <RHFTextField name="reserveSurplus" label="Reserve Surplus" fullWidth type="number" />
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
              <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
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
  saveStepData: PropTypes.func,
  setCurrentFormCount: PropTypes.func,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
