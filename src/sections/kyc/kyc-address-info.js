import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Iconify from 'src/components/iconify';
// components
import RHFTextField from 'src/components/hook-form/rhf-text-field';
import { RHFUploadBox } from 'src/components/hook-form/rhf-upload';

// ----------------------------------------------------------------------

const StyledDropZone = styled('div')(({ theme }) => ({
  width: '100%',
  height: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  borderRadius: 1,
  border: '2px dashed',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.neutral,
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer',
  },
}));

const AddressSchema = Yup.object().shape({
  registeredAddressLine1: Yup.string().required('Address Line 1 is required'),
  registeredAddressLine2: Yup.string(),
  registeredCity: Yup.string().required('City is required'),
  registeredState: Yup.string().required('State is required'),
  registeredPincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Must be a valid 6-digit pincode'),
  registeredEmail: Yup.string().email('Invalid email').required('Email is required'),
  registeredPhone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),

  sameAsRegistered: Yup.boolean(),

  correspondenceAddressLine1: Yup.string().when('sameAsRegistered', {
    is: false,
    then: (schema) => schema.required('Address Line 1 is required'),
  }),
  correspondenceAddressLine2: Yup.string(),
  correspondenceCity: Yup.string().when('sameAsRegistered', {
    is: false,
    then: (schema) => schema.required('City is required'),
  }),
  correspondenceState: Yup.string().when('sameAsRegistered', {
    is: false,
    then: (schema) => schema.required('State is required'),
  }),
  correspondencePincode: Yup.string().when('sameAsRegistered', {
    is: false,
    then: (schema) =>
      schema
        .required('Pincode is required')
        .matches(/^[0-9]{6}$/, 'Must be a valid 6-digit pincode'),
  }),
  correspondenceEmail: Yup.string().when('sameAsRegistered', {
    is: false,
    then: (schema) => schema.email('Invalid email').required('Email is required'),
  }),
  correspondencePhone: Yup.string().when('sameAsRegistered', {
    is: false,
    then: (schema) =>
      schema
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),
  }),

  addressProof: Yup.mixed().required('Address proof is required'),
});

