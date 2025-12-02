import { m } from 'framer-motion';
import * as Yup from 'yup';
// @mui
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

// components
import { RouterLink } from 'src/routes/components';
import { MotionContainer, varFade } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import FormProvider from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
// sections
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'src/routes/hook';
import KYCStepper from './kyc-stepper';
import { yupResolver } from '@hookform/resolvers/yup';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function KYCCompanyDetails() {
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [docSummary, setDocSummary] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const base = process.env.REACT_APP_HOST_API || '';
  const companyId = sessionStorage.getItem('company_information_id');

  const CompanyDetailSchema = Yup.object().shape({
    certificateOfIncorporation: Yup.mixed().required('Certificate of Incorporation is required'),

    moaAoaType: Yup.string().required('Please select MoA or AoA'),

    moaAoa: Yup.mixed().required('Please upload the selected document (MoA or AoA)'),
  });

  const methods = useForm({
    resolver: yupResolver(CompanyDetailSchema),
    defaultValues: {
      certificateOfIncorporation: null,
      moaAoa: null,
      sebiCertificate: null,
      gstCertificate: null,
      moaAoaType: 'moa',
    },
  });
  const { setValue, control } = methods;

  // // Watch the select values for dynamic labels
  // const moaAoaType = useWatch({ control, name: 'moaAoaType' });
  // const msmeUdyamAvailability = useWatch({ control, name: 'msmeUdyamAvailability' });

  // Get the display name for the selected document type
  const getMoaAoaLabel = () => {
    switch (moaAoaType) {
      case 'moa':
        return 'MoA - Memorandum of Association';
      case 'aoa':
        return 'AoA - Articles of Association';
      default:
        return 'Document';
    }
  };

  useEffect(() => {
    // Prefill selects based on existing documents
    const has = (n) => (docs || []).some((d) => d.document_name === n);
    if (has('MOA')) setValue('moaAoaType', 'moa');
    else if (has('AOA')) setValue('moaAoaType', 'aoa');

    if (has('MSME')) setValue('msmeUdyamAvailability', 'msme');
    else if (has('UDYAM')) setValue('msmeUdyamAvailability', 'udyam');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const moaAoaType = useWatch({ control, name: 'moaAoaType' });

  const DOCUMENT_MAP = {
    certificate_of_incorporation: '091b9240-d614-4b88-86ca-29e21a47c504',
    moa: '63f4d91c-5b39-4e85-9941-48f27376f1dd',
    aoa: '5dc2ef67-82c7-41ea-849f-362e61a4782a',
    gst_certificate: 'ae2721a3-f3af-4dc8-8b64-0b1233b03523',
    sebi_registration_certificate: 'ff7575eb-e42d-4677-9088-456d7b36109f',
  };

  const onSubmit = handleSubmit(async (form) => {
    try {
      const usersId = sessionStorage.getItem('trustee_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID not found in session!', { variant: 'error' });
        return;
      }

      // 2️⃣ Map fields → document values
      const uploadList = [
        {
          field: 'certificateOfIncorporation',
          value: 'certificate_of_incorporation',
        },
        {
          field: 'moaAoa',
          value: form.moaAoaType === 'moa' ? 'moa' : 'aoa',
        },
        {
          field: 'gstCertificate',
          value: 'gst_certificate',
        },
        {
          field: 'sebiCertificate',
          value: 'sebi_registration_certificate',
        },
      ];

      const uploadedDocuments = [];

      for (const item of uploadList) {
        const file = form[item.field];
        if (!file) continue;

        const fd = new FormData();
        fd.append('file', file);

        const res = await axiosInstance.post('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const uploaded = res?.data?.files?.[0];

        if (!uploaded?.id) {
          enqueueSnackbar(`Upload failed for ${item.field}`, { variant: 'error' });
          continue;
        }

        uploadedDocuments.push({
          documentsId: DOCUMENT_MAP[item.value],
          documentsFileId: uploaded.id,
        });
      }
      const payload = {
        usersId,
        documents: uploadedDocuments,
      };

      console.log('📤 FINAL PAYLOAD:', payload);

      const final = await axiosInstance.post('/trustee-profiles/kyc-upload-documents', payload);

      if (final?.data?.success) {
        enqueueSnackbar('Documents uploaded successfully!', {
          variant: 'success',
        });
        router.push(paths.KYCBankDetails);
      } else {
        enqueueSnackbar(final?.data?.message || 'Upload failed', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('❌ ERROR uploading documents:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  });

  const requiredFields = [
    'certificateOfIncorporation',
    'moaAoa',
    'sebiCertificate',
    'gstCertificate',
  ];

  const allValues = methods.watch();
  const errors = methods.formState.errors;

  const calculatePercent = () => {
    let validCount = 0;

    requiredFields.forEach((field) => {
      const value = allValues[field];

      const hasError = !!errors[field];

      if (value && !hasError) {
        validCount++;
      }
    });

    return Math.round((validCount / requiredFields.length) * 100);
  };

  const percent = calculatePercent();

  // useEffect(() => {
  //   const run = async () => {
  //     setLoadingDocs(true);
  //     try {
  //       const accessToken = sessionStorage.getItem('accessToken');
  //       const res = await fetch(`${base}/api/kyc/issuer_kyc/companies/documents/`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  //         },
  //       });
  //       if (!res.ok) {
  //         setDocs([]);
  //         setDocSummary(null);
  //         return;
  //       }
  //       let json = {};
  //       try {
  //         json = await res.json();
  //       } catch (e) {
  //         json = {};
  //       }
  //       const data = json?.data ?? {};
  //       setDocs(Array.isArray(data.documents) ? data.documents : []);
  //       setDocSummary(data.summary ?? null);
  //     } catch (e) {
  //       setDocs([]);
  //       setDocSummary(null);
  //     } finally {
  //       setLoadingDocs(false);
  //     }
  //   };
  //   run();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [companyId, base]);

  return (
    <Container>
      <KYCStepper percent={percent} />
      <KYCTitle
        title="Trustee Company Details"
        subtitle={
          'Kindly submit your company’s key documents, such as the Memorandum of Association (MoA) and Articles of Association (AoA). These documents are necessary for verification of your company’s legal existence and compliance with applicable regulations'
        }
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {(() => {
          const byName = (n) => (docs || []).find((d) => d.document_name === n);
          const toExisting = (d) =>
            d ? { name: d.document_name_display || d.document_name } : null;
          var ex_CERT = toExisting(byName('CERTIFICATE_INC'));
          var ex_MOA = toExisting(byName('MOA'));
          var ex_MSME = toExisting(byName('MSME'));
          var ex_IEC = toExisting(byName('IEC'));
          return null;
        })()}
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 3 }}>
            <RHFFileUploadBox
              name="certificateOfIncorporation"
              label="Certificate of Incorporation*"
              icon="mdi:certificate-outline"
              color="#1e88e5"
              acceptedTypes="pdf,xls,docx,jpeg"
              maxSizeMB={10}
              existing={
                (docs || []).find((d) => d.document_name === 'CERTIFICATE_INC')
                  ? {
                      name:
                        (docs || []).find((d) => d.document_name === 'CERTIFICATE_INC')
                          .document_name_display ||
                        (docs || []).find((d) => d.document_name === 'CERTIFICATE_INC')
                          .document_name,
                      status: (docs || []).find((d) => d.document_name === 'CERTIFICATE_INC')
                        .status,
                    }
                  : null
              }
            />
            <YupErrorMessage name="certificateOfIncorporation" />

            <RHFSelect
              name="moaAoaType"
              label="Select Document Type"
              sx={{ width: '100%', maxWidth: 400 }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="moa">MoA - Memorandum of Association*</MenuItem>
              <MenuItem value="aoa">AoA - Articles of Association*</MenuItem>
              {/* <MenuItem value="both">Both (MoA + AoA Combined)</MenuItem> */}
            </RHFSelect>
            {(() => {
              const moad = (docs || []).find(
                (d) => d.document_name === 'MOA' || d.document_name === 'AOA'
              );
              return moad ? (
                <Typography variant="caption" color="text.secondary">
                  Selected: {moad.document_name_display || moad.document_name}
                </Typography>
              ) : null;
            })()}

            <RHFFileUploadBox
              name="moaAoa"
              label={getMoaAoaLabel()}
              icon="mdi:file-document-edit-outline"
              color="#1e88e5"
              acceptedTypes="pdf,xls,docx,jpeg"
              maxSizeMB={10}
              existing={
                (docs || []).find((d) => d.document_name === (moaAoaType === 'aoa' ? 'AOA' : 'MOA'))
                  ? {
                      name:
                        (docs || []).find(
                          (d) => d.document_name === (moaAoaType === 'aoa' ? 'AOA' : 'MOA')
                        )?.document_name_display ||
                        (docs || []).find(
                          (d) => d.document_name === (moaAoaType === 'aoa' ? 'AOA' : 'MOA')
                        )?.document_name ||
                        getMoaAoaLabel(),
                      status: (docs || []).find(
                        (d) => d.document_name === (moaAoaType === 'aoa' ? 'AOA' : 'MOA')
                      )?.status,
                    }
                  : null
              }
            />
            <YupErrorMessage name="moaAoa" />

            <RHFFileUploadBox
              name="sebiCertificate"
              label="SEBI"
              icon="mdi:briefcase-outline"
              color="#1e88e5"
              acceptedTypes="pdf,xls,docx,jpeg"
              maxSizeMB={10}
              // multiple={msmeUdyamAvailability === 'both'}
            />

            <RHFFileUploadBox
              name="gstCertificate"
              label="GST"
              icon="mdi:earth"
              color="#1e88e5"
              acceptedTypes="pdf,xls,docx,jpeg"
              maxSizeMB={10}
              existing={
                (docs || []).find((d) => d.document_name === 'IEC')
                  ? {
                      name:
                        (docs || []).find((d) => d.document_name === 'IEC').document_name_display ||
                        (docs || []).find((d) => d.document_name === 'IEC').document_name,
                      status: (docs || []).find((d) => d.document_name === 'IEC').status,
                    }
                  : null
              }
            />
          </Box>
        </Paper>
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
