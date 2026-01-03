/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Card,
  Container,
  Grid,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { DatePicker } from '@mui/x-date-pickers';
import { enqueueSnackbar } from 'notistack';

export default function RegulatoryFiling({
  currentRegulatory,
  saveStepData,
  setActiveStepId,
  percent,
}) {
  const [sebiAuthority, setSebiAuthority] = useState('');
  const [inPrincipleAuthority, setInPrincipleAuthority] = useState('');
  const [rocAuthority, setRocAuthority] = useState('');

  const RegulatoryFilingSchema = Yup.object().shape({
    // PAS-4
    filingDatePas4: Yup.string().required('Filing Date is required'),
    fileNamePas4: Yup.string().required('File Name is required'),
    referenceNoPas4: Yup.string().required('Reference No is required'),
    approvalNoPas4: Yup.string().required('Approval Number is required'),
    pas4: Yup.mixed().required('Upload is required'),

    // Memorandum
    filingDateMemorandum: Yup.string().required('Filing Date is required'),
    fileNameMemorandum: Yup.string().required('File Name is required'),
    referenceNoMemorandum: Yup.string().required('Reference No is required'),
    informationMemorandum: Yup.mixed().required('Upload is required'),

    // SEBI/NHB/RBI Approvals
    sebiApprovalNo: Yup.string().required('Approval number is required'),
    sebiDate: Yup.date().nullable().required('Date is required'),
    sebi: Yup.mixed().required('Upload required'),

    // In-principle listing
    principleApprovalNo: Yup.string().required('Approval number is required'),
    principleDate: Yup.date().nullable().required('Date is required'),
    principle: Yup.mixed().required('Upload required'),

    // ROC
    rocApprovalNo: Yup.string().required('Approval number is required'),
    rocDate: Yup.date().nullable().required('Date is required'),
    roc: Yup.mixed().required('Upload required'),

    sebiAuthority: Yup.string().required('Authority required'),
    inPrincipleAuthority: Yup.string().required('Authority required'),
    rocAuthority: Yup.string().required('Authority required'),
  });

  const defaultValues = {
    filingDatePas4: '',
    fileNamePas4: '',
    referenceNoPas4: '',
    approvalNoPas4: '',
    pas4: null,

    filingDateMemorandum: '',
    fileNameMemorandum: '',
    referenceNoMemorandum: '',
    informationMemorandum: null,

    // SEBI Approvals
    sebiApprovalNo: '',
    sebiDate: null,
    sebiAuthority: '',
    inPrincipleAuthority: '',
    rocAuthority: '',

    sebi: null,

    // In-principle
    principleApprovalNo: '',
    principleDate: null,
    principle: null,

    // ROC
    rocApprovalNo: '',
    rocDate: null,
    roc: null,
  };

  const methods = useForm({
    resolver: yupResolver(RegulatoryFilingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    isSubmitting,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log('🟢 Regulatory Filing Submit Data:', data);

    // ---------------- CREATE GROUPED PAYLOAD HERE -------------------
    const payload = {
      pas4: {
        filingDatePas4: data.filingDatePas4,
        fileNamePas4: data.fileNamePas4,
        referenceNoPas4: data.referenceNoPas4,
        approvalNoPas4: data.approvalNoPas4,
        pas4: data.pas4,
      },

      memorandum: {
        filingDateMemorandum: data.filingDateMemorandum,
        fileNameMemorandum: data.fileNameMemorandum,
        referenceNoMemorandum: data.referenceNoMemorandum,
        informationMemorandum: data.informationMemorandum,
      },

      sebiApprovals: {
        sebiApprovalNo: data.sebiApprovalNo,
        sebiDate: data.sebiDate,
        sebiAuthority: data.sebiAuthority,
        sebi: data.sebi,
      },

      inPrinciple: {
        principleApprovalNo: data.principleApprovalNo,
        principleDate: data.principleDate,
        inPrincipleAuthority: data.inPrincipleAuthority,
        principle: data.principle,
      },

      rocApprovals: {
        rocApprovalNo: data.rocApprovalNo,
        rocDate: data.rocDate,
        rocAuthority: data.rocAuthority,
        roc: data.roc,
      },
    };
    // ---------------------------------------------------------------

    saveStepData({
      pas4: payload.pas4 || {},
      memorandum: payload.memorandum || {},
      sebiApprovals: payload.sebiApprovals || {},
      inPrinciple: payload.inPrinciple || {},
      rocApprovals: payload.rocApprovals || {},
    });

    setActiveStepId('isin_activation');
    enqueueSnackbar('Created Successfully!', { variant: 'success' });
  };

  const requiredFields = [
    'filingDatePas4',
    'fileNamePas4',
    'referenceNoPas4',
    'approvalNoPas4',
    'pas4',
    'filingDateMemorandum',
    'fileNameMemorandum',
    'referenceNoMemorandum',
    'informationMemorandum',
    'sebiApprovalNo',
    'sebiDate',
    'sebiAuthority',
    'sebi',
    'principleApprovalNo',
    'principleDate',
    'inPrincipleAuthority',
    'principle',
    'rocApprovalNo',
    'rocDate',
    'rocAuthority',
    'roc',
  ];

  const calculatePercentUsingYup = () => {
    let completed = 0;

    requiredFields.forEach((field) => {
      if (!errors[field]) {
        const value = methods.getValues(field);

        // Only count if field has actual value or valid file
        if (value && value !== '' && value !== null) {
          completed += 1;
        }
      }
    });

    const p = Math.round((completed / requiredFields.length) * 100);

    if (typeof percent === 'function') {
      percent(p);
    }
  };

  useEffect(() => {
    calculatePercentUsingYup();
  }, [methods.watch(), errors]);

  // SEBI
  useEffect(() => {
    setValue('sebiAuthority', sebiAuthority);
  }, [sebiAuthority]);

  // In-Principle
  useEffect(() => {
    setValue('inPrincipleAuthority', inPrincipleAuthority);
  }, [inPrincipleAuthority]);

  // ROC
  useEffect(() => {
    setValue('rocAuthority', rocAuthority);
  }, [rocAuthority]);
  useEffect(() => {
    if (!currentRegulatory) return;

    methods.reset({
      ...defaultValues,

      ...(currentRegulatory.pas4 || {}),
      ...(currentRegulatory.memorandum || {}),
      ...(currentRegulatory.sebiApprovals || {}),
      ...(currentRegulatory.inPrinciple || {}),
      ...(currentRegulatory.rocApprovals || {}),
    });

    setSebiAuthority(currentRegulatory.sebiApprovals?.sebiAuthority || '');
    setInPrincipleAuthority(currentRegulatory.inPrinciple?.inPrincipleAuthority || '');
    setRocAuthority(currentRegulatory.rocApprovals?.rocAuthority || '');

    percent?.(100);
  }, [currentRegulatory]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
            Regulatory Filings
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            Term Sheet:
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="sebiApprovalNo" label="Approval number" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="sebiDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Date"
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
            {/* <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '48px' }}>
                  Authority:
                </Typography>

                <ToggleButtonGroup
                  value={sebiAuthority}
                  exclusive
                  onChange={(e, val) => val && setSebiAuthority(val)}
                  sx={{
                    height: 48,
                    border: 'none !important', // remove outer group border
                    '&& .MuiToggleButton-root': {
                      border: '1px solid #000000ff !important',
                    },
                    '&& .MuiToggleButton-root.Mui-selected': {
                      border: '1px solid #1976d2 !important',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                    },
                  }}
                >
                  {['SEBI', 'NBH', 'RBI'].map((option) => (
                    <ToggleButton
                      key={option}
                      value={option.toLowerCase()}
                      sx={{
                        minWidth: 90,
                        height: 48,
                        fontSize: '16px',
                        px: 2,
                      }}
                    >
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Grid> */}
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="sebi"
                label="Term Sheet"
                icon="mdi:file-document-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
              <YupErrorMessage name="sebi" />
            </Grid>
          </Grid>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            PAS-4
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDatePas4" label="Filing Date" fullWidth />
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
                label="PAS-4"
                icon="mdi:file-document-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
              <YupErrorMessage name="pas4" />
            </Grid>
          </Grid>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            Prospectus/Information Memorandum
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="filingDateMemorandum" label="Filing Date" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFTextField name="fileNameMemorandum" label="File Name" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <RHFTextField name="referenceNoMemorandum" label="Reference No" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="informationMemorandum"
                label="Prospectus/Information Memorandum"
                icon="mdi:file-document-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
              <YupErrorMessage name="informationMemorandum" />
            </Grid>
          </Grid>
          {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            Registrar of Companies (ROC)
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="rocApprovalNo" label="Approval number" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="rocDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="ROC Date"
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
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '48px' }}>
                  Authority:
                </Typography>

                <ToggleButtonGroup
                  value={rocAuthority}
                  exclusive
                  onChange={(e, val) => val && setRocAuthority(val)}
                  sx={{
                    height: 48,
                    border: 'none !important', // remove outer group border
                    '&& .MuiToggleButton-root': {
                      border: '1px solid #000000ff !important',
                    },
                    '&& .MuiToggleButton-root.Mui-selected': {
                      border: '1px solid #1976d2 !important',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                    },
                  }}
                >
                  {['SEBI', 'NBH', 'RBI'].map((option) => (
                    <ToggleButton
                      key={option}
                      value={option.toLowerCase()}
                      sx={{
                        minWidth: 90,
                        height: 48,
                        fontSize: '16px',
                        px: 2,
                      }}
                    >
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <RHFFileUploadBox
                name="roc"
                label="Registrar of Companies (ROC)"
                icon="mdi:file-document-outline"
                maxSizeMB={5}
              />
              <YupErrorMessage name="roc" />
            </Grid>
          </Grid> */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Box>
        </Card>
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, mt: 5 }}>
            In-Principle Listing Approvals
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="principleApprovalNo" label="Approval number" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="principleDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Principle Date"
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
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '48px' }}>
                  Authority:
                </Typography>

                <ToggleButtonGroup
                  value={inPrincipleAuthority}
                  exclusive
                  onChange={(e, val) => val && setInPrincipleAuthority(val)}
                  sx={{
                    height: 48,
                    border: 'none !important', // remove outer group border
                    '&& .MuiToggleButton-root': {
                      border: '1px solid #000000ff !important',
                    },
                    '&& .MuiToggleButton-root.Mui-selected': {
                      border: '1px solid #1976d2 !important',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                    },
                  }}
                >
                  {['SEBI', 'NBH', 'RBI'].map((option) => (
                    <ToggleButton
                      key={option}
                      value={option.toLowerCase()}
                      sx={{
                        minWidth: 90,
                        height: 48,
                        fontSize: '16px',
                        px: 2,
                      }}
                    >
                      {option}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <RHFCustomFileUploadBox
                name="principle"
                label="In-Principle Listing Approvals"
                icon="mdi:file-document-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
              <YupErrorMessage name="principle" />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Box>
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
            {/* <Button variant="outlined" sx={{ color: '#000000' }}>
              Cancel
            </Button> */}
            <LoadingButton variant="contained" type="submit" sx={{ color: '#fff' }}>
              Next
            </LoadingButton>
          </Box>
        </Grid>
      </Container>
    </FormProvider>
  );
}
