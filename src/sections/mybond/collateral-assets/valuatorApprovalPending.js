import { Box, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ValuatorApprovalPendingNotice() {
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
        Valuator Approval Pending
      </Typography>

      <Typography variant="body2" color="text.secondary">
        The valuation of collateral assets has not yet been approved by the
        appointed valuer.
        <br />
        This approval is mandatory before proceeding further in the bond issue process.
      </Typography>

      <Typography
        variant="caption"
        sx={{ display: 'block', mt: 2, color: 'text.disabled' }}
      >
        You will be able to continue once the collateral valuation report is
        uploaded and approved by the valuer.
      </Typography>
    </Box>
  );
}
