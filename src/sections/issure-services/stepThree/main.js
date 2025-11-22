import React, { useEffect, useMemo } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form';
import BorrowingDetails from './borrowing-details';
import ProfitabilityDetails from './profitable-details';
import CapitalDetails from './capital-details';

export default function MainFile({ setActiveStep, currentDetails , onSave }) {
  // ✅ Schema
  const MainSchema = Yup.object().shape({
    borrowings: Yup.array().of(
      Yup.object().shape({
        lenderName: Yup.string().required('Lender Name is required'),
        lenderAmount: Yup.number()
          .typeError('Lender Amount must be a number')
          .required('Lender Amount is required'),
        repaymentTerms: Yup.string().required('Select a repayment term'),
        borrowingType: Yup.string().required('Select borrowing type'),
        interestPayment: Yup.number()
          .typeError('Interest payment must be a number')
          .required('Interest payment is required'),
        monthlyPrincipal: Yup.number()
          .typeError('Monthly principal must be a number')
          .required('Monthly principal is required'),
        monthlyInterest: Yup.number()
          .typeError('Monthly interest must be a number')
          .required('Monthly interest is required'),
      })
    ),
    shareCapital: Yup.number()
      .typeError('Share Capital must be a number')
      .required('Share Capital is required'),
    reserveSurplus: Yup.number()
      .typeError('Reserve Surplus must be a number')
      .required('Reserve Surplus is required'),
    netWorth: Yup.number()
      .typeError('Net Worth must be a number')
      .required('Net Worth is required'),
    netProfit: Yup.number()
      .typeError('Net Profit must be a number')
      .required('Net Profit is required'),
    ebidta: Yup.number()
      .typeError('EBIDTA must be a number')
      .required('EBIDTA amount is required'),
  });

  // ✅ Default values (handles array safely)
const defaultValues = useMemo(
  () => ({
    borrowings:
      currentDetails?.borrowings?.length > 0
        ? currentDetails.borrowings.map((details) => ({
            lenderName: details?.lenderName || '',
            lenderAmount: details?.lenderAmount || '',
            repaymentTerms: details?.repaymentTerms || '',
            borrowingType: details?.borrowingType || '',
            interestPayment: details?.interestPayment || '',
            monthlyPrincipal: details?.monthlyPrincipal || '',
            monthlyInterest: details?.monthlyInterest || '',
          }))
        : [
            {
              lenderName: '',
              lenderAmount: '',
              repaymentTerms: '',
              borrowingType: '',
              interestPayment: '',
              monthlyPrincipal: '',
              monthlyInterest: '',
            },
          ],
    shareCapital: currentDetails?.shareCapital || '',
    reserveSurplus: currentDetails?.reserveSurplus || '',
    netWorth: currentDetails?.netWorth || '',
    netProfit: currentDetails?.netProfit || '',
    ebidta: currentDetails?.ebidta || '',
  }),
  [currentDetails]
);

  const methods = useForm({
    resolver: yupResolver(MainSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (currentDetails) reset(defaultValues);
  }, [currentDetails, reset, defaultValues]);

  const onSubmit = (data) => {
    console.log('✅ Full Form Data:', data);
    onSave(data);
    setActiveStep(2);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BorrowingDetails />
        </Grid>

        <Grid item xs={12}>
          <CapitalDetails />
        </Grid>

        <Grid item xs={12}>
          <ProfitabilityDetails />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              sx={{ color: '#000000' }}
              onClick={() => setActiveStep(0)}
            >
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" sx={{ color: '#fff' }}>
              Next
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

MainFile.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object, 
  onSave: PropTypes.func,
};
