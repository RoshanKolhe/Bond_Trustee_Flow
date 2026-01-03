import { Card, Typography, Stack, Button, Grid, Box, Divider } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function CreditRatingCard({ data = [], onGoToTab }) {
  const hasData = Array.isArray(data) && data.length > 0;

  const emptyDataComponent = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="subtitle1">
        Credit Rating request is pending
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Please complete credit rating selection to proceed.
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={onGoToTab}>
        Appoint
      </Button>
    </Box>
  );

  const dataComponent = () => (
    <Stack sx={{ p: 2 }} spacing={2}>
      {data.map((rating, index) => (
        <Box
          key={rating.id}
          sx={{
            position: 'relative',    
            pr: 6,                 
          }}
        >
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              
              color:
                rating.status === 'Appointed'
                  ? 'success.main'
                  : 'warning.main',
            }}
          >
           <b>{rating.status}</b> 
          </Typography>

          <Typography fontWeight={600}>{rating.name}</Typography>

          <Typography variant="body2">
            Rating Type: <b>{rating.value}</b>
          </Typography>

          <Typography variant="body2">
            Description: <b>{rating.description}</b>
          </Typography>

          {index !== data.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      ))}
    </Stack>
  );

  return (
    <Card>
      <Grid container>
      
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            borderRight: { md: '2px dashed lightgray' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',          
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Iconify icon="solar:chart-bold" width={22} />
            Credit Rating Agency
          </Typography>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={8}>
          {hasData ? dataComponent() : emptyDataComponent()}
        </Grid>
      </Grid>
    </Card>
  );
}
