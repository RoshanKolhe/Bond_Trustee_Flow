import { Box, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import IsinActivationFinalization from './isin-activation-finalization';
import DematCreditDetails from './demat-credit-details';
import TrusteeProceedForApproval from './trustee-approval';

export default function IsinActivationMain({
  currentIsin,
  currentDemat,
  currentTrusteeApproval,
  percent,
  setActiveStepId,
  saveStepData,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [isinPercent, setIsinPercent] = useState(0);
  const [dematPercent, setDematPercent] = useState(0);
  const [trusteePercent, setTrusteePercent] = useState(0);

  const [isinCompleted, setIsinCompleted] = useState(false);
  const [dematCompleted, setDematCompleted] = useState(false);
  const [trusteeCompleted, setTrusteeCompleted] = useState(false);

  /* ---------------- NEXT BUTTON ---------------- */
  const handleNextClick = () => {
    if (!isinCompleted) {
      enqueueSnackbar('Please complete ISIN Activation section', { variant: 'error' });
      return;
    }

    // if (!dematCompleted) {
    //   enqueueSnackbar('Please complete Demat Credit Details section', { variant: 'error' });
    //   return;
    // }

    // if (!trusteeCompleted) {
    //   enqueueSnackbar('Please complete Trustee Approval section', { variant: 'error' });
    //   return;
    // }

    setActiveStepId('execute_document');
  };

  /* ---------------- STEP PERCENT ---------------- */

  useEffect(() => {
    const totalPercent = isinPercent 
    // * 0.35 + dematPercent * 0.35 + trusteePercent * 0.3
    ;

    percent?.(Math.round(totalPercent));
  }, [isinPercent, dematPercent, trusteePercent, percent]);

  return (
    <Stack direction="column" spacing={3}>
      {/* ---------------- TRUSTEE APPROVAL ---------------- */}
      {/* <TrusteeProceedForApproval
        currentTrusteeApproval={currentTrusteeApproval}
        saveStepData={(data) => saveStepData('trustee_sebi_approval', data)}
        setPercent={setTrusteePercent}
        setProgress={setTrusteeCompleted}
      /> */}
      {/* ---------------- ISIN ACTIVATION ---------------- */}
      <IsinActivationFinalization
        currentIsin={currentIsin}
        saveStepData={(data) => saveStepData('isin_activation', data)}
        setPercent={setIsinPercent}
        setProgress={setIsinCompleted}
      />

      {/* ---------------- DEMAT CREDIT DETAILS ---------------- */}
      {/* <DematCreditDetails
        currentDemat={currentDemat}
        saveStepData={(data) => saveStepData('demat_credit_details', data)}
        setPercent={setDematPercent}
        setProgress={setDematCompleted}
      /> */}

      {/* ---------------- NEXT BUTTON ---------------- */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNextClick}>
          Next
        </Button>
      </Box>
    </Stack>
  );
}

IsinActivationMain.propTypes = {
  currentIsin: PropTypes.object,
  currentDemat: PropTypes.object,
  currentTrusteeApproval: PropTypes.object,
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
  saveStepData: PropTypes.func,
};
