import { m } from 'framer-motion';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
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
import { useRouter } from 'src/routes/hook';
import KYCStepper from './kyc-stepper';
import { yupResolver } from '@hookform/resolvers/yup';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import axiosInstance from 'src/utils/axios';

import { enqueueSnackbar } from 'notistack';

import { useGetKycProgress, useGetKycSection } from 'src/api/trusteeKyc';

// -------------------------------------------------------------

export default function KYCCompanyDetails() {
  const router = useRouter();
  const sessionId = localStorage.getItem('sessionId');

  const { profileId, kycProgressLoading } = useGetKycProgress(sessionId);

  const { kycSectionData, kycSectionLoading } = useGetKycSection(
    'trustee_documents',
    profileId,
    '/trustee-kyc/company-details'
  );

  const [docs, setDocs] = useState([]);

  // === Map incoming GET API ===
  useEffect(() => {
    if (kycSectionData?.data) {
      setDocs(kycSectionData.data || []);
    }
  }, [kycSectionData]);

  // -------------------------------------------------------------
  // Document mapping based on your API IDs
  const DOCUMENT_MAP = {
    certificate_of_incorporation: '091b9240-d614-4b88-86ca-29e21a47c504',
    moa: '63f4d91c-5b39-4e85-9941-48f27376f1dd',
    aoa: '5dc2ef67-82c7-41ea-849f-362e61a4782a',
    gst_certificate: 'ae2721a3-f3af-4dc8-8b64-0b1233b03523',
    sebi_registration_certificate: 'ff7575eb-e42d-4677-9088-456d7b36109f',
  };

  const findDoc = (docId) =>
    docs.find((d) => d.documentId === docId && d.documentFile?.documentFile);

  const formatExisting = (docObj) => {
    if (!docObj) return null;

    return {
      name: docObj.documentFile.documentFile.fileOriginalName,
      url: docObj.documentFile.documentFile.fileUrl,
      status: docObj.documentFile.status,
    };
  };

  const existingCOI = formatExisting(findDoc(DOCUMENT_MAP.certificate_of_incorporation));
  const existingMOA = formatExisting(findDoc(DOCUMENT_MAP.moa));
  const existingAOA = formatExisting(findDoc(DOCUMENT_MAP.aoa));
  const existingGST = formatExisting(findDoc(DOCUMENT_MAP.gst_certificate));
  const existingSEBI = formatExisting(findDoc(DOCUMENT_MAP.sebi_registration_certificate));

  // -------------------------------------------------------------
  // Default values include existing files shown in UploadBox
  const defaultValues = useMemo(
    () => ({
      certificateOfIncorporation: null,
      moaAoa: null,
      sebiCertificate: null,
      gstCertificate: null,
      moaAoaType: existingAOA ? 'aoa' : 'moa',
    }),
    [existingCOI, existingMOA, existingAOA, existingGST, existingSEBI]
  );

  // -------------------------------------------------------------
  const CompanyDetailSchema = Yup.object().shape({
    certificateOfIncorporation: Yup.mixed().nullable(),
    moaAoaType: Yup.string().required('Please select MoA or AoA'),
    moaAoa: Yup.mixed().nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(CompanyDetailSchema),
    defaultValues,
  });

  const { setValue, watch, control, handleSubmit, formState: { errors, isSubmitting } } = methods;
  const moaAoaType = useWatch({ control, name: 'moaAoaType' });

  // -------------------------------------------------------------
  const getMoaAoaLabel = () =>
    moaAoaType === 'moa'
      ? 'MoA - Memorandum of Association'
      : 'AoA - Articles of Association';

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
        router.push(paths.KYCBankDetails);
      }
    } catch (error) {
      enqueueSnackbar('Error uploading documents', { variant: 'error' });
    }
  });

  // -------------------------------------------------------------
  if (kycProgressLoading || kycSectionLoading) {
    return (
      <Container>
        <Typography sx={{ mt: 5 }}>Loading Company Documents…</Typography>
      </Container>
    );
  }

  // -------------------------------------------------------------
  return (
    <Container>
      <KYCStepper percent={50} />

      <KYCTitle
        title="Trustee Company Details"
        subtitle="Submit required company documents."
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* ================= COI ================= */}
            <RHFFileUploadBox
              name="certificateOfIncorporation"
              label="Certificate of Incorporation*"
              existing={existingCOI}
              icon="mdi:certificate-outline"
            />
            <YupErrorMessage name="certificateOfIncorporation" />

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
              existing={moaAoaType === 'moa' ? existingMOA : existingAOA}
            />
            <YupErrorMessage name="moaAoa" />

            {/* ================= SEBI ================= */}
            <RHFFileUploadBox
              name="sebiCertificate"
              label="SEBI Registration Certificate"
              icon="mdi:briefcase-outline"
              existing={existingSEBI}
            />

            {/* ================= GST ================= */}
            <RHFFileUploadBox
              name="gstCertificate"
              label="GST Certificate"
              icon="mdi:earth"
              existing={existingGST}
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
