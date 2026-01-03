import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  Alert,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function TrusteeDueDiligence({
  currentData,
  saveStepData,
  percent,
  setActiveStepId,
}) {
  const Schema = Yup.object().shape({
    trusteeApproved: Yup.boolean()
      .oneOf([true], 'Trustee approval is required to proceed')
      .required(),
    trusteeSupportingDocument: Yup.mixed().nullable(),
    trusteeRemarks: Yup.string().nullable(),
  });

  const defaultValues = {
    trusteeApproved: false,
    trusteeSupportingDocument: null,
    trusteeRemarks: '',
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, watch, reset } = methods;

  const trusteeApproved = watch('trusteeApproved');

  useEffect(() => {
    percent?.(trusteeApproved ? 100 : 0);
  }, [trusteeApproved, percent]);

  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
      });
      percent?.(100);
    }
  }, [currentData, reset, percent]);

  const onSubmit = (data) => {
    const payload = {
      trusteeDueDiligenceStatus: 'approved',
      trusteeApproved: true,
      trusteeSupportingDocument: data.trusteeSupportingDocument,
      trusteeRemarks: data.trusteeRemarks,
    };

    saveStepData?.(payload);
    percent?.(100);
    setActiveStepId?.('principle_listing_approval');

    enqueueSnackbar('Trustee review completed successfully', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color='primary' fontWeight='bold' mb={2}>
            Trustee Review & Due Diligence
          </Typography>

          {/* INFO MESSAGE */}
          <Alert severity="info" sx={{ mb: 3 }}>
            The debenture trustee has reviewed the Information Memorandum,
            financials, collateral details, and regulatory disclosures. This
            step confirms completion of trustee due diligence and is mandatory
            before proceeding to listing approval.
          </Alert>

          <Grid container spacing={3}>
            {/* TRUSTEE APPROVAL */}
            <Grid item xs={12}>
              <Controller
                name="trusteeApproved"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                        />
                      }
                      label="I confirm that the debenture trustee has completed due diligence and approved the issue"
                    />
                    {fieldState.error && (
                      <Typography variant="caption" color="error">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </>
                )}
              />
              <YupErrorMessage name="trusteeApproved" />
            </Grid>

            {/* OPTIONAL SUPPORTING DOCUMENT */}
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="trusteeSupportingDocument"
                label="Upload Trustee Confirmation (Optional)"
                icon="mdi:file-document-outline"
              />
            </Grid>

            {/* OPTIONAL REMARKS */}
            <Grid item xs={12}>
              <RHFTextField
                name="trusteeRemarks"
                label="Trustee Remarks (Optional)"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={!trusteeApproved}
            >
              Confirm & Continue
            </LoadingButton>
          </Box>
        </Card>
      </Container>
    </FormProvider>
  );
}
