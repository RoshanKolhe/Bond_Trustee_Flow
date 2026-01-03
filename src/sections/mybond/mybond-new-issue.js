import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Button,
  Box,
} from '@mui/material';

import FormProvider, { RHFTextField, RHFSelect } from '../../components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useRouter } from 'src/routes/hook';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
// FIXED: Correct path

export default function MyBondNewIssue({ currentIssue, saveStepData, setActiveStepId, percent }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const Schema = Yup.object().shape({
    issueType: Yup.string().required('Required'),
    securityType: Yup.string().required('Required'),
    issueSize: Yup.string().required('Required'),
    tenureYears: Yup.string().required('Required'),
    couponRate: Yup.string().required('Required'),
    minimumInvestmentPrice: Yup.string().required('Required'),
    redemptionType: Yup.string().required('Required'),
    minimumPurchaseUnit: Yup.string().required('Required'),
    totalUnit: Yup.string().required('Required'),

    boardResolution: Yup.mixed().required('Board Resolution is required'),
    shareholderResolution: Yup.mixed().required('Shareholder Resolution is Required'),
    moa: Yup.mixed().required('(MoA)* Memorandum of Association Amended (if any) is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      issueType: currentIssue?.issueType || 'public',
      securityType: currentIssue?.securityType || 'secured',
      issueSize: currentIssue?.issueSize || '',
      tenureYears: currentIssue?.tenureYears || '',
      couponRate: currentIssue?.couponRate || '',
      minimumInvestmentPrice: currentIssue?.minimumInvestmentPrice || '',
      redemptionType: currentIssue?.redemptionType || '',
      minimumPurchaseUnit: currentIssue?.minimumPurchaseUnit || '',
      totalUnit: currentIssue?.totalUnit || '',

      boardResolution: null,
      shareholderResolution: null,
      moa: null,
    }),
    [currentIssue]
  );

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;
  console.log('values', watch());
  console.log('errors', errors);

  const requiredFields = [
    'issueType',
    'securityType',
    'issueSize',
    'tenureYears',
    'couponRate',
    'minimumInvestmentPrice',
    'redemptionType',
    'minimumPurchaseUnit',
    'totalUnit',
    'boardResolution',
    'shareholderResolution',
    'moa',
  ];

  const calculatePercent = (values) => {
    let filled = 0;

    requiredFields.forEach((field) => {
      const value = values[field];

      if (
        value !== null &&
        value !== undefined &&
        value !== ''
        // !(typeof value === 'object' && Object.keys(value || {}).length === 0) // for files
      ) {
        filled++;
      }
    });

    return Math.round((filled / requiredFields.length) * 100);
  };

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const p = calculatePercent(values);
      percent(p); // SEND percent to parent stepper
    });

    return () => subscription.unsubscribe();
  }, [methods.watch]);

  useEffect(() => {
    const initialPercent = calculatePercent(methods.getValues());
    percent(initialPercent);
  }, []);

  const issueType = watch('issueType');
  const securityType = watch('securityType');
  const issueSize = watch('issueSize');
  const totalUnit = watch('totalUnit');
  const minimumPurchaseUnit = watch('minimumPurchaseUnit');

  const handleIssueTypeChange = (e, value) => {
    if (value !== null) setValue('issueType', value);
  };

  const handleSecurityTypeChange = (e, value) => {
    if (value !== null) setValue('securityType', value);
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        issueType: formData.issueType,
        securityType: formData.securityType,
        issueSize: formData.issueSize,
        tenureYears: formData.tenureYears,
        couponRate: formData.couponRate,
        minimumInvestmentPrice: formData.minimumInvestmentPrice,
        redemptionType: formData.redemptionType,
        minimumPurchaseUnit: formData.minimumPurchaseUnit,
        totalUnit: formData.totalUnit,
      };

      console.log('payload', payload);

      // if (!currentIssue) {
      //   await axiosInstance.post('/bonds/new-issue', payload);
      // } else {
      //   await axiosInstance.patch(`/bonds/new-issue/${currentIssue.id}`, payload);
      // }

      saveStepData(formData);
      setActiveStepId('intermediaries');
      enqueueSnackbar(currentIssue ? 'Updated Successfully!' : 'Created Successfully!');
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message || 'Error saving issue', { variant: 'error' });
    }
  });

  useEffect(() => {
    if (currentIssue) {
      reset(currentIssue);
    }
  }, [currentIssue]);

  useEffect(() => {
    const size = parseFloat(issueSize);
    const units = parseFloat(totalUnit);
    const minUnit = parseFloat(minimumPurchaseUnit);

    if (size > 0 && units > 0 && minUnit > 0) {
      const oneUnitPrice = size / units;
      const minInvestment = oneUnitPrice * minUnit;

      setValue('minimumInvestmentPrice', minInvestment.toFixed(2), {
        shouldValidate: true,
      });
    } else {
      setValue('minimumInvestmentPrice', '', { shouldValidate: false });
    }
  }, [issueSize, totalUnit, minimumPurchaseUnit, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2, mb: '50px' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary">
            New Issue Setup
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Issue Type*
              </Typography>
              <ToggleButtonGroup
                value={issueType}
                exclusive
                onChange={handleIssueTypeChange}
                fullWidth
              >
                <ToggleButton value="public">Public</ToggleButton>
                <ToggleButton value="private">Private</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Tenure (Years)*
              </Typography>
              <RHFTextField
                name="tenureYears"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Redemption Type*
              </Typography>
              <RHFSelect name="redemptionType">
                <MenuItem value="">Select Redemption</MenuItem>
                <MenuItem value="bullet">Bullet</MenuItem>
                <MenuItem value="amortizing">Amortizing</MenuItem>
                <MenuItem value="callable">Callable</MenuItem>
              </RHFSelect>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Security Type*
              </Typography>
              <ToggleButtonGroup
                value={securityType}
                exclusive
                onChange={handleSecurityTypeChange}
                fullWidth
              >
                <ToggleButton value="secured">Secured</ToggleButton>
                <ToggleButton value="unsecured">Unsecured</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Coupon Rate(%)*
              </Typography>
              <RHFTextField
                name="couponRate"
                placeholder="e.g., 5.25"
                onInput={(e) => {
                  let value = e.target.value;

                  // Allow only digits and at most one decimal
                  value = value.replace(/[^0-9.]/g, '');

                  // Prevent more than one decimal point
                  const parts = value.split('.');
                  if (parts.length > 2) {
                    value = parts[0] + '.' + parts[1];
                  }

                  // Max 2 digits before decimal
                  if (parts[0].length > 2) {
                    parts[0] = parts[0].slice(0, 2);
                  }

                  // Max 2 digits after decimal
                  if (parts[1]?.length > 2) {
                    parts[1] = parts[1].slice(0, 2);
                  }

                  e.target.value = parts.join('.');
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} />

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Issue Size*
              </Typography>
              <RHFTextField
                name="issueSize"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Total Units
              </Typography>
              <RHFTextField
                name="totalUnit"
                placeholder="e.g., 5.25"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Minimum Purchase Unit
              </Typography>
              <RHFTextField
                name="minimumPurchaseUnit"
                placeholder="e.g., 5.25"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Minimum Investment Price
              </Typography>
              <RHFTextField name="minimumInvestmentPrice" placeholder="Auto calculated" disabled />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ p: 2, py: 5 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ pb: '20px' }}>
          Upload Documents
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RHFFileUploadBox name="boardResolution" label="Board Resolution* " />
            <YupErrorMessage name="boardResolution" />
          </Grid>

          <Grid item xs={12}>
            <RHFFileUploadBox name="shareholderResolution" label="Shareholder Resolution" />
            <YupErrorMessage name="shareholderResolution" />
          </Grid>

          <Grid item xs={12}>
            <RHFFileUploadBox
              name="moa"
              label="(MoA)* Memorandum of Association Amended (if any)"
            />
            <YupErrorMessage name="moa" />
          </Grid>
        </Grid>
      </Card>
      <Grid item xs={12}>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            m: 2,
          }}
        >
          <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </FormProvider>
  );
}
