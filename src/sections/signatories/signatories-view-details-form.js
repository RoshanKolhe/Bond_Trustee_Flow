import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
    Box,
    Button,
    CircularProgress,
    Card,
    Grid,
    MenuItem,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';


const ROLES = [
    { value: 'DIRECTOR', label: 'Director' },
    { value: 'SIGNATORY', label: 'Signatory' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'OTHER', label: 'Other' },
];

export default function SignatoriesDetails({ currentUser, isViewMode, isEditMode }) {
    const { enqueueSnackbar } = useSnackbar();
    const [extractedPan, setExtractedPan] = useState(null);
    const [isPanUploaded, setIsPanUploaded] = useState(false);

    // ---------------------- VALIDATION ----------------------
    const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email(),
        phoneNumber: Yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),
        role: Yup.string().required(),
        customDesignation: Yup.string().when('role', {
            is: 'OTHER',
            then: Yup.string().required('Enter custom designation'),
        }),
        submittedPanFullName: Yup.string().required(),
        submittedPanNumber: Yup.string().required(),
        submittedDateOfBirth: Yup.string().required(),
        panCard: Yup.mixed().test('required', 'PAN card is required', (v) => isEditMode || !!v),
        boardResolution: Yup.mixed().test('required', 'Board Resolution is required', (v) => isEditMode || !!v),
    });

    // ---------------------- DEFAULT VALUES ----------------------
    const defaultValues = useMemo(
        () => ({
            name: currentUser?.fullName || '',
            email: currentUser?.email || '',
            phoneNumber: currentUser?.phone || '',

            // FIXED ROLE MAPPING
            role:
                currentUser?.designationValue
                    ? ROLES.find((r) => r.label.toLowerCase() === currentUser.designationValue.toLowerCase())?.value
                    : '',

            customDesignation:
                currentUser?.designationType === 'CUSTOM' ? currentUser.designationValue : '',

            panCard: currentUser?.panCardFileId || null,
            boardResolution: currentUser?.boardResolutionFileId || null,

            submittedPanFullName: currentUser?.submittedPanFullName || '',
            submittedPanNumber: currentUser?.submittedPanNumber || '',
            submittedDateOfBirth:
                currentUser?.submittedDateOfBirth ? new Date(currentUser.submittedDateOfBirth) : null,
        }),
        [currentUser]
    );


    const methods = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { handleSubmit, reset, setValue, watch } = methods;
    const roleWatch = watch('role');

    useEffect(() => {
        if (currentUser) reset(defaultValues);
    }, [currentUser]);

    // ---------------------- FILE HANDLERS ----------------------
    const uploadFile = async (file) => {
        if (!file || typeof file === 'string') return file; // if already uploaded
        const fd = new FormData();
        fd.append('file', file);
        const { data } = await axiosInstance.post('/files', fd);
        return data?.files?.[0]?.id;
    };

    const handlePanUpload = async (file) => {
        enqueueSnackbar('Uploading PAN...', { variant: 'info' });

        const fd = new FormData();
        fd.append('file', file);

        const uploadRes = await axiosInstance.post('/files', fd);
        const uploadedFile = uploadRes?.data?.files?.[0];

        if (!uploadedFile) return enqueueSnackbar('Upload failed', { variant: 'error' });

        setIsPanUploaded(true);

        const extractRes = await axiosInstance.post('/extract/pan-info', fd);
        const extracted = extractRes?.data?.data;

        setExtractedPan(extracted);

        setValue('submittedPanFullName', extracted?.extractedPanHolderName || '');
        setValue('submittedPanNumber', extracted?.extractedPanNumber || '');
        setValue('submittedDateOfBirth', extracted?.extractedDateOfBirth || '');
    };

    // ---------------------- SUBMIT ----------------------
    const onSubmit = handleSubmit(async (form) => {
        try {
            const payload = {
                signatory: {
                    fullName: form.name,
                    email: form.email,
                    phone: form.phoneNumber,
                    designationType: form.role === 'OTHER' ? 'CUSTOM' : 'DEFAULT',
                    designationValue:
                        form.role === 'OTHER' ? form.customDesignation : ROLES.find((r) => r.value === form.role)?.label,
                    submittedPanFullName: form.submittedPanFullName,
                    submittedPanNumber: form.submittedPanNumber,
                    submittedDateOfBirth: form.submittedDateOfBirth,
                    panCardFileId: await uploadFile(form.panCard),
                    boardResolutionFileId: await uploadFile(form.boardResolution),
                    ...(extractedPan ? { extractedPan } : {}),
                },
            };

            const res = await axiosInstance.post('/company-profiles/authorize-signatory', payload);

            enqueueSnackbar(res?.data?.message || 'Success', { variant: 'success' });
            reset(defaultValues);
        } catch (err) {
            enqueueSnackbar('Failed, try again', { variant: 'error' });
        }
    });

    const isDisabled = isViewMode;

    // ---------------------- UI ----------------------
    return (
        <Card sx={{ p: 4 }}>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={3} mt={2}>
                    <Grid item xs={12} sm={6}>
                        <RHFTextField name="name" label="Name*" disabled={true} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <RHFTextField name="email" label="Email*"  disabled={true} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <RHFTextField name="phoneNumber" label="Phone*"  disabled={true} inputProps={{ maxLength: 10 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <RHFSelect name="role" label="Designation*"  disabled={true}>
                            {ROLES.map((r) => (
                                <MenuItem key={r.value} value={r.value}>
                                    {r.label}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                    </Grid>

                    {roleWatch === 'OTHER' && !isDisabled && (
                        <Grid item xs={12} sm={6}>
                            <RHFTextField name="customDesignation" label="Custom Designation*"  disabled={true} />
                        </Grid>
                    )}

                    {/* PAN Upload */}
                    <Grid item xs={12}>
                        {/* <RHFFileUploadBox
                            name="panCard"
                            label="Upload PAN*"
                            accept="application/pdf,image/*"
                            onDrop={(files) => handlePanUpload(files[0])}
                        /> */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    mb: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                      Check  Uploaded PanCard :
                                    </Typography>
                                </Box>

                                {currentUser?.panCardFile?.fileUrl ? (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        
                                        startIcon={<Iconify icon="mdi:eye" />}
                                        sx={{
                                            height: 36,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                        onClick={() => window.open(currentUser.panCardFile.fileUrl, '_blank')}
                                    >
                                        Preview Document
                                    </Button>
                                ) : (
                                    <Typography color="text.secondary">No file uploaded.</Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <RHFTextField name="submittedPanFullName" label="PAN Holder Name*" disabled={!isPanUploaded || isDisabled} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <RHFTextField name="submittedPanNumber" label="PAN Number*" disabled={!isPanUploaded || isDisabled} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="submittedDateOfBirth"
                            control={methods.control}
                            render={({ field }) => (
                                <DatePicker
                                    label="DOB"
                                    disabled={!isPanUploaded || isDisabled}
                                    value={field.value instanceof Date && !isNaN(field.value) ? field.value : null}
                                    onChange={(newValue) => field.onChange(newValue ?? null)}
                                    format="dd/MM/yyyy"
                                />
                            )}
                        />

                    </Grid>

                    <Grid item xs={12}>
                        {/* <RHFFileUploadBox name="boardResolution" label="Board Resolution*" accept="application/pdf,image/*" /> */}
                        <Box sx={{ mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    mb: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                      Check  Uploaded Resolution :
                                    </Typography>
                                </Box>

                                {currentUser?.boardResolutionFile?.fileUrl ? (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<Iconify icon="mdi:eye" />}
                                        sx={{
                                            height: 36,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                        onClick={() => window.open(currentUser.boardResolutionFile.fileUrl, '_blank')}
                                    >
                                        Preview Document
                                    </Button>
                                ) : (
                                    <Typography color="text.secondary">No file uploaded.</Typography>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {/* 
        {!isDisabled && (
          <Box sx={{ textAlign: 'right', mt: 3 }}>
            <Button type="submit" variant="contained" startIcon={<Iconify icon="eva:save-fill" />}>
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        )} */}
            </FormProvider>
        </Card>
    );
}

SignatoriesDetails.propTypes = {
    currentUser: PropTypes.object,
    isViewMode: PropTypes.bool,
    isEditMode: PropTypes.bool,
};
