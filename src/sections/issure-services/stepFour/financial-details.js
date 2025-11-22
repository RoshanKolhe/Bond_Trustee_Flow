import React from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';


export default function FinancialDetails() {
    return (

        <Box display="flex" flexDirection="column" gap={3}>
            <Box
                sx={{
                    border: '2px solid #1877F2',
                    pl: 2,
                    py: 2,

                }}
            >
                <Typography variant="h3" color="#1877F2" fontWeight={600} gutterBottom>
                    Financial Ratios
                </Typography>
                <Typography variant="body1" color="#5E5E5E">
                    Provide your company’s key financial ratios to help assess its financial health
                </Typography>
            </Box>

            <Card
                sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 3,
                    border: '1px solid #e0e0e0',
                }}
            >
                <Grid container spacing={2} alignItems="center">

                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="debtEquityRatio"
                            label="Debt-Equity Ratio (DER)"
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="currentRatio"
                            label="Current Ratio"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="netWorth"
                            label="Net Worth"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="quickRatio"
                            label="Quick Ratio"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="returnOnEquity"
                            label="Return on Equity (ROE)  "
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="returnOnAssets"
                            label="Return on Assets (ROA)"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RHFTextField
                            name="debtServiceCoverageRatio"
                            label="Debt Service Coverage Ratio (DSCR)"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Card>
        </Box>

    );
}
