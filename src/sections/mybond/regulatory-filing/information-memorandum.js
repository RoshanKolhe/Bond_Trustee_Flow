import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function InformationMemorandum({
  currentData,
  saveStepData,
  setPercent,
  setProgress,
}) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    filingDateMemorandum: Yup.string().required('Filing Date is required'),
    fileNameMemorandum: Yup.string().required('File Name is required'),
    referenceNoMemorandum: Yup.string().required('Reference No is required'),
    informationMemorandum: Yup.mixed().required('Upload is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    filingDateMemorandum: '',
    fileNameMemorandum: '',
    referenceNoMemorandum: '',
    informationMemorandum: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, watch, reset } = methods;

  const filingDateMemorandum = watch('filingDateMemorandum');
  const fileNameMemorandum = watch('fileNameMemorandum');
  const referenceNoMemorandum = watch('referenceNoMemorandum');
  const informationMemorandum = watch('informationMemorandum');

  /* ---------------- PERCENT LOGIC ---------------- */
  useEffect(() => {
    let completed = 0;

    if (filingDateMemorandum) completed++;
    if (fileNameMemorandum) completed++;
    if (referenceNoMemorandum) completed++;
    if (informationMemorandum) completed++;

    const pct = Math.round((completed / 4) * 35);

    setPercent?.(pct);
    setProgress?.(pct === 35);
  }, [
    filingDateMemorandum,
    fileNameMemorandum,
    referenceNoMemorandum,
    informationMemorandum,
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
      filingDateMemorandum: data.filingDateMemorandum,
      fileNameMemorandum: data.fileNameMemorandum,
      referenceNoMemorandum: data.referenceNoMemorandum,
      informationMemorandum: data.informationMemorandum,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('Information Memorandum saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color='primary'  fontWeight= 'bold'  mb={2}>
            Prospectus / Information Memorandum
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="filingDateMemorandum"
                label="Filing Date"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="fileNameMemorandum"
                label="File Name"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="referenceNoMemorandum"
                label="Reference No"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="informationMemorandum"
                label="Upload Prospectus / Information Memorandum"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="informationMemorandum" />
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
