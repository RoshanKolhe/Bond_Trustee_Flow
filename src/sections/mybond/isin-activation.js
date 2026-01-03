import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import FormProvider, { RHFTextField, RHFUploadRectangle } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { enqueueSnackbar } from 'notistack';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

export default function IsinActivation({ currentIsin, saveStepData, setActiveStepId, percent }) {
  const IsinSchema = Yup.object().shape({
    ISIN: Yup.string()
      .required('ISIN is required')
      .matches(/^INE[0-9A-Z]{10}$/, 'Enter a valid ISIN (e.g., INE1234567890)'),

    activationDate: Yup.string().required('Activation Date is required'),

    isinLetter: Yup.mixed()
      .required('Upload is required')
      .test('fileSize', 'Max size 5MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF allowed', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.type === 'application/pdf';
      }),

    creditConfirmationDate: Yup.string().required('Credit confirmation date is required'),

    creditProof: Yup.mixed()
      .required('Upload is required')
      .test('fileSize', 'Max size 5MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF allowed', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.type === 'application/pdf';
      }),

    remark: Yup.string().nullable(),

    actionType: Yup.string().required('Please select an Action'),
  });

  const defaultValues = {
    ISIN: '',
    activationDate: '',
    isinLetter: null,
    creditConfirmationDate: '',
    remark: '',
    creditProof: null,
    actionType: 'activate isin', // default first tab
  };

  const methods = useForm({
    resolver: yupResolver(IsinSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, control, watch } = methods;

  const currentAction = watch('actionType');

  const requiredFields = [
    'ISIN',
    'activationDate',
    'isinLetter',
    'creditConfirmationDate',
    'creditProof',
    'actionType',
  ];

  const calculatePercent = () => {
    let completed = 0;

    requiredFields.forEach((field) => {
      const value = methods.getValues(field);

      if (value && value !== '' && value !== null) {
        completed += 1;
      }
    });

    const p = Math.round((completed / requiredFields.length) * 100);

    if (typeof percent === 'function') {
      percent(p);
    }
  };

  useEffect(() => {
    calculatePercent();
  }, [watch()]);

  const handleFileDrop = (fieldName, acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setValue(fieldName, newFile, { shouldValidate: true });
  };

  const handleFileRemove = (fieldName) => {
    setValue(fieldName, null, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    console.log('ISIN DATA:', data);
    saveStepData('isin_activation', { ...data });
    setActiveStepId('execute_document');
    enqueueSnackbar('Created Successfully!', { variant: 'success' });
  };

  useEffect(() => {
    if (!currentIsin || Object.keys(currentIsin).length === 0) return;

    const normalized = {
      ...defaultValues,
      ...currentIsin,

      activationDate: currentIsin.activationDate
        ? currentIsin.activationDate instanceof Date
          ? currentIsin.activationDate
          : new Date(currentIsin.activationDate)
        : '',

      creditConfirmationDate: currentIsin.creditConfirmationDate
        ? currentIsin.creditConfirmationDate instanceof Date
          ? currentIsin.creditConfirmationDate
          : new Date(currentIsin.creditConfirmationDate)
        : '',

      actionType: currentIsin.actionType || 'activate isin',
    };

    methods.reset(normalized);

    // Restore files with preview
    if (currentIsin.isinLetter && typeof currentIsin.isinLetter === 'object') {
      setValue(
        'isinLetter',
        Object.assign(currentIsin.isinLetter, {
          preview: currentIsin.isinLetter.preview || URL.createObjectURL(currentIsin.isinLetter),
        })
      );
    }

    if (currentIsin.creditProof && typeof currentIsin.creditProof === 'object') {
      setValue(
        'creditProof',
        Object.assign(currentIsin.creditProof, {
          preview: currentIsin.creditProof.preview || URL.createObjectURL(currentIsin.creditProof),
        })
      );
    }

    percent?.(100);
  }, [currentIsin]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600 }}>
                ISIN Activation & Finalization
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Required Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="ISIN" label="ISIN*" placeholder="e.g., INE1234567890" fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              {/* <RHFTextField
                name="activationDate"
                label="Activation Date*"
                placeholder="16 Nov 2025"
                fullWidth
              /> */}
              <Controller
                name="activationDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Activation Date*"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography sx={{ pb: 2 }}>Upload ISIN Confirmation Letter*</Typography>
              {/* <RHFUploadRectangle
                name="isinLetter"
                multiple={false}
                helperText="Upload ISIN Confirmation Letter*"
                onDrop={(files) => handleFileDrop('isinLetter', files)}
                onDelete={() => handleFileRemove('isinLetter')}
              /> */}
              <RHFFileUploadBox
                name="isinLetter"
                label="Upload ISIN Confirmation Letter*"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="isinLetter" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                Demat Credit Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Credit to Investor Demat Completed
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="creditConfirmationDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Credit Confirmation Date*"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="remark"
                label="Remark"
                placeholder="All investors Credit Successfully."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={{ pb: 2 }}>Upload Credit Confirmation Proof*</Typography>
              {/* <RHFUploadRectangle
                name="creditProof"
                multiple={false}
                helperText="Upload Credit Confirmation Proof*"
                onDrop={(files) => handleFileDrop('creditProof', files)}
                onDelete={() => handleFileRemove('creditProof')}
              /> */}
              <RHFFileUploadBox
                name="creditProof"
                label="Upload Credit Confirmation Proof*"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="creditProof" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Actions
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Tabs
                value={currentAction}
                onChange={(e, val) => setValue('actionType', val)}
                TabIndicatorProps={{ sx: { display: 'none' } }}
                sx={{
                  minHeight: 48,
                  height: 48,
                  borderBottom: 'none', // remove default bottom border
                  '& .MuiTabs-flexContainer': {
                    border: 'none',
                  },
                }}
              >
                {['Activate ISIN', 'Verify Demat Credit', 'Generate Final Allotment Summary'].map(
                  (option, idx) => (
                    <Tab
                      key={option}
                      label={option}
                      value={option.toLowerCase()}
                      sx={{
                        minHeight: 48,
                        height: 48,
                        px: 3,
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: 0,

                        // Remove double-border between tabs
                        marginLeft: idx === 0 ? 0 : '-1px',

                        '&.Mui-selected': {
                          backgroundColor: '#2E6CF6',
                          color: '#fff',
                        },
                      }}
                    />
                  )
                )}
              </Tabs>
            </Grid>

            {/* <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                <LoadingButton type="submit" variant="contained">
                  Save
                </LoadingButton>
              </Stack>
            </Grid> */}
          </Grid>
        </Card>
        <Grid item xs={12}>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <LoadingButton variant="contained" type="submit" sx={{ color: '#fff' }}>
              Next
            </LoadingButton>
          </Box>
        </Grid>
      </Container>
    </FormProvider>
  );
}
