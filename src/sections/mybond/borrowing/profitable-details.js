

import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
export default function ProfitabilityDetails({ currentProfitable, onSave, setCurrentFormCount }) {


  const profitableSchema = Yup.object().shape({
    netProfit: Yup.number()
      .typeError('Net Profit must be a number')
      .required('Net Profit is required'),
    ebidta: Yup.number()
      .typeError('EBIDTA must be a number')
      .required('EBIDTA amount is required'),
  });

  const defaultValues = useMemo(
    () => ({
      netProfit: currentProfitable?.netProfit || '',
      ebidta: currentProfitable?.ebidta || '',

    }),
    [currentProfitable]
  );

  const methods = useForm({
    resolver: yupResolver(profitableSchema),
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
    if (currentProfitable) reset(defaultValues);
  }, [currentProfitable, reset, defaultValues]);

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
            Profitability Details
          </Typography>

          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="netProfit"
                label="Net Profit"
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="ebidta"
                label="Enter EBIDTA Amount"
                fullWidth
                type="number"
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


ProfitabilityDetails.propTypes = {
  setActiveStep: PropTypes.func,
  currentProfitable: PropTypes.object,
  onSave: PropTypes.func,
  setCurrentFormCount: PropTypes.func
};