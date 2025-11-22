import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
// @mui
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
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

function PANUploadArea({ value, onChange, error }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.pdf'],
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        p: 2,
        borderRadius: 1,
        cursor: 'pointer',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        ...(isDragActive && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
        }),
        ...(error && {
          borderColor: 'error.main',
        }),
      }}
    >
      <input {...getInputProps()} />
      <Button variant="outlined" size="small">
        Select file...
      </Button>
      <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
        {value ? value.name : 'Drop files here to upload'}
      </Typography>
    </Box>
  );
}

PANUploadArea.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  error: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function KYCBasicInfo() {
  const NewUserSchema = Yup.object().shape({
    cin: Yup.string().required('CIN is required'),
    companyName: Yup.string().required('Company Name is required'),
    gstin: Yup.string().required('GSTIN is required'),
    dateOfIncorporation: Yup.date().required('Date of Incorporation is required'),
    msmeUdyamRegistrationNo: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    entityType: Yup.string().required('Entity Type is required'),
    panFile: Yup.mixed(),
    panNumber: Yup.string(),
    dateOfBirth: Yup.date(),
    panHoldersName: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      cin: '',
      companyName: '',
      gstin: '',
      dateOfIncorporation: null,
      msmeUdyamRegistrationNo: '',
      city: '',
      state: '',
      country: '',
      entityType: '',
      panFile: null,
      panNumber: '',
      dateOfBirth: null,
      panHoldersName: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Container>
      <KYCTitle
        title="Welcome to Bond Issuer"
        subtitle={"Let's get you started please provide your details"}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Left Section */}
            <Grid xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:user-rounded-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      CIN
                    </Box>
                  </Box>
                  <RHFTextField name="cin" />
                </Box>

                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:buildings-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Company Name
                    </Box>
                  </Box>
                  <RHFTextField name="companyName" />
                </Box>

                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:percentage-circle-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      GSTIN
                    </Box>
                  </Box>
                  <RHFTextField name="gstin" />
                </Box>

                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Date of Incorporation
                    </Box>
                  </Box>
                  <Controller
                    name="dateOfIncorporation"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        format="DD-MM-YYYY"
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
                </Box>

                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:buildings-2-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      MSME/Udyam Registration No.
                    </Box>
                  </Box>
                  <RHFTextField name="msmeUdyamRegistrationNo" />
                </Box>

                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:map-point-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Place of Incorporation
                    </Box>
                  </Box>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                    <RHFTextField name="city" placeholder="City" sx={{ flex: 1 }} />
                    <RHFSelect
                      name="state"
                      sx={{ flex: 1 }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <Box sx={{ color: 'text.disabled' }}>State</Box>;
                          }
                          return selected;
                        },
                      }}
                    >
                      <MenuItem value="">State</MenuItem>
                      {/* Add state options here */}
                    </RHFSelect>
                    <RHFAutocomplete
                      name="country"
                      placeholder="Country"
                      sx={{ flex: 1 }}
                      options={countries.map((country) => country.label)}
                      getOptionLabel={(option) => option}
                      renderOption={(props, option) => {
                        const { code, label, phone } = countries.filter(
                          (country) => country.label === option
                        )[0];

                        if (!label) {
                          return null;
                        }

                        return (
                          <li {...props} key={label}>
                            <Iconify
                              key={label}
                              icon={`circle-flags:${code.toLowerCase()}`}
                              width={28}
                              sx={{ mr: 1 }}
                            />
                            {label} ({code}) +{phone}
                          </li>
                        );
                      }}
                    />
                  </Stack>
                </Box>

                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:buildings-2-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Entity Type
                    </Box>
                  </Box>
                  <RHFSelect name="entityType" placeholder="Select Entity Type">
                    <MenuItem value="">Select Entity Type</MenuItem>
                    {/* Add entity type options here */}
                  </RHFSelect>
                </Box>
              </Box>
            </Grid>

            {/* Right Section */}
            <Grid xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                {/* Image - takes up 3 textField areas */}
                <Box
                  sx={{
                    height: { xs: 'auto', md: 'calc(3.82 * (56px + 24px))' }, // Approximate height of 3 fields with gaps
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: { xs: 0, md: 0 },
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/kyc/kyc-basic-info/kyc-img.svg"
                    alt="KYC Illustration"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                {/* Upload PAN Section */}
                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Upload PAN to Fill Details Automatically
                    </Box>
                  </Box>
                  <Controller
                    name="panFile"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <PANUploadArea
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                          setValue('panFile', file, { shouldValidate: true });
                        }}
                        error={!!error}
                      />
                    )}
                  />
                </Box>

                {/* PAN Number Field */}
                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      PAN Number
                    </Box>
                  </Box>
                  <RHFTextField name="panNumber" placeholder="Your PAN Number" />
                </Box>

                {/* Date of Birth Field */}
                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Date of Birth
                    </Box>
                  </Box>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        format="DD-MM-YYYY"
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
                </Box>

                {/* PAN Holder's Name Field */}
                <Box>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:calendar-bold" width={24} />
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      PAN Holder's Name
                    </Box>
                  </Box>
                  <RHFTextField name="panHoldersName" placeholder="Enter Name as per PAN" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 4 }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{
            bgcolor: 'grey.800',
            color: 'common.white',
            borderRadius: 1,
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: 'grey.900',
            },
          }}
          endIcon={<Iconify icon="eva:arrow-forward-fill" />}
        >
          Save & Continue
        </LoadingButton>
      </Box>

      <KYCFooter />
    </Container>
  );
}
