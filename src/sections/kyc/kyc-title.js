// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function KYCTitle({ title, subtitle }) {
  return (
    <Container sx={{ position: 'relative', py: { xs: 4, sm: 6 } }}>
      <Box
        sx={{
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          border: '1px solid #0880FF',
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={0.5} alignItems="flex-start">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#206CFE',
              textAlign: 'left',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: '#000000',
                textAlign: 'left',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
