import React, { useEffect, useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import BorrowingDetails from './borrowing-details';

export default function MainFile({ setActiveStepId, percent }) {
  const [currentFormCount, setCurrentFormCount] = useState(0);
  const [payloadData, setpayloadData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getPercent = (count) => {
    switch (count) {
      case 1:
        return 100;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const p = getPercent(currentFormCount);

    if (typeof percent === 'function') {
      percent(p);
    }
  }, [currentFormCount]);

  const handleNextClick = async () => {
    if (currentFormCount === 1) {
      enqueueSnackbar('Step completed!', { variant: 'success' });
      setActiveStepId();
    } else {
      enqueueSnackbar('Please complete the form', { variant: 'error' });
      return;
    }
  };

  const handleSkipClick = () => {
    enqueueSnackbar('Borrowing skipped', { variant: 'info' });

    if (typeof percent === 'function') {
      percent(100);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <BorrowingDetails
          onSave={(data) => setpayloadData((prev) => ({ ...prev, borrowings: data }))}
          setCurrentFormCount={setCurrentFormCount}
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
          <Button variant="outlined" onClick={handleSkipClick}>
            Skip
          </Button>

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

MainFile.propTypes = {
  onSave: PropTypes.func,
  percent: PropTypes.func,
};
