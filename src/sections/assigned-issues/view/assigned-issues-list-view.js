import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useRouter } from 'src/routes/hook/use-router';
import { Card, Chip, Grid } from '@mui/material';
import { color } from '@mui/system';
import RejectReasonDialog from 'src/components/reject-dialog-box/reject-dialog-box';


// ----------------------------------------------------------------------
// MOCK DATA
export const PENDING_APPOINTMENTS = [
  {
    id: 1,
    companyName: 'Sunrise Infrastructure Ltd.',
    cin: 'U35900XYZ23A4B5C60',
    description: 'Appointment request for ₹600 Cr infrastructure bond issuance',
    amount: '₹600 Crores',
    tenure: '8 Years',
    requestedDate: '10/12/2024',
  },
  {
    id: 2,
    companyName: 'Blue Ocean Logistics Pvt Ltd',
    cin: 'U35800XYZ23A4B5C60',
    description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
    amount: '₹250 Crores',
    tenure: '5 Years',
    requestedDate: '10/23/2024',
  },

];

export const UPCOMING_COUPONS = [
  {
    id: 1,
    amount: '₹12.5 Crores',
    title: 'RTGS to Debenture Holders',
    date: '12/15/2024',
    status: 'Pending',
  },
  {
    id: 2,
    amount: '₹8.0 Crores',
    title: 'RTGS to Debenture Holders',
    date: '01/15/2025',
    status: 'Pending',
  },
];
export const Compliance_Alerts = [
  {
    id: 1,
    companyName: 'Blue Ocean Logistics Pvt Ltd',
    description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
    amount: '₹12.5 Crores',
    title: 'RTGS to Debenture Holders',
    date: '12/15/2024',
    status: 'High',
    Background: 'linear-gradient(180deg, #991C1E 0%, #FF2F32 100%)',

  },
  {
    id: 2,
    companyName: 'Sunrise Infrastructure Ltd.',
    description: 'Trustee appointment for ₹250 Cr secured NCD issuance',
    amount: '₹8.0 Crores',
    title: 'RTGS to Debenture Holders',
    date: '01/15/2025',
    status: 'Medium',
    Background: 'linear-gradient(180deg, #0E458C 0%, #1877F2 100%)',

  },
];


