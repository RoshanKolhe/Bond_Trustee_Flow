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

import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
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
import { useGetDocumentsByScreen } from 'src/api/documentsByScreen';

// =====================================================================

export default function KYCCompanyDetails({ percent, setActiveStepId }) {
  const { kycSectionData, kycSectionLoading } = useGetKycSection(
    'trustee_documents',
    '/trustee-kyc/company-details'
  );

  const { documents, documentsLoading } = useGetDocumentsByScreen('/trustee-kyc/company-details');

  // Store file objects for uploaded docs
  const [docs, setDocs] = useState({});

  // ========================= FIELD MAP ================================
  const FIELD_MAP = {
    certificate_of_incorporation: 'certificateOfIncorporation',
    sebi_registration_certificate: 'sebiCertificate',
    gst_certificate: 'gstCertificate',
    moa: 'moaDocument',
    aoa: 'aoaDocument',
  };

  // ========================= DOCUMENT MAP =============================
  const DOCUMENT_MAP = useMemo(() => {
    if (!documents) return {};
    const map = {};

    documents.forEach((doc) => {
      map[doc.value] = doc.id;
    });

    return map;
  }, [documents]);

  // ========================= DEFAULT VALUES ===========================
  const defaultValues = useMemo(() => {
    const result = {};

    Object.keys(FIELD_MAP).forEach((backendKey) => {
      const formField = FIELD_MAP[backendKey];
      const docId = DOCUMENT_MAP[backendKey];
      result[formField] = docs[docId] ?? null;
    });

    result.moaAoaType = docs[DOCUMENT_MAP.moa] ? 'moa' : docs[DOCUMENT_MAP.aoa] ? 'aoa' : 'moa';

    return result;
  }, [docs, DOCUMENT_MAP]);

  // ========================= YUP SCHEMA ===============================
  const CompanyDetailSchema = Yup.object().shape({
    certificateOfIncorporation: Yup.object().required('Certificate Of Incorporation is Required'),
    sebiCertificate: Yup.object().required('Sebi Certificate is Required'),
    gstCertificate: Yup.object().nullable(),
    moaDocument: Yup.object().nullable(),
    aoaDocument: Yup.object().nullable(),
  });

  // ========================= FORM HOOK ================================

  const methods = useForm({
    resolver: yupResolver(CompanyDetailSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const moaAoaType = useWatch({ control, name: 'moaAoaType' });
  const values = watch();

  // =====================================================================
  // Load existing files from KYC section
  useEffect(() => {
    if (!kycSectionData || kycSectionLoading) return;

    const filled = {};

    (kycSectionData.data || []).forEach((item) => {
      const file = item?.documentFile?.documentFile ?? null;
      filled[item.documentId] = file;
    });

    setDocs(filled);
    setActiveStepId();
  }, [kycSectionData, kycSectionLoading]);

  // Reset form on docs change
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // =====================================================================
  // Percent calculation
  const calculatePercent = () => {
    let valid = 0;

    if (values.certificateOfIncorporation && !errors.certificateOfIncorporation) valid++;
    if (values.sebiCertificate && !errors.sebiCertificate) valid++;

    return Math.round((valid / 2) * 100);
  };

  useEffect(() => {
    percent(calculatePercent());
  }, [values, errors]);

  // =====================================================================
  // Submit handler
  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('trustee_user_id');
      if (!usersId) return enqueueSnackbar('User ID missing', { variant: 'error' });

      const uploadedDocuments = [];

      Object.keys(FIELD_MAP).forEach((backendKey) => {
        const formField = FIELD_MAP[backendKey];
        const uploaded = data[formField];

        if (uploaded?.id) {
          uploadedDocuments.push({
            documentsId: DOCUMENT_MAP[backendKey],
            documentsFileId: uploaded.id,
          });
        }
      });

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

  // =====================================================================
  return (
    <Container>
      <KYCTitle title="Trustee Company Details" subtitle="Submit required company documents." />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* ================= COI ================= */}
            <RHFCustomFileUploadBox
              name="certificateOfIncorporation"
              label="Certificate of Incorporation*"
              existing={docs[DOCUMENT_MAP.certificate_of_incorporation]}
              icon="mdi:certificate-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="certificateOfIncorporation" />

            {/* ================= SEBI ================= */}
            <RHFCustomFileUploadBox
              name="sebiCertificate"
              label="SEBI Registration Certificate*"
              existing={docs[DOCUMENT_MAP.sebi_registration_certificate]}
              icon="mdi:briefcase-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
            <YupErrorMessage name="sebiCertificate" />

            {/* ================= MOA / AOA TYPE ================= */}
            <RHFSelect name="moaAoaType" label="Select Document Type">
              <MenuItem value="moa">MoA - Memorandum of Association</MenuItem>
              <MenuItem value="aoa">AoA - Articles of Association</MenuItem>
            </RHFSelect>

            {/* ================= MOA ================= */}
            {moaAoaType === 'moa' && (
              <RHFCustomFileUploadBox
                name="moaDocument"
                label="MoA - Memorandum of Association"
                existing={docs[DOCUMENT_MAP.moa]}
                icon="mdi:file-document-edit-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
            )}

            {/* ================= AOA ================= */}
            {moaAoaType === 'aoa' && (
              <RHFCustomFileUploadBox
                name="aoaDocument"
                label="AoA - Articles of Association"
                existing={docs[DOCUMENT_MAP.aoa]}
                icon="mdi:file-document-edit-outline"
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
            )}

            {/* ================= GST ================= */}
            <RHFCustomFileUploadBox
              name="gstCertificate"
              label="GST Certificate"
              icon="mdi:earth"
              existing={docs[DOCUMENT_MAP.gst_certificate]}
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
            />
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
