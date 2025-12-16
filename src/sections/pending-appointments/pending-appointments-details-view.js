// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

// components
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useForm, useWatch } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useRouter } from 'src/routes/hook';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useLocation } from 'react-router';
import { Card } from '@mui/material';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';


// ----------------------------------------------------------------------

export default function PendingAppointmentsDetails({ companyProfile }) {
  const userId = companyProfile?.data?.id;
  const stepperId = companyProfile?.kycApplications?.currentProgress?.[2];
  const { state } = useLocation();
  const bankDetails = state?.bankData || null;
  console.log('📌 Received bankData:', bankDetails);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  console.log('KYCBankDetails userId', userId);
  const router = useRouter();

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

  const handleApprove = async () => {
    try {
      await axiosInstance.patch('/company-profiles/bank-account-verification', {
        status: 1,
        accountId: bankDetails?.id,
        reason: '',
      });

      enqueueSnackbar('Bank Approved Successfully!', { variant: 'success' });
      router.back(); // or refresh page
    } catch (err) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    try {
      await axiosInstance.patch('/company-profiles/bank-account-verification', {
        status: 2,
        accountId: bankDetails?.id,
        reason: rejectReason,
      });

      enqueueSnackbar('Bank Rejected', { variant: 'success' });

      setRejectOpen(false);
      setRejectReason('');
      router.back();
    } catch (err) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
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
  
      const proofFile = data.addressProof;
      let uploadedProofId = null;

      if (proofFile) {
        const fd = new FormData();
        fd.append('file', proofFile);

        const uploadRes = await axiosInstance.post('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedProofId = uploadRes?.data?.files?.[0]?.id;

        if (!uploadedProofId) {
          enqueueSnackbar('Failed to upload address proof', { variant: 'error' });
          return;
        }
      }

      const payload = {
        bankDetails: {
          bankName: data.bankName,
          bankShortCode: data.bankShortCode,
          ifscCode: data.ifscCode,
          branchName: data.branchName,
          bankAddress: data.bankAddress,
          accountType: data.accountType === 'CURRENT' ? 1 : 0,
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          bankAccountProofType: data.documentType === 'cheque' ? 0 : 1,
          bankAccountProofId: uploadedProofId,
        },
      };

      console.log('📤 FINAL BANK PAYLOAD:', payload);

      const res = await axiosInstance.post('/company-profiles/kyc-bank-details', payload);

      if (res?.data?.success) {
        enqueueSnackbar('Bank details submitted successfully!', { variant: 'success' });
        router.push(paths.KYCSignatories);
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong!', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to submit bank details', { variant: 'error' });
    }
  });

  const requiredFields = ['addressProof', 'bankName', 'branchName', 'accountNumber', 'ifscCode'];

  const errors = methods.formState.errors;

  const calculatePercent = () => {
    let valid = 0;
    requiredFields.forEach((field) => {
      const value = values[field];
      if (value && !errors[field]) valid++;
    });
    return Math.round((valid / requiredFields.length) * 100);
  };

  const percent = calculatePercent();

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
              disabled
              SelectProps={{
                displayEmpty: true,
              }}
            >
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
            </RHFSelect>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  Uploaded {documentType === 'cheque' ? 'Cheque' : 'Bank Statement'} :
                </Typography>
              </Box>

              {existingProof?.url ? (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Iconify icon="mdi:eye" />}
                  sx={{
                    height: 36,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  onClick={() => window.open(existingProof.url, '_blank')}
                >
                  Preview {documentType === 'cheque' ? 'Cheque' : 'Statement'}
                </Button>
              ) : (
                <Typography color="text.secondary">No file uploaded.</Typography>
              )}
            </Box>
          </Box>
          {/* <RHFFileUploadBox
            name="addressProof"
            label={`Upload ${documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}`}
            icon="mdi:file-document-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
            existing={existingProof}
            onDrop={(files) => handleDrop(files)}
            disabled
          /> */}

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
                      disabled
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
                            disabled
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
                      disabled
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="branchName"
                      label="Branch Name"
                      placeholder="Enter Branch Name"
                      disabled
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="accountHolderName"
                      label="Account Holder Name"
                      placeholder="Enter Account Holder Name"
                      disabled
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="accountNumber"
                      label="Account Number"
                      placeholder="Enter Account Number"
                      disabled
                    />
                  </Box>
                  <Box>
                    <RHFTextField
                      name="bankAddress"
                      label="Bank Address"
                      placeholder="Bank Address"
                      disabled
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
                      disabled
                      InputLabelProps={{
                        shrink: Boolean(getValues('bankShortCode')),
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* ACTION BUTTONS - Bottom Right */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
            }}
          >
            {/* REJECT BUTTON */}
            <Button
              variant="soft"
              color="error"
              onClick={() => setRejectOpen(true)}
              disabled={bankDetails?.status === 1 || bankDetails?.status === 2}
              sx={{
                opacity: bankDetails?.status === 1 || bankDetails?.status === 2 ? 0.4 : 1,
              }}
            >
              Reject
            </Button>

            {/* APPROVE BUTTON */}
            <Button
              variant="soft"
              color="success"
              onClick={handleApprove}
              disabled={bankDetails?.status === 1 || bankDetails?.status === 2}
              sx={{
                opacity: bankDetails?.status === 1 || bankDetails?.status === 2 ? 0.4 : 1,
              }}
            >
              Approve
            </Button>
          </Box>

          {/* Reject Reason Dialog */}
          <RejectReasonDialog
            open={rejectOpen}
            onClose={() => setRejectOpen(false)}
            reason={rejectReason}
            setReason={setRejectReason}
            onSubmit={handleRejectSubmit}
          />
        </Card>
      </FormProvider>
    </Container>
  );
}
