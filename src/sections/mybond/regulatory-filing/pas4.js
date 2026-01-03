import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function PAS4({ currentData, saveStepData, setPercent, setProgress }) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    filingDatePas4: Yup.string().required('Filing Date is required'),
    fileNamePas4: Yup.string().required('File Name is required'),
    referenceNoPas4: Yup.string().required('Reference No is required'),
    approvalNoPas4: Yup.string().required('Approval Number is required'),
    pas4: Yup.mixed().required('PAS-4 upload is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    filingDatePas4: '',
    fileNamePas4: '',
    referenceNoPas4: '',
    approvalNoPas4: '',
    pas4: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, watch, reset } = methods;

  const filingDatePas4 = watch('filingDatePas4');
  const fileNamePas4 = watch('fileNamePas4');
  const referenceNoPas4 = watch('referenceNoPas4');
  const approvalNoPas4 = watch('approvalNoPas4');
  const pas4 = watch('pas4');

  /* ---------------- PERCENT LOGIC ---------------- */
  useEffect(() => {
    let completed = 0;

    if (filingDatePas4) completed++;
    if (fileNamePas4) completed++;
    if (referenceNoPas4) completed++;
    if (approvalNoPas4) completed++;
    if (pas4) completed++;

    const pct = Math.round((completed / 5) * 35);

    setPercent?.(pct);
    setProgress?.(pct === 35);
  }, [
    filingDatePas4,
    fileNamePas4,
    referenceNoPas4,
    approvalNoPas4,
    pas4,
    setPercent,
    setProgress,
  ]);

  /* ---------------- RESET ON EDIT ---------------- */
  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
      });

      setPercent?.(20);
      setProgress?.(true);
    }
  }, [currentData, reset, setPercent, setProgress]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    const payload = {
      filingDatePas4: data.filingDatePas4,
      fileNamePas4: data.fileNamePas4,
      referenceNoPas4: data.referenceNoPas4,
      approvalNoPas4: data.approvalNoPas4,
      pas4: data.pas4,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('PAS-4 saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color='primary' fontWeight='bold' mb={2}>
            PAS-4
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDatePas4" label="Filing Date" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="fileNamePas4" label="File Name" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="referenceNoPas4" label="Reference No" fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <RHFTextField name="approvalNoPas4" label="Approval Number" fullWidth />
            </Grid>

            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="pas4"
                label="Upload PAS-4"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="pas4" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained">
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Container>
    </FormProvider>
  );
}
