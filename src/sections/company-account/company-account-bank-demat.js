import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

// components / utils (adjust paths if necessary)
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';

/**
 * BankDematNewForm
 * - Keeps only Bank + Demat sections (replaced address form)
 * - Auto-fill from uploaded passbook/cheque/bank statement
 * - Verify IFSC and submit bank details
 * - Submit demat details
 */
export default function BankDematNewForm({ onClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [preview, setPreview] = useState(null);
  const [showDemat, setShowDemat] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const COMPANY_ID = sessionStorage.getItem('company_information_id');

  // -------------------------------------------------------
  // Validation Schema
  // -------------------------------------------------------
  const schema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    addressProof: Yup.mixed().required('Document is required'),

    // Bank fields
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),

    // Demat fields (only validated when shown)
    dpId: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('DP ID is required'),
    }),
    dpName: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('DP Name is required'),
    }),
    beneficiaryClientId: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('Beneficiary/Client ID is required'),
    }),
    dematAccountNumber: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('Demat Account Number is required'),
    }),
    depository: Yup.string().when('showDemat', {
      is: true,
      then: (s) => s.required('Depository is required'),
    }),
  });

  // -------------------------------------------------------
  // Form
  // -------------------------------------------------------
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documentType: 'passbook',
      addressProof: null,
      // bank
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'SAVINGS',
      // demat
      dpId: '',
      dpName: '',
      beneficiaryClientId: '',
      dematAccountNumber: '',
      depository: '',
      // helper field for conditional validation
      showDemat: false,
    },
    reValidateMode: 'onChange',
  });

  const {
    setValue,
    control,
    watch,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const addressProof = useWatch({ control, name: 'addressProof' });
  const documentType = useWatch({ control, name: 'documentType' });

  // -------------------------------------------------------
  // Helpers
  // -------------------------------------------------------
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (!file) return;

    setValue('addressProof', file, { shouldValidate: true });

    // preview if image
    if (file.type?.startsWith?.('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    extractBankDetails(file);
  };

  const handleRemove = () => {
    setValue('addressProof', null, { shouldValidate: true });
    setPreview(null);
  };

  // -------------------------------------------------------
  // Extract bank details from uploaded document
  // (calls your backend: /bank-details/extract/)
  // -------------------------------------------------------
  const extractBankDetails = async (file) => {
    try {
      const formData = new FormData();
      formData.append('document_type', documentType || 'passbook');
      // backend expected key may be 'file' or 'document' — use 'file' as in original
      formData.append('file', file);

      const res = await axiosInstance.post(
        `/api/kyc/issuer_kyc/bank-details/extract/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const extracted = res?.data?.data?.extracted_data?.data ?? null;

      if (!extracted) {
        enqueueSnackbar('Could not extract bank details from document', { variant: 'warning' });
        return;
      }

      // Auto-fill detected fields
      setValue('bankName', extracted.bank_name || '', { shouldValidate: true });
      setValue('branchName', extracted.branch_name || '', { shouldValidate: true });
      setValue('accountNumber', extracted.account_number || '', { shouldValidate: true });
      setValue('ifscCode', extracted.ifsc_code || '', { shouldValidate: true });
      setValue('accountType', extracted.account_type || 'SAVINGS', { shouldValidate: true });

      enqueueSnackbar('Auto-filled bank details from uploaded document', { variant: 'success' });
    } catch (err) {
      console.error('extractBankDetails error', err);
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to extract bank details. Try different document.',
        { variant: 'error' }
      );
    }
  };

  // -------------------------------------------------------
  // Verify bank detail (IFSC) and submit bank details to backend
  // -------------------------------------------------------
  const verifyBankDetail = async () => {
    try {
      const data = getValues();
      const payload = {
        account_number: data.accountNumber,
        bank_name: data.bankName,
        branch_name: data.branchName,
        account_type: data.accountType,
        ifsc_code: data.ifscCode,
      };

      const res = await axiosInstance.post(
        `/api/kyc/issuer_kyc/bank-details/verify/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      enqueueSnackbar(res?.data?.message || 'Bank details verified', { variant: 'success' });

      // optionally submit bank details after verification
      await axiosInstance.post(
        `/api/kyc/issuer_kyc/bank-details/submit/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      enqueueSnackbar('Bank details submitted successfully', { variant: 'success' });

      // Show demat section now
      setShowDemat(true);
      setValue('showDemat', true);
    } catch (err) {
      console.error('verifyBankDetail error', err);
      const errMsg =
        err?.response?.data?.message ||
        'Bank verification failed. Please check IFSC / account number and try again.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  // -------------------------------------------------------
  // Submit demat details (and optionally bank)
  // -------------------------------------------------------
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsUploading(true);

      // build demat payload
      const dematPayload = {
        dp_name: data.dpName,
        depository_participant: data.depository,
        dp_id: Number(data.dpId),
        demat_account_number: String(data.dematAccountNumber),
        client_id_bo_id: String(data.beneficiaryClientId),
      };

      // Post demat
      const dematRes = await axiosInstance.post(`/api/kyc/issuer_kyc/company/demat/`, dematPayload, {
        headers: { 'Content-Type': 'application/json' },
      });

      enqueueSnackbar(dematRes?.data?.message || 'Demat details submitted', { variant: 'success' });

      // Optionally navigate or call onClose
      onClose?.();
    } catch (err) {
      console.error('onSubmit error', err);
      const errMsg =
        err?.response?.data?.message || 'Submission failed. Please check details and try again.';
      enqueueSnackbar(errMsg, { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  });

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Bank & Demat Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Upload passbook/cheque/bank statement to auto-fill bank details. Verify IFSC to
            proceed to Demat details.
          </Typography>
        </Stack>

        {/* Document Type + Upload */}
        <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: 240 }}>
            <RHFSelect
              name="documentType"
              placeholder="Document Type"
              SelectProps={{
                displayEmpty: true,
              }}
            >
              <MenuItem value="passbook">Passbook</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
            </RHFSelect>
          </Box>

          <RHFFileUploadBox
            name="addressProof"
            label={`Upload ${
              (documentType === 'passbook' && 'Passbook') ||
              (documentType === 'cheque' && 'Cheque') ||
              (documentType === 'bank_statement' && 'Bank Statement')
            }`}
            acceptedTypes="pdf,jpeg,jpg,png"
            maxSizeMB={10}
            onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
          />
        </Stack>

        {/* Bank fields */}
        <Box sx={{ py: 2 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={9}>
              <Stack spacing={3}>
                <Box>
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>Bank Name</Typography>
                  <RHFTextField name="bankName" placeholder="Enter Bank Name" />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Will be auto-filled after extraction/IFSC verification.
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>Branch Name</Typography>
                  <RHFTextField name="branchName" placeholder="Enter Branch Name" />
                </Box>

                <Box>
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>Account Number</Typography>
                  <RHFTextField name="accountNumber" placeholder="Enter Account Number" />
                </Box>

                <Box>
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>IFSC Code</Typography>
                  <RHFTextField name="ifscCode" placeholder="E.g., SBIN0000001" />
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={verifyBankDetail} type="button">
                      Verify
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack spacing={3}>
                <Box>
                  <Typography sx={{ mb: 1, fontWeight: 600 }}>Account Type</Typography>
                  <RHFSelect name="accountType" placeholder="Account Type">
                    <MenuItem value="SAVINGS">Savings</MenuItem>
                    <MenuItem value="CURRENT">Current</MenuItem>
                  </RHFSelect>
                </Box>

                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/kyc/kyc-basic-info/kyc-autofill.svg"
                    alt="autofill"
                    sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Demat fields - shown after verify */}
          <Paper
            variant="outlined"
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Demat Account Details
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>DP ID</Typography>
                <RHFTextField name="dpId" placeholder="Enter DP ID (8 Digits)" />
              </Grid>

              <Grid xs={12} md={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>DP Name</Typography>
                <RHFTextField name="dpName" placeholder="DP / Broker Name" />
              </Grid>

              <Grid xs={12} md={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Client ID / BO ID</Typography>
                <RHFTextField name="beneficiaryClientId" placeholder="Enter Client ID / BO ID" />
              </Grid>

              <Grid xs={12} md={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Demat Account Number</Typography>
                <RHFTextField name="dematAccountNumber" placeholder="Enter Demat Account Number" />
              </Grid>

              <Grid xs={12} md={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Depository</Typography>
                <RHFSelect name="depository" placeholder="Select Depository">
                  <MenuItem value="CDSL">CDSL</MenuItem>
                  <MenuItem value="NSDL">NSDL</MenuItem>
                </RHFSelect>
              </Grid>
            </Grid>
          </Paper>
        {/* Submit / buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'end' ,gap: 2 , mt: 4 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="contained" type="submit" disabled={isUploading || isSubmitting}>
            {isUploading || isSubmitting ? 'Submitting...' : 'Save & Continue'}
          </Button>
        </Box>
      </Paper>
    </FormProvider>
  );
}

BankDematNewForm.propTypes = {
  onClose: PropTypes.func,
};
