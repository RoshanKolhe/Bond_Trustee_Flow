import { Box, Card, Grid, Typography, Alert } from '@mui/material';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

/* ---------------- SCHEMA ---------------- */

const executeDocumentSchema = Yup.object().shape({
  debentureTrusteeDeed: Yup.mixed()
    .required('Debenture Trustee Deed is required'),

  securityDocument: Yup.mixed()
    .required('Security Document is required'),

  escrowAgreement: Yup.mixed()
    .required('Escrow Agreement is required'),
});

/* ---------------- COMPONENT ---------------- */

export default function ExecuteDocument({
  currentExecuteDocument,
  saveStepData,
  setActiveStepId,
  percent,
}) {
  const defaultValues = {
    debentureTrusteeDeed: null,
    securityDocument: null,
    escrowAgreement: null,
  };

  const methods = useForm({
    resolver: yupResolver(executeDocumentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  /* ---------------- PERCENT (BINARY) ---------------- */
  useEffect(() => {
    const done =
      values.debentureTrusteeDeed &&
      values.securityDocument &&
      values.escrowAgreement;

    percent?.(done ? 100 : 0);
  }, [
    values.debentureTrusteeDeed,
    values.securityDocument,
    values.escrowAgreement,
    percent,
  ]);

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (currentExecuteDocument && Object.keys(currentExecuteDocument).length > 0) {
      reset({
        ...defaultValues,
        ...currentExecuteDocument,
      });

      percent?.(100);
    }
  }, [currentExecuteDocument, reset, percent]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    saveStepData?.(data);

    enqueueSnackbar('Executed documents saved successfully', {
      variant: 'success',
    });

    setActiveStepId?.('launch_issue');
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, mb: 4 }}>
         <Typography variant="h5" color='primary'  fontWeight= 'bold'  mb={2}>
          Execute Documents
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          These documents are executed after ISIN activation and must be
          signed before opening the issue for subscription.
        </Alert>

        <Grid container spacing={3}>
          {/* Trustee Deed */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="debentureTrusteeDeed"
              label="Upload Debenture Trustee Deed"
              icon="mdi:file-document-outline"
            />
            <YupErrorMessage name="debentureTrusteeDeed" />
          </Grid>

          {/* Security Document */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="securityDocument"
              label="Upload Security Document"
              icon="mdi:file-document-outline"
            />
            <YupErrorMessage name="securityDocument" />
          </Grid>

          {/* Escrow Agreement */}
          <Grid item xs={12}>
            <RHFCustomFileUploadBox
              name="escrowAgreement"
              label="Upload Escrow Agreement"
              icon="mdi:file-document-outline"
            />
            <YupErrorMessage name="escrowAgreement" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Next
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}
