import { Grid, Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams } from 'src/routes/hook';
import { useGetBondApplicationStepData } from 'src/api/bondApplications';
import { useEffect, useState } from 'react';
import DebentureTrusteeCard from './cards/debenturee-trustee-card';
import RTACard from './cards/rta-card';
import ValuerCard from './cards/valuer-card';
import CreditRatingCard from './cards/creditrating-card';

export default function AllIntermediariesView({ setActiveStepId, setCurrentTab, percent }) {
  const param = useParams();
  const { applicationId } = param;
  const { enqueueSnackbar } = useSnackbar();
  const [appointedIntermediaries, setAppointedIntermediaries] = useState({
    debenture_trustee: null,
    rta: null,
    valuer: null,
    credit_rating: [],
  });
  const { stepData, stepDataLoading } = useGetBondApplicationStepData(applicationId, 'intermediary_appointments_pending');

  const handleNext = () => {
    const allIntermediaries = [
      appointedIntermediaries.debenture_trustee,
      appointedIntermediaries.rta,
      appointedIntermediaries.valuer,
      ...(appointedIntermediaries.credit_rating || []),
    ].filter(Boolean);

    if (allIntermediaries.length === 0) {
      enqueueSnackbar('No intermediaries found', { variant: 'error' });
      return;
    }

    const hasPending = allIntermediaries.some(
      (item) => item.status !== 'Appointed'
    );

    if (hasPending) {
      enqueueSnackbar(
        'Please appoint all intermediaries before proceeding',
        { variant: 'error' }
      );
      return;
    }

    enqueueSnackbar('All intermediaries appointed', { variant: 'success' });
    setActiveStepId('fund_position');
  };

  useEffect(() => {
    if (!stepData || stepDataLoading) return;

    setAppointedIntermediaries((prev) => ({
      ...prev,
      debenture_trustee: stepData.debentureTrustee
        ? { ...stepData.debentureTrustee, status: 'Appointed' }
        : null,

      rta: stepData.registrarAndTransferAgent
        ? { ...stepData.registrarAndTransferAgent, status: 'Appointed' }
        : null,

      valuer: stepData.valuer
        ? { ...stepData.valuer, status: 'Appointed' }
        : null,

      credit_rating: stepData.creditRatingAgency?.length
        ? stepData.creditRatingAgency.map((agency) => ({
          ...agency,
          status: 'Appointed',
        }))
        : [],
    }));
  }, [stepData, stepDataLoading]);

  useEffect(() => {
    let count = 0;

    if(appointedIntermediaries.debenture_trustee) count++;
    if(appointedIntermediaries.rta) count++;
    if(appointedIntermediaries.credit_rating) count++;
    if(appointedIntermediaries.valuer) count++;

    const percentage = (count/4) * 100;
    percent?.(percentage);
  }, [appointedIntermediaries, percent])

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DebentureTrusteeCard data={appointedIntermediaries.debenture_trustee}
            onGoToTab={() => setCurrentTab('debenture_trustee')}
          />
        </Grid>

        <Grid item xs={12}>
          <RTACard data={appointedIntermediaries.rta}
            onGoToTab={() => setCurrentTab('rta')}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <SectionTitle icon="solar:user-star-bold" title="Lead Manager" />
          <IntermediarySection data={appointedIntermediaries.lead_manager} />
        </Grid>

        <Grid item xs={12}>
          <SectionTitle icon="solar:scale-bold" title="Legal Advisor" />
          <IntermediarySection data={appointedIntermediaries.legal_advisor} />
        </Grid> */}

        <Grid item xs={12}>
          <ValuerCard data={appointedIntermediaries.valuer}
            onGoToTab={() => setCurrentTab('valuer')}
          />
        </Grid>

        <Grid item xs={12}>
          <CreditRatingCard data={appointedIntermediaries.credit_rating}
            onGoToTab={() => setCurrentTab('credit_rating')}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </>
  );
}
