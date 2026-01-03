import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Card, Box, Typography, Chip, Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function ApprovalCard({ name, reg, intermediaryType, intermediaryRegName }) {
  const Schema = Yup.object().shape({
    remark: Yup.string(),
    comment: Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      remark: '',
      comment: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const status = 'pending'; // pending | approved | rejected

  const statusConfig = {
    pending: { label: 'Pending', color: 'warning' },
    approved: { label: 'Approved', color: 'success' },
    rejected: { label: 'Rejected', color: 'error' },
  };

  const onSubmit = (data) => {
    console.log('Approval Data:', data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        {/* Header */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Intermediary Type */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {intermediaryType} :
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {name}
              </Typography>
            </Stack>
          </Grid>

          {/* Registration */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {intermediaryRegName} :
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reg}
              </Typography>
            </Stack>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Chip
              label={statusConfig[status].label}
              color={statusConfig[status].color}
              variant="soft"
            />
          </Grid>
        </Grid>

        {/* Form Fields */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="nowrap">
              <Typography variant="subtitle1" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                Remark :
              </Typography>

              <RHFTextField name="remark" placeholder="Enter remark" fullWidth disabled />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <RHFTextField name="comment" label="Comment" multiline rows={3} />
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}

ApprovalCard.propTypes = {
  setActiveStepId: PropTypes.func,
};
