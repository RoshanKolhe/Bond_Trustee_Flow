import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
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
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
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
  const [extractedPan, setExtractedPan] = useState(null);
  const [panExtractionStatus, setPanExtractionStatus] = useState('idle');

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
    submittedPanFullName: Yup.string()
      .transform((value) => value?.toUpperCase())
      .required("PAN Holder's Name is required")
      .matches(/^[A-Za-z\s]+$/, 'Only alphabets allowed'),
    submittedPanNumber: Yup.string()
      .transform((value) => value?.toUpperCase())
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
      .required('PAN Number is required'),
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
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const panFile = useWatch({
    control: methods.control,
    name: 'panCard',
  });
  const isPanUploaded = Boolean(panFile?.id || panFile?.files?.[0]?.id);

  const watchRole = methods.watch('role');

  const getFileId = (fileValue) => {
    if (!fileValue) return null;

    // Existing file (edit mode)
    if (fileValue.id) return fileValue.id;

    // Newly uploaded file
    if (fileValue.files?.length > 0) {
      return fileValue.files[0]?.id || null;
    }

    return null;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const usersId = sessionStorage.getItem('trustee_user_id');

      if (!usersId) {
        enqueueSnackbar('User ID missing. Restart KYC.', { variant: 'error' });
        return;
      }

      const panCardFileId = getFileId(data.panCard);
      const boardResolutionFileId = getFileId(data.boardResolution);

      if (!panCardFileId && !isEditMode) {
        enqueueSnackbar('PAN card is required', { variant: 'error' });
        return;
      }

      if (!boardResolutionFileId && !isEditMode) {
        enqueueSnackbar('Board Resolution is required', { variant: 'error' });
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

          panCardFileId,
          boardResolutionFileId,
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

  useEffect(() => {
    if (!panFile?.id) return;

    const extractPanDetails = async () => {
      try {
        setPanExtractionStatus('loading');

        const response = await axiosInstance.post('/extract/pan-info', {
          fileId: panFile.id,
        });

        const data = response?.data?.data || {};

        const panNumber = data?.extractedPanNumber;
        const panName = data?.extractedPanHolderName;
        const panDob = data?.extractedDateOfBirth;

        if (!panNumber && !panName && !panDob) {
          setPanExtractionStatus('failed');
          enqueueSnackbar("Couldn't extract PAN details. Please fill manually.", {
            variant: 'error',
          });
          return;
        }

        if (panName) {
          setValue('panHoldersName', panName, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        if (panNumber) {
          setValue('panNumber', panNumber, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        if (panDob) {
          setValue('submittedDateOfBirth', panDob, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }

        setPanExtractionStatus('success');
        enqueueSnackbar('PAN details extracted successfully', {
          variant: 'success',
        });
      } catch (error) {
        console.error(error);
        setPanExtractionStatus('failed');
        enqueueSnackbar('Unable to extract PAN details. Please fill manually.', {
          variant: 'error',
        });
      }
    };

    extractPanDetails();
  }, [panFile?.id]);

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
                <RHFCustomFileUploadBox
                  name="panCard"
                  label="Upload PAN*"
                  fileType="pan"
                  required={!isEditMode}
                  error={!!errors.panCard}
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                />
                <RHFTextField
                  name="submittedPanFullName"
                  label="PAN Holder Full Name*"
                  InputLabelProps={{ shrink: true }}
                  disabled={!isPanUploaded}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />

                <RHFTextField
                  name="submittedPanNumber"
                  label="PAN Number*"
                  InputLabelProps={{ shrink: true }}
                  disabled={!isPanUploaded}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />

                <Controller
                  name="submittedDateOfBirth"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="PAN Date of Birth*"
                      disabled={!isPanUploaded}
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
                <RHFCustomFileUploadBox
                  name="boardResolution"
                  label="Board Resolution*"
                  fileType="boardResolution"
                  required={!isEditMode}
                  error={!!errors.boardResolution}
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                />
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
