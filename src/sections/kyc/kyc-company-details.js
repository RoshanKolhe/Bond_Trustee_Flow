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

  useEffect(() => {
    const run = async () => {
      setLoadingDocs(true);
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const res = await fetch(`${base}/api/kyc/issuer_kyc/companies/documents/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        if (!res.ok) {
          setDocs([]);
          setDocSummary(null);
          return;
        }
        let json = {};
        try {
          json = await res.json();
        } catch (e) {
          json = {};
        }
        const data = json?.data ?? {};
        setDocs(Array.isArray(data.documents) ? data.documents : []);
        setDocSummary(data.summary ?? null);
      } catch (e) {
        setDocs([]);
        setDocSummary(null);
      } finally {
        setLoadingDocs(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, base]);

  const methods = useForm({
    resolver: yupResolver(CompanyDetailSchema),
    defaultValues: {
      certificateOfIncorporation: null,
      moaAoa: null,
      msmeUdyamCertificate: null,
      importExportCertificate: null,
      moaAoaType: 'moa',
      msmeUdyamAvailability: 'msme',
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
  const msmeUdyamAvailability = useWatch({ control, name: 'msmeUdyamAvailability' });

  // const onSubmit = handleSubmit(async (form) => {
  //   const base = process.env.REACT_APP_HOST_API || '';
  //   const companyId = sessionStorage.getItem('company_information_id');
  //   const bulkUrl = `${base}/api/kyc/issuer_kyc/companies/documents/bulkupload/`;

  //   const accessToken = sessionStorage.getItem('accessToken');
  //   const upper = (v) => (typeof v === 'string' ? v.toUpperCase() : '');

  //   // Helper to find existing doc by canonical name
  //   const findDoc = (name) => (docs || []).find((d) => d.document_name === name);

  //   // Collect PUT tasks for files replacing existing docs
  //   const putTasks = [];

  //   const tryQueuePut = (file, existingDoc) => {
  //     if (!file || !existingDoc?.document_id) return false;
  //     const putFd = new FormData();
  //     putFd.append('file', file);
  //     const url = `${base}/api/kyc/issuer_kyc/companies/documents/${existingDoc.document_id}/`;
  //     putTasks.push(
  //       fetch(url, {
  //         method: 'PUT',
  //         headers: {
  //           ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  //         },
  //         body: putFd,
  //       })
  //     );
  //     return true;
  //   };

  //   // Determine which to PUT vs keep for bulk POST
  //   const bulkFd = new FormData();

  //   // Certificate of Incorporation
  //   const exCert = findDoc('CERTIFICATE_INC');
  //   if (!tryQueuePut(form.certificateOfIncorporation, exCert)) {
  //     if (form.certificateOfIncorporation)
  //       bulkFd.append('certificate_of_incorporation', form.certificateOfIncorporation);
  //   }

  //   // MoA/AoA combined upload field
  //   const exMoa = findDoc('MOA') || findDoc('AOA');
  //   if (!tryQueuePut(form.moaAoa, exMoa)) {
  //     if (form.moaAoa) {
  //       bulkFd.append('moa_aoa_file', form.moaAoa);
  //       if (form.moaAoaType) bulkFd.append('moa_aoa_type', upper(form.moaAoaType));
  //     }
  //   }

  //   // MSME/Udyam combined field
  //   const exMsme = findDoc('MSME') || findDoc('UDYAM');
  //   if (!tryQueuePut(form.msmeUdyamCertificate, exMsme)) {
  //     if (form.msmeUdyamCertificate) {
  //       bulkFd.append('msme_udyam_file', form.msmeUdyamCertificate);
  //       if (form.msmeUdyamAvailability)
  //         bulkFd.append('msme_udyam_type', upper(form.msmeUdyamAvailability));
  //     }
  //   }

  //   // IEC
  //   const exIec = findDoc('IEC');
  //   if (!tryQueuePut(form.importExportCertificate, exIec)) {
  //     if (form.importExportCertificate)
  //       bulkFd.append('import_export_certificate', form.importExportCertificate);
  //   }

  //   try {
  //     // Execute PUT updates first (if any)
  //     if (putTasks.length > 0) {
  //       const putResponses = await Promise.all(putTasks);
  //       for (const r of putResponses) {
  //         if (!r.ok) {
  //           const t = await r.text();
  //           throw new Error(t || 'Failed to update existing document');
  //         }
  //       }
  //     }

  //     // If there are files to POST in bulk, do it
  //     const hasBulkFiles = Array.from(bulkFd.keys()).some((k) =>
  //       [
  //         'certificate_of_incorporation',
  //         'moa_aoa_file',
  //         'msme_udyam_file',
  //         'import_export_certificate',
  //       ].includes(k)
  //     );
  //     if (hasBulkFiles) {
  //       const res = await fetch(bulkUrl, {
  //         method: 'POST',
  //         headers: {
  //           ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  //         },
  //         body: bulkFd,
  //       });
  //       if (!res.ok) {
  //         const txt = await res.text();
  //         throw new Error(txt || 'Failed to upload documents');
  //       }
  //     }

  //     // Navigate to next step on success
  //     router.push(paths.KYCBankDetails);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.error(err);
  //   }
  // });
  const onSubmit = handleSubmit(async (form) => {
    console.log('🚀 Final Submitted Form Data:', {
      certificateOfIncorporation: form.certificateOfIncorporation,
      moaAoaType: form.moaAoaType,
      moaAoa: form.moaAoa,
      msmeUdyamCertificate: form.msmeUdyamCertificate,
      importExportCertificate: form.importExportCertificate,
      msmeUdyamAvailability: form.msmeUdyamAvailability,
    });

    // You can move to next page if needed
    router.push(paths.KYCBankDetails);
  });

  const requiredFields = [
    'certificateOfIncorporation', // required by Yup
    'moaAoa', // file
    'msmeUdyamCertificate', // file
    'importExportCertificate', // IEC file (optional in UI but still part of progress)
  ];

  const allValues = methods.watch();
  const errors = methods.formState.errors;

  const calculatePercent = () => {
    let validCount = 0;

    requiredFields.forEach((field) => {
      const value = allValues[field];

      const hasError = !!errors[field];

      // VALID when:
      //   - field is not empty
      //   - AND no validation error from Yup
      if (value && !hasError) {
        validCount++;
      }
    });

    return Math.round((validCount / requiredFields.length) * 100);
  };

  const percent = calculatePercent();

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
              <MenuItem value="moa">MoA - Memorandum of Association</MenuItem>
              <MenuItem value="aoa">AoA - Articles of Association</MenuItem>
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
              name="msmeUdyamCertificate"
              label="SEBI"
              icon="mdi:briefcase-outline"
              color="#1e88e5"
              acceptedTypes="pdf,xls,docx,jpeg"
              maxSizeMB={10}
              // multiple={msmeUdyamAvailability === 'both'}
            />

            <RHFFileUploadBox
              name="importExportCertificate"
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
