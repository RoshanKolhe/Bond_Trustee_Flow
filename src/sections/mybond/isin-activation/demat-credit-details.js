import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { enqueueSnackbar } from 'notistack';

/* ---------------- YUP SCHEMA ---------------- */

export default function DematCreditDetails({
  currentDemat,
  saveStepData,
  setPercent,
  setProgress,
}) {
  const DematSchema = Yup.object().shape({
    creditConfirmationDate: Yup.date().nullable().required('Credit date is required'),
    creditProof: Yup.mixed().required('Credit proof is required'),
    remark: Yup.string().nullable(),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    creditConfirmationDate: null,
    creditProof: null,
    remark: '',
  };
  const methods = useForm({
    resolver: yupResolver(DematSchema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  const watched = watch(['creditConfirmationDate', 'creditProof']);

  useEffect(() => {
    let completed = 0;
    if (watched[0]) completed++;
    if (watched[1]) completed++;

    const pct = Math.round((completed / 2) * 100);
    setPercent?.(pct);
    setProgress?.(pct === 100);
  }, [watched, setPercent, setProgress]);

  useEffect(() => {
    if (currentDemat && Object.keys(currentDemat).length > 0) {
      reset({
        ...defaultValues,
        ...currentDemat,
        creditConfirmationDate: currentDemat.creditConfirmationDate
          ? new Date(currentDemat.creditConfirmationDate)
          : null,
      });
    }
  }, [currentDemat, reset]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.(data);
    setPercent?.(100);
    setProgress?.(true);
    enqueueSnackbar('Demat credit details saved', { variant: 'success' });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight={600}>
              Demat Credit Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="creditConfirmationDate"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  {...field}
                  label="Credit Confirmation Date*"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField name="remark" label="Remark" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="creditProof"
              label="Upload Credit Confirmation Proof*"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="creditProof" />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained">
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
