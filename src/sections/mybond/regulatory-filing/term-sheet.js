import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useEffect } from 'react';

export default function TermSheet({ currentData, saveStepData, setPercent, setProgress }) {
  const Schema = Yup.object().shape({
    sebiApprovalNo: Yup.string().required('Approval number is required'),
    sebiDate: Yup.date().nullable().required('Date is required'),
    sebi: Yup.mixed().required('Term Sheet upload is required'),
  });

  const defaultValues = {
    sebiApprovalNo: '',
    sebiDate: null,
    sebi: null,
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const { handleSubmit, control, watch, reset, getValues } = methods;

  const sebiApprovalNo = watch('sebiApprovalNo');
  const sebiDate = watch('sebiDate');
  const sebi = watch('sebi');

  useEffect(() => {
    let completed = 0;

    if (sebiApprovalNo) completed++;
    if (sebiDate) completed++;
    if (sebi) completed++;

    const pct = Math.round((completed / 3) * 30);

    setPercent?.(pct);
    setProgress?.(pct === 30);
  }, [sebiApprovalNo, sebiDate, sebi, setPercent, setProgress]);

  useEffect(() => {
    if (currentData && Object.keys(currentData).length > 0) {
      reset({
        ...defaultValues,
        ...currentData,
        sebiDate: currentData.sebiDate ? new Date(currentData.sebiDate) : null,
      });

      // if backend already has full data
      setPercent?.(20);
      setProgress?.(true);
    }
  }, [currentData, reset, setPercent, setProgress]);

  const onSubmit = (data) => {
    const payload = {
      sebiApprovalNo: data.sebiApprovalNo,
      sebiDate: data.sebiDate,
      sebi: data.sebi,
    };

    saveStepData?.(payload);
    setPercent?.(20);
    setProgress?.(true);

    enqueueSnackbar('Term Sheet saved successfully!', {
      variant: 'success',
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
           <Typography variant="h5" color='primary'  fontWeight= 'bold'  mb={2}>
            Term Sheet
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <RHFTextField name="sebiApprovalNo" label="Approval Number" fullWidth />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="sebiDate"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Date"
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

            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="sebi"
                label="Upload Term Sheet"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name="sebi" />
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
