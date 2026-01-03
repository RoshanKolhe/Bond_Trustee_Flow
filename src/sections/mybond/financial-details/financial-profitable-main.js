import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Box } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import ProfitabilityDetails from './profitable-details';
import FinancialDetails from './financial-details';
import { useParams } from 'src/routes/hook';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import axiosInstance from 'src/utils/axios';

export default function FinancialProfitableMainFile({
  percent,
  setActiveStepId,
}) {
  const params = useParams();
  const { applicationId } = params;
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [financialPercent, setFinancialPercent] = useState(0);
  const [profitabilityPercent, setProfitabilityPercent] = useState(0);
  const [financialCompleted, setFinancialCompleted] = useState(false);
  const [profitabilityCompleted, setProfitabilityCompleted] = useState(false);

  useEffect(() => {
    const total = financialPercent + profitabilityPercent;
    percent?.(total);
  }, [financialPercent, profitabilityPercent, percent]);

  const handleNextClick = () => {

    if (!financialCompleted) {
      enqueueSnackbar('financial ratios are not filled', {
        variant: 'warning',
      });
      return;
    }

    if (!profitabilityCompleted) {
      enqueueSnackbar('Profitability details are not filled', {
        variant: 'warning',
      });
      return;
    }

    setActiveStepId('credit_rating');

  }

  useEffect(() => {
    const fetchRatios = async () => {
      try {
        const response = await axiosInstance.get(`/bonds-pre-issue/financial-ratios/${applicationId}`);

        if (response.data.success) {
          setData({
            financialRatios: response.data.details?.financialRatios,
            profitabilityDetails: response.data.details?.profitabilityDetails
          })
        }

      } catch (error) {
        console.error('Error while fetching the ratios :', error);
      }
    };

    fetchRatios();
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FinancialDetails
          currentDetails={data?.financialRatios}
          setPercent={setFinancialPercent}
          setProgress={setFinancialCompleted}
        />
      </Grid>

      <Grid item xs={12}>
        <ProfitabilityDetails
          currentDetails={data?.profitabilityDetails}
          setPercent={setProfitabilityPercent}
          setProgress={setProfitabilityCompleted}
        />
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
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ color: '#fff' }}
            onClick={handleNextClick}
          >
            Next
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
}


FinancialProfitableMainFile.propTypes = {
  setActiveStep: PropTypes.func,
  currentDetails: PropTypes.object,
  onSave: PropTypes.func,
  percent: PropTypes.func,
};
