import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  Alert,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import FormProvider, {
  RHFCustomFileUploadBox,
  RHFTextField,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function InPrincipleApproval({
  currentData,
  saveStepData,
  percent,
  setActiveStepId,
}) {
  /* ---------------- SCHEMA ---------------- */
  const Schema = Yup.object().shape({
    exchange: Yup.string()
      .oneOf(['BSE', 'NSE'])
      .required('Stock exchange is required'),

    inPrincipleApprovalNo: Yup.string()
      .required('Approval number is required'),

    inPrincipleApprovalDate: Yup.date()
      .nullable()
      .required('Approval date is required'),

    inPrincipleApprovalLetter: Yup.mixed()
      .required('In-principle approval letter is required'),
  });

  /* ---------------- DEFAULT VALUES ---------------- */
  const defaultValues = {
    exchange: '',
    inPrincipleApprovalNo: '',
    inPrincipleApprovalDate: null,
    inPrincipleApprovalLetter: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset } = methods;

  const exchange = watch('exchange');
  const approvalNo = watch('inPrincipleApprovalNo');
  const approvalDate = watch('inPrincipleApprovalDate');
  const approvalLetter = watch('inPrincipleApprovalLetter');

  /* ---------------- PERCENT LOGIC (BINARY) ---------------- */
  useEffect(() => {
    percent?.(
      exchange && approvalNo && approvalDate && approvalLetter ? 100 : 0
    );
  }, [
    exchange,
    approvalNo,
    approvalDate,
    approvalLetter,
    percent,
  ]);

  /* ---------------- RESET ON EDIT ---------------- */
  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
        inPrincipleApprovalDate: currentData.inPrincipleApprovalDate
          ? new Date(currentData.inPrincipleApprovalDate)
          : null,
      });
      percent?.(100);
    }
  }, [currentData, reset, percent]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data) => {
    const payload = {
      exchange: data.exchange,
      inPrincipleApprovalNo: data.inPrincipleApprovalNo,
      inPrincipleApprovalDate: data.inPrincipleApprovalDate,
      inPrincipleApprovalLetter: data.inPrincipleApprovalLetter,
    };

    saveStepData?.(payload);
    percent?.(100);
    setActiveStepId?.('isin_activation');

    enqueueSnackbar('In-Principle Listing Approval saved successfully', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" color='primary' fontWeight='bold' mb={2}>
            In-Principle Listing Approval
          </Typography>

          {/* INFO MESSAGE */}
          <Alert severity="info" sx={{ mb: 3 }}>
            In-Principle Listing Approval is issued by the stock exchange
            (BSE or NSE) and is mandatory before ISIN activation and
            subscription opening.
          </Alert>

          <Grid container spacing={3}>
            {/* EXCHANGE */}
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="exchange"
                label="Stock Exchange"
                select
                fullWidth
              >
                <MenuItem value="BSE">BSE</MenuItem>
                <MenuItem value="NSE">NSE</MenuItem>
              </RHFTextField>
            </Grid>

            {/* APPROVAL NUMBER */}
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="inPrincipleApprovalNo"
                label="Approval Number"
                fullWidth
              />
            </Grid>

            {/* APPROVAL DATE */}
            <Grid item xs={12} md={4}>
              <Controller
                name="inPrincipleApprovalDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Approval Date"
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

            {/* APPROVAL LETTER */}
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="inPrincipleApprovalLetter"
                label="Upload In-Principle Approval Letter"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="inPrincipleApprovalLetter" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained">
              Save & Continue
            </LoadingButton>
          </Box>
        </Card>
      </Container>
    </FormProvider>
  );
}
