import { Card, Chip, Stack, Typography } from '@mui/material';

export default function IntermediarySection({ data }) {
  return (
    <Card sx={{ p: 3 }}>
      {(() => {
        const list = Array.isArray(data) ? data : data ? [data] : [];

        return list.length > 0 ? (
          <Stack spacing={2}>
            {list.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reg. No: {item.registrationNo}
                  </Typography>
                </Stack>

                <Chip
                  label={item.status}
                  color={item.status === 'Appointed' ? 'success' : 'warning'}
                  size="small"
                  variant="soft"
                />
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No intermediary appointed
          </Typography>
        );
      })()}
    </Card>
  );
}
