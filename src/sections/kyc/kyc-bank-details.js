// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
// components
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

export default function KYCBankDetails() {
  const [showDemat, setShowDemat] = useState(false);

  const NewBankSchema = Yup.object().shape({
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewBankSchema),
    defaultValues: {
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // Replace with API integration
    // eslint-disable-next-line no-console
    console.info('Company Documents', data);
  });

  // Demat form schema and methods
  const DematSchema = Yup.object().shape({
    dpId: Yup.string().required('DP ID is required'),
    boId: Yup.string().required('BO ID is required'),
    beneficiaryClientId: Yup.string().required('Beneficiary/Client ID is required'),
    dematAccountNumber: Yup.string().required('Demat Account Number is required'),
    depository: Yup.string().required('Depository is required'),
  });

  const dematMethods = useForm({
    resolver: yupResolver(DematSchema),
    defaultValues: {
      dpId: '',
      boId: '',
      beneficiaryClientId: '',
      dematAccountNumber: '',
      depository: '',
    },
  });

  const onSubmitDemat = dematMethods.handleSubmit(async (data) => {
    // Replace with API integration
    // eslint-disable-next-line no-console
    console.info('Demat Details', data);
  });

  return (
    <Container>
      <KYCTitle
        title="Bank & Demat Details"
        subtitle={'Add your bank and demat account information'}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Auto-Fill Details
          </Typography>

          <Grid container spacing={3}>
            {/* Left Section (9 columns) */}
            <Grid xs={12} md={9}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Bank Name */}
                <Box>
                  <Box sx={{ mb: 1, fontWeight: 600 }}>Bank Name</Box>
                  <RHFSelect
                    name="bankName"
                    placeholder="Select Bank"
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (value) =>
                        value || <Box sx={{ color: 'text.disabled' }}>Select Bank</Box>,
                    }}
                  >
                    <MenuItem value="">Select Bank</MenuItem>
                    {/* Add banks list if available */}
                  </RHFSelect>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                  >
                    This will be filled automatically after verifying your IFSC code
                  </Typography>
                </Box>

                {/* Branch Name */}
                <Box>
                  <Box sx={{ mb: 1, fontWeight: 600 }}>Branch Name</Box>
                  <RHFTextField name="branchName" placeholder="Enter Branch Name" />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                  >
                    Branch name is automatically detected once IFSC code is confirmed.
                  </Typography>
                </Box>

                {/* Account Number */}
                <Box>
                  <Box sx={{ mb: 1, fontWeight: 600 }}>Account Number</Box>
                  <RHFTextField name="accountNumber" placeholder="Enter Account Number" />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                  >
                    Your account number is encrypted and secure.
                  </Typography>
                </Box>

                {/* IFSC Code + Verify */}
                <Box>
                  <Box sx={{ mb: 1, fontWeight: 600 }}>IFSC Code</Box>
                  <RHFTextField name="ifscCode" placeholder="Enter IFSC Code (E.G., SBIN001234)" />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                  >
                    Enter your IFSC code to auto-detect your bank and branch details.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={() => setShowDemat(true)}>
                      Verify
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Right Section (3 columns) */}
            <Grid xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Account Type */}
                <Box>
                  <Box sx={{ mb: 1, fontWeight: 600 }}>Account Type</Box>
                  <RHFSelect
                    name="accountType"
                    placeholder="Select Account Type"
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (value) =>
                        value || <Box sx={{ color: 'text.disabled' }}>Select Account Type</Box>,
                    }}
                  >
                    <MenuItem value="">Select Account Type</MenuItem>
                    <MenuItem value="Savings">Savings</MenuItem>
                    <MenuItem value="Current">Current</MenuItem>
                  </RHFSelect>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                  >
                    Select your account type to proceed.
                  </Typography>
                </Box>

                {/* Illustration */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    component="img"
                    src="/assets/images/kyc/kyc-basic-info/kyc-autofill.svg"
                    alt="Bank details illustration"
                    sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>

      {showDemat && (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 3 }}>
            Demat Account Details
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
            Required for bond transactions
          </Typography>
          <FormProvider methods={dematMethods} onSubmit={onSubmitDemat}>
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                {/* Left Section (9 columns) */}
                <Grid xs={12} md={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Button size="small" variant="contained">
                        Fetch
                      </Button>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid xs={12} md={6}>
                        <Box>
                          <Box sx={{ mb: 1, fontWeight: 600 }}>DP ID</Box>
                          <RHFTextField name="dpId" placeholder="Enter DP ID (8 Digits)" />
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                          >
                            Depository Participant Identification
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Box>
                          <Box sx={{ mb: 1, fontWeight: 600 }}>BO ID</Box>
                          <RHFTextField name="boId" placeholder="Enter DP ID (8 Digits)" />
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                          >
                            Beneficial Owner Identification
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid xs={12} md={6}>
                        <Box>
                          <Box sx={{ mb: 1, fontWeight: 600 }}>Beneficiary/Client ID</Box>
                          <RHFTextField name="beneficiaryClientId" placeholder="123456678" />
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                          >
                            Enter A Number of Beneficiary/Client ID
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid xs={12} md={6}>
                        <Box>
                          <Box sx={{ mb: 1, fontWeight: 600 }}>Demat Account Number</Box>
                          <RHFTextField name="dematAccountNumber" placeholder="DP + Client ID" />
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                          >
                            Enter a Depository Participant Identification & Client ID
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid xs={12} md={6}>
                        <Box>
                          <Box sx={{ mb: 1, fontWeight: 600 }}>Depository</Box>
                          <RHFSelect
                            name="depository"
                            placeholder="Select Depository"
                            SelectProps={{
                              displayEmpty: true,
                              renderValue: (value) =>
                                value || <Box sx={{ color: 'text.disabled' }}>CDSL</Box>,
                            }}
                          >
                            <MenuItem value="CDSL">CDSL</MenuItem>
                            <MenuItem value="NSDL">NSDL</MenuItem>
                          </RHFSelect>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', display: 'block', mt: 0.75 }}
                          >
                            Depository Participant Identification
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Right Section (3 columns) */}
                {/* <Grid xs={12} md={3}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/images/kyc/kyc-basic-info/kyc-autofill.svg"
                      alt="Demat illustration"
                      sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                    />
                  </Box>
                </Grid> */}
              </Grid>
            </Box>
            
            {/* Demat Account Information Tip */}
            <Box 
              sx={{ 
                mt: 4,
                p: 3, 
                border: '1px solid #0049C6', 
                borderRadius: 1,
                backgroundColor: 'rgba(0, 111, 255, 0.05)'
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#006FFF', fontWeight: 600, mb: 1 }}>
                Demat Account Information
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Your DP ID and BO ID can be found on your demat account statement. These details are required to facilitate bond transactions and settlements.
              </Typography>
            </Box>

            {/* Account Verification Section */}
            <Box 
              sx={{ 
                mt: 3,
                p: 3, 
                backgroundColor: '#FFF7EA',
                borderRadius: 1,
                border: '1px solid #FFEBD0'
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#7B332B', fontWeight: 600, mb: 1 }}>
                Account Verification
              </Typography>
              <Typography variant="body2" sx={{ color: '#BE5149', mb: 2 }}>
                Your bank and demat account details will be verified during the compliance review process. Please ensure all information is accurate to avoid delays
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, '& li': { color: '#ED9B00', mb: 0.5 } }}>
                <Typography component="li" variant="body2">Bank account should be in the company's name</Typography>
                <Typography component="li" variant="body2">Demat account should be linked to the same company</Typography>
                <Typography component="li" variant="body2">All details will be cross-verified with regulatory databases</Typography>
              </Box>
            </Box>
          </FormProvider>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 2 }}>
        <Button component={RouterLink} href={paths.kycBasicInfo} variant="outlined">
          Back
        </Button>
        <Button variant="contained" loading={isSubmitting}>
          Next
        </Button>
      </Box>

      <KYCFooter />
    </Container>
  );
}
