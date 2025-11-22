import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';

// MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Card from '@mui/material/Card';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { countries } from 'src/assets/data';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { fData } from 'src/utils/format-number';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';

// developer-provided uploaded file path (used as initial avatarUrl)
const UPLOADED_DEV_FILE = '/mnt/data/Untitled document.docx';

// ----------------------------------------------------------------------

export default function CompanyAccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [hasExistingData, setHasExistingData] = useState(false);
  const [panFileToken, setPanFileToken] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState(null);

  // ------------------------------ validation --------------------------------
  const NewUserSchema = Yup.object().shape({
    cin: Yup.string().required('CIN is required'),
    companyName: Yup.string().required('Company Name is required'),
    gstin: Yup.string().required('GSTIN is required'),
    dateOfIncorporation: Yup.date().nullable().required('Date of Incorporation is required'),
    msmeUdyamRegistrationNo: Yup.string().required('MSME Udyam Registration No is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    entityType: Yup.string().required('Entity Type is required'),
    panFile: Yup.mixed().when('hasExistingData', {
      is: false,
      then: (schema) => schema.required('Pan File is required'),
      otherwise: (schema) => schema.nullable(),
    }),
    panNumber: Yup.string().required('Pan Number is required'),
    dateOfBirth: Yup.date().nullable().required('Date of Birth is required'),
    panHoldersName: Yup.string().required('Pan Holders Name is required'),
    sector: Yup.string().required('Sector is required'),
    avatarUrl: Yup.string().nullable(),
  });

  // ------------------------------ defaults ----------------------------------
  const defaultValues = useMemo(
    () => ({
      cin: '',
      companyName: '',
      gstin: '',
      dateOfIncorporation: null,
      msmeUdyamRegistrationNo: '',
      city: '',
      state: '',
      country: 'India',
      entityType: '',
      panFile: null,
      panNumber: '',
      dateOfBirth: null,
      panHoldersName: '',
      sector: '',
      // avatar default: developer-provided file path (for dev preview)
      avatarUrl: UPLOADED_DEV_FILE,
      hasExistingData: hasExistingData,
    }),
    [hasExistingData]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = methods;

  // --------------------------- fetch company info --------------------------
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axiosInstance.get(`/api/kyc/issuer_kyc/company-info/profile/`);
        const companyData = response?.data?.data;
        if (companyData) {
          reset(
            {
              cin: companyData.corporate_identification_number || '',
              companyName: companyData.company_name || '',
              gstin: companyData.gstin || '',
              dateOfIncorporation: companyData.date_of_incorporation
                ? dayjs(companyData.date_of_incorporation, 'YYYY-MM-DD').toDate()
                : null,
              msmeUdyamRegistrationNo: companyData.msme_udyam_registration_no || '',
              city: companyData.city_of_incorporation || '',
              state: companyData.state_of_incorporation || '',
              country: companyData.country_of_incorporation || 'India',
              entityType: (companyData.entity_type || '').toLowerCase(),
              sector: companyData.sector || '',
              panNumber: companyData.company_pan_number || '',
              dateOfBirth: companyData.date_of_birth
                ? dayjs(companyData.date_of_birth, 'YYYY-MM-DD').toDate()
                : null,
              panHoldersName: companyData.pan_holder_name || '',
              avatarUrl: companyData.avatar?.fileUrl || UPLOADED_DEV_FILE,
            },
            { keepDefaultValues: false }
          );

          setHasExistingData(true);
          if (companyData.company_id) setUserCompanyId(companyData.company_id);
        }
      } catch (error) {
        // silent fail - form stays empty (dev file used as avatar default)
        console.error('fetchCompanyInfo error', error);
      }
    };

    fetchCompanyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------- PAN extraction ------------------------------
  const handlePanUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('pan_card_file', file);
      const response = await axiosInstance.post('/api/kyc/issuer_kyc/pan-extraction/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const { pan_number, pan_holder_name, date_of_birth, file_token } = response.data.data;
        setValue('panNumber', pan_number || '');
        setValue('panHoldersName', pan_holder_name || '');
        if (date_of_birth) setValue('dateOfBirth', new Date(date_of_birth));
        setPanFileToken(file_token || '');
        enqueueSnackbar('PAN details extracted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.data.message || 'Failed to extract PAN details', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error uploading PAN:', error);
      enqueueSnackbar('Error uploading PAN. Please try again.', { variant: 'error' });
    }
  };

  // --------------------------- Avatar upload (/files) ----------------------
  const handleAvatarDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setAvatarUploading(true);
        const fd = new FormData();
        fd.append('file', file);

        // Upload to your files endpoint
        const res = await axiosInstance.post('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const uploaded = res?.data?.files?.[0];
        if (uploaded?.fileUrl) {
          setValue('avatarUrl', uploaded.fileUrl, { shouldValidate: true });
          enqueueSnackbar('Avatar uploaded', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to upload avatar', { variant: 'error' });
        }
      } catch (err) {
        console.error('avatar upload error', err);
        enqueueSnackbar('Avatar upload failed', { variant: 'error' });
      } finally {
        setAvatarUploading(false);
      }
    },
    [setValue, enqueueSnackbar]
  );

  // optional small dropzone wrapper for RHFUploadAvatar if you want to use useDropzone directly
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log(file);
      // const newFile = Object.assign(file, {
      //   preview: URL.createObjectURL(file),
      // });

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/files', formData);
        const { data } = response;
        console.log(data);
        setValue('avatarUrl', data?.files[0].fileUrl, {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  // --------------------------- submit handler -----------------------------
  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Build FormData for KYC endpoint
      const fd = new FormData();

      fd.append('corporate_identification_number', formData.cin || '');
      fd.append('company_name', formData.companyName || '');
      fd.append('gstin', formData.gstin || '');
      fd.append(
        'date_of_incorporation',
        formData.dateOfIncorporation ? dayjs(formData.dateOfIncorporation).format('YYYY-MM-DD') : ''
      );
      fd.append('msme_udyam_registration_no', formData.msmeUdyamRegistrationNo || '');
      fd.append('country_of_incorporation', formData.country || 'India');
      fd.append('city_of_incorporation', formData.city || '');
      fd.append('state_of_incorporation', formData.state || '');
      fd.append('entity_type', formData.entityType || '');
      fd.append('company_pan_number', formData.panNumber || '');
      fd.append('pan_holder_name', formData.panHoldersName || '');
      fd.append('sector', formData.sector || '');
      fd.append(
        'date_of_birth',
        formData.dateOfBirth ? dayjs(formData.dateOfBirth).format('YYYY-MM-DD') : ''
      );

      // If PAN extraction gave us a token, include it
      if (panFileToken) {
        fd.append('file_token', panFileToken);
      } else if (formData.panFile) {
        // If user uploaded panFile but no token, append the file itself
        fd.append('company_or_individual_pan_card_file', formData.panFile);
      }

      // Attach avatarUrl if uploaded earlier (Option 2 flow)
      // Here we send avatar as a URL (fileUrl from /files). If your API expects a file, adjust accordingly.
      if (formData.avatarUrl) {
        fd.append('avatar_file_url', formData.avatarUrl);
      }

      // Choose method
      const token = sessionStorage.getItem('accessToken');
      const config = {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data',
        },
      };

      let response;
      if (!hasExistingData) {
        response = await axiosInstance.post('/api/kyc/issuer_kyc/company-info/', fd, config);
        if (response?.data?.data?.company_id) {
          sessionStorage.setItem('company_information_id', response.data.data.company_id);
        }
      } else {
        response = await axiosInstance.patch(
          '/api/kyc/issuer_kyc/company-info/profile/',
          fd,
          config
        );
      }

      if (response?.data?.success) {
        enqueueSnackbar(response.data.message || 'Saved', { variant: 'success' });
        navigate('/kyc/address-info');
      } else {
        enqueueSnackbar(response?.data?.message || 'Failed', { variant: 'error' });
      }
    } catch (err) {
      console.error('submit err', err);
      enqueueSnackbar('Submission failed', { variant: 'error' });
    }
  });

  // --------------------------- render -------------------------------------
  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3}>
            {/* LEFT: Avatar card */}
            <Grid xs={12} md={4}>
              <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
                <Typography
                  sx={{
                    mb: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    fontWeight:600,
                  }}
                >
                  Company Logo
                </Typography>
                <RHFUploadAvatar
                  name="avatarUrl"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>
            </Grid>

            {/* RIGHT: KYC Form fields */}
            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:user-rounded-bold" width={24} />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        CIN*
                      </Box>
                    </Box>
                    <RHFTextField
                      name="cin"
                      InputProps={{
                        endAdornment: (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: '#00328A',
                              color: 'white',
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '6px',
                            }}
                            onClick={async () => {
                              const cinValue = getValues('cin');
                              if (!cinValue) {
                                enqueueSnackbar('Please enter a CIN before fetching.', {
                                  variant: 'warning',
                                });
                                return;
                              }
                              try {
                                const response = await axiosInstance.get(
                                  `/api/kyc/issuer_kyc/company-info/cin/${cinValue}/`
                                );
                                const data = response.data.data;
                                if (response.data.success && data) {
                                  setValue('companyName', data.company_name || '');
                                  setValue('gstin', data.gstin || '');
                                  setValue(
                                    'dateOfIncorporation',
                                    data.date_of_incorporation
                                      ? dayjs(data.date_of_incorporation, 'YYYY-MM-DD').toDate()
                                      : null
                                  );
                                  setValue('city', data.city_of_incorporation || '');
                                  setValue('state', data.state_of_incorporation || '');
                                  setValue('country', data.country_of_incorporation || 'India');
                                  setValue('sector', data.sector || '');
                                  setValue('entityType', data.entity_type || '');
                                  setValue('panNumber', data.company_pan_number || '');
                                  enqueueSnackbar('CIN data fetched successfully', {
                                    variant: 'success',
                                  });
                                } else {
                                  throw new Error(
                                    response.data.message || 'Failed to fetch CIN data'
                                  );
                                }
                              } catch (error) {
                                console.error('Error fetching CIN:', error);
                                enqueueSnackbar(
                                  error.response?.data?.message ||
                                    'Failed to fetch CIN data. Please check CIN or try again.',
                                  { variant: 'error' }
                                );
                              }
                            }}
                          >
                            Fetch
                          </Button>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:buildings-bold" width={24} />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        Company Name*
                      </Box>
                    </Box>
                    <RHFTextField name="companyName" />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:percentage-circle-bold" width={24} />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        GSTIN*
                      </Box>
                    </Box>
                    <RHFTextField name="gstin" />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:calendar-bold" width={24} />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        Date of Incorporation*
                      </Box>
                    </Box>
                    <Controller
                      name="dateOfIncorporation"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          value={field.value}
                          onChange={(newValue) => field.onChange(newValue)}
                          format="dd-MM-yyyy"
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

                  <Grid xs={12} md={6}>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:buildings-2-bold" width={24} />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        MSME/Udyam Registration No.*
                      </Box>
                    </Box>
                    <RHFTextField name="msmeUdyamRegistrationNo" />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Iconify icon="solar:map-point-bold" width={24} />
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        Place of Incorporation*
                      </Box>
                    </Box>
                    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                      <RHFTextField name="city" placeholder="City" sx={{ flex: 1 }} />
                      <RHFSelect name="state" sx={{ flex: 1 }} SelectProps={{ displayEmpty: true }}>
                        <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                      </RHFSelect>
                      <RHFAutocomplete
                        name="country"
                        placeholder="Country"
                        sx={{ flex: 1 }}
                        readOnly
                        options={countries.map((c) => c.label)}
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => {
                          const found = countries.find((co) => co.label === option) || {};
                          return (
                            <li {...props} key={option}>
                              <Iconify
                                icon={`circle-flags:${(found.code || '').toLowerCase()}`}
                                width={28}
                                sx={{ mr: 1 }}
                              />
                              {option}
                            </li>
                          );
                        }}
                      />
                    </Stack>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="solar:buildings-2-bold" width={24} />
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            Entity Type*
                          </Box>
                        </Box>
                        <RHFSelect name="entityType">
                          <MenuItem value="">Select Entity Type</MenuItem>
                          <MenuItem value="private">Private Limited</MenuItem>
                          <MenuItem value="public">Public Limited</MenuItem>
                          <MenuItem value="LLP">LLP</MenuItem>
                          <MenuItem value="OPC">OPC</MenuItem>
                        </RHFSelect>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="solar:chart-2-bold" width={24} />
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            Sector*
                          </Box>
                        </Box>
                        <RHFSelect name="sector">
                          <MenuItem value="">Select Sector</MenuItem>
                          <MenuItem value="BANKING">Banking</MenuItem>
                          <MenuItem value="INFRASTRUCTURE">Infrastructure</MenuItem>
                          <MenuItem value="IT">IT & Software</MenuItem>
                          <MenuItem value="OTHERS">Others</MenuItem>
                        </RHFSelect>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>

          {/* PAN Upload */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Iconify icon="solar:document-upload-bold" width={24} />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: 600 }}>
                    Upload PAN to Fill Details Automatically*
                  </Typography>
                </Grid>
              </Grid>

              <RHFFileUploadBox
                name="panFile"
                label="Upload PAN Card"
                acceptedTypes="pdf,jpeg,jpg"
                maxSizeMB={10}
                onDrop={async (acceptedFiles) => {
                  const file = acceptedFiles[0];
                  if (file) {
                    setValue('panFile', file, { shouldValidate: true });
                    await handlePanUpload(file);
                  }
                }}
              />
              <YupErrorMessage name="panFile" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Iconify icon="solar:card-bold" width={24} />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: 600 }}>PAN Number*</Typography>
                </Grid>
              </Grid>

              <RHFTextField name="panNumber" placeholder="Your PAN Number" />
            </Grid>

            {/* -------------------- DATE OF BIRTH -------------------- */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Iconify icon="solar:calendar-bold" width={24} />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: 600 }}>Date of Birth*</Typography>
                </Grid>
              </Grid>

              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd-MM-yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: 'DD-MM-YYYY',
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Iconify icon="solar:user-bold" width={24} />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: 600 }}>PAN Holder's Name*</Typography>
                </Grid>
              </Grid>

              <RHFTextField name="panHoldersName" placeholder="Enter Name as per PAN" />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
              sx={{ bgcolor: 'grey.800', color: '#fff', px: 4, py: 1.5 }}
            >
              Save & Continue
            </LoadingButton>
          </Box>
        </Card>
      </FormProvider>
    </Container>
  );
}

CompanyAccountGeneral.propTypes = {};