// ----------------------------------------------------------------------
// LIST COMPONENT (ARRAY → FIELDS)
export default function AssignedIssuesListView() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Grid container spacing={2}>
      {/* LEFT: Assigned Issues */}
      <Grid item xs={12} md={8} >
        <Card sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}>

          <Stack spacing={0.3}>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src="/assets/icons/assign-issues/assign-issues-hero.png"
                alt="Assigned Issues"
                sx={{ width: 20, height: 20 }}
              />

              <Typography variant="h4" color="#1877F2" fontWeight={700}>
                Assigned Issues
              </Typography>
            </Stack>


            <Typography variant="body2" color="text.secondary">
              Your currently assigned bond issues
            </Typography>
          </Stack>


          {/* LIST */}
          <Stack spacing={1.5} mt={2}>
            {PENDING_APPOINTMENTS.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
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
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack spacing={0.3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.companyName}
                      </Typography>

                      <Chip
                        size="small"
                        label="New Monitoring"
                        color="primary"
                        sx={{ height: 18, fontSize: 11 }}
                      />
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {item.cin}
                    </Typography>
                  </Stack>

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
                </Stack>

                {/* Footer */}
                <Stack
                  direction="row"
                  spacing={2}
                  mt={0.8}
                  flexWrap="wrap"
                >
                  <Typography variant="caption">
                    Amount: <strong>{item.amount}</strong>
                  </Typography>
                  <Typography variant="caption">
                    Tenure: <strong>{item.tenure}</strong>
                  </Typography>
                  <Typography variant="caption">
                    Issued: <strong>{item.requestedDate}</strong>
                  </Typography>
                </Stack>

              </Box>

            ))}
          </Stack>
        </Card>
      </Grid>

      {/* RIGHT: Quick Actions */}
      <Grid item xs={12} md={4}>
        <Card sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          height: '100%',
        }}>
          <Typography variant="subtitle1" color="#1877F2" fontWeight={700} mb={1}>
            Quick Actions
          </Typography>

          <Stack spacing={1}>
            <Button variant="soft" fullWidth>
              Approve Appointment
            </Button>
            <Button variant="soft" fullWidth>
              Upload Compliance Report
            </Button>
            <Button variant="soft" fullWidth>
              Generate Certificate
            </Button>
            <Button variant="soft" fullWidth>
              Send Message
            </Button>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            transition: '0.2s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            },
          }}
        >
          {/* Header */}
          <Stack spacing={0.3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src="/assets/icons/assign-issues/pending.png"
                alt="Upcoming Coupons"
                sx={{ width: 18, height: 18 }}
              />

              <Typography variant="subtitle1" fontWeight={700} color="#FFAB00">
                Pending Approvals
              </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              2 requests awaiting action
            </Typography>
          </Stack>

          {/* List */}
          <Stack spacing={1.5} mt={2}>
            {PENDING_APPOINTMENTS.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.companyName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={0.8}
                >
                  <Typography variant="caption" color="text.secondary">
                    Date: {item.requestedDate}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ mt: 4 }}>
                  <Button
                    variant="soft"
                    color="error"
                    sx={{
                      height: '32px',
                    }}

                  // onClick={() => setRejectOpen(true)}
                  // disabled={loading || data?.kycApplications?.status === 2}
                  >
                    Decline
                  </Button>

                  <Button
                    variant="soft"
                    color="success"
                    sx={{
                      height: '32px',
                    }}
                  // onClick={() => handleStatusUpdate(2)}
                  // disabled={loading || data?.kycApplications?.status === 2}
                  >
                    Approve
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Card>
      </Grid>


      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            transition: '0.2s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            },
          }}
        >
          {/* Header */}
          <Stack spacing={0.3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src="/assets/icons/assign-issues/compliance-alert.png"
                alt="Upcoming Coupons"
                sx={{ width: 18, height: 18 }}
              />

              <Typography variant="subtitle1" fontWeight={700} color="#C72427">
                Compliance Alerts
              </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              2 items need attention
            </Typography>
          </Stack>

          {/* List */}
          <Stack spacing={1.5} mt={2}>
            {Compliance_Alerts.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.companyName}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={0.8}
                >
                  <Typography variant="caption" color="text.secondary">
                    Date: {item.date}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" sx={{ mt: 4 }}>
                  <Chip
                    size="small"
                    label={item.status}
                    sx={{
                      height: 25,
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#fff',
                      background: item.Background,
                    }}
                  />
                </Stack>

              </Box>
            ))}
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
            height: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            transition: '0.2s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            },
          }}
        >
          {/* Header */}
          <Stack spacing={0.3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                component="img"
                src="/assets/icons/assign-issues/upcoming.png"
                alt="Upcoming Coupons"
                sx={{ width: 18, height: 18 }}
              />

              <Typography variant="subtitle1" fontWeight={700} color="#1877F2">
                Upcoming Coupons
              </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Next 90 days
            </Typography>
          </Stack>

          {/* List */}
          <Stack spacing={1.5} mt={2}>
            {UPCOMING_COUPONS.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {item.amount}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.title}
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={0.8}
                >
                  <Typography variant="caption" color="text.secondary">
                    Date: {item.date}
                  </Typography>


                </Stack>

                <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ mt: 4 }}>

                  <Button
                    variant="soft"

                    sx={{
                      height: '32px',
                      color: '#fff',
                      backgroundColor: '#FFAB00',
                      '&:hover': {
                        backgroundColor: '#ffbf33',
                      },

                    }}
                  // onClick={() => handleStatusUpdate(2)}
                  // disabled={loading || data?.kycApplications?.status === 2}
                  >
                    Pending
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>

          <RejectReasonDialog
          // title={'Decline Profile'}
          // open={rejectOpen}
          // onClose={() => setRejectOpen(false)}
          // reason={rejectReason}
          // setReason={setRejectReason}
          // onSubmit={handleRejectSubmit}
          />
        </Card>
      </Grid>


    </Grid>
  );
}