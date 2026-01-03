import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
  useGetChargeTypes,
  useGetCollateralTypes,
  useGetOwnershipTypes,
} from 'src/api/fieldOptions';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

export default function CollateralAssets({
  currentCollateralAssets,
  setPercent,
  setProgress,
  saveStepData,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { chargeTypes, chargeTypesLoading } = useGetChargeTypes();
  const { collateralTypes, collateralTypesLoading } = useGetCollateralTypes();
  const { ownershipTypes, ownershipTypesLoading } = useGetOwnershipTypes();
  const [chargeTypesData, setChargeTypesData] = useState([]);
  const [collateralTypesData, setCollateralTypesData] = useState([]);
  const [ownershipTypesData, setOwnershipTypesData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const newCollateralSchema = Yup.object().shape({
    collateralAssets: Yup.array()
      .of(
        Yup.object().shape({
          collateralType: Yup.string().required('Collateral Type is required'),
          chargeType: Yup.string().required('Charge Type is required'),
          description: Yup.string().required('Description is required'),
          estimatedValue: Yup.number()
            .typeError('Estimated value must be a number')
            .required('Estimated value is required'),
          valuationDate: Yup.date().required('Valuation date is required'),
          ownershipType: Yup.string().required('Ownership type is required'),
          trustName: Yup.string().required('Trust name is required'),
          securityDocRef: Yup.string().required('Security document ref is required'),
          securityDocument: Yup.mixed().required('Security document is required'),
          assetCoverCertificate: Yup.mixed().required('Asset cover certificate is required'),
          valuationReport: Yup.mixed().required('Valuation report is required'),
          remarks: Yup.string().nullable(),
        })
      )
      .min(1, 'At least one collateral asset is required'),
  });

  const defaultValues = useMemo(
    () => ({
      collateralAssets: currentCollateralAssets || [],
    }),
    [currentCollateralAssets]
  );

  const methods = useForm({
    resolver: yupResolver(newCollateralSchema),
    defaultValues,
  });

  const {
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collateralAssets',
  });

  const handleAddAsset = () => {
    append({
      collateralType: '',
      chargeType: '',
      description: '',
      estimatedValue: '',
      valuationDate: null,
      ownershipType: '',
      trustName: '',
      securityDocRef: '',
      securityDocument: null,
      assetCoverCertificate: null,
      valuationReport: null,
      remarks: '',
    });
    setCurrentIndex(fields.length);
  };

  const onSubmit = handleSubmit((data) => {
    const payload = {
      collateralType: data.collateralType,
      chargeType: data.chargeType,
      description: data.description,
      estimatedValue: data.estimatedValue,
      valuationDate: data.valuationDate,
      ownershipType: data.ownershipType,
      securityDocRef: data.securityDocRef,
      trustName: data.trustName,
      remarks: data.remarks,
      securityDocument: data.securityDocument,
      assetCoverCertificate: data.assetCoverCertificate,
      valuationReport: data.valuationReport,
    };

    console.log('📌 Collateral Assets Saved:', payload);

    // Call parent save handler
    saveStepData?.(payload);

    setProgress?.(true);

    enqueueSnackbar('Collateral Assets saved (console only)', {
      variant: 'success',
    });
  });

  const calculatePercent = () => {
    let completed = 0;
    if (values.collateralAssets.length > 0) completed++;
    const TOTAL = 1;

    const percentVal = (completed / TOTAL) * 100;

    setPercent?.(percentVal);
  };

  useEffect(() => {
    calculatePercent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    values.collateralAssets
  ]);

  useEffect(() => {
    if (currentCollateralAssets) {
      reset(defaultValues);
    }
  }, [currentCollateralAssets, reset, defaultValues]);

  useEffect(() => {
    if (chargeTypes?.length > 0 && !chargeTypesLoading) {
      setChargeTypesData(chargeTypes);
    }
  }, [chargeTypes, chargeTypesLoading]);

  useEffect(() => {
    if (collateralTypes?.length > 0 && !collateralTypesLoading) {
      setCollateralTypesData(collateralTypes);
    }
  }, [collateralTypes, collateralTypesLoading]);

  useEffect(() => {
    if (ownershipTypes?.length > 0 && !ownershipTypesLoading) {
      setOwnershipTypesData(ownershipTypes);
    }
  }, [ownershipTypes, ownershipTypesLoading]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          minHeight: '100vh',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            p: 5,
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            mb: 0,
            mt: '0px',
          }}
        >
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
            Collateral & Asset Verification
          </Typography>

          <Grid container spacing={3}>
            {/* Collateral Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Collateral Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFSelect name={`collateralAssets.${currentIndex}.collateralType`} label="Collateral Type" defaultValue="">
                    {collateralTypesData.length > 0 ? (
                      collateralTypesData.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No collateral types
                      </MenuItem>
                    )}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Grid>

            {/* Charge Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Charge Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFSelect name={`collateralAssets.${currentIndex}.chargeType`} label="Charge Type" defaultValue="">
                    {chargeTypesData.length > 0 ? (
                      chargeTypesData.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No charge types
                      </MenuItem>
                    )}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Grid>

            {/* Asset Description */}
            <Grid item xs={12} md={12}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Asset Description
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField multiline name={`collateralAssets.${currentIndex}.description`} fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Estimated Value */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Estimated Value
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name={`collateralAssets.${currentIndex}.estimatedValue`} fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Security Document Ref */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Security Document Ref
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name={`collateralAssets.${currentIndex}.securityDocRef`} fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Valuation Date */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Valuation Date
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <Controller
                    name={`collateralAssets.${currentIndex}.valuationDate`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Valuation Date"
                        value={
                          field.value
                            ? field.value instanceof Date
                              ? field.value
                              : new Date(field.value)
                            : null
                        }
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Trust Name */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Trust Name
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name={`collateralAssets.${currentIndex}.trustName`} fullWidth />
                </Grid>
              </Grid>
            </Grid>

            {/* Ownership Type */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Ownership Type
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFSelect name={`collateralAssets.${currentIndex}.ownershipType`} label="Ownership Type" defaultValue="">
                    {ownershipTypesData.length > 0 ? (
                      ownershipTypesData.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.label}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        No ownership types
                      </MenuItem>
                    )}
                  </RHFSelect>
                </Grid>
              </Grid>
            </Grid>

            {/* Remarks */}
            <Grid item xs={12} md={6}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={4} md={3}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Remarks
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <RHFTextField name={`collateralAssets.${currentIndex}.remarks`} fullWidth />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={{ py: '20px' }}>Security Document</Typography>
              <RHFFileUploadBox
                name={`collateralAssets.${currentIndex}.securityDocument`}
                label="Upload security document"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name={`collateralAssets.${currentIndex}.securityDocument`} />
              <Typography sx={{ py: '20px' }}>Asset Cover Certificate</Typography>
              <RHFFileUploadBox
                name={`collateralAssets.${currentIndex}.assetCoverCertificate`}
                label="Upload Asset cover certificate"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name={`collateralAssets.${currentIndex}.assetCoverCertificate`}/>
              <Typography sx={{ py: '20px' }}>Valuation Report</Typography>
              <RHFFileUploadBox
                name={`collateralAssets.${currentIndex}.valuationReport`}
                label="Upload Valuation Report"
                icon="mdi:file-document-outline"
              />
              <YupErrorMessage name={`collateralAssets.${currentIndex}.valuationReport`} />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              type='button'
              variant="contained"
              onClick={() => handleAddAsset()}
              sx={{ color: '#fff' }}
            >
              + Add Asset
            </Button>
          </Box>

          {/* TABLE VIEW */}
          {fields?.length > 0 && (
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" mb={2}>
                Added Collateral Assets
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Charge</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Trust</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fields.map((asset, index) => (
                    <TableRow key={fields[index]?.id}>
                      <TableCell>{asset.collateralType || '-'}</TableCell>
                      <TableCell>{asset.chargeType || '-'}</TableCell>
                      <TableCell>{asset.estimatedValue || '-'}</TableCell>
                      <TableCell>{asset.trustName || '-'}</TableCell>
                      <TableCell>
                        <Button color="error" onClick={() => remove(index)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              sx={{ color: '#fff' }}
            >
              Save
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </FormProvider>
  );
}

CollateralAssets.propTypes = {
  currentCollateralAssets: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
};
