import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import FormProvider from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export default function KYCCompanyDetails() {
  const methods = useForm({
    defaultValues: {
      certificateOfIncorporation: null,
      moaAoa: null,
      msmeUdyamCertificate: null,
      importExportCertificate: null,
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

  return (
    <Container>
      <KYCTitle
        title="Company Details"
        subtitle={
          'Kindly submit your company’s key documents, such as the Memorandum of Association (MoA) and Articles of Association (AoA). These documents are necessary for verification of your company’s legal existence and compliance with applicable regulations'
        }
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
          <RHFFileUploadBox
            name="certificateOfIncorporation"
            label="Certificate of Incorporation"
            icon="mdi:certificate-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
          />

          <RHFFileUploadBox
            name="moaAoa"
            label="(MoA) Memorandum of Association / (AoA) Article of Association"
            icon="mdi:file-document-edit-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
          />

          <RHFFileUploadBox
            name="msmeUdyamCertificate"
            label="MSME / Udyam Certificate"
            icon="mdi:briefcase-outline"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
          />

          <RHFFileUploadBox
            name="importExportCertificate"
            label="Import Export Certificate (IEC)"
            icon="mdi:earth"
            color="#1e88e5"
            acceptedTypes="pdf,xls,docx,jpeg"
            maxSizeMB={10}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 2 }}>
          <Button component={RouterLink} href={paths.kycBasicInfo} variant="outlined">
            Back
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Next
          </LoadingButton>
        </Box>
      </FormProvider>

      <KYCFooter />
    </Container>
  );
}
