import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
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

const ROLES = [
  { value: 'DIRECTOR', label: 'Director' },
  { value: 'SIGNATORY', label: 'Signatory' },
  { value: 'MANAGER', label: 'Manager' },
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
  const { user } = useAuthContext(); // eslint-disable-line no-unused-vars

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
    dob: Yup.date().required('Date of birth is required').typeError('Invalid date'),
    role: Yup.string().required('Role is required'),
    panCard: Yup.mixed()
      .test('fileRequired', 'PAN card is required', function (value) {
        if (isEditMode) return true; // Not required in edit mode
        return value && value !== ''; // Required in create mode
      })
      .test('fileSize', 'File size is too large (max 10MB)', function (value) {
        if (!value || value === '') return true;
        return value.size <= 10 * 1024 * 1024; // 10MB
      }),
    aadhaarCard: Yup.mixed()
      .test('fileRequired', 'Aadhaar card is required', function (value) {
        if (isEditMode) return true; // Not required in edit mode
        return value && value !== ''; // Required in create mode
      })
      .test('fileSize', 'File size is too large (max 10MB)', function (value) {
        if (!value || value === '') return true;
        return value.size <= 10 * 1024 * 1024; // 10MB
      }),
    passportPhoto: Yup.mixed().test('fileRequired', 'Passport photo is required', function (value) {
      if (isEditMode) return true;
      return value instanceof File;
    }),

    signature: Yup.mixed().test('fileRequired', 'Signature file is required', function (value) {
      if (isEditMode) return true;
      return value instanceof File;
    }),
  });

  const defaultValues = useMemo(() => {
    const roleValue = currentUser?.designation
      ? ROLES.find((r) => r.value === currentUser.designation)?.value || ''
      : '';

    return {
      name: currentUser?.name_of_signatory || '',
      email: currentUser?.email_address || '',
      phoneNumber: currentUser?.phone_number || '',
      dob: '',
      role: roleValue,
      panCard: '',
      aadhaarCard: '',
      passportPhoto: '',
      signature: '',
      panNumber: currentUser?.pan_number || '',
      aadhaarNumber: currentUser?.aadhaar_number || '',
    };
  }, [currentUser]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  // Reset form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      methods.reset({
        name: currentUser.name_of_signatory || '',
        email: currentUser.email_address || '',
        phoneNumber: currentUser.phone_number || '',
        role: currentUser.designation || '',
        panCard: '',
        aadhaarCard: '',
        passportPhoto: '',
        signature: '',
        panNumber: currentUser.pan_number || '',
        aadhaarNumber: currentUser.aadhaar_number || '',
      });
    } else {
      methods.reset(defaultValues);
    }
  }, [currentUser, methods, defaultValues]);

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  // Helper function to get error message for a field
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

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('name_of_signatory', data.name);
  //     formData.append('email_address', data.email);
  //     formData.append('phone_number', data.phoneNumber);
  //     formData.append('designation', data.role);
  //     if (data.panCard) formData.append('document_file_pan', data.panCard);
  //     if (data.aadhaarCard) formData.append('document_file_aadhaar', data.aadhaarCard);
  //     if (data.passportPhoto) formData.append('passport_photo', data.passportPhoto);
  //     if (data.signature) formData.append('signature_file', data.signature);

  //     const token = sessionStorage.getItem('accessToken');
  //     const headers = {
  //       'Content-Type': 'multipart/form-data',
  //       Authorization: `Bearer ${token}`,
  //     };

  //     let response;
  //     if (isEditMode && currentUser?.signatory_id) {
  //       // Update existing signatory
  //       response = await axios.patch(
  //         `${process.env.REACT_APP_HOST_API}/api/kyc/issuer_kyc/company/signatories/update/${currentUser.signatory_id}`,
  //         formData,
  //         { headers }
  //       );
  //     } else {
  //       // Create new signatory
  //       response = await axios.post(
  //         `${process.env.REACT_APP_HOST_API}/api/kyc/issuer_kyc/company/signatories/`,
  //         formData,
  //         { headers }
  //       );
  //     }

  //     if (response.data.success === true) {
  //       enqueueSnackbar(
  //         isEditMode ? 'Signatory updated successfully' : 'Signatory added successfully',
  //         { variant: 'success' }
  //       );
  //       onSuccess();
  //       onClose();
  //     }
  //   } catch (error) {
  //     console.error('Error saving signatory:', error);
  //     enqueueSnackbar(
  //       error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} signatory`,
  //       { variant: 'error' }
  //     );
  //   }
  // });
  const onSubmit = handleSubmit(async (data) => {
    // Create object to send back to parent list
    const newSignatory = {
      name: data.name,
      email: data.email,
      phone: data.phoneNumber,
      din: data.din ?? '—', // If you add DIN later
      role: ROLES.find((r) => r.value === data.role)?.label || data.role,
      idProof: 'Uploaded', // static for now
      status: 'Pending',
    };

    console.log('Signatory Submitted (Dummy):', newSignatory);

    // pass to parent
    if (onSuccess) onSuccess(newSignatory);

    onClose();
  });

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
            {/* {getErrorMessage('name')} */}

            <RHFTextField
              name="email"
              label="Email*"
              type="email"
              InputLabelProps={{ shrink: true }}
              disabled={isViewMode}
            />
            {/* {getErrorMessage('email')} */}

            <RHFTextField
              name="phoneNumber"
              label="Phone Number*"
              type="number"
              InputLabelProps={{ shrink: true }}
              disabled={isViewMode}
              sx={{ mt: 2 }}
            />
            {/* {getErrorMessage('phoneNumber')} */}
            <Controller
              name="dob"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label="Date of Birth"
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
            {/* {getErrorMessage('role')} */}

            {isViewMode ? (
              <>
                <RHFTextField
                  name="panNumber"
                  label="PAN Number*"
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
                <RHFTextField
                  name="aadhaarNumber"
                  label="Aadhaar Number*"
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
                />
                {getErrorMessage('panCard')}

                <RHFFileUploadBox
                  name="aadhaarCard"
                  label="Upload Aadhaar*"
                  accept="application/pdf,image/*"
                  fileType="aadhaar"
                  required={!isEditMode}
                  error={!!errors.aadhaarCard}
                />
                {getErrorMessage('aadhaarCard')}
                <RHFFileUploadBox
                  name="passportPhoto"
                  label="Passport Size Photo*"
                  accept="application/pdf,image/*"
                  fileType="passport"
                  required={!isEditMode}
                  error={!!errors.passportPhoto}
                />
                {getErrorMessage('passportPhoto')}
                <RHFFileUploadBox
                  name="signature"
                  label="Signature*"
                  accept="application/pdf,image/*"
                  fileType="aadhaar"
                  required={!isEditMode}
                  error={!!errors.signature}
                />
                {getErrorMessage('signature')}
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
