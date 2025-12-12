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
import useGetProfileData from 'src/api/trusteeKyc';
import { useGetTrusteeEntityTypes } from 'src/api/entityType';

// developer-provided uploaded file path (used as initial avatarUrl)
const UPLOADED_DEV_FILE = '/mnt/data/Untitled document.docx';

// ----------------------------------------------------------------------

export default function CompanyAccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const [hasExistingData, setHasExistingData] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [entityOptions, setEntityOptions] = useState([]);
  const { EntityTypes, EntityTypesEmpty } = useGetTrusteeEntityTypes();

  const { profileData } = useGetProfileData();
  console.log('Profile Data in General Info:', profileData);

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
    panNumber: Yup.string().required('Pan Number is required'),
    dateOfBirth: Yup.date().nullable().required('Date of Birth is required'),
    panHoldersName: Yup.string().required('Pan Holders Name is required'),
    sector: Yup.string().required('Sector is required'),
    companyLogo: Yup.object().nullable(),
    companyAbout: Yup.string(),
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
      companyAbout: '',
      entityType: '',
      panNumber: '',
      dateOfBirth: null,
      panHoldersName: '',
      sector: '',
      companyLogo: null,
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
    if (EntityTypes && !EntityTypesEmpty) {
      setEntityOptions(EntityTypes);
    } else {
      setEntityOptions([]);
    }
  }, [EntityTypes, EntityTypesEmpty]);

  useEffect(() => {
    if (!profileData) return;

    const p = profileData;

    reset({
      cin: p.CIN || '',
      companyName: p.legalEntityName || '',
      gstin: p.GSTIN || '',
      dateOfIncorporation: p.dateOfIncorporation ? dayjs(p.dateOfIncorporation).toDate() : null,

      msmeUdyamRegistrationNo: p.udyamRegistrationNumber || '',
      city: p.cityOfIncorporation || '',
      state: p.stateOfIncorporation || '',
      country: p.countryOfIncorporation || 'India',

      entityType: p?.trusteeEntityTypesId || '',
      sector: '', // Trustee API does NOT have sector

      // PAN card mappings
      panNumber:
        p.trusteePanCards?.submittedPanNumber || p.trusteePanCards?.extractedPanNumber || '',

      dateOfBirth: p.trusteePanCards?.submittedDateOfBirth
        ? dayjs(p.trusteePanCards.submittedDateOfBirth).toDate()
        : p.trusteePanCards?.extractedDateOfBirth
        ? dayjs(p.trusteePanCards.extractedDateOfBirth).toDate()
        : null,

      panHoldersName:
        p.trusteePanCards?.submittedTrusteeName || p.trusteePanCards?.extractedTrusteeName || '',

      companyAbout: p.trusteeAbout || '',

      companyLogo: p.trusteeLogoId ? { id: p.trusteeLogoId, url: p.trusteeLogo?.fileUrl } : null,
    });

    setHasExistingData(true);
  }, [profileData, reset]);

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
          setValue('companyLogo', uploaded.fileUrl, { shouldValidate: true });
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
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axiosInstance.post('/files', formData);

        const uploaded = data?.files?.[0];

        if (uploaded) {
          setValue('companyLogo', uploaded, { shouldValidate: true });

          console.log('Saved companyLogoId:', uploaded.id);

          enqueueSnackbar('Logo uploaded!', { variant: 'success' });
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Upload failed', { variant: 'error' });
      }
    },
    [setValue, enqueueSnackbar]
  );

  // --------------------------- submit handler -----------------------------
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const payload = {
        companyLogo: formData.companyLogo.id ? String(formData.companyLogo.id) : null,
        companyAbout: formData.companyAbout?.trim() || '',
      };

      const response = await axiosInstance.patch('/company-profiles/update-general-info', payload);

      if (response?.data?.success) {
        enqueueSnackbar('Company profile updated successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar(response?.data?.message || 'Update failed', { variant: 'error' });
      }
    } catch (error) {
      console.error('Update error:', error);
      enqueueSnackbar('Something went wrong. Try again.', { variant: 'error' });
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
            <Grid xs={12} md={12}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6}>
                    <RHFTextField name="cin" label="CIN" disabled />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField name="companyName" label="Company Name" disabled />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <RHFTextField name="gstin" label="GSTIN" disabled />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Controller
                      name="dateOfIncorporation"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          disabled
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
                    <RHFTextField
                      name="msmeUdyamRegistrationNo"
                      label="MSME/Udyam Registration No.*"
                      disabled
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                      <RHFTextField name="city" placeholder="City" disabled sx={{ flex: 1 }} />
                      <RHFSelect
                        name="state"
                        disabled
                        sx={{ flex: 1 }}
                        SelectProps={{ displayEmpty: true }}
                      >
                        <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                      </RHFSelect>
                      <RHFAutocomplete
                        name="country"
                        disabled
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
                        <RHFSelect name="entityType" label="Entity Type" disabled>
                          <MenuItem value="">Select Entity Type</MenuItem>
                          {entityOptions.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>

          {/* PAN Upload */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="panNumber"
                label="PAN Number*"
                disabled
                placeholder="Your PAN Number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="panHoldersName" disabled placeholder="Enter Name as per PAN" />
            </Grid>
          </Grid>
          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            {/* <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ ml: 'auto' }}
            >
              Save Changes
            </LoadingButton> */}
          </Stack>
        </Card>
      </FormProvider>
    </Container>
  );
}

CompanyAccountGeneral.propTypes = {};
