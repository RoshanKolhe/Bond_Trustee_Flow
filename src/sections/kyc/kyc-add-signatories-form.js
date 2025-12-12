import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { DatePicker } from '@mui/x-date-pickers';
import axiosInstance from 'src/utils/axios';

const ROLES = [
  { value: 'DIRECTOR', label: 'Director' },
  { value: 'MANAGING_DIRECTOR', label: 'Managing Director (MD)' },
  { value: 'WHOLETIME_DIRECTOR', label: 'Whole-Time Director' },
  { value: 'CFO', label: 'Chief Financial Officer (CFO)' },
  { value: 'CEO', label: 'Chief Executive Officer (CEO)' },
  { value: 'AUTHORISED_SIGNATORY', label: 'Authorised Signatory' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'TRUSTEE', label: 'Trustee' },
  { value: 'PROPRIETOR', label: 'Proprietor' },
  { value: 'COMPANY_SECRETARY', label: 'Company Secretary (CS)' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'AUTHORIZED_REPRESENTATIVE', label: 'Authorized Representative' },
  { value: 'NOMINEE', label: 'Nominee' },
  { value: 'OTHER', label: 'Other' },
];

export default function KYCAddSignatoriesForm({
  open,
  onClose,
  onSuccess,
  companyId,
  currentUser,
  isViewMode,
  isEditMode,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isPanUploaded, setIsPanUploaded] = useState(false);
  const [extractedPan, setExtractedPan] = useState(null);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        'Please enter a valid email address'
      ),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
    role: Yup.string().required('Role is required'),
    customDesignation: Yup.string().when('role', (role, schema) =>
      role === 'OTHER' ? schema.required('Please enter designation') : schema.notRequired()
    ),
    submittedPanFullName: Yup.string().required('PAN Holder Name is required'),
    submittedPanNumber: Yup.string().required('PAN Number is required'),
    submittedDateOfBirth: Yup.string().required('DOB is required'),
    panCard: Yup.mixed().test('fileRequired', 'PAN card is required', function (value) {
      if (isEditMode) return true;
      return !!value;
    }),
    boardResolution: Yup.mixed().test(
      'fileRequired',
      'Board Resolution is required',
      function (value) {
        if (isEditMode) return true;
        return !!value;
      }
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phone || '',
      role: currentUser?.designationType || '',
      panCard: '',
      customDesignation: '',
      boardResolution: '',
      submittedPanFullName: '',
      submittedPanNumber: '',
      submittedDateOfBirth: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const watchRole = methods.watch('role');

  const getErrorMessage = (fieldName) => {
    if (!errors[fieldName]) return null;
    return (
      <Box
        component="span"
        sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, display: 'block' }}
      >
        {errors[fieldName]?.message}
      </Box>
    );
  };

  const uploadFile = async (file) => {
    if (!file) return null;

    const fd = new FormData();
    fd.append('file', file);

    const res = await axiosInstance.post('/files', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res?.data?.files?.[0]?.id || null;
  };

  const handlePanUpload = async (file) => {
    try {
      if (!file) return;

      enqueueSnackbar('Uploading PAN...', { variant: 'info' });

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await axiosInstance.post('/files', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = uploadRes?.data?.files?.[0];
      if (!uploaded || !uploaded.id) {
        throw new Error('PAN file upload failed');
      }
      setIsPanUploaded(true);

      enqueueSnackbar('Extracting PAN details…', { variant: 'info' });

      const extractRes = await axiosInstance.post('/extract/pan-info', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const panData = extractRes?.data?.data || extractRes?.data;

      const panNumberFromApi = panData?.extractedPanNumber || '';
      const dobFromApi = panData?.extractedDateOfBirth || '';
      const panHolderNameFromApi = panData?.extractedPanHolderName || '';

      if (!panNumberFromApi && !dobFromApi && !panHolderNameFromApi) {
        enqueueSnackbar(
          "We couldn't fetch details from your PAN document. Please fill the details manually.",
          { variant: 'error' }
        );
        return;
      }

      // Autofill PAN form fields
      methods.setValue('submittedPanFullName', panHolderNameFromApi || '', {
        shouldValidate: true,
        shouldDirty: true,
      });

      methods.setValue('submittedPanNumber', panNumberFromApi || '', {
        shouldValidate: true,
        shouldDirty: true,
      });

      if (dobFromApi) {
        methods.setValue('submittedDateOfBirth', new Date(dobFromApi), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Keep extracted values for API payload
      setExtractedPan({
        extractedPanFullName: panHolderNameFromApi || '',
        extractedPanNumber: panNumberFromApi || '',
        extractedDateOfBirth: dobFromApi || '',
      });

      enqueueSnackbar('PAN details extracted successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error in PAN upload/extraction:', err);
      enqueueSnackbar(
        "We couldn't fetch details from your PAN document. Please fill the details manually.",
        { variant: 'error' }
      );
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const panFileId = await uploadFile(data.panCard);
      const boardFileId = await uploadFile(data.boardResolution);

      const usersId = sessionStorage.getItem('trustee_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Restart KYC.', { variant: 'error' });
        return;
      }

      const isCustom = data.role === 'OTHER';

      const payload = {
        usersId,
        signatory: {
          fullName: data.name,
          email: data.email,
          phone: data.phoneNumber,

          // Extracted PAN details (from OCR)
          extractedPanFullName: extractedPan?.extractedPanFullName || '',
          extractedPanNumber: extractedPan?.extractedPanNumber || '',
          extractedDateOfBirth: extractedPan?.extractedDateOfBirth || '',

          // Submitted PAN details (after human check / edit)
          submittedPanFullName: data.submittedPanFullName,
          submittedPanNumber: data.submittedPanNumber,
          submittedDateOfBirth: data.submittedDateOfBirth,

          panCardFileId: panFileId,
          boardResolutionFileId: boardFileId,
          designationType: isCustom ? 'custom' : 'dropdown',
          designationValue: isCustom
            ? data.customDesignation
            : ROLES.find((r) => r.value === data.role)?.label || data.role,
        },
      };

      const res = await axiosInstance.post('/trustee-profiles/kyc-authorize-signatory', payload);

      if (res?.data?.success) {
        enqueueSnackbar('Signatory added successfully', { variant: 'success' });
        onSuccess?.(payload.signatory);
        onClose();
      } else {
        enqueueSnackbar(res?.data?.message || 'Something went wrong', {
          variant: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to add signatory', { variant: 'error' });
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [currentUser, defaultValues, reset]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {isViewMode ? 'View Signatory' : isEditMode ? 'Edit Signatory' : 'Add New Signatory'}
        </DialogTitle>

        <DialogContent
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            overflowY: 'auto',
            maxHeight: '70vh',
            pr: 2,
          }}
        >
          <Box rowGap={3} display="grid" mt={2}>
            <RHFTextField
              name="name"
              label="Name*"
              InputLabelProps={{ shrink: true }}
              disabled={isViewMode}
            />

            <RHFTextField
              name="email"
              label="Email*"
              type="email"
              InputLabelProps={{ shrink: true }}
              disabled={isViewMode}
            />

            <RHFTextField
              name="phoneNumber"
              label="Phone Number*"
              type="tel"
              disabled={isViewMode}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 10 }}
            />
            <RHFSelect
              name="role"
              label="Designation*"
              InputLabelProps={{ shrink: true }}
              disabled={isViewMode}
            >
              {ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {watchRole === 'OTHER' && !isViewMode && (
              <RHFTextField
                name="customDesignation"
                label="Enter Custom Designation*"
                placeholder="Enter custom designation"
                InputLabelProps={{ shrink: true }}
              />
            )}

            {isViewMode ? (
              <>
                <RHFTextField
                  name="panNumber"
                  label="PAN Number*"
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
                <RHFTextField
                  name="boardResolution"
                  label="Board Resolution*"
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </>
            ) : (
              <>
                <RHFFileUploadBox
                  name="panCard"
                  label="Upload PAN*"
                  accept="application/pdf,image/*"
                  fileType="pan"
                  required={!isEditMode}
                  error={!!errors.panCard}
                  onDrop={async (files) => {
                    const file = files[0];
                    if (!file) return;
                    methods.setValue('panCard', file, { shouldValidate: true });
                    await handlePanUpload(file);
                  }}
                />
                {getErrorMessage('panCard')}
                <RHFTextField
                  name="submittedPanFullName"
                  label="PAN Holder Full Name*"
                  InputLabelProps={{ shrink: true }}
                  disabled={!isPanUploaded || isViewMode}
                />

                <RHFTextField
                  name="submittedPanNumber"
                  label="PAN Number*"
                  InputLabelProps={{ shrink: true }}
                  disabled={!isPanUploaded || isViewMode}
                />

                <Controller
                  name="submittedDateOfBirth"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="PAN Date of Birth*"
                      disabled={!isPanUploaded || isViewMode}
                      value={field.value ? new Date(field.value) : null}
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

                <RHFFileUploadBox
                  name="boardResolution"
                  label="Board Resolution*"
                  accept="application/pdf,image/*"
                  fileType="boardResolution"
                  required={!isEditMode}
                  error={!!errors.boardResolution}
                />
                {getErrorMessage('boardResolution')}
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>

            {!isViewMode && (
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isEditMode ? 'Update' : 'Add'}
              </Button>
            )}
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

KYCAddSignatoriesForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  isViewMode: PropTypes.bool,
  companyId: PropTypes.string,
};
