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

// ----------------------------------------------------------------------
// MOCK DATA
export const PENDING_APPOINTMENTS = [
  {
    id: 1,
    companyName: 'Sunrise Infrastructure Ltd.',
    isin: 'U35900XYZ23A4B5C60',
    description: 'Appointment request for ₹600 Cr infrastructure bond issuance',
    amount: '₹600 Crores',
    tenure: '8 Years',
    requestedDate: '10/12/2024',
  },
  {
    id: 2,
    companyName: 'Blue Ocean Logistics Pvt Ltd',
    isin: 'U35800XYZ23A4B5C60',
    description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
    amount: '₹250 Crores',
    tenure: '5 Years',
    requestedDate: '10/23/2024',
  },
  {
    id: 3,
    companyName: 'GreenField Energy Ltd.',
    isin: 'U45900XYZ23A4B5C61',
    description: 'Trustee appointment for renewable energy bonds',
    amount: '₹400 Crores',
    tenure: '10 Years',
    requestedDate: '11/02/2024',
  },
];

// ----------------------------------------------------------------------
// LIST COMPONENT
export default function PendingAppointmentsCardList() {
  const theme = useTheme();
  const router = useRouter();

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
                  onClick={() => router.push(`/appointments/${item.id}`)}
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
    </Box>

  );
}
