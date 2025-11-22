import React from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    MenuItem,
    Divider,
} from '@mui/material';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, {
    RHFSelect,
    RHFTextField,
} from 'src/components/hook-form';

const repaymentTerm = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Quarterly', value: 'quarterly' },
];

const borrowingTypes = [
    { label: 'Secured', value: 'secured' },
    { label: 'Un-Secured', value: 'unsecured' },
    { label: 'Short-Term', value: 'shortterm' },
    { label: 'Long-Term', value: 'longterm' },
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
];



export default function BorrowingDetails() {
    const { control, setValue, watch } = useFormContext();

    const { fields, append } = useFieldArray({
        control,
        name: 'borrowings',
    });


    const handleAddBorrowing = () => {
        append({
            lenderName: '',
            lenderAmount: '',
            repaymentTerms: '',
            borrowingType: '',
            interestPayment: '',
            monthlyPrincipal: '',
            monthlyInterest: '',
        });
    };

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            {fields.map((item, index) => (
                <Card
                    key={item.id}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 3,
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <Typography variant="h3" fontWeight={600} color="#1874ED" mb={1}>
                        Borrowing Details
                    </Typography>
                    <Typography variant="body1" color="#5E5E5E" mb={3}>
                        Add and manage your borrowing information
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <RHFTextField
                                name={`borrowings[${index}].lenderName`}
                                label="Lender Name"
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFTextField
                                name={`borrowings[${index}].lenderAmount`}
                                label="Lender Amount"
                                fullWidth
                                type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                name={`borrowings[${index}].repaymentTerms`}
                                label="Repayment Terms"
                                fullWidth
                            >
                                {repaymentTerm.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFSelect
                                name={`borrowings[${index}].borrowingType`}
                                label="Borrowing Type"
                                fullWidth
                            >
                                {borrowingTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFTextField
                                name={`borrowings[${index}].interestPayment`}
                                label="Interest Payment (%)"
                                fullWidth
                                 type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFTextField
                                name={`borrowings[${index}].monthlyPrincipal`}
                                label="Monthly Principal Payment"
                                fullWidth
                                 type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <RHFTextField
                                name={`borrowings[${index}].monthlyInterest`}
                                label="Monthly Interest Payment"
                                fullWidth
                                 type="number"
                            />
                        </Grid>
                    </Grid>

                </Card>
            ))}

            <Box textAlign="center">
                <Button
                    variant="contained"
                    onClick={handleAddBorrowing}
                    sx={{
                        background: 'linear-gradient(90deg, #1877F2 0%, #0E458C 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #0E458C 0%, #1877F2 100%)',
                        },
                    }}
                >
                    + Add Another Borrowing
                </Button>
            </Box>
        </Box>
    );
}
