// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { Card, Dialog, DialogContent, DialogTitle } from '@mui/material';

// components
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hook';
import RejectReasonDialog from 'src/components/reject-dialog-box/reject-dialog-box';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export default function PendingAppointmentsDetails({ open, data, onClose }) {
  const router = useRouter();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // ---------------- VALIDATION ----------------
  const NewSchema = Yup.object().shape({
    issuer: Yup.string(),
    isin: Yup.string(),
    issueAmount: Yup.string(),
    tenure: Yup.string(),
    requestDate: Yup.string(),
    comments: Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      issuer: '',
      isin: '',
      issueAmount: '',
      tenure: '',
      requestDate: '',
      comments: '',
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;


  useEffect(() => {
    if (data && open) {
      reset({
        issuer: data.companyName || '',
        isin: data.isin || '',
        issueAmount: data.amount || '',
        tenure: data.tenure || '',
        requestDate: data.requestedDate || '',
        comments: '',
      });
    }
  }, [data, open, reset]);

  // ---------------- ACTIONS ----------------
  const handleApprove = async () => {
    try {
      // API call if needed
      enqueueSnackbar('Appointment Approved Successfully!', { variant: 'success' });
      onClose();
    } catch (err) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    try {
      // API call if needed
      enqueueSnackbar('Appointment Rejected', { variant: 'success' });
      setRejectOpen(false);
      setRejectReason('');
      onClose();
    } catch (err) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Appointment Request Review
        <Typography variant="body2" color="text.secondary">
          Review and approve or reject this trustee appointment request
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <FormProvider methods={methods}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 'none',
              border: 'none',
            }}
          >
            {/* DETAILS */}
            <Grid container spacing={2}>
              <Grid xs={6}>
                <RHFTextField name="issuer" label="Issuer" disabled />
              </Grid>

              <Grid xs={6}>
                <RHFTextField name="isin" label="ISIN" disabled />
              </Grid>

              <Grid xs={6}>
                <RHFTextField name="issueAmount" label="Issue Amount" disabled />
              </Grid>

              <Grid xs={6}>
                <RHFTextField name="tenure" label="Tenure" disabled />
              </Grid>

              <Grid xs={12}>
                <RHFTextField name="requestDate" label="Request Date" disabled />
              </Grid>
            </Grid>

            {/* SUMMARY */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.description}
              </Typography>
            </Box>

            {/* ACTION BUTTONS */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 3,
              }}
            >
               <Button
                variant="soft"
                onClick={() => onClose(true)}
              >
                Cancel
              </Button>
              <Button
                variant="soft"
                color="error"
                onClick={() => setRejectOpen(true)}
              >
                Reject
              </Button>

              <Button
                variant="soft"
                color="success"
                onClick={handleApprove}
              >
                Approve
              </Button>
            </Box>

            {/* REJECT DIALOG */}
            <RejectReasonDialog
              open={rejectOpen}
              onClose={() => setRejectOpen(false)}
              reason={rejectReason}
              setReason={setRejectReason}
              onSubmit={handleRejectSubmit}
            />
          </Card>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}


PendingAppointmentsDetails.propTypes =
{
  open: PropTypes.func,
  onClose: PropTypes.func,
  data: PropTypes.object
}
