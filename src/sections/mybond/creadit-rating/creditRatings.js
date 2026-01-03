// /* eslint-disable no-useless-escape */
// import React, { useEffect, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
// import * as Yup from 'yup';
// import { Controller, useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   Box,
//   Grid,
//   Typography,
//   Radio,
//   FormControlLabel,
//   MenuItem,
//   Card,
//   Button,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TextField,
// } from '@mui/material';
// import { useSnackbar } from 'src/components/snackbar';
// import FormProvider, { RHFAutocomplete, RHFSelect } from 'src/components/hook-form';
// import axiosInstance from 'src/utils/axios';
// import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
// import YupErrorMessage from 'src/components/error-field/yup-error-messages';
// import { DatePicker } from '@mui/x-date-pickers';
// import { Icon } from '@iconify/react';
// import { LoadingButton } from '@mui/lab';
// import { useGetCreditRatingAgencies, useGetCreditRatings } from 'src/api/creditRatingsAndAgencies';
// import { useParams } from 'src/routes/hook';
// import { format, isDate } from 'date-fns';

// export default function CreditRating({
//   currentCreditRatings,
//   saveStepData,
//   setPercent,
//   setProgress,
// }) {
//   const params = useParams();
//   const { applicationId } = params;
//   const [agenciesData, setAgenciesData] = useState([]);
//   const [ratingsData, setRatingsData] = useState([]);
//   const { creditRatingAgencies, creditRatingAgenciesLoading } = useGetCreditRatingAgencies();
//   const { creditRatings, creditRatingsLoading } = useGetCreditRatings();
//   const { enqueueSnackbar } = useSnackbar();
//   const [ratingList, setRatingList] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isApiSubmitting, setIsApiSubmitting] = useState(false);

//   const newCreditRatingSchema = Yup.object().shape({
//     selectedAgency: Yup.object().required('Please select agency'),
//     selectedRating: Yup.object().required('Please select rating'),
//     validFrom: Yup.string().required('Valid from is required'),
//     creditRatingLetter: Yup.mixed().required('Credit rating letter required'),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       selectedAgency: null,
//       selectedRating: null,
//       validFrom: '',
//       creditRatingLetter: null,
//     }),
//     []
//   );

//   const methods = useForm({
//     resolver: yupResolver(newCreditRatingSchema),
//     defaultValues,
//   });

//   const {
//     control,
//     watch,
//     setValue,
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const values = watch();

//   const handleAddRating = handleSubmit((data) => {
//     const newEntry = {
//       agency: data.selectedAgency,
//       rating: data.selectedRating,
//       validFrom: data.validFrom,
//       creditRatingLetter: data.creditRatingLetter,
//     };

//     if (isEditing) {
//       const updatedList = [...ratingList];
//       updatedList[editIndex] = newEntry;
//       setRatingList(updatedList);
//       setIsEditing(false);
//       setEditIndex(null);
//     } else {
//       setRatingList([...ratingList, newEntry]);
//     }

//     reset(defaultValues);
//   });

//   const handleDeleteRating = (index) => {
//     setRatingList(ratingList.filter((_, i) => i !== index));
//   };

//   const handleFileUpload = async (file) => {
//     try {
//       if (!file) return;

//       enqueueSnackbar('Uploading File...', { variant: 'info' });

//       const uploadFormData = new FormData();
//       uploadFormData.append('file', file);

//       const uploadRes = await axiosInstance.post('/files', uploadFormData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setValue('creditRatingLetter', uploadRes?.data?.files[0], { shouldValidate: true });
//     } catch (err) {
//       enqueueSnackbar('File upload failed', { variant: 'error' });
//     }
//   };

//   // const onSubmit = async () => {
//   //   try {
//   //     setIsApiSubmitting(true);
//   //     if (!ratingList.length || ratingList.length === 0) {
//   //       enqueueSnackbar('Please add at least one rating', { variant: 'error' });
//   //       return;
//   //     }

