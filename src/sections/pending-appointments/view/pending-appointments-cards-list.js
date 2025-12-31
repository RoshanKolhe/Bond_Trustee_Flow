import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
} from '@mui/material';
import { useRouter } from 'src/routes/hook/use-router';
import { PENDING_APPOINTMENTS } from 'src/_mock/_pending';
import { useState } from 'react';
import PendingAppointmentsDetails from '../pending-appointments-details-view';

// ----------------------------------------------------------------------
// LIST COMPONENT
export default function PendingAppointmentsCardList() {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleOpen = (item) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="#1877F2" >
        Pending Appointments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review and approve new trustee appointment requests
      </Typography>

      <Grid container spacing={2}>


        {PENDING_APPOINTMENTS.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card

              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                transition: '0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                },
              }}
              onClick={() => handleOpen(item)}
            >
              {/* Header */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {item.companyName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.isin}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={item.description}

              >
                {item.description}
              </Typography>


              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Stack spacing={0.3}>
                    <Typography variant="caption" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.amount}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={0.3}>
                    <Typography variant="caption" color="text.secondary">
                      Tenure
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.tenure}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={4}>
                  <Stack spacing={0.3}>
                    <Typography variant="caption" color="text.secondary">
                      Requested
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.requestedDate}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  justifyContent: 'end',

                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleOpen(item)}
                  sx={{

                    borderRadius: 20,
                    backgroundColor: '#1877F2',
                    '&:hover': {
                      bgcolor: '#1f57a0ff',
                    },
                  }}
                >
                  View
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PendingAppointmentsDetails
        open={open}
        onClose={() => setOpen(false)}
        data={selected}
      />
    </Box>

  );
}
