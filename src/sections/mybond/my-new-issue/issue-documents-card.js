import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import FormProvider, { RHFCustomFileUploadBox } from 'src/components/hook-form';
import { useGetBondFlowDocuments } from 'src/api/bond-documents';
import axiosInstance from 'src/utils/axios';
import { useParams } from 'src/routes/hook';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';

// ------------------------------------------------------------

export default function IssueDocumentsCard({
  setProgress,
  setPercent,
}) {
  const param = useParams();
  const { applicationId } = param;
  const { enqueueSnackbar } = useSnackbar();
  const { documents, documentsLoading } = useGetBondFlowDocuments('document_upload');
  const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'document_upload');

  const normalizedDocuments = useMemo(() => {
    if (!documents) return [];

    return documents.map((d) => ({
      id: d.documents.id,
      code: d.documents.value,
      label: d.documents.name,
      description: d.documents.description,
      isMandatory: d.isMandatory,
    }));
  }, [documents]);

  const DocumentSchema = useMemo(() => {
    const shape = {};
    normalizedDocuments.forEach((doc) => {
      shape[doc.code] = doc.isMandatory
        ? Yup.mixed().required(`${doc.label} is required`)
        : Yup.mixed().nullable();
    });
    return Yup.object().shape(shape);
  }, [normalizedDocuments]);

  const defaultValues = useMemo(() => {
    const values = {};
    normalizedDocuments.forEach((doc) => {
      values[doc.code] = null;
    });
    return values;
  }, [normalizedDocuments]);

  const methods = useForm({
    resolver: yupResolver(DocumentSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = normalizedDocuments
        .filter((doc) => data[doc.code])
        .map((doc) => ({
          documentsId: doc.id,
          mediaId: data[doc.code].id,
        }));

      const response = await axiosInstance.patch(`/bonds-pre-issue/upload-documents/${applicationId}`, {
        documents: payload,
      });

      if (response.failureCount > 0) {
        enqueueSnackbar(
          `${response.successCount} uploaded, ${response.failureCount} failed`,
          { variant: 'warning' }
        );
      } else {
        enqueueSnackbar('All documents uploaded successfully', {
          variant: 'success',
        });
      }

      setProgress?.(true);
    } catch (error) {
      enqueueSnackbar('Document upload failed', { variant: 'error' });
    }
  });

  const mapUploadedDocsToFormValues = (
    normalizedDocuments,
    uploadedDocs
  ) => {
    const values = {};

    normalizedDocuments.forEach((doc) => {
      const uploaded = uploadedDocs?.find(
        (u) =>
          u.documentsId === doc.id &&
          u.documentState === 'UPLOADED'
      );

      values[doc.code] = uploaded
        ? {
          id: uploaded.media.id,
          name: uploaded.media.fileOriginalName,
          preview: uploaded.media.fileUrl,
          fileUrl: uploaded.media.fileUrl,
          isUploaded: true,
        }
        : null;
    });

    return values;
  };

  useEffect(() => {
    if (!normalizedDocuments.length) return;

    const uploaded = normalizedDocuments.filter(
      (doc) => values[doc.code]
    ).length;

    const percent = Math.round((uploaded / normalizedDocuments.length) * 50);
    setPercent?.(percent);
  }, [values, normalizedDocuments, setPercent]);

  useEffect(() => {
    if (
      stepData &&
      !stepDataLoading &&
      normalizedDocuments.length
    ) {
      const mappedValues = mapUploadedDocsToFormValues(
        normalizedDocuments,
        stepData
      );

      methods.reset(mappedValues);
      setProgress?.(true);
    }
  }, [
    stepData,
    stepDataLoading,
    normalizedDocuments,
    methods,
    setProgress,
  ]);

  if (documentsLoading) {
    return <Typography>Loading documents...</Typography>;
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2 }}>
          <Typography variant="h5" mb={2} fontWeight="bold" color="primary">
          Upload Documents
        </Typography>

        <Grid container spacing={3}>
          {normalizedDocuments.map((doc) => (
            <Grid item xs={12} key={doc.id}>
              <RHFCustomFileUploadBox
                name={doc.code}
                label={doc.label}
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/png': ['.png'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            variant="contained"
          >
            Save
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}