//   //     const payload = {
//   //       creditRatings: ratingList.map((rating) => ({
//   //         validFrom: rating.validFrom,
//   //         creditRatingsId: rating.rating.id,
//   //         creditRatingAgenciesId: rating.agency.id,
//   //         ratingLetterId: rating.creditRatingLetter.id,
//   //         isActive: true
//   //       }))
//   //     };

//   //     const response = await axiosInstance.patch(`/bond-estimations/credit-ratings/${applicationId}`, payload);

//   //     if (response.data?.success) {
//   //       setProgress(true);
//   //       enqueueSnackbar('Credit ratings updated', { variant: 'success' });
//   //     }

//   //   } catch (error) {
//   //     console.error('error while submitting credit ratings :', error);
//   //   } finally {
//   //     setIsApiSubmitting(false);
//   //   }
//   // };

//   const onSubmit = async () => {
//     try {
//       setIsApiSubmitting(true);

//       if (!ratingList.length) {
//         enqueueSnackbar('Please add at least one rating', { variant: 'error' });
//         return;
//       }

//       const payload = {
//         creditRatings: ratingList.map((r) => ({
//           validFrom: r.validFrom,
//           creditRatingsId: r.rating?.id,
//           creditRatingAgenciesId: r.agency?.id,
//           ratingLetterId: r.creditRatingLetter?.id,
//           isActive: true,
//         })),
//       };

//       console.log('📤 Mock Submit Payload:', payload);

//       enqueueSnackbar('Credit ratings saved (mock)', { variant: 'success' });
//       saveStepData(ratingList);
//       setProgress(true);
//     } catch (error) {
//       console.error('Mock submit error:', error);
//     } finally {
//       setIsApiSubmitting(false);
//     }
//   };

//   const calculatePercent = () => {
//     if (!ratingList.length) {
//       setPercent?.(0);
//       return;
//     }

//     let completed = 0;
//     const latest = ratingList[0];

//     if (latest.agency) completed++;
//     if (latest.rating) completed++;
//     if (latest.validFrom) completed++;
//     if (latest.creditRatingLetter) completed++;
//     if (ratingList.length > 0) completed++;

//     const percentVal = (completed / 5) * 50;
//     setPercent?.(percentVal);
//   };

//   useEffect(() => {
//     calculatePercent();
//   }, [ratingList, values]);

//   useEffect(() => {
//     if (creditRatingAgencies && !creditRatingAgenciesLoading) {
//       setAgenciesData(creditRatingAgencies);
//     }
//   }, [creditRatingAgencies, creditRatingAgenciesLoading]);

//   useEffect(() => {
//     if (creditRatings && !creditRatingsLoading) {
//       setRatingsData(creditRatings);
//     }
//   }, [creditRatings, creditRatingsLoading]);

//   // Restore saved list when returning to this step
//   useEffect(() => {
//     if (Array.isArray(currentCreditRatings) && currentCreditRatings.length > 0) {
//       setRatingList(
//         currentCreditRatings.map((r) => ({
//           agency: r.agency,
//           rating: r.rating,
//           validFrom: r.validFrom,
//           creditRatingLetter: r.creditRatingLetter,
//         }))
//       );

//       setProgress(true);
//     }
//   }, [currentCreditRatings]);

//   return (
//     <FormProvider methods={methods} onSubmit={handleAddRating}>
//       <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
//         <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
//           Credit Ratings Available
//         </Typography>

//         <Grid container spacing={4}>
//           <Grid item xs={12} md={4}>
//             <RHFAutocomplete
//               name="selectedAgency"
//               label="Credit Rating Agency"
//               options={agenciesData || []}
//               getOptionLabel={(option) => option.name}
//               isOptionEqualToValue={(option, value) => option.id === value.id}
//               renderOption={(props, option) => (
//                 <li {...props} key={option.id}>
//                   {option.name}
//                 </li>
//               )}
//             />
//           </Grid>

//           <Grid item xs={12} md={8}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
//               Rating
//             </Typography>
//             <Grid container spacing={2}>
//               {ratingsData.map((rating) => (
//                 <Grid item xs={4} key={rating.id}>
//                   <FormControlLabel
//                     control={
//                       <Radio
//                         checked={values.selectedRating?.id === rating?.id}
//                         onChange={() =>
//                           setValue('selectedRating', rating, { shouldValidate: true })
//                         }
//                       />
//                     }
//                     label={rating.name}
//                   />
//                 </Grid>
//               ))}
//             </Grid>
//             <YupErrorMessage name="selectedRating" />
//           </Grid>
//         </Grid>

