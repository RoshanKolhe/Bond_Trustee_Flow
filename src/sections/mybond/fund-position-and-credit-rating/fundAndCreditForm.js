import PropTypes from 'prop-types';
import FundPosition from './fundPosition';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import CapitalDetails from './capital-details';

export default function FundAndCreditForm({
  percent,
  setActiveStepId,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [fundPositionPercent, setFundPositionPercent] = useState(0);
  const [creditRatingPercent, setCreditRatingPercent] = useState(0);
  const [fundpositionCompleted, setfundpositionCompleted] = useState(false);
  const [creditRatingCompleted, setcreditRatingCompleted] = useState(false);

  const handleNextClick = () => {
    if (!fundpositionCompleted) {
      enqueueSnackbar('please complete fund position section', {variant: 'error'});
      return;
    }

    if (!creditRatingCompleted) {
      enqueueSnackbar('please complete credit rating section', {variant: 'error'});
      return;
    }

    setActiveStepId('audited_financial');
  };

  useEffect(() => {
    const total = fundPositionPercent + creditRatingPercent;
    percent?.(total);
  }, [fundPositionPercent, creditRatingPercent, percent]);

  return (
    <>
      <FundPosition
        setPercent={setFundPositionPercent}
        setProgress={setfundpositionCompleted}
      />
      <CapitalDetails
        setPercent={setCreditRatingPercent}
        setProgress={setcreditRatingCompleted}
      />
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="button" variant="contained" onClick={() => handleNextClick()}>
          Next
        </Button>
      </Box>
    </>
  );
}

FundAndCreditForm.propTpes = {
  currentFundPosition: PropTypes.object,
  currentCreditRatings: PropTypes.array,
  saveStepData: PropTypes.func,
  percent: PropTypes.func,
  setActiveStepId: PropTypes.func,
};
