// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
import Iconify from 'src/components/iconify';
import KYCReviewAndSubmitCard from './kyc-review-and-submit-card';
// ----------------------------------------------------------------------

export default function KYCReviewAndSubmit() {
  return (
    <>
      <Container>
        <KYCTitle
          title="Review & Submit"
          subtitle={'Please review all information before submitting your application'}
        />

        <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
          <Grid xs={12} md={6}>
            {/* Company Information */}
            <KYCReviewAndSubmitCard
              isFullWidth={false}
              title="Company Information"
              editPath={paths.kyc.basicInfo}
              icon="solar:buildings-bold"
              data={[
                { title: 'Company Name', value: 'ABC INFRA TECH SOLUTION PRIVATE LTD' },
                { title: 'GSTIN', value: '27ABCD1234F1Z5' },
                { title: 'Place of Incorporation', value: 'Nashik, Maharashtra, India' },
                { title: 'PAN Number', value: 'ABCDE1234F' },
                { title: "PAN Holder's Name", value: 'MR. Aniket S. Sonawane' },
                { title: 'CIN', value: 'U12345MH2025PTC1123456' },
                { title: 'Designation', value: 'CEO' },
                { title: 'Date of Incorporation', value: '01/01/2025' },
                { title: 'Entity Type', value: 'Private Limited' },
                { title: 'Date of Birth', value: '01/01/1980' },
              ]}
            />

            {/* Address Information */}

            <KYCReviewAndSubmitCard
              isFullWidth={true}
              title="Address Information"
              editPath={paths.kyc.addressInfo} // Make sure this path is defined in your routes
              icon="mdi:map-marker-outline"
              data={[
                {
                  title: 'Registered Address',
                  value: 'Silver Arc Building, Baner Road, Pune, Maharashtra – 411045',
                },
                {
                  title: 'Correspondence Address',
                  value: 'Silver Arc Building, Baner Road, Pune, Maharashtra – 411045',
                },
              ]}
            />

            {/* Audited Financials */}
            <KYCReviewAndSubmitCard
              isFullWidth={true}
              title="Audited Financials"
              editPath={paths.kyc.addressInfo} // Make sure this path is defined in your routes
              icon="mdi:file-document-outline"
              data={[
                {
                  title: 'IT Returns',
                  value: 'Uploaded',
                },
                {
                  title: 'GST Returns',
                  value: 'Pending',
                },
                {
                  title: 'Audited Financial Statements- Last 2 Years',
                  value: 'Pending',
                },
              ]}
            />
          </Grid>

          <Grid xs={12} md={6}>
            {/* Company Details */}
            <KYCReviewAndSubmitCard
              isFullWidth={true}
              title="Company Details"
              editPath={paths.kyc.companyDetails} // Make sure this path is defined in your routes
              icon="solar:buildings-bold"
              data={[
                {
                  title: 'Power of Attorney',
                  value: 'Uploaded',
                },
                {
                  title: 'Certificate of Incorporation',
                  value: 'Uploaded',
                },
                {
                  title: '(MoA) Memorandum of Association & (AoA) Articles of Association',
                  value: 'Pending',
                },
              ]}
            />

            {/* Bank and Demat Details */}
            <KYCReviewAndSubmitCard
              isFullWidth={false}
              title="Bank and Demat Details"
              editPath={paths.kyc.companyDetails} // Make sure this path is defined in your routes
              icon="mdi:bank-outline"
              data={[
                {
                  title: 'IFSC Code',
                  value: 'SBIN001234',
                },
                {
                  title: 'Bank Name',
                  value: 'State Bank of India',
                },
                {
                  title: 'Account Number',
                  value: '1234567890',
                },
                {
                  title: 'DP ID',
                  value: 'AS245WA566',
                },
                {
                  title: 'BO ID',
                  value: 'AS245WA566',
                },
                {
                  title: 'Depository',
                  value: 'CDSL',
                },
              ]}
            />

            {/* Added Signatories */}
            <KYCReviewAndSubmitCard
              isFullWidth={true}
              title="Added Signatories"
              editPath={paths.kyc.companyDetails} // Make sure this path is defined in your routes
              icon="mdi:account-multiple-plus"
              data={[
                {
                  title: 'Director',
                  value: 'Mr. Anand C. Patil, Mr. Anand C. Patil, Mr. Anand C. Patil',
                },
                {
                  title: 'Signatory',
                  value: 'Mr. Anand C. Patil, Mr. Anand C. Patil, Mr. Anand C. Patil',
                },
                {
                  title: 'Manager',
                  value: 'Mr. Anand C. Patil, Mr. Anand C. Patil, Mr. Anand C. Patil',
                },
              ]}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ color: '#004A9A', mt: 3, mb: 1, fontWeight: 'bold' }}>
          Electronic Signature Consent
        </Typography>
        <Typography variant="body2" sx={{ color: '#004A9A', mb: 5 }}>
          By checking the box below, you consent to electronically sign this application and agree
          that your electronic signature has the same legal effect as a handwritten signature.
        </Typography>
      </Container>
      <Box sx={{ backgroundColor: '#383535', p: 3, mb: 5 }}>
        <FormControlLabel
          control={<Checkbox sx={{ color: '#FFFFFF', '&.Mui-checked': { color: '#FFFFFF' } }} />}
          label={
            <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
              I agree to electronically sign this application and acknowledge that I have reviewed
              all information provided above. I understand that submitting false information may
              result in rejection of this application.
            </Typography>
          }
          sx={{ m: 0 }}
        />
      </Box>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 2 }}>
          <Button component={RouterLink} href={paths.kycBasicInfo} variant="outlined">
            Back
          </Button>
          <Button variant="contained">Submit For Review</Button>
        </Box>

        <KYCFooter />
      </Container>
    </>
  );
}