//         <Controller
//           name="validFrom"
//           control={control}
//           render={({ field, fieldState: { error } }) => (
//             <DatePicker
//               sx={{ mb: 2 }}
//               {...field}
//               label="Valid From"
//               value={
//                 field.value
//                   ? field.value instanceof Date
//                     ? field.value
//                     : new Date(field.value)
//                   : null
//               }
//               onChange={(newValue) => field.onChange(newValue)}
//               format="dd/MM/yyyy"
//               slotProps={{
//                 textField: {
//                   fullWidth: true,
//                   error: !!error,
//                   helperText: error?.message,
//                 },
//               }}
//             />
//           )}
//         />

//         <RHFFileUploadBox
//           name="creditRatingLetter"
//           label="Upload Credit Rating Letter"
//           icon="mdi:file-document-outline"
//           maxSizeMB={2}
//           onDrop={async (files) => handleFileUpload(files[0])}
//         />

//         <YupErrorMessage name="creditRatingLetter" />

//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1, mt: 2 }}>
//           <LoadingButton type="submit" loading={isSubmitting}>
//             {isEditing ? 'Update Rating' : 'Add Rating'}
//           </LoadingButton>
//         </Box>

//         {/* Rating Table */}
//         {ratingList.length > 0 && (
//           <Box sx={{ mt: 4 }}>
//             <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
//               Added Ratings
//             </Typography>

//             <TableContainer component={Card}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Rating Agency</TableCell>
//                     <TableCell>Rating</TableCell>
//                     <TableCell>Valid From</TableCell>
//                     <TableCell>Letter</TableCell>
//                     <TableCell align="center">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {ratingList.map((row, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{row.agency?.name}</TableCell>
//                       <TableCell>{row.rating?.name}</TableCell>
//                       <TableCell>
//                         {isDate(row.validFrom) ? format(new Date(row.validFrom), 'dd/MM/yyyy') : 'NA'}
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="text"
//                           color="primary"
//                           onClick={() => window.open(row.creditRatingLetter?.fileUrl, '_blank')}
//                         >
//                           Preview
//                         </Button>
//                       </TableCell>

//                       <TableCell align="center">
//                         <Icon
//                           icon="mdi:pencil-outline"
//                           width="20"
//                           style={{ cursor: 'pointer', marginRight: 12 }}
//                           onClick={() => {
//                             setValue(
//                               'selectedAgency',
//                               agenciesData.find((a) => a.id === row.agency)
//                             );
//                             setValue(
//                               'selectedRating',
//                               ratingsData.find((r) => r.id === row.rating)
//                             );
//                             setValue('validFrom', row.validFrom);
//                             setValue('additionalRating', row.additionalRating);
//                             setValue('creditRatingLetter', row.creditRatingLetter);
//                             setIsEditing(true);
//                             setEditIndex(index);
//                           }}
//                         />

//                         <Icon
//                           icon="mdi:delete-outline"
//                           width="20"
//                           style={{ cursor: 'pointer', color: '#d32f2f' }}
//                           onClick={() => handleDeleteRating(index)}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         )}

//         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
//           <LoadingButton
//             loading={isApiSubmitting}
//             type="button"
//             variant="contained"
//             onClick={onSubmit}
//           >
//             Save
//           </LoadingButton>
//         </Box>
//       </Card>
//     </FormProvider>
//   );
// }

// CreditRating.propTypes = {
//   currentCreditRatings: PropTypes.array,
//   setPercent: PropTypes.func,
//   setProgress: PropTypes.func,
// };

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Typography, Card, Radio, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFCustomFileUploadBox } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import { useGetCreditRatingAgencies, useGetCreditRatings } from 'src/api/creditRatingsAndAgencies';
import YupErrorMessage from 'src/components/error-field/yup-error-messages';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useParams } from 'src/routes/hook';
import RatingPendingNotice from './ratingPending';

