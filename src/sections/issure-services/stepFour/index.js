import React, { useEffect, useMemo } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form';

import FinancialDetails from './financial-details';
import PropTypes from 'prop-types';



export default function StepFour({ currentFinancial, setActiveStep, onSave}) {

const MainSchema = Yup.object().shape({
 debtEquityRatio: Yup.string().required('Equity ratio is required'),
    currentRatio: Yup.string().required('Current ratio is required'),
    netWorth: Yup.string().required('Net worth is required'),
    quickRatio: Yup.string().required('Quick ratio is required'),
    returnOnEquity: Yup.string().required('Retrun equity is required'),
    returnOnAssets: Yup.string().required('Return on Assets (ROA) is required'),
    debtServiceCoverageRatio: Yup.string().required('Debt Service Coverage Ratio (DSCR) is required')
});

  const defaultValues = useMemo(() => ({
        debtEquityRatio: currentFinancial?.debtEquityRatio || '',
        currentRatio: currentFinancial?.currentRatio || '',
        netWorth: currentFinancial?.netWorth || '',
        quickRatio: currentFinancial?.quickRatio || '',
        returnOnEquity: currentFinancial?.returnOnEquity || '',
  
        returnOnAssets: currentFinancial?.returnOnAssets || '',
        debtServiceCoverageRatio: currentFinancial?.debtServiceCoverageRatio || '',

  }), [currentFinancial])

  const methods = useForm({
    resolver: yupResolver(MainSchema),
    mode: 'onSubmit',
    defaultValues,
  });

  const { handleSubmit , reset} = methods;

    useEffect(() => {
    if (currentFinancial) {
      reset(defaultValues);
    }
  }, [currentFinancial, reset, defaultValues]);

  const onSubmit = (data) => {
    console.log('Full Form Data:', data);
    onSave(data);
    setActiveStep(3);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
  
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FinancialDetails />
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
                sx={{
                  color: '#000000',
        
                 
                }}
                onClick={()=> setActiveStep(1)}
              >
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
    
                sx={{ 
                  color: '#fff',   
                }}
              >
                Next
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
 
    </FormProvider>
  );
}

StepFour.propTypes={
    setActiveStep: PropTypes.func,
    currentFinancial: PropTypes.object,
    onSave: PropTypes.func,
}
