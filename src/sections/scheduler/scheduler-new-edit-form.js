import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// utils
import { fData } from 'src/utils/format-number';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// assets

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect } from 'src/components/hook-form';
import RHFSwitch from 'src/components/hook-form/rhf-switch';
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';
import RHFAutocomplete from 'src/components/hook-form/rhf-autocomplete';

import { Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
// import { _fullNames } from 'src/_mock';

const platformNames = [
  { value: 'naukari', label: 'Naukari' },
  { value: 'linkedIn', label: 'LinkedIn' },
];

const SchedulerTypes = [
  { value: 'recurring', label: 'Recurring' },
  { value: 'oneTime', label: 'One Time' },
];

const SchedulerFors = [
  { value: 'job', label: 'Job' },
];

export default function SchedulerNewEditForm({ currentScheduler, open, onClose }) {

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const SchedulerSchema = Yup.object().shape({
    platformName: Yup.string().required('Name is required'),
    schedulerType: Yup.string().required('Scheduler type is required'),
    schedulerFor: Yup.string().required('Scheduler for is required'),
    interval: Yup.string().required('Interval is required'),
    date: Yup.date().required('date is required'),
    time: Yup.string().required('time is required')
  });

  const defaultValues = useMemo(
    () => ({
      platformName: currentScheduler?.platformName || '',
      schedulerType: currentScheduler?.schedulerType || '',
      schedulerFor: currentScheduler?.schedulerFor || '',
      interval: currentScheduler?.interval || '',
      date: currentScheduler?.date || '',
      time: currentScheduler?.time || ''
    }),
    [currentScheduler]
  );

  const methods = useForm({
    resolver: yupResolver(SchedulerSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // const handleDrop = useCallback((field) => (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   const newFile = Object.assign(file, {
  //     preview: URL.createObjectURL(file),
  //   });
  //   setValue(field, newFile, { shouldValidate: true });
  // }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const inputData = {
        platformName: data.platformName,
        schedulerType: data.schedulerType,
        schedulerFor: data.schedulerFor,
        interval: data.interval,
        date: data.date,
        time: data.time,
      

      };

      if (!currentScheduler) {
        await axiosInstance.post('/schedulers', inputData);
      } else {
        await axiosInstance.patch(`/schedulers/${currentScheduler.id}`, inputData);
      }

      reset();
      enqueueSnackbar(currentScheduler ? 'Scheduler updated successfully!' : 'Scheduler created successfully!');
      router.push(paths.dashboard.scheduler.list); 
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });

useEffect(() => {
    if (currentScheduler) {
      reset(defaultValues);
    }
  }, [currentScheduler, defaultValues, reset]);


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <RHFSelect name="platformName" label="platform ">
                {platformNames.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </RHFSelect>  

               <RHFSelect name="schedulerType" label="Scheduler Type ">
                {SchedulerTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </RHFSelect> 

              <RHFTextField name="interval" label="Interval" />
                <Controller
                name="date"
                control={control}
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
        
              <Controller
                name="time"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    label="Time"
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
               <RHFSelect name="schedulerFor" label="Scheduler For ">
                {SchedulerFors.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </RHFSelect> 

             
                 </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentScheduler ? 'Save Changes' : 'Create Scheduler'}
              </LoadingButton>
            </Stack>
         </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SchedulerNewEditForm.propTypes = {
  currentScheduler: PropTypes.object,
    open: PropTypes.bool,
  onClose: PropTypes.func,

};
