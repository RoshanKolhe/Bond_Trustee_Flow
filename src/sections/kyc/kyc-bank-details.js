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

// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useRouter } from 'src/routes/hook';
import KYCStepper from './kyc-stepper';

// ----------------------------------------------------------------------

export default function KYCBankDetails() {
  const router = useRouter();

  // ---------------- VALIDATION ----------------
  const NewSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    addressProof: Yup.mixed().required('Address proof is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    reValidateMode: "onChange",
    defaultValues: {
      documentType: 'passbook',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'SAVINGS',
      addressProof: null,
    },
  });

  const { setValue, control, watch, handleSubmit } = methods;
  const values = watch();
  const documentType = useWatch({ control, name: 'documentType' });

  // ---------------- FILE UPLOAD ----------------
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue("addressProof", file, { shouldValidate: true });
    }
  };

  // ---------------- SUBMIT ----------------
  const onSubmit = handleSubmit(async (data) => {
    const bankPayload = {
      account_number: data.accountNumber,
      bank_name: data.bankName,
      branch_name: data.branchName,
      account_type: data.accountType,
      ifsc_code: data.ifscCode,
      document_type: data.documentType,
      account_proof: data.addressProof,
    };

    console.log("📤 BANK DATA SUBMITTED:", bankPayload);

    // No API — just next step
    router.push(paths.KYCSignatories);
  });

  // ---------------- PROGRESS BAR ----------------
  const requiredFields = [
    "addressProof",
    "bankName",
    "branchName",
    "accountNumber",
    "ifscCode",
  ];

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

  return (
    <Container>
      <KYCStepper percent={percent} />
      <KYCTitle title="Bank Details" subtitle="Add your bank account information" />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* ---------------- SELECT DOCUMENT TYPE ---------------- */}
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Select Document Type:
          </Typography>

          <Box sx={{ width: 200, mb: 3 }}>
            <RHFSelect
              name="documentType"
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) =>
                  value ? value : <Box sx={{ color: "text.disabled" }}>Select Type</Box>,
              }}
            >
              <MenuItem value="passbook">Passbook</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
            </RHFSelect>
          </Box>

          {/* ---------------- ADDRESS PROOF UPLOAD ---------------- */}
          <RHFFileUploadBox
            name="addressProof"
            label={`Upload ${
              documentType === "passbook"
                ? "Passbook"
                : documentType === "cheque"
                ? "Cheque"
                : "Bank Statement"
            }`}
            icon="mdi:file-document-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
            onDrop={(files) => handleDrop(files)}
          />

          {/* ---------------- BANK FIELDS ---------------- */}
          <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={9}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography sx={{ mb: 1, fontWeight: 600 }}>Bank Name</Typography>
                    <RHFTextField name="bankName" placeholder="Enter Bank Name" />
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
                    <RHFTextField name="ifscCode" placeholder="Enter IFSC Code" />
                  </Box>
                </Box>
              </Grid>

              <Grid xs={12} md={3}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography sx={{ mb: 1, fontWeight: 600 }}>Account Type</Typography>
                    <RHFSelect name="accountType">
                      <MenuItem value="SAVINGS">Savings</MenuItem>
                      <MenuItem value="CURRENT">Current</MenuItem>
                    </RHFSelect>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* ---------------- FOOTER BUTTONS ---------------- */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, mb: 2 }}>
          <Button component={RouterLink} href={paths.kycCompanyDetails} variant="outlined">
            Back
          </Button>

          <Button variant="contained" type="submit">
            Next
          </Button>
        </Box>
      </FormProvider>

      <KYCFooter />
    </Container>
  );
}
