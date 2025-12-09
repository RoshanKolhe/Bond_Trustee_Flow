import PropTypes from 'prop-types';
import { Card, Box, Typography, Stack, Divider, Chip, Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

export default function BankDetailsCard({ bank, onViewRow }) {
  const navigate = useNavigate();
  if (!bank) return null;

  const STATUS = {
    0: { label: 'Under Review', color: '#ED6C02', icon: 'mdi:clock-time-eight-outline' },
    1: { label: 'Approved', color: '#2E7D32', icon: 'mdi:check-decagram' },
    2: { label: 'Rejected', color: '#C62828', icon: 'mdi:close-circle' },
  };

  const bankProof = {
    0: { label: 'Cheque' },
    1: { label: 'Bank Statement' },
  };

  const maskAccountNumber = (num) => {
    if (!num) return '';
    const lastFour = num.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      onClick={() =>
        navigate(paths.dashboard.trusteeProfiles.new, {
          state: { bankData: bank },
        })
      }
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Iconify icon="mdi:bank" width={30} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Bank Name
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="h6"
                onClick={() =>
                  navigate(paths.dashboard.trusteeProfiles.new, {
                    state: { bankData: bank },
                  })
                }
              >
                {bank?.bankName}
              </Typography>

              {bank?.isPrimary && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1d5ec7ff',
                    px: 1.2,
                    py: 0.4,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    width: 'fit-content',
                  }}
                >
                  <Iconify icon="mdi:star" width={16} />
                </Box>
              )}
            </Stack>
          </Box>
        </Stack>

        <Chip
          icon={<Iconify icon={STATUS[bank?.status]?.icon} />}
          label={STATUS[bank?.status]?.label || 'Unknown'}
          sx={{
            bgcolor: `${STATUS[bank?.status]?.color}1A`,
            color: STATUS[bank?.status]?.color,
            fontWeight: 600,
            px: 1.5,
          }}
        />
      </Stack>

      <Divider />

      {/* Details Grid */}
      <Grid container spacing={2}>
        {/* Branch Name */}
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:home-city-outline" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Branch Name
              </Typography>
              <Typography variant="subtitle1">{bank?.branchName || '-'}</Typography>
            </Box>
          </Stack>
        </Grid>

        {/* IFSC Code */}
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:web" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                IFSC Code
              </Typography>
              <Typography variant="subtitle1">{bank?.ifscCode || '-'}</Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Account Number */}
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:card-account-details" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Account Number
              </Typography>
              <Typography variant="subtitle1">{maskAccountNumber(bank?.accountNumber)}</Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Account Proof + Eye Icon */}
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:file-document-outline" width={22} />

            <Box flex={1}>
              <Typography variant="caption" color="text.secondary">
                Account Proof
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                {bankProof[bank?.bankAccountProofType]?.label || 'Unknown'}

                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(bank?.bankAccountProof?.fileUrl, '_blank');
                  }}
                  sx={{ ml: 0.5 }}
                >
                  <Iconify icon="mdi:eye" width={20} />
                </IconButton>
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

BankDetailsCard.propTypes = {
  onViewRow: PropTypes.func,
};
