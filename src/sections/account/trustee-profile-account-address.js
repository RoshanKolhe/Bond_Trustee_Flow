import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
  Button,
} from '@mui/material';

import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import RHFFileUploadBox from 'src/components/custom-file-upload/file-upload';

import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from 'axios';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { LoadingButton } from '@mui/lab';

export default function AddressNewForm({ onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [addressExists, setAddressExists] = useState(false);

  const accessToken = sessionStorage.getItem('accessToken');
  const companyId = sessionStorage.getItem('company_information_id');
  const router = useRouter();

  // ----------------------------- Validation Schema -----------------------------
  const AddressSchema = Yup.object().shape({
    documentType: Yup.string().required('Please select document type'),
    registeredAddressLine1: Yup.string().required('Required'),
    registeredAddressLine2: Yup.string(),
    registeredCountry: Yup.string().required('Required'),
    registeredCity: Yup.string().required('Required'),
    registeredState: Yup.string().required('Required'),
    registeredPincode: Yup.string().required('Required').matches(/^[0-9]+$/, 'Invalid'),
    registeredEmail: Yup.string().email('Invalid').required('Required'),
    registeredPhone: Yup.string().required('Required').matches(/^[0-9]{10}$/, 'Must be 10 digits'),

    sameAsRegistered: Yup.boolean(),

    correspondenceAddressLine1: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required'),
    }),
    correspondenceAddressLine2: Yup.string(),
    correspondenceCountry: Yup.string().required('Required'),
    correspondenceCity: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required'),
    }),
    correspondenceState: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required'),
    }),
    correspondencePincode: Yup.string().when('sameAsRegistered', {
      is: false,
      then: (s) => s.required('Required').matches(/^[0-9]{6}$/, 'Invalid'),
    }),
    correspondenceEmail: Yup.string().email('Invalid'),
    correspondencePhone: Yup.string(),

    addressProof: Yup.mixed().required('Required'),
  });

  // ----------------------------- Form Defaults -----------------------------
  const defaultValues = useMemo(
    () => ({
      documentType: 'electricityBill',

      registeredAddressLine1: '',
      registeredAddressLine2: '',
      registeredCountry: 'India',
      registeredCity: '',
      registeredState: '',
      registeredPincode: '',
      registeredEmail: '',
      registeredPhone: '',

      sameAsRegistered: false,

      correspondenceAddressLine1: '',
      correspondenceAddressLine2: '',
      correspondenceCity: '',
      correspondenceCountry: 'India',
      correspondenceState: '',
      correspondencePincode: '',
      correspondenceEmail: '',
      correspondencePhone: '',

      addressProof: null,
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(AddressSchema),
  });

  const { handleSubmit, setValue, watch, control } = methods;

  const sameAsRegistered = watch('sameAsRegistered');
  const documentType = useWatch({ control, name: 'documentType' });

  // ----------------------------- Auto Copy Logic -----------------------------
  useEffect(() => {
    if (sameAsRegistered) {
      setValue('correspondenceAddressLine1', watch('registeredAddressLine1'));
      setValue('correspondenceAddressLine2', watch('registeredAddressLine2'));
      setValue('correspondenceCountry', watch('registeredCountry'));
      setValue('correspondenceCity', watch('registeredCity'));
      setValue('correspondenceState', watch('registeredState'));
      setValue('correspondencePincode', watch('registeredPincode'));
      setValue('correspondenceEmail', watch('registeredEmail'));
      setValue('correspondencePhone', watch('registeredPhone'));
    }
  }, [
    sameAsRegistered,
    watch('registeredAddressLine1'),
    watch('registeredAddressLine2'),
    watch('registeredCountry'),
    watch('registeredCity'),
    watch('registeredState'),
    watch('registeredPincode'),
    watch('registeredEmail'),
    watch('registeredPhone'),
  ]);

  // ----------------------------- Fetch Address API -----------------------------
  useEffect(() => {
    const fetchAddress = async () => {
      const base = process.env.REACT_APP_HOST_API || '';
      try {
        const res = await fetch(`${base}/api/kyc/issuer_kyc/company/address/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        if (!res.ok) return;

        const json = await res.json();
        const data = json?.addresses || {};

        const reg = data.registered || {};
        const corr = data.correspondence || {};

        // Registered
        setValue('registeredAddressLine1', reg.registered_office || '');
        setValue('registeredAddressLine2', reg.registered_office_line2 || '');
        setValue('registeredCity', reg.city || '');
        setValue('registeredState', reg.state_ut || '');
        setValue('registeredPincode', reg.pin_code || '');
        setValue('registeredEmail', reg.contact_email || '');
        setValue(
          'registeredPhone',
          (reg.contact_phone || '').replace(/\D/g, '').slice(-10)
        );

        // Correspondence (kept separate!)
        setValue(
          'correspondenceAddressLine1',
          corr.correspondence_address || corr.registered_office || ''
        );
        setValue(
          'correspondenceAddressLine2',
          corr.correspondence_address_line2 || corr.registered_office_line2 || ''
        );
        setValue('correspondenceCity', corr.correspondence_city || '');
        setValue('correspondenceCountry', corr.correspondence_country || 'India');
        setValue('correspondenceState', corr.correspondence_state_ut || '');
        setValue('correspondencePincode', corr.correspondence_pin_code || '');
        setValue('correspondenceEmail', corr.correspondence_email || '');
        setValue(
          'correspondencePhone',
          (corr.correspondence_phone || '').replace(/\D/g, '').slice(-10)
        );

        setAddressExists(Boolean(reg.address_id || corr.address_id));
      } catch (e) {
        console.error(e);
      }
    };

    fetchAddress();
  }, [companyId]);

  // ----------------------------- Fetch User API -----------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/auth/v1/me/', {
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        });

        const user = res?.data?.data || {};

        setValue('registeredEmail', user.email || '');
        setValue(
          'registeredPhone',
          (user.mobile_number || '').replace(/\D/g, '').slice(-10)
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, []);

  // ----------------------------- Submit API -----------------------------
  const onSubmit = async (form) => {
    const base = process.env.REACT_APP_HOST_API || '';
    const payload = {};

    const add = (k, v) => (payload[k] = v ?? '');

    add('is_same_address', String(form.sameAsRegistered));
    add('registered_office', form.registeredAddressLine1);
    add('city', form.registeredCity);
    add('state_ut', form.registeredState);
    add('pin_code', form.registeredPincode);
    add('contact_email', form.registeredEmail);
    add(
      'contact_phone',
      form.registeredPhone.startsWith('+')
        ? form.registeredPhone
        : `+91${form.registeredPhone}`
    );

    add(
      'correspondence_address',
      form.sameAsRegistered ? form.registeredAddressLine1 : form.correspondenceAddressLine1
    );
    add(
      'correspondence_city',
      form.sameAsRegistered ? form.registeredCity : form.correspondenceCity
    );
    add(
      'correspondence_state_ut',
      form.sameAsRegistered ? form.registeredState : form.correspondenceState
    );
    add(
      'correspondence_pin_code',
      form.sameAsRegistered ? form.registeredPincode : form.correspondencePincode
    );

    add('correspondence_country', 'India');
    add(
      'correspondence_email',
      form.sameAsRegistered ? form.registeredEmail : form.correspondenceEmail
    );
    add(
      'correspondence_phone',
      form.sameAsRegistered
        ? `+91${form.registeredPhone}`
        : `+91${form.correspondencePhone}`
    );

    try {
      setIsUploading(true);

      const method = addressExists ? 'PUT' : 'POST';

      const res = await fetch(`${base}/api/kyc/issuer_kyc/company/address/`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed');

      alert('Address Saved');
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <Stack spacing={4}>
          {/* ---------------- File Upload ---------------- */}
          <Stack spacing={2}>
            <Typography variant="h4">Upload Address Proof</Typography>

            <Box sx={{ width: 200 }}>
              <RHFSelect name="documentType" label="Document Type">
                <MenuItem value="electricityBill">Electricity Bill</MenuItem>
                <MenuItem value="leaseAgreement">Lease Agreement</MenuItem>
              </RHFSelect>
            </Box>

            <RHFFileUploadBox
              name="addressProof"
              // label="Upload Address Proof"
              label={`Upload ${(documentType === 'electricityBill' && 'Electricity Bill') ||
                (documentType === 'leaseAgreement' && 'Lease Agreement')
                }`}
              acceptedTypes="pdf,jpg,jpeg,png"
              maxSizeMB={10}
            />
          </Stack>

          {/* ---------------- Registered Address ---------------- */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Registered Address
              </Typography>

              <Stack spacing={2}>
                <RHFTextField name="registeredAddressLine1" label="Address Line 1" />
                <RHFTextField name="registeredAddressLine2" label="Address Line 2" />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField name="registeredCountry" label="Country" disabled />
                  <RHFTextField name="registeredCity" label="City" />
                  <RHFTextField name="registeredState" label="State" />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField name="registeredEmail" label="Email" disabled />
                  <RHFTextField name="registeredPhone" label="Phone" disabled />
                </Box>

                <RHFTextField name="registeredPincode" label="Pincode" />
              </Stack>
            </Grid>

            {/* ---------------- Correspondence ---------------- */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Correspondence Address</Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsRegistered}
                      onChange={(e) => setValue('sameAsRegistered', e.target.checked)}
                    />
                  }
                  label="Same as Registered"
                />
              </Box>

              <Stack spacing={2} sx={{ opacity: sameAsRegistered ? 0.5 : 1 }}>
                <RHFTextField
                  name="correspondenceAddressLine1"
                  label="Address Line 1"
                  disabled={sameAsRegistered}
                />
                <RHFTextField
                  name="correspondenceAddressLine2"
                  label="Address Line 2"
                  disabled={sameAsRegistered}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField name="correspondenceCountry" label="Country" disabled />
                  <RHFTextField
                    name="correspondenceCity"
                    label="City"
                    disabled={sameAsRegistered}
                  />
                  <RHFTextField
                    name="correspondenceState"
                    label="State"
                    disabled={sameAsRegistered}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField name="correspondenceEmail" label="Email" disabled />
                  <RHFTextField name="correspondencePhone" label="Phone" disabled />
                </Box>

                <RHFTextField
                  name="correspondencePincode"
                  label="Pincode"
                  disabled={sameAsRegistered}
                />
              </Stack>
            </Grid>
          </Grid>

          {/* ---------------- Buttons ---------------- */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
         
            <LoadingButton type="submit" variant="contained" loading={isUploading} sx={{ ml: 'auto' }}>
              Save Changes
            </LoadingButton>


          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

AddressNewForm.propTypes = {
  onClose: PropTypes.func,
};