export default function CreditRating({ percent, setActiveStepId }) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const { creditRatings = [] } = useGetCreditRatings();
  const { creditRatingAgencies } = useGetCreditRatingAgencies();
  const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'credit_rating_approval');
  const [creditRatingsData, setCreditRatingsData] = useState(null);

  const Schema = Yup.object().shape({
    ratings: Yup.array().of(
      Yup.object().shape({
        agency: Yup.object().required('Credit Rating agency is required'),
        rating: Yup.object().required('Rating is required'),
        validFrom: Yup.date().required('Valid from is required'),
        creditRatingLetter: Yup.mixed().required('Rating letter required'),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      ratings: creditRatingsData?.creditRatings?.map((rating) => ({
        agency: rating?.creditRatingAgencies || null,
        rating: rating?.creditRatings || null,
        validFrom: new Date(rating?.validFrom) || null,
        creditRatingLetter: rating?.ratingLetter || null,
      })),
    }),
    [creditRatingsData]
  );

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'ratings',
  });

  const values = watch('ratings');

  const isCreditRatingComplete = values?.length
    ? values.every((r) => r.rating && r.validFrom && r.creditRatingLetter)
    : false;

  const { reset } = methods;

  const onSubmit = (data) => {
    console.log('📤 Credit Rating Payload:', data);

    enqueueSnackbar('Credit ratings saved successfully', {
      variant: 'success',
    });

    setActiveStepId?.('regulatory_filing');
  };

  const handleNextClick = () => {
    if (!isCreditRatingComplete) {
      enqueueSnackbar('Please complete all Credit Rating details', {
        variant: 'warning',
      });
      return;
    }

    // move to next step
    setActiveStepId?.('regulatory_filing');
  };

  useEffect(() => {
    if (stepData && !stepDataLoading) {
      setCreditRatingsData(stepData);
    }
  }, [stepData, stepDataLoading]);

  useEffect(() => {
    if (!creditRatingsData?.creditRatings?.length) return;

    reset(defaultValues);
  }, [creditRatingsData, reset, defaultValues]);

  useEffect(() => {
    if (!values?.length) {
      percent?.(0);
      return;
    }

    const completed = values.filter((r) => r.rating && r.validFrom && r.creditRatingLetter).length;

    const percentage = (completed / values.length) * 100;
    percent?.(percentage);
  }, [values, percent]);

  return (
    fields.length > 0 ? (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" color="primary" fontWeight='bold'>
          Credit Rating Details
        </Typography>

        <Grid container spacing={4}>
          {fields.map((item, index) => (
            <Grid item xs={12} key={item.id}>
              <Card sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      name={`ratings.${index}.agency`}
                      label="Credit Rating Agency"
                      options={creditRatingAgencies || []}
                      getOptionLabel={(option) => option?.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <RHFAutocomplete
                      name={`ratings.${index}.rating`}
                      label="Credit Rating"
                      options={creditRatings || []}
                      getOptionLabel={(option) => option?.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  </Grid>
                </Grid>

                {/* Valid From */}
                <Controller
                  name={`ratings.${index}.validFrom`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="Valid From"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                      sx={{ my: 5 }}
                    />
                  )}
                />

                <Grid item xs={12}>
                  <RHFCustomFileUploadBox
                    name={`ratings.${index}.creditRatingLetter`}
                    label="Upload Credit Rating Letter"
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/png': ['.png'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                  />
                  <YupErrorMessage name={`ratings.${index}.creditRatingLetter`} />
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Box> */}
        {creditRatingsData?.approvalCompleted && <Grid item xs={12}>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              m: 2,
            }}
          >
            <LoadingButton type="button" variant="contained" onClick={handleNextClick}>
              Next
            </LoadingButton>
          </Box>
        </Grid>}
      </FormProvider>
    ) : (
      <RatingPendingNotice />
    )
  );
}

CreditRating.propTypes = {
  saveStepData: PropTypes.func,
  percent: PropTypes.func,
  setProgress: PropTypes.func,
};
