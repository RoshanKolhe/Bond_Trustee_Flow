import * as Yup from 'yup';
import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import FormProvider from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import KYCTitle from './kyc-title';
import KYCFooter from './kyc-footer';

import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import axiosInstance from 'src/utils/axios';

import { enqueueSnackbar } from 'notistack';

import { useGetKycSection } from 'src/api/trusteeKyc';

// -------------------------------------------------------------

export default function KYCCompanyDetails({ percent, setActiveStepId }) {
  const { kycSectionData, kycSectionLoading } = useGetKycSection(
    'trustee_documents',
    '/trustee-kyc/company-details'
  );

  const [docs, setDocs] = useState({
    '091b9240-d614-4b88-86ca-29e21a47c504': null,
    '63f4d91c-5b39-4e85-9941-48f27376f1dd': null,
    '5dc2ef67-82c7-41ea-849e-362e61a4782a': null,
    'ae2721a3-f3af-4dc8-8b64-0b1233b03523': null,
    'ff7575eb-e42d-4677-9088-456d7b36109f': null,
  });

  // -------------------------------------------------------------
  // Document mapping based on your API IDs
  const DOCUMENT_MAP = useMemo(
    () => ({
      certificate_of_incorporation: '091b9240-d614-4b88-86ca-29e21a47c504',
      moa: '63f4d91c-5b39-4e85-9941-48f27376f1dd',
      aoa: '5dc2ef67-82c7-41ea-849f-362e61a4782a',
      gst_certificate: 'ae2721a3-f3af-4dc8-8b64-0b1233b03523',
      sebi_registration_certificate: 'ff7575eb-e42d-4677-9088-456d7b36109f',
    }),
    []
  );

  // -------------------------------------------------------------
  // Default values include existing files shown in UploadBox
  const defaultValues = useMemo(
    () => ({
      certificateOfIncorporation: docs[DOCUMENT_MAP.certificate_of_incorporation]
        ? docs[DOCUMENT_MAP.certificate_of_incorporation]
        : null,
      moaAoa: (docs[DOCUMENT_MAP.moa] || docs[DOCUMENT_MAP.aoa]) ?? null,
      sebiCertificate: docs[DOCUMENT_MAP.sebi_registration_certificate] ?? null,
      gstCertificate: docs[DOCUMENT_MAP.gst_certificate] ?? null,
      moaAoaType: docs[DOCUMENT_MAP.moa] ? 'moa' : docs[DOCUMENT_MAP.aoa] ? 'aoa' : 'moa',
    }),
    [docs, DOCUMENT_MAP]
  );

  // -------------------------------------------------------------
  const CompanyDetailSchema = Yup.object().shape({
    certificateOfIncorporation: Yup.mixed().required('Certificate Of Incorporation is Required'),
    sebiCertificate: Yup.mixed().required('Sebi Certificate is Required'),
    // moaAoaType: Yup.string().required('Please select MoA or AoA'),
    // moaAoa: Yup.mixed().nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(CompanyDetailSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const values = watch();
  const moaAoaType = useWatch({ control, name: 'moaAoaType' });

  // -------------------------------------------------------------
  const getMoaAoaLabel = () =>
    moaAoaType === 'moa' ? 'MoA - Memorandum of Association' : 'AoA - Articles of Association';

  // -------------------------------------------------------------
  const onSubmit = handleSubmit(async (form) => {
    try {
      const usersId = sessionStorage.getItem('trustee_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing', { variant: 'error' });
        return;
      }

      const uploadList = [
        { field: 'certificateOfIncorporation', value: 'certificate_of_incorporation' },
        { field: 'moaAoa', value: moaAoaType === 'moa' ? 'moa' : 'aoa' },
        { field: 'gstCertificate', value: 'gst_certificate' },
        { field: 'sebiCertificate', value: 'sebi_registration_certificate' },
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
        if (!uploaded?.id) continue;

        uploadedDocuments.push({
          documentsId: DOCUMENT_MAP[item.value],
          documentsFileId: uploaded.id,
        });
      }

      const payload = {
        usersId,
        documents: uploadedDocuments,
      };

      const final = await axiosInstance.post('/trustee-profiles/kyc-upload-documents', payload);

      if (final?.data?.success) {
        enqueueSnackbar('Documents Uploaded Successfully', { variant: 'success' });
        percent(100);
        setActiveStepId();
      }
    } catch (error) {
      enqueueSnackbar('Error uploading documents', { variant: 'error' });
    }
  });

  // -------------------------------------------------------------

  const calculatePercent = () => {
    let valid = 0;

    if (values.certificateOfIncorporation && !errors.certificateOfIncorporation) valid++;

    if (values.sebiCertificate && !errors.sebiCertificate) valid++;

    return Math.round((valid / 2) * 100);
  };

  const localPercent = calculatePercent();

  useEffect(() => {
    percent(localPercent);
  }, [localPercent, percent]);

  useEffect(() => {
    if (kycSectionData && !kycSectionLoading) {
      setDocs({
        '091b9240-d614-4b88-86ca-29e21a47c504':
          kycSectionData.data.find(
            (doc) => doc.documentId === DOCUMENT_MAP.certificate_of_incorporation
          )?.documentFile?.documentFile ?? null,
        '63f4d91c-5b39-4e85-9941-48f27376f1dd':
          kycSectionData.data.find((doc) => doc.documentId === DOCUMENT_MAP.moa)?.documentFile
            ?.documentFile ?? null,
        '5dc2ef67-82c7-41ea-849f-362e61a4782a':
          kycSectionData.data.find((doc) => doc.documentId === DOCUMENT_MAP.aoa)?.documentFile
            ?.documentFile ?? null,
        'ae2721a3-f3af-4dc8-8b64-0b1233b03523':
          kycSectionData.data.find((doc) => doc.documentId === DOCUMENT_MAP.gst_certificate)
            ?.documentFile?.documentFile ?? null,
        'ff7575eb-e42d-4677-9088-456d7b36109f':
          kycSectionData.data.find(
            (doc) => doc.documentId === DOCUMENT_MAP.sebi_registration_certificate
          )?.documentFile?.documentFile ?? null,
      });
    }
  }, [kycSectionData, kycSectionLoading, DOCUMENT_MAP]);

  useEffect(() => {
    if (docs) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, docs]);

  return (
    <Container>
      <KYCTitle title="Trustee Company Details" subtitle="Submit required company documents." />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* ================= COI ================= */}
            <RHFFileUploadBox
              name="certificateOfIncorporation"
              label="Certificate of Incorporation*"
              icon="mdi:certificate-outline"
              existing={values.certificateOfIncorporation}
            />
            <YupErrorMessage name="certificateOfIncorporation" />

            {/* ================= SEBI ================= */}
            <RHFFileUploadBox
              name="sebiCertificate"
              label="SEBI Registration Certificate*"
              icon="mdi:briefcase-outline"
              existing={values.sebiCertificate}
            />
            <YupErrorMessage name="sebiCertificate" />

            {/* ================= MOA/AOA TYPE ================= */}
            <RHFSelect name="moaAoaType" label="Select Document Type">
              <MenuItem value="moa">MoA - Memorandum of Association</MenuItem>
              <MenuItem value="aoa">AoA - Articles of Association</MenuItem>
            </RHFSelect>

            {/* ================= MOA/AOA FILE ================= */}
            <RHFFileUploadBox
              name="moaAoa"
              label={getMoaAoaLabel()}
              icon="mdi:file-document-edit-outline"
              existing={values.moaAoa}
            />

            {/* ================= GST ================= */}
            <RHFFileUploadBox name="gstCertificate" label="GST Certificate" icon="mdi:earth" existing={values.gstCertificate}/>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
