import {
  Card,
  Typography,
  Checkbox,
  Stack,
  Grid,
  Tooltip,
  IconButton,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function ValuerCardView({
  row,
  selected,
  onSelectRow,
  onView,
  onSendRequest,
}) {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        sx={{
          p: 2,
          mb: 2,
          border: selected ? '2px solid #1877F2' : '1px solid #e0e0e0',
          transition: '0.2s',
        }}
      >
        {/* ACTION BAR */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 1,
            px: 0.5, 
          }}
        >
        
          <Checkbox
            checked={selected}
            onChange={() => onSelectRow(row.id)}
            sx={{
              p: 0.5,   
            }}
          />

          {/* RIGHT → Actions */}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View">
              <IconButton size="small" sx={{ p: 0.5 }} onClick={onView}>
                <Iconify icon="solar:eye-bold" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Send Request">
              <IconButton
                size="small"
                sx={{ p: 0.5 }}
                color="primary"
                onClick={onSendRequest}
              >
                <Iconify icon="mdi:email-send" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* INFORMATION */}
        <Stack spacing={0.8} sx={{ px: 0.5 }}>
          <Typography variant="h6" fontWeight={600}>
            {row.legalEntityName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Experience: {row.experience} yrs
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Regulatory: {row.regulatory}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Fees: {row.fees}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Response Time: {row.responseTime}
          </Typography>
        </Stack>
      </Card>
    </Grid>
  );
}