export default function KycAddressInfo() {
  const [preview, setPreview] = useState(null);

  const methods = useForm({
    resolver: yupResolver(AddressSchema),
    defaultValues: {
      registeredAddressLine1: '',
      registeredAddressLine2: '',
      registeredCity: '',
      registeredState: '',
      registeredPincode: '',
      registeredEmail: '',
      registeredPhone: '',
      sameAsRegistered: true,
      correspondenceAddressLine1: '',
      correspondenceAddressLine2: '',
      correspondenceCity: '',
      correspondenceState: '',
      correspondencePincode: '',
      correspondenceEmail: '',
      correspondencePhone: '',
      addressProof: null,
    },
  });

  const { handleSubmit, setValue, control, watch } = methods;
  const addressProof = useWatch({ control, name: 'addressProof' });
  const sameAsRegistered = useWatch({ control, name: 'sameAsRegistered' });

  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
    // Handle form submission here
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('addressProof', file, { shouldValidate: true });
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemove = () => {
    setValue('addressProof', null, { shouldValidate: true });
    setPreview(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            // sx={{
            //   p: { xs: 2, md: 4 },
            //   borderRadius: 2,
            //   boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            // }}
          >
            {/* Address Proof Section */}
            <Stack spacing={4}>
              <div>
                <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
                  Upload Address Proof
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', bgcolor: '#F0F7FF', p: 2, borderRadius: 1 }}
                >
                  Upload a document to confirm your address and fetch the details automatically
                  (e.g., utility bill, registered address and correspondence). Maximum file size: 5
                  MB
                </Typography>
              </div>

              <Box sx={{ width: '100%' }}>
                {!addressProof ? (
                  <RHFUploadBox
                    name="addressProof"
                    onDrop={handleDrop}
                    maxSize={5 * 1024 * 1024} // 5MB
                    accept={{
                      'application/pdf': ['.pdf'],
                      'image/*': ['.jpeg', '.jpg', '.png'],
                    }}
                    sx={{
                      width: '100%',
                      height: 200,
                      m: 0,
                      bgcolor: 'transparent',
                      border: 'none',
                      '&:hover': {
                        bgcolor: 'transparent',
                      },
                    }}
                    placeholder={
                      <StyledDropZone>
                        <Iconify
                          icon="solar:cloud-upload-bold"
                          width={48}
                          sx={{ color: 'text.disabled' }}
                        />
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Upload file
                        </Typography>
                        <Box
                          sx={{
                            textAlign: 'center',
                            bgcolor: '#D0E4FF',
                            p: 1,
                            borderRadius: 0.5,
                            width: { xs: '90%', md: '40%' },
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                            Electricity Bill / Lease Agreement
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            Drag & drop or choose file
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Supported file types: PDF, JPG, PNG (Max 5MB)
                        </Typography>
                      </StyledDropZone>
                    }
                  />
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    {preview && addressProof.type.startsWith('image/') ? (
                      <Box
                        component="img"
                        src={preview}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: 150,
                          mb: 2,
                          borderRadius: 1,
                        }}
                        alt="Preview"
                      />
                    ) : (
                      <Iconify
                        icon="clarity:document-solid"
                        width={48}
                        sx={{ color: 'text.disabled', mb: 1 }}
                      />
                    )}
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      {addressProof.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {(addressProof.size / 1024).toFixed(2)} KB
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={handleRemove}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
            <Stack spacing={4} pt={2}>
              {/* Address Section */}
              <Box>
                <Grid container spacing={3}>
                  {/* Registered Address */}
                  <Grid xs={12} md={6}>
                    <Typography
                      variant="h4"
                      sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}
                    >
                      Registered Address
                    </Typography>
                    <Stack spacing={2}>
                      <RHFTextField
                        name="registeredAddressLine1"
                        label="Address Line 1 *"
                        fullWidth
                      />
                      <RHFTextField
                        name="registeredAddressLine2"
                        label="Address Line 2"
                        fullWidth
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <RHFTextField 
                          name="registeredCity" 
                          label="City *" 
                          fullWidth 
                        />
                        <RHFTextField 
                          name="registeredState" 
                          label="State *" 
                          fullWidth 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <RHFTextField 
                          name="registeredEmail" 
                          label="Email *" 
                          fullWidth 
                        />
                        <RHFTextField 
                          name="registeredPhone" 
                          label="Phone No. *" 
                          fullWidth 
                        />
                      </Box>
                      <RHFTextField name="registeredPincode" label="Pincode *" fullWidth />

                    </Stack>
                  </Grid>

                  {/* Correspondence Address */}
                  <Grid xs={12} md={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 600, color: 'primary.main' }}
                      >
                        Correspondence Address
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="sameAsRegistered"
                            checked={sameAsRegistered}
                            onChange={(e) =>
                              setValue('sameAsRegistered', e.target.checked, {
                                shouldValidate: true,
                              })
                            }
                          />
                        }
                        label="Same as Registered Address"
                        sx={{ m: 0 }}
                      />
                    </Box>

                    <Stack spacing={2} sx={{ opacity: sameAsRegistered ? 0.6 : 1 }}>
                      <RHFTextField
                        name="correspondenceAddressLine1"
                        label="Address Line 1 *"
                        fullWidth
                        disabled={sameAsRegistered}
                      />
                      <RHFTextField
                        name="correspondenceAddressLine2"
                        label="Address Line 2"
                        fullWidth
                        disabled={sameAsRegistered}
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <RHFTextField
                          name="correspondenceCity"
                          label="City *"
                          fullWidth
                          disabled={sameAsRegistered}
                        />
                        <RHFTextField
                          name="correspondenceState"
                          label="State *"
                          fullWidth
                          disabled={sameAsRegistered}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <RHFTextField
                          name="correspondenceEmail"
                          label="Email *"
                          fullWidth
                          disabled={sameAsRegistered}
                        />
                        <RHFTextField
                          name="correspondencePhone"
                          label="Phone No. *"
                          fullWidth
                          disabled={sameAsRegistered}
                        />
                      </Box>
                      <RHFTextField
                        name="correspondencePincode"
                        label="Pincode *"
                        fullWidth
                        disabled={sameAsRegistered}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button type="submit" variant="contained" size="large" sx={{ minWidth: 120 }}>
                  Next
                </Button>
              </Box>
            </Stack>
          </Paper>
        </form>
      </FormProvider>
    </Container>
  );
}
