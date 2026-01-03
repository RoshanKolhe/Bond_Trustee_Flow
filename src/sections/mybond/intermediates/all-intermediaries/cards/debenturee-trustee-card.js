import { Card, Typography, Stack, Button, Box, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function DebentureTrusteeCard({ data, onGoToTab }) {
  const emptyDataComponent = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="subtitle1">
        Debenture Trustee request is pending
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Please complete Debenture Trustee selection to proceed.
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={onGoToTab}>
        Appoint
      </Button>
    </Box>
  );

  const dataComponent = () => (
  <Stack sx={{ p: 2 }}>      <Typography fontWeight={600}>{data.legalEntityName}</Typography>
      <Typography variant="body2">
        Experience: <b> {data.experience}</b>
      </Typography>
      <Typography variant="body2">
        SEBI Reg No: <b>{data.regulatory}</b>
      </Typography>
       <Typography
                variant="body2"
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 0,
                    pr:2,

                    color:
                        data.status === 'Appointed'
                            ? 'success.main'
                            : 'warning.main',
                }}
            >
                <b>{data.status}</b>
            </Typography>
    </Stack>
  );

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid
         item
          xs={12}
          md={4}
          sx={{
            borderRight: { md: '2px dashed lightgray' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            p: 2,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={1}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Iconify icon="solar:shield-check-bold" width={22} />
            Debenture Trustee
          </Typography>
        </Grid>

        <Grid item xs={12} md={8} >
          {data ? dataComponent() : emptyDataComponent()}
        </Grid>
      </Grid>
    </Card>
  );
}
