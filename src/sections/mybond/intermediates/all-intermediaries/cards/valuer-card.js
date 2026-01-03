import { Card, Typography, Stack, Button, Box, Grid } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function ValuerCard({ data, onGoToTab }) {
    const emptyDataComponent = () => (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1">
                Valuer request is pending
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Please complete valuer selection to proceed.
            </Typography>

            <Button variant="contained" sx={{ mt: 2 }} onClick={onGoToTab}>
                Appoint
            </Button>
        </Box>
    );


    const dataComponent = () => (
        <Stack p={2}>
            <Typography fontWeight={600}>{data.legalEntityName}</Typography>
            <Typography variant="body2">Experience: <b>{data.experience}</b></Typography>
            <Typography variant="body2">Response: <b>{data.responseTime}</b></Typography>
            
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
    )
    return (
        <Card sx={{ p: 0 }}>
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ borderRight: { md: '2px dashed lightgray' }, p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        mb={1}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <Iconify icon="solar:calculator-bold" width={22} />
                        Valuer
                    </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                    {data ? dataComponent() : emptyDataComponent()}
                </Grid>
            </Grid>
        </Card>
    );
}
