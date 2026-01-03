import { Box, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function RatingPendingNotice() {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'warning.light',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify
        icon="solar:info-circle-bold"
        width={36}
        sx={{ color: 'warning.main', mb: 1 }}
      />

      <Typography variant="h6" fontWeight={600} gutterBottom>
        Credit Rating Pending
      </Typography>

      <Typography variant="body2" color="text.secondary">
        No credit rating has been provided yet by the Credit Rating Agency.
        <br />
        This step requires approval before proceeding further in the bond issue process.
      </Typography>

      <Typography
        variant="caption"
        sx={{ display: 'block', mt: 2, color: 'text.disabled' }}
      >
        You will be able to continue once the rating letter is uploaded and approved.
      </Typography>
    </Box>
  );
}
