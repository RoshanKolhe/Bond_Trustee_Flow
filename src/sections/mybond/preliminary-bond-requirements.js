import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import {
  Card,
  Typography,
  TextField,
  Grid,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Icon } from '@iconify/react';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUpload,
  RHFUploadBox,
  RHFUploadRectangle,
} from 'src/components/hook-form';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { DatePicker } from '@mui/x-date-pickers';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';

export default function PreliminaryBondRequirements({
  currentBondRequirements,
  saveStepData,
  setActiveStepId,
  percent,
}) {
  const [security, setSecurity] = useState('secured');
  const [investorCategory, setInvestorCategory] = useState('retail');
  const [paymentCycle, setPaymentCycle] = useState('monthly');
  const [issueAmount, setIssueAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [roi, setRoi] = useState('');

  const router = useRouter();

  // Collateral Asset Verification State
  const [collateralType, setCollateralType] = useState('');
  const [chargeType, setChargeType] = useState('');
  const [assetDescription, setAssetDescription] = useState('Land Parcel At Pune SEZ');
  const [estimatedValue, setEstimatedValue] = useState('50,00,00,000');
  const [valuationDate, setValuationDate] = useState('18/10/2025');
  const [ownershipType, setOwnershipType] = useState('Owned / Leased / Pledged');
  const [securityDocRef, setSecurityDocRef] = useState('4576/2024');
  const [trustName, setTrustName] = useState('Axis Trustee Service');
  const [remarks, setRemarks] = useState('Collateral For Series -A Secured Bonds');
  const [bondCompleted, setBondCompleted] = useState(false);
  const [collateralCompleted, setCollateralCompleted] = useState(false);
  const [payloadData, setpayloadData] = useState(null);

  const BondSchema = Yup.object().shape({
    issueAmount: Yup.number()
      .typeError('Issue Amount is required')
      .positive('Must be positive')
      .required('Issue Amount is required'),

    tenure: Yup.number()
      .typeError('Tenure must be a number')
      .positive('Must be positive')
      .required('Tenure is required'),

    roi: Yup.number()
      .typeError('ROI must be a number')
      .min(0, 'Must be at least 0%')
      .max(100, 'Cannot exceed 100%')
      .required('ROI is required'),
  });

  const CollateralSchema = Yup.object().shape({
    collateralType: Yup.string().required('Collateral Type is required'),
    chargeType: Yup.string().required('Charge Type is required'),
    assetDescription: Yup.string().required('Asset Description is required'),
    estimatedValue: Yup.string().required('Estimated Value is required'),
    valuationDate: Yup.date().required('Valuation Date is required'),
    ownershipType: Yup.string().required('Ownership Type is required'),
    // securityDocument: Yup.mixed().required('Security Document is required'),
    securityDocRef: Yup.string().required('Security Document Ref is required'),
    trustName: Yup.string().required('Trust Name is required'),
    remarks: Yup.string().required('Remarks are required'),

    creditRatingLetter: Yup.mixed().required('Asset Cover Certificate is required'),
    valuationReport: Yup.mixed().required('Valuation Report is required'),
  });

  const bondDefaultValues = {
    issueAmount: currentBondRequirements?.issueAmount || '',
    tenure: currentBondRequirements?.tenure || '',
    roi: currentBondRequirements?.roi || '',
  };

  const collateralDefaultValues = {
    collateralType: currentBondRequirements?.collateralType || '',
    chargeType: currentBondRequirements?.chargeType || '',
    assetDescription: currentBondRequirements?.assetDescription || '',
    estimatedValue: currentBondRequirements?.estimatedValue || '',
    valuationDate: currentBondRequirements?.valuationDate || '',
    ownershipType: currentBondRequirements?.ownershipType || '',
    securityDocument: null,
    securityDocRef: currentBondRequirements?.securityDocRef || '',
    trustName: currentBondRequirements?.trustName || '',
    remarks: currentBondRequirements?.remarks || '',

    creditRatingLetter: null,
    valuationReport: null,
  };

  const bondMethods = useForm({
    resolver: yupResolver(BondSchema),
    defaultValues: bondDefaultValues,
  });

  const collateralMethods = useForm({
    resolver: yupResolver(CollateralSchema),
    defaultValues: collateralDefaultValues,
  });

  console.log('🟣 React Hook Form methods:', bondMethods, collateralMethods);

  const calculatePercent = () => {
    let p = 0;
    if (bondCompleted) p += 50;
    if (collateralCompleted) p += 50;

    percent?.(p);
    console.log('🟠 Preliminary Bond % =', p);
  };

  useEffect(() => {
    calculatePercent();
  }, [bondCompleted, collateralCompleted]);

  const {
    handleSubmit: handleBondSubmit,
    control: bondControl,
    formState: { errors: bondErrors },
  } = bondMethods;

  const {
    handleSubmit: handleCollateralSubmit,
    control: collateralControl,
    formState: { errors: collateralErrors },
  } = collateralMethods;

  const onSubmitBond = async (data) => {
    const finalBond = {
      ...data,
      security,
      investorCategory,
      paymentCycle,
    };
    setpayloadData((prev) => ({
      ...prev,
      bondRequirements: finalBond,
    }));
    setBondCompleted(true);
  };

  const onSubmitCollateral = async (data) => {
    setpayloadData((prev) => ({
      ...prev,
      collateralRequirement: data,
    }));
    setCollateralCompleted(true);
  };

  const handleNextClick = async () => {
    try {
      // 1️⃣ Validate both forms
      const bondValid = await bondMethods.trigger();
      const collateralValid = await collateralMethods.trigger();

      if (!bondValid || !collateralValid) {
        console.log('❌ Validation failed');
        return;
      }

      // 2️⃣ Collect all form data
      const bondPayload = bondMethods.getValues();
      const collateralPayload = collateralMethods.getValues();

      // 3️⃣ Save in parent (so values persist)
      saveStepData(payloadData);
      setActiveStepId('regulatory_filing');
      enqueueSnackbar('Created Successfully!', { variant: 'success' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCollateralFileDrop = (fieldName, acceptedFiles, setValue) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setValue(fieldName, newFile, { shouldValidate: true });
  };

  const handleRemoveCollateralFile = (fieldName, setValue) => {
    setValue(fieldName, null, { shouldValidate: true });
  };

  useEffect(() => {
    if (!currentBondRequirements) return;

    bondMethods.reset({
      issueAmount: currentBondRequirements.issueAmount || '',
      tenure: currentBondRequirements.tenure || '',
      roi: currentBondRequirements.roi || '',
    });

    setSecurity(currentBondRequirements.security || 'secured');
    setInvestorCategory(currentBondRequirements.investorCategory || 'retail');
    setPaymentCycle(currentBondRequirements.paymentCycle || 'monthly');

    setBondCompleted(true);
    percent?.(50);
  }, [currentBondRequirements]);

  useEffect(() => {
    if (!currentBondRequirements?.collateralRequirement) return;

    const cr = currentBondRequirements.collateralRequirement;

    collateralMethods.reset({
      collateralType: cr.collateralType || '',
      chargeType: cr.chargeType || '',
      assetDescription: cr.assetDescription || '',
      estimatedValue: cr.estimatedValue || '',
      valuationDate: cr.valuationDate ? new Date(cr.valuationDate) : null,
      ownershipType: cr.ownershipType || '',
      securityDocRef: cr.securityDocRef || '',
      trustName: cr.trustName || '',
      remarks: cr.remarks || '',
      creditRatingLetter: cr.creditRatingLetter || null,
      valuationReport: cr.valuationReport || null,
    });

    setCollateralCompleted(true);
    percent?.(50);
  }, [currentBondRequirements]);

  // const onSubmit = async (data) => {
  //   console.log('✅ Submitted Data:', {
  //     ...data,
  //     security,
  //     investorCategory,
  //     paymentCycle,
  //   });
  //   onSave(data);
  //   router.push(paths.dashboard.issureservices.view);
  // };

  return (
    <>
      <FormProvider methods={bondMethods} onSubmit={bondMethods.handleSubmit(onSubmitBond)}>
        <Box
          sx={{
            minHeight: '100vh',
            // p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Card
            sx={{
              width: '100%',
              mt: 5,
              p: 5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
                  Preliminary Bond Requirements
                </Typography>

                {/* Issue Amount */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Issue Amount (₹)
                    <Tooltip title="Whether the bond is backed by collateral or not" arrow>
                      <Icon
                        icon="mdi:information-outline"
                        width={18}
                        height={18}
                        style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <RHFTextField
                    name="issueAmount"
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="₹ 500,00,000"
                    variant="outlined"
                    label="Issue Amount"
                  />
                </Box>

                {/* Security */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Security
                    <Tooltip
                      title="Decide on an investment structure - whether by equity investors or any lenders"
                      arrow
                    >
                      <Icon
                        icon="mdi:information-outline"
                        width={18}
                        height={18}
                        style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <ToggleButtonGroup
                    value={security}
                    exclusive
                    onChange={(e, val) => val && setSecurity(val)}
                    fullWidth
                  >
                    {['Secured', 'Unsecured'].map((option) => (
                      <ToggleButton key={option} value={option.toLowerCase()}>
                        {option}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                {/* Tenure */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Tenure
                    <Tooltip title="Enter tenure for your bond (e.g., 5 for 5 years)" arrow>
                      <Icon
                        icon="mdi:information-outline"
                        width={18}
                        height={18}
                        style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <RHFTextField
                    name="tenure"
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="3.5"
                    variant="outlined"
                  />
                </Box>

                {/* Preferred ROI */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Preferred ROI (%)
                  </Typography>
                  <RHFTextField
                    name="roi"
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="8.5"
                    variant="outlined"
                  />
                </Box>

                {/* Investor Category */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Preferred Investor Category
                    <Tooltip title="Select the type of investors you need to target" arrow>
                      <Icon
                        icon="mdi:information-outline"
                        width={18}
                        height={18}
                        style={{ cursor: 'pointer', marginLeft: 4, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <ToggleButtonGroup
                    value={investorCategory}
                    exclusive
                    onChange={(e, val) => val && setInvestorCategory(val)}
                    fullWidth
                    sx={{ flexWrap: 'wrap', border: '1px #C0C0C0' }}
                  >
                    {[
                      { label: 'Retail', value: 'retail' },
                      { label: 'QIB', value: 'qib' },
                      { label: 'HNIs', value: 'hnwi' },
                      { label: 'Mutual Funds', value: 'mutual' },
                    ].map((option) => (
                      <ToggleButton
                        key={option.value}
                        value={option.value}
                        sx={{ flex: '1 0 48%', m: 0.5 }}
                      >
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                {/* Payment Cycle */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Preferred Interest Payment Cycle
                  </Typography>
                  <ToggleButtonGroup
                    value={paymentCycle}
                    exclusive
                    onChange={(e, val) => val && setPaymentCycle(val)}
                    fullWidth
                  >
                    {['Monthly', 'Quarterly', 'Annually'].map((option) => (
                      <ToggleButton key={option} value={option.toLowerCase()}>
                        {option}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="/assets/images/roi/preliminary.png"
                  alt="Bond Illustration"
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
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
              <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
                Save
              </LoadingButton>
            </Box>
          </Card>
        </Box>
      </FormProvider>
      <FormProvider
        methods={collateralMethods}
        onSubmit={collateralMethods.handleSubmit(onSubmitCollateral)}
      >
        <Box
          sx={{
            minHeight: '100vh',
            pt: 4,
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
                    <FormControl fullWidth>
                      <RHFSelect name="collateralType" label="Collateral Type" defaultValue="">
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="property">Property</MenuItem>
                        <MenuItem value="equipment">Equipment</MenuItem>
                        <MenuItem value="inventory">Inventory</MenuItem>
                      </RHFSelect>
                    </FormControl>
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
                    <FormControl fullWidth>
                      <RHFSelect name="chargeType" label="Charge Type" defaultValue="">
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="first">First Charge</MenuItem>
                        <MenuItem value="second">Second Charge</MenuItem>
                        <MenuItem value="pari-passu">Pari Passu</MenuItem>
                      </RHFSelect>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Asset Description */}
              <Grid item xs={12} md={6}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Asset Description
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <RHFTextField name="assetDescription" fullWidth />
                  </Grid>
                </Grid>
              </Grid>

              {/* Security Document File */}
              <Grid item xs={12} md={6}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Security Document
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}></Grid>
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
                    <RHFTextField name="estimatedValue" fullWidth />
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
                    <RHFTextField name="securityDocRef" fullWidth />
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
                      name="valuationDate"
                      control={collateralControl}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          label="Date"
                          value={new Date(field.value)}
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
                    <RHFTextField name="trustName" fullWidth />
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
                    <RHFTextField name="ownershipType" fullWidth />
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
                    <RHFTextField name="remarks" fullWidth />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography sx={{ pb: '20px' }}>Asset Cover Certificate</Typography>
                <RHFFileUploadBox
                  name="creditRatingLetter"
                  label="Upload Credit Rating Letter"
                  icon="mdi:file-document-outline"
                  onDrop={(files) =>
                    handleCollateralFileDrop(
                      'creditRatingLetter',
                      files,
                      collateralMethods.setValue
                    )
                  }
                  onDelete={() =>
                    handleRemoveCollateralFile('creditRatingLetter', collateralMethods.setValue)
                  }
                />
                <YupErrorMessage name="creditRatingLetter" />
                <Typography sx={{ py: '20px' }}>Valuation Report</Typography>
                <RHFFileUploadBox
                  name="valuationReport"
                  label="Upload Valuation Report"
                  icon="mdi:file-document-outline"
                  onDrop={(files) =>
                    handleCollateralFileDrop('valuationReport', files, collateralMethods.setValue)
                  }
                  onDelete={() =>
                    handleRemoveCollateralFile('valuationReport', collateralMethods.setValue)
                  }
                />
                <YupErrorMessage name="valuationReport" />
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
              <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
                Save
              </LoadingButton>
            </Box>
          </Card>
        </Box>
      </FormProvider>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {/* <Button variant="outlined" sx={{ color: '#000' }} onClick={() => setActiveStep(2)}>
                Cancel
              </Button> */}

        <LoadingButton variant="contained" sx={{ color: '#fff' }} onClick={handleNextClick}>
          Next
        </LoadingButton>
      </Box>
    </>
  );
}

PreliminaryBondRequirements.propTypes = {
  setActiveStep: PropTypes.func,
  currentBondRequirements: PropTypes.object,
  onSave: PropTypes.func,
};
