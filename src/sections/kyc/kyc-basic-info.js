import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Card } from '@mui/material';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import dayjs from 'dayjs';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useGetTrusteeEntityTypes } from 'src/api/entityType';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { useGetKycProgress } from 'src/api/trusteeKyc';

// ----------------------------------------------------------------------

export default function KYCBasicInfo() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const storedProfileId = sessionStorage.getItem('trustee_user_id');

  const sessionId = localStorage.getItem('sessionId');
  const { kycProgress, profileId: fetchedProfileId } = useGetKycProgress(sessionId);

  const profileId = storedProfileId || fetchedProfileId;
  console.log('KYCBasicInfo profileId:', profileId);

  const [panExtractionStatus, setPanExtractionStatus] = useState('idle'); // 'idle' | 'success' | 'failed'
  const [extractedPanDetails, setExtractedPanDetails] = useState(null);
  const [uploadedPanFile, setUploadedPanFile] = useState(null);
  const isPanUploaded = Boolean(uploadedPanFile);
  // State to store mapped API values
  const [entityOptions, setEntityOptions] = useState([]);
  const { EntityTypes, EntityTypesEmpty } = useGetTrusteeEntityTypes();

  const [humanInteraction, setHumanInteraction] = useState({
    companyName: false,
    gstin: false,
    dateOfIncorporation: false,
    msmeUdyamRegistrationNo: false,
    city: false,
    state: false,
    country: false,
    panNumber: false,
    panHoldersName: false,
    sebiRegistrationNumber: false,
    sebiValidityDate: false,
  });

  const handleHumanInteraction = (fieldName) => {
    if (!humanInteraction[fieldName]) {
      setHumanInteraction((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }
  };

  const NewUserSchema = Yup.object().shape({
    cin: Yup.string().required('CIN is required'),
    companyName: Yup.string().required('Company Name is required'),
    gstin: Yup.string().required('GSTIN is required'),
    dateOfIncorporation: Yup.date().required('Date of Incorporation is required'),
    msmeUdyamRegistrationNo: Yup.string().required('MSME Udyam Registration No is required'),
    sebiRegistrationNumber: Yup.string().required('SEBI Registration Number is required'),
    sebiValidityDate: Yup.date().required('SEBI Validity Date is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    panFile: Yup.mixed().required('PAN file is required'),
    panNumber: Yup.string().required('PAN Number is required'),
    panHoldersName: Yup.string().required("PAN Holder's Name is required"),
    companyEntityTypeId: Yup.string().required('Entity Type is required'),
  });

  const defaultValues = useMemo(
    () => ({
      cin: '',
      companyName: '',
      gstin: '',
      dateOfIncorporation: null,
      msmeUdyamRegistrationNo: '',
      sebiRegistrationNumber: '',
      sebiValidityDate: null,
      city: '',
      state: '',
      country: 'India',
      panFile: null,
      panNumber: '',
      panHoldersName: '',
      panCardDocumentId: '',
      companyEntityTypeId: '',
      humanInteraction: { ...humanInteraction },
    }),
    [humanInteraction]
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
    formState: { isSubmitting, errors },
  } = methods;

  const handlePanUpload = async (file) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await axiosInstance.post('/files', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = uploadRes?.data?.files?.[0];
      if (!uploaded || !uploaded.id) {
        throw new Error('PAN file upload failed');
      }

      setUploadedPanFile(uploaded);
      setValue('panCardDocumentId', uploaded.id, { shouldValidate: true });

      const extractRes = await axiosInstance.post('/extract/pan-info', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const panData = extractRes?.data?.data || extractRes?.data;

      // Adjust these keys according to your actual API response
      const panNumberFromApi = panData?.extractedPanNumber || '';
      const panHolderNameFromApi = panData?.extractedPanHolderName || '';

      if (!panNumberFromApi && !panHolderNameFromApi) {
        // Treat as failure if nothing useful came back
        setPanExtractionStatus('failed');
        enqueueSnackbar(
          "We couldn't fetch details from your PAN document. Please fill the details manually.",
          { variant: 'error' }
        );
        return;
      }

      // Fill form values from extraction
      if (panHolderNameFromApi) {
        setValue('panHoldersName', panHolderNameFromApi, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (panNumberFromApi) {
        setValue('panNumber', panNumberFromApi, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Save extracted details in state for final payload
      const extracted = {
        extractedTrusteeName: panHolderNameFromApi || '',
        extractedPanNumber: panNumberFromApi || '',
      };

      setExtractedPanDetails(extracted);
      setPanExtractionStatus('success');

      enqueueSnackbar('PAN details extracted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error in PAN upload/extraction:', error);
      setPanExtractionStatus('failed');
      enqueueSnackbar(
        "We couldn't fetch details from your PAN document. Please fill the details manually.",
        { variant: 'error' }
      );
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || '';

      const dateOfIncorporationStr = formData.dateOfIncorporation
        ? dayjs(formData.dateOfIncorporation).format('YYYY-MM-DD')
        : '';
      // Detect if user changed PAN fields manually
      let humanEdited = false;

      if (extractedPanDetails) {
        humanEdited =
          extractedPanDetails.extractedTrusteeName !== formData.panHoldersName ||
          extractedPanDetails.extractedPanNumber !== formData.panNumber;
      }

      // Build extracted PAN object
      const extractedPan = extractedPanDetails
        ? {
            extractedTrusteeName: extractedPanDetails.extractedTrusteeName || '',
            extractedPanNumber: extractedPanDetails.extractedPanNumber || '',
          }
        : {
            extractedTrusteeName: formData.panHoldersName,
            extractedPanNumber: formData.panNumber,
          };

      // Build submitted PAN object
      const submittedPan = humanEdited
        ? {
            submittedTrusteeName: formData.panHoldersName,
            submittedPanNumber: formData.panNumber,
          }
        : {
            submittedTrusteeName: formData.panHoldersName,
            submittedPanNumber: formData.panNumber,
          };

      // FINAL API PAYLOAD — 100% MATCHES THE API FORMAT YOU GAVE
      const payload = {
        sessionId,
        legalEntityName: formData.companyName,
        CIN: formData.cin,
        GSTIN: formData.gstin,
        udyamRegistrationNumber: formData.msmeUdyamRegistrationNo,

        dateOfIncorporation: dateOfIncorporationStr,
        sebiRegistrationNumber: formData.sebiRegistrationNumber,
        sebiValidityDate: formData.sebiValidityDate
          ? dayjs(formData.sebiValidityDate).format('YYYY-MM-DD')
          : '',

        cityOfIncorporation: formData.city,
        stateOfIncorporation: formData.state,
        countryOfIncorporation: formData.country,

        humanInteraction: humanEdited ? true : false,

        extractedPanDetails: extractedPan,
        submittedPanDetails: submittedPan,

        panCardDocumentId: formData.panCardDocumentId,
        trusteeEntityTypesId: formData.companyEntityTypeId,
      };

      console.log('FINAL Trustee Registration Payload:', payload);

      const response = await axiosInstance.post('/auth/trustee-registration', payload);

      if (response?.data?.success) {
        const usersId = response?.data?.usersId;

        // ✅ Store it so next page can access it
        if (usersId) {
          sessionStorage.setItem('trustee_user_id', usersId);
        } else {
          console.warn('No usersId found in trustee-registration response');
        }
        enqueueSnackbar(response.data.message || 'Trustee Registration Successful', {
          variant: 'success',
        });

        reset();
        router.push(paths.auth.kyc.trusteeKyc);
      } else {
        throw new Error(response?.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

  const existingPAN = useMemo(() => {
    const p = kycProgress?.profile?.trusteePanCards;
    if (!p || !p.panCardDocument) return null;

    return {
      name: p.panCardDocument.fileOriginalName,
      url: p.panCardDocument.fileUrl,
      status: p.status,
    };
  }, [kycProgress]);

  useEffect(() => {
    if (fetchedProfileId) {
      sessionStorage.setItem('trustee_user_id', fetchedProfileId);
    }
  }, [fetchedProfileId]);

  useEffect(() => {
    if (EntityTypes && !EntityTypesEmpty) {
      setEntityOptions(EntityTypes);
    } else {
      setEntityOptions([]);
    }
  }, [EntityTypes, EntityTypesEmpty]);

  useEffect(() => {
    if (kycProgress?.profile) {
      const p = kycProgress.profile;

      reset({
        cin: p.CIN || '',
        companyName: p.legalEntityName || '',
        gstin: p.GSTIN || '',
        dateOfIncorporation: p.dateOfIncorporation ? dayjs(p.dateOfIncorporation).toDate() : null,

        msmeUdyamRegistrationNo: p.udyamRegistrationNumber || '',
        sebiRegistrationNumber: p.sebiRegistrationNumber || '',
        sebiValidityDate: p.sebiValidityDate ? dayjs(p.sebiValidityDate).toDate() : null,

        city: p.cityOfIncorporation || '',
        state: p.stateOfIncorporation || '',
        country: p.countryOfIncorporation || 'India',

        // PAN fields — your GET API does NOT return them
        panFile: null,
        panCardDocumentId: p?.trusteePanCards?.panCardDocumentId || '',

        panNumber:
          p?.trusteePanCards?.submittedPanNumber || p?.trusteePanCards?.extractedPanNumber || '',

        panHoldersName:
          p?.trusteePanCards?.submittedTrusteeName ||
          p?.trusteePanCards?.extractedTrusteeName ||
          '',

        companyEntityTypeId: p?.trusteeEntityTypesId || '',
      });
      if (p?.trusteePanCards?.panCardDocument) {
        const serverFile = {
          name: p.trusteePanCards.panCardDocument.fileOriginalName,
          url: p.trusteePanCards.panCardDocument.fileUrl,
          id: p.trusteePanCards.panCardDocument.id,
          isServerFile: true,
        };

        setValue('panFile', serverFile, { shouldValidate: true });
        setUploadedPanFile(serverFile);

        // Also hydrate extractedPanDetails for humanEdited comparison
        setExtractedPanDetails({
          extractedTrusteeName:
            p?.trusteePanCards?.extractedTrusteeName ||
            p?.trusteePanCards?.submittedTrusteeName ||
            '',
          extractedPanNumber:
            p?.trusteePanCards?.extractedPanNumber || p?.trusteePanCards?.submittedPanNumber || '',
        });
      }
    }
  }, [kycProgress, reset, setValue]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* <KYCTitle
      title="Basic Information"
      subtitle="Please provide your company details to proceed"
    /> */}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            boxShadow: '0px 8px 25px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 600,
          }}
        >
          {/* Background Image */}
          <Box
            component="img"
            src="/assets/images/kyc/kyc-basic-info/kyc-img.svg"
            alt="background"
            sx={{
              position: 'absolute',
              right: 0,
              bottom: '10%',
              height: '100%',
              width: '100%',
              opacity: 0.1,
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />

          {/* CONTENT WRAPPER */}
          <Box sx={{ position: 'relative', zIndex: 10 }}>
            {/* TITLE */}
            <Stack spacing={0.5} alignItems="flex-start" sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#206CFE',
                  textAlign: 'left',
                }}
              >
                Company Basic Information
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: '#000000',
                  textAlign: 'left',
                }}
              >
                Please provide your company details to proceed
              </Typography>
            </Stack>

            {/* 3 Fields in One Row */}
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <RHFTextField
                  name="cin"
                  label="CIN *"
                  placeholder="Enter CIN"
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          textTransform: 'none',
                          bgcolor: 'primary.main',
                          color: 'white',
                          ml: 1,
                        }}
                        onClick={async () => {
                          const cin = getValues('cin');
                          if (!cin) {
                            enqueueSnackbar('Enter CIN first.', { variant: 'warning' });
                            return;
                          }
                          try {
                            const res = await axiosInstance.post('/extraction/company-info', {
                              CIN: cin,
                            });
                            const data = res?.data?.data;
                            if (res.data.success && data) {
                              setValue('companyName', data.companyName || '');
                              setValue('gstin', data.gstin || '');
                              setValue(
                                'dateOfIncorporation',
                                data.dateOfIncorporation ? new Date(data.dateOfIncorporation) : null
                              );
                              setValue('city', data.cityOfIncorporation || '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              setValue('state', data.stateOfIncorporation || '', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              setValue('country', data.countryOfIncorporation || 'India', {
                                shouldValidate: true,
                                shouldDirty: true,
                              });

                              enqueueSnackbar('CIN details fetched!', { variant: 'success' });
                            }
                          } catch (err) {
                            enqueueSnackbar('Unable to fetch CIN details', { variant: 'error' });
                          }
                        }}
                      >
                        Fetch
                      </Button>
                    ),
                  }}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFTextField
                  name="companyName"
                  label="Legal Entity Name *"
                  placeholder="Company Name"
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFTextField name="gstin" label="GSTIN *" placeholder="Enter GSTIN" />
              </Grid>
              <Grid xs={12} md={4}>
                <RHFTextField
                  name="sebiRegistrationNumber"
                  label="SEBI Registration Number *"
                  placeholder="Enter Registration Number"
                />
              </Grid>

              {/* NEXT ROW - 3 fields */}
              <Grid xs={12} md={4}>
                <Controller
                  name="sebiValidityDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="SEBI Validity Date *"
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
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
              <Grid xs={12} md={4}>
                <Controller
                  name="dateOfIncorporation"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Date of Incorporation *"
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
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

              <Grid xs={12} md={4}>
                <RHFTextField name="city" label="City of Incorporation*" placeholder="City" />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFSelect name="state" label="State of Incorporation*">
                  <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                </RHFSelect>
              </Grid>

              {/* COUNTRY + ENTITY TYPE */}
              <Grid xs={12} md={4}>
                <RHFAutocomplete
                  name="country"
                  label="Country"
                  readOnly
                  options={['India']}
                  getOptionLabel={(o) => o}
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFTextField
                  name="msmeUdyamRegistrationNo"
                  label="MSME / Udyam No. *"
                  placeholder="Enter MSME Number"
                />
              </Grid>

              <Grid xs={12} md={4}>
                <RHFSelect name="companyEntityTypeId" label="Entity Type *">
                  <MenuItem value="">Select Entity Type</MenuItem>
                  {entityOptions.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>

            {/* ---------------------- */}
            {/* PAN SECTION */}
            {/* ---------------------- */}
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 5, mb: 2 }}>
              PAN Details
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
                <RHFFileUploadBox
                  name="panFile"
                  label="Upload PAN Card *"
                  acceptedTypes="pdf,jpg,jpeg,png"
                  onDrop={async (files) => {
                    const f = files[0];
                    if (f) await handlePanUpload(f);
                  }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField
                  name="panNumber"
                  label="PAN Number *"
                  placeholder="Enter PAN Number"
                  disabled={!isPanUploaded}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <RHFTextField
                  name="panHoldersName"
                  label="PAN Holder Name *"
                  placeholder="Enter Name"
                  disabled={!isPanUploaded}
                />
              </Grid>
            </Grid>

            {/* SUBMIT BUTTON */}
            <Box textAlign="center" sx={{ mt: 4 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                sx={{
                  px: 6,
                  py: 1.6,
                  fontWeight: 600,
                  borderRadius: 1,
                }}
              >
                Save & Continue
              </LoadingButton>
            </Box>
          </Box>
        </Card>

        <KYCFooter />
      </FormProvider>
    </Container>
  );
}
