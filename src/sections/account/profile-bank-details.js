// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';

// components
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useForm, useWatch } from 'react-hook-form';

// sections
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useRouter } from 'src/routes/hook';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useGetDetails } from 'src/api/trusteeKyc';
import { useEffect } from 'react';
import { Card } from '@mui/material';
import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

export default function KYCBankDetails() {
  const router = useRouter();
  const location = useLocation();
  const bankDetails = location.state?.bankData || null;
  console.log('🏦 Bank Details Fetched:', bankDetails);

  const isApproved = bankDetails?.status === 1;

  // ---------------- VALIDATION ----------------
  const NewSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    addressProof: Yup.mixed().required('Address proof is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.number().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      documentType: 'cheque',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'CURRENT',
      addressProof: null,
      accountHolderName: '',
      bankAddress: '',
    },
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

      const payload = {
        usersId,
        bankDetails: {
          bankName: data.bankName,
          bankShortCode: data.bankShortCode,
          ifscCode: data.ifscCode,
          branchName: data.branchName,
          bankAddress: data.bankAddress,
          accountType: data.accountType === 'CURRENT' ? 1 : 0,
          accountHolderName: data.accountHolderName,
          accountNumber: String(data.accountNumber),
          bankAccountProofType: data.documentType === 'cheque' ? 0 : 1,
          bankAccountProofId: uploadedProofId,
        },
      };

      console.log('📤 FINAL BANK PAYLOAD:', payload);

      let res;
      if (!bankDetails?.id) {
        res = await axiosInstance.post('/trustee-profiles/kyc-bank-details', payload);
      } else {
        res = await axiosInstance.patch('/trustee-profiles/kyc-bank-details', {
          bankDetailsId: bankDetails.id,
          ...payload,
        });
      }

      if (res?.data?.success) {
        enqueueSnackbar('Bank details saved successfully!', { variant: 'success' });
        router.push('/trusteeProfiles/new');
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', { variant: 'error' });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit bank details', { variant: 'error' });
    }
  });

  useEffect(() => {
    if (bankDetails) {
      reset({
        documentType: bankDetails.bankAccountProofType === 0 ? 'cheque' : 'bank_statement',
        bankName: bankDetails.bankName || '',
        branchName: bankDetails.branchName || '',
        accountNumber: bankDetails.accountNumber || '',
        ifscCode: bankDetails.ifscCode || '',
        accountType: bankDetails.accountType === 1 ? 'CURRENT' : 'SAVINGS',
        addressProof: null,
        accountHolderName: bankDetails.accountHolderName || '',
        bankAddress: bankDetails.bankAddress || '',
        bankShortCode: bankDetails.bankShortCode || '',
      });
    }
  }, [bankDetails, reset]);

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
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
            </RHFSelect>
          </Box>

          {/* ---------------- ADDRESS PROOF UPLOAD ---------------- */}
          <RHFFileUploadBox
            name="addressProof"
            label={`Upload ${documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}`}
            icon="mdi:file-document-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
            existing={existingProof}
            onDrop={(files) => handleDrop(files)}
            disabled={isApproved}
          />

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
                Save
              </Button>
            </Box>
          )}
        </Card>
      </FormProvider>
    </Container>
  );
}
