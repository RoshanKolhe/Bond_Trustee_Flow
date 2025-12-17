// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';

// components
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect, RHFCustomFileUploadBox } from 'src/components/hook-form';
import { useForm, useWatch } from 'react-hook-form';

// sections
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useRouter } from 'src/routes/hook';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useEffect, useMemo } from 'react';
import { Card } from '@mui/material';
import { useLocation, useParams } from 'react-router';
import { useGetBankDetail, useGetBankDetails } from 'src/api/trusteeKyc';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';

// ----------------------------------------------------------------------
const documentOptions = [
  { label: 'Cheque', value: 0 },
  { label: 'Bank Statement', value: 1 },
]

export default function KYCBankDetails() {
  const { id } = useParams();
  const router = useRouter();
  const location = useLocation();
  const { bank, loading, refreshBank } = useGetBankDetail(id);

  const { refreshBankDetail } = useGetBankDetails();
  const raw = bank;
  const bankDetails = raw?.data || raw?.bankDetails || raw || {};

  console.log('🏦 Bank Details Fetched:', bankDetails);

  const isApproved = bankDetails?.status === 1;

  // ---------------- VALIDATION ----------------
  const NewSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    addressProof: Yup.mixed().when([], {
      is: () => !bankDetails?.id,
      then: (schema) => schema.required('Address proof is required'),
      otherwise: (schema) => schema.nullable(),
    }),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.number().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      documentType: bankDetails?.bankAccountProofType || 0,

      bankName: bankDetails?.bankName || '',
      branchName: bankDetails?.branchName || '',
      accountNumber: bankDetails?.accountNumber || '',
      ifscCode: bankDetails?.ifscCode || '',

      accountType: bankDetails?.accountType === 1 ? 'CURRENT' : 'SAVINGS',

      addressProof: null,

      accountHolderName: bankDetails?.accountHolderName || '',
      bankAddress: bankDetails?.bankAddress || '',
      bankShortCode: bankDetails?.bankShortCode || '',
    }),
    [bankDetails]
  );

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    // reValidateMode: 'onChange',
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const documentType = useWatch({ control, name: 'documentType' });

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('addressProof', file, { shouldValidate: true });
    }
  };

  const existingProof = bankDetails?.bankAccountProof
    ? {
      id: bankDetails.bankAccountProof.id,
      name: bankDetails.bankAccountProof.fileOriginalName,
      url: bankDetails.bankAccountProof.fileUrl,
      status: bankDetails.status === 1 ? 'approved' : 'pending',
      isServerFile: true,
    }
    : null;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('trustee_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Please restart KYC process.', { variant: 'error' });
        return;
      }

      let uploadedProofId = bankDetails?.bankAccountProofId || null;

      if (data.addressProof && !data.addressProof.isServerFile) {
        const fd = new FormData();
        fd.append('file', data.addressProof);

        const uploadRes = await axiosInstance.post('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedProofId = uploadRes?.data?.files?.[0]?.id;
      }

      const bankId = bankDetails?.id;
      console.log('📤 FINAL BANK bankId:', bankId);

      const payload = {
        bankName: data.bankName,
        bankShortCode: data.bankShortCode,
        ifscCode: data.ifscCode,
        branchName: data.branchName,
        bankAddress: data.bankAddress,
        accountType: data.accountType === 'CURRENT' ? 1 : 0,
        accountHolderName: data.accountHolderName,
        accountNumber: String(data.accountNumber),
        bankAccountProofType: Number(data.documentType),
        bankAccountProofId: uploadedProofId,
      };

      console.log('📤 FINAL BANK PAYLOAD:', payload);
      let finalPayload;

      if (!bankId) {
        finalPayload = { bankDetails: payload };
      } else {
        finalPayload = payload;
      }

      let res;

      if (!bankDetails?.id) {
        res = await axiosInstance.post('/trustee-profiles/bank-details', finalPayload);
      } else {
        res = await axiosInstance.patch(`/trustee-profiles/bank-details/${bankId}`, finalPayload);
      }

      if (res?.data?.success) {
        enqueueSnackbar('Bank details saved successfully!', { variant: 'success' });
        refreshBankDetail();
        router.push('/dashboard/user/profile');
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit bank details', { variant: 'error' });
    }
  });

  useEffect(() => {
    if (bankDetails?.id) {
      reset(defaultValues);
    }
  }, [bankDetails, defaultValues, reset]);

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Select Document Type:
          </Typography>

          <Box sx={{ width: 200, mb: 3 }}>
            <RHFSelect
              name="documentType"
              SelectProps={{
                displayEmpty: true,
              }}
              disabled={isApproved}
            >
              {documentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>

          {/* ---------------- ADDRESS PROOF UPLOAD ---------------- */}
          {/* <RHFFileUploadBox
           key={documentType}
            name="addressProof"
            label={`Upload ${documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}`}
            icon="mdi:file-document-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
            existing={existingProof}
            onDrop={(files) => handleDrop(files)}
            disabled={isApproved}
          /> */}
          <RHFCustomFileUploadBox
            key={documentType}
            name="addressProof"
            label={`Upload ${documentType === 0 ? 'Cheque' : 'Bank Statement'}`}
            icon="mdi:file-document-outline"
          // accept={{
          //   'application/pdf': ['.pdf'],
          //   'application/msword': ['.doc'],
          //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          // }}
          />
          <YupErrorMessage name="addressProof" />

          {/* ---------------- BANK FIELDS ---------------- */}
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={9}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <RHFTextField
                      name="ifscCode"
                      label="IFSC Code"
                      placeholder="Enter IFSC Code"
                      disabled={isApproved}
                      InputProps={{
                        endAdornment: (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              ml: 1,
                              bgcolor: '#00328A',
                              color: 'white',
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '6px',
                              minHeight: '32px',
                              px: 2,
                              '&:hover': { bgcolor: '#002670' },
                            }}
                            onClick={async () => {
                              const ifsc = getValues('ifscCode');

                              if (!ifsc) {
                                enqueueSnackbar('Please enter IFSC Code first', {
                                  variant: 'warning',
                                });
                                return;
                              }

                              try {
                                const res = await axiosInstance.get(
                                  `/bank-details/get-by-ifsc/${ifsc}`
                                );

                                const data = res?.data?.bankDetails;

                                if (!data) {
                                  enqueueSnackbar('No bank details found', { variant: 'error' });
                                  return;
                                }

                                // Autofill form values
                                setValue('bankName', data.bankName || '');
                                setValue('branchName', data.branchName || '');
                                setValue('bankShortCode', data.bankShortCode || '');
                                setValue('bankAddress', data.bankAddress || '');
                                setValue('city', data.city || '');
                                setValue('state', data.state || '');
                                setValue('district', data.district || '');

                                enqueueSnackbar('Bank details fetched successfully', {
                                  variant: 'success',
                                });
                              } catch (error) {
                                console.error(error);
                                enqueueSnackbar(
                                  error?.response?.data?.message || 'Invalid IFSC Code',
                                  { variant: 'error' }
                                );
                              }
                            }}
                            disabled={isApproved}
                          >
                            Fetch
                          </Button>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <RHFTextField
                      name="bankName"
                      label="Bank Name"
                      placeholder="Enter Bank Name"
                      disabled={isApproved}
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="branchName"
                      label="Branch Name"
                      placeholder="Enter Branch Name"
                      disabled={isApproved}
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="accountHolderName"
                      label="Account Holder Name"
                      placeholder="Enter Account Holder Name"
                      disabled={isApproved}
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="accountNumber"
                      label="Account Number"
                      placeholder="Enter Account Number"
                      disabled={isApproved}
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="bankAddress"
                      label="Bank Address"
                      placeholder="Bank Address"
                      disabled={isApproved}
                      InputLabelProps={{
                        shrink: Boolean(getValues('bankAddress')),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <RHFSelect name="accountType" label="Account Type" disabled>
                      <MenuItem value="SAVINGS">Savings</MenuItem>
                      <MenuItem value="CURRENT">Current</MenuItem>
                    </RHFSelect>
                  </Box>
                  <Box>
                    <RHFTextField
                      name="bankShortCode"
                      label="Bank Short Code"
                      placeholder="Bank Short Code"
                      disabled={isApproved}
                      InputLabelProps={{
                        shrink: Boolean(getValues('bankShortCode')),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* ---------------- FOOTER BUTTONS ---------------- */}
          {!isApproved && (
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4, mb: 2 }}>
              <Button variant="contained" type="submit">
                {bankDetails?.id ? 'Update' : 'Save'}
              </Button>
            </Box>
          )}
        </Card>
      </FormProvider>
    </Container>
  );
}
