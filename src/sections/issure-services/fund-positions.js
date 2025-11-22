/* eslint-disable no-useless-escape */
import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Card,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { DatePicker } from '@mui/x-date-pickers';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function FundPositionForm({ currentFund, setActiveStep, onSave }) {
  const { enqueueSnackbar } = useSnackbar();
  const [ratingList, setRatingList] = React.useState([]);
  const [editIndex, setEditIndex] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);

  // ---- FUND POSITION SCHEMA ----
  const FundPositionSchema = Yup.object().shape({
    cashBalance: Yup.string().required('Cash Balance is required'),
    bankBalance: Yup.string().required('Bank Balance is required'),
    cashBalanceDate: Yup.date()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .required('Date is required'),

    bankBalanceDate: Yup.date()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .required('Date is required'),
  });

  // ---- CREDIT RATING SCHEMA ----
  const CreditRatingSchema = Yup.object().shape({
    // Conditional validation (only required if no ratings added)
    selectedAgency: Yup.string().when([], {
      is: () => ratingList.length === 0,
      then: (schema) => schema.required('Rating agency is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    selectedRating: Yup.string().when([], {
      is: () => ratingList.length === 0,
      then: (schema) => schema.required('Rating is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Always required (independent of ratingList)
    vault: Yup.string().required('Vault Till is required'),

    additionalRating: Yup.string().required('Additional Rating is required'),

    creditRatingLetter: Yup.mixed()
      .required('Credit rating letter is required')
      .test('fileSize', 'Max size is 5MB', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Only PDF allowed', (value) => {
        if (!value || typeof value === 'string') return true;
        return value.type === 'application/pdf';
      }),
  });

  // ---- FUND POSITION DEFAULT VALUES ----
  const fundDefaults = {
    cashBalance: currentFund?.cashBalance || '',
    cashBalanceDate: currentFund?.cashBalanceDate ? new Date(currentFund.cashBalanceDate) : null,
    bankBalance: currentFund?.bankBalance || '',
    bankBalanceDate: currentFund?.bankBalanceDate ? new Date(currentFund.bankBalanceDate) : null,
  };

  // ---- CREDIT RATING DEFAULT VALUES ----
  const ratingDefaults = {
    selectedAgency: currentFund?.creditRating?.selectedAgency || '',
    selectedRating: currentFund?.creditRating?.selectedRating || '',
    vault: currentFund?.creditRating?.vault || '',
    additionalRating: currentFund?.creditRating?.additionalRating || '',
    creditRatingLetter: currentFund?.creditRating?.creditRatingLetter
      ? {
          fileUrl: currentFund.creditRating.creditRatingLetter.fileUrl,
          preview: currentFund.creditRating.creditRatingLetter.fileUrl,
        }
      : null,
  };

  console.log('🟢 Default Values:', fundDefaults, ratingDefaults);

  // Fund Position Form
  const fundForm = useForm({
    resolver: yupResolver(FundPositionSchema),
    defaultValues: fundDefaults,
  });

  // Credit Rating Form
  const ratingForm = useForm({
    resolver: yupResolver(CreditRatingSchema),
    defaultValues: ratingDefaults,
  });

  const {
    handleSubmit: handleFundSubmit,
    watch: watchFund,
    setValue: setFundValue,
    control: fundControl,
    reset: resetFund,
    formState: { errors: fundErrors },
  } = fundForm;

  const {
    handleSubmit: handleRatingSubmit,
    watch: watchRating,
    setValue: setRatingValue,
    control: ratingControl,
    reset: resetRating,
    formState: { errors: ratingErrors },
  } = ratingForm;

  const onSubmitFund = async (data) => {
    console.log('🟦 FUND POSITION SUBMIT DATA:', data);

    enqueueSnackbar('Fund position saved! (console only)', { variant: 'success' });

    return true;
  };

  const onSubmitRating = async (data) => {
    console.log('🟩 CREDIT RATING SUBMIT DATA:', {
      ...data,
      ratings: ratingList,
      creditRatingLetter: data?.creditRatingLetter?.fileUrl
        ? { fileUrl: data.creditRatingLetter.fileUrl }
        : null,
    });

    enqueueSnackbar('Credit rating saved! (console only)', { variant: 'success' });

    return true;
  };

  const handleAddRating = () => {
    const agency = ratingValues.selectedAgency;
    const rating = ratingValues.selectedRating;

    if (!agency || !rating) {
      enqueueSnackbar('Please select both Agency and Rating', { variant: 'error' });
      return;
    }

    // 🔹 If editing, update instead of adding
    if (isEditing) {
      const updatedList = [...ratingList];
      updatedList[editIndex] = { agency, rating };
      setRatingList(updatedList);

      // reset editing state
      setIsEditing(false);
      setEditIndex(null);

      enqueueSnackbar('Rating updated!', { variant: 'success' });
    } else {
      // 🔹 Normal Add
      const newEntry = { agency, rating };
      setRatingList((prev) => [...prev, newEntry]);
    }

    // clear form fields
    setRatingValue('selectedAgency', '');
    setRatingValue('selectedRating', '');
  };

  const handleDeleteRating = (index) => {
    setRatingList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextClick = async () => {
    try {
      // 1. Validate both forms
      const fundValid = await fundForm.trigger();
      const ratingValid = await ratingForm.trigger();

      if (!fundValid || !ratingValid) {
        enqueueSnackbar('Please fix the validation errors', { variant: 'error' });
        return;
      }

      // 2. Collect both forms data
      const fundPayload = fundForm.getValues();
      const ratingPayload = {
        ...ratingForm.getValues(),
        ratings: ratingList,
      };

      // 3. Save everything in parent (so data persists)
      onSave('fundPosition', {
        fundPosition: fundPayload,
        creditRating: ratingPayload,
      });

      enqueueSnackbar('All data saved in state!', { variant: 'success' });

      // 4. Go to next page
      setActiveStep(1);
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.error(error);
    }
  };

  const agencies = [
    'CRISIL',
    'ICRA',
    'INDIA RATINGS & RESEARCH',
    'Rating Agency 4',
    'Rating Agency 5',
    'Rating Agency 6',
  ];

  const ratings = [
    { value: 'A+', label: 'A+' },
    { value: 'AAA', label: 'AAA' },
    { value: 'AA+', label: 'AA+' },
    { value: 'AA-', label: 'AA-' },
    { value: 'AA', label: 'AA' },
    { value: 'A-', label: 'A-' },
    { value: 'BBB+', label: 'BBB+' },
    { value: 'UNRATED', label: 'UNRATED' },
  ];

  const fundValues = watchFund();
  const ratingValues = watchRating();

  useEffect(() => {
    if (currentFund?.creditRating?.ratings) {
      setRatingList(currentFund.creditRating.ratings);
    }
  }, [currentFund]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <FormProvider methods={fundForm} onSubmit={handleFundSubmit(onSubmitFund)}>
        {/* 1. Fund Position Section */}
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
          <Typography variant="h3" sx={{ color: '#1565c0', fontWeight: 600 }}>
            Fund Position
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Add and manage your borrowing information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <RHFTextField name="cashBalance" label="Cash Balance as on Date" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="cashBalanceDate"
                control={fundControl}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Cash Balance Date"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
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
            <Grid item xs={12} md={3}>
              <RHFTextField name="bankBalance" label="Bank Balance as on Date" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
              <Controller
                name="bankBalanceDate"
                control={fundControl}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    label="Bank Balance Date"
                    value={
                      field.value
                        ? field.value instanceof Date
                          ? field.value
                          : new Date(field.value)
                        : null
                    }
                    onChange={(newValue) => field.onChange(newValue)}
                    format="dd/MM/yyyy"
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
      </FormProvider>

      <FormProvider methods={ratingForm} onSubmit={handleRatingSubmit(onSubmitRating)}>
        {/* 3. Conditional Rendering */}
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Credit Ratings Available
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <RHFSelect
                name="selectedAgency"
                label="Select Rating Agency"
                size="small"
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Select the appropriate rating agency</MenuItem>
                {agencies.map((agency, idx) => (
                  <MenuItem key={idx} value={agency}>
                    {agency}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Rating
              </Typography>
              <Grid container spacing={2}>
                {ratings
                  .filter((rating) => {
                    // Example logic: only show ratings based on selected category
                    if (ratingValues.category === 'Credit') return rating.value <= 3;
                    if (ratingValues.category === 'Risk') return rating.value > 3;
                    return true;
                  })
                  .map((rating) => (
                    <Grid item xs={4} key={rating.value}>
                      <FormControlLabel
                        value={rating.value}
                        control={
                          <Radio
                            checked={ratingValues.selectedRating === rating.value}
                            onChange={(e) => setRatingValue('selectedRating', e.target.value)}
                            color="primary"
                          />
                        }
                        label={rating.label}
                      />
                    </Grid>
                  ))}
              </Grid>
              <YupErrorMessage name="selectedRating" />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button variant="outlined" color="primary" onClick={handleAddRating}>
              {isEditing ? 'Update Rating' : 'Add Rating'}
            </Button>
          </Box>
          {ratingList.length > 0 && (
            <Box sx={{ mt: 4, mb: 2 }}>
              {' '}
              {/* mb: 20px */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Added Ratings
              </Typography>
              <TableContainer component={Card} sx={{ borderRadius: 2, mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Rating Agency</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {ratingList.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.agency}</TableCell>
                        <TableCell>{row.rating}</TableCell>
                        <TableCell align="center">
                          {/* Edit Icon */}
                          <Icon
                            icon="mdi:pencil-outline"
                            width="22"
                            height="22"
                            style={{ cursor: 'pointer', marginRight: 12 }}
                            onClick={() => {
                              setRatingValue('selectedAgency', row.agency);
                              setRatingValue('selectedRating', row.rating);

                              setEditIndex(index);
                              setIsEditing(true);
                            }}
                          />

                          {/* Delete Icon */}
                          <Icon
                            icon="mdi:delete-outline"
                            width="22"
                            height="22"
                            style={{ cursor: 'pointer', color: '#d32f2f' }}
                            onClick={() => handleDeleteRating(index)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          <RHFTextField
            name="vault"
            label="Vault Till"
            fullWidth
            size="small"
            sx={{ pb: '30px' }}
          />
          <RHFTextField
            name="additionalRating"
            label="Additional Rating"
            fullWidth
            size="small"
            sx={{ pb: '30px' }}
          />

          {/* 5. Credit Rating Letter Upload */}
          <RHFFileUploadBox
            name="creditRatingLetter"
            label="Upload Credit Rating Letter"
            icon="mdi:file-document-outline"
            maxSizeMB={2}
          />
          <YupErrorMessage name="creditRatingLetter" />
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
      </FormProvider>
      <Grid item xs={12}>
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button variant="outlined" sx={{ color: '#000000' }} onClick={() => setActiveStep(0)}>
            Cancel
          </Button>
          <LoadingButton variant="contained" sx={{ color: '#fff' }} onClick={handleNextClick}>
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </Box>
  );
}

// ----------------------------------------------------------------------

const CreditRatingCard = ({ imageSrc, label, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      mb: '20px',
      borderRadius: 0,
      height: 150,
      cursor: 'pointer',
      minWidth: 250,
    }}
  >
    <Box sx={{ height: 150, overflow: 'hidden', flexShrink: 0, borderRadius: 1 }}>
      <img
        src={imageSrc}
        alt={label}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Box>
  </Box>
);

CreditRatingCard.propTypes = {
  imageSrc: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  setActiveStep: PropTypes.func,
  currentFund: PropTypes.object,
  onSave: PropTypes.func,
};
