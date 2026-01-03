import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  Grid,
  Typography,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

/* ---------------- SCHEMA ---------------- */

const IsinSchema = Yup.object().shape({
  depository: Yup.string()
    .oneOf(['NSDL', 'CDSL'])
    .required('Depository is required'),

  isin: Yup.string()
    .required('ISIN is required')
    .matches(/^INE[0-9A-Z]{9}$/, 'Invalid ISIN format'),

  activationDate: Yup.date()
    .nullable()
    .required('Activation date is required'),

  isinLetter: Yup.mixed()
    .required('ISIN confirmation letter is required'),
});

/* ---------------- COMPONENT ---------------- */

export default function IsinActivationFinalization({
  currentIsin,
  saveStepData,
  setPercent,
  setProgress,
}) {
  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    depository: '',
    isin: '',
    activationDate: null,
    isinLetter: null,
  };

  const methods = useForm({
    resolver: yupResolver(IsinSchema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  const watched = watch([
    'depository',
    'isin',
    'activationDate',
    'isinLetter',
  ]);

  /* ---------------- PERCENT LOGIC (BINARY) ---------------- */
  useEffect(() => {
    const done =
      watched[0] &&
      watched[1] &&
      watched[2] &&
      watched[3];

    setPercent?.(done ? 100 : 0);
    setProgress?.(done);
  }, [watched, setPercent, setProgress]);

  /* ---------------- RESET ON EDIT ---------------- */
  useEffect(() => {
    if (currentIsin && Object.keys(currentIsin).length > 0) {
      reset({
        ...defaultValues,
        ...currentIsin,
        activationDate: currentIsin.activationDate
          ? new Date(currentIsin.activationDate)
          : null,
      });

      setPercent?.(100);
      setProgress?.(true);
    }
  }, [currentIsin, reset, setPercent, setProgress]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.({
      depository: data.depository,
      isin: data.isin,
      activationDate: data.activationDate,
      isinLetter: data.isinLetter,
    });

    setPercent?.(100);
    setProgress?.(true);

    enqueueSnackbar('ISIN Activation saved successfully', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, mb: 3 }}>
       <Typography variant="h5" color='primary'  fontWeight= 'bold'  mb={2}>
          ISIN Activation & Finalization
        </Typography>

        {/* INFO MESSAGE */}
        <Alert severity="info" sx={{ mb: 3 }}>
          ISIN is issued by depositories (NSDL or CDSL) and is mandatory before
          allotment and settlement of bonds. Please upload the official ISIN
          confirmation letter issued by the depository.
        </Alert>

        <Grid container spacing={3}>
          {/* DEPOSITORY */}
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="depository"
              label="Depository"
              select
              fullWidth
            >
              <MenuItem value="NSDL">NSDL</MenuItem>
              <MenuItem value="CDSL">CDSL</MenuItem>
            </RHFTextField>
          </Grid>

          {/* ISIN */}
          <Grid item xs={12} md={4}>
            <RHFTextField
              name="isin"
              label="ISIN"
              fullWidth
            />
          </Grid>

          {/* ACTIVATION DATE */}
          <Grid item xs={12} md={4}>
            <Controller
              name="activationDate"
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Activation Date"
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

          {/* ISIN LETTER */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="isinLetter"
              label="Upload ISIN Confirmation Letter"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="isinLetter" />
          </Grid>

          {/* ACTION */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
              >
                Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}
