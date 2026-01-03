import { Stack, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import IssueDocumentsCard from './issue-documents-card';
import IssueDetailsCard from './issue-details-card';

export default function MyBondNewIssue({
  saveStepData,
  setActiveStepId,
  percent,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [detailsPercent, setDetailsPercent] = useState(0);
  const [docsPercent, setDocsPercent] = useState(0);

  const [detailsCompleted, setDetailsCompleted] = useState(false);
  const [docsCompleted, setDocsCompleted] = useState(false);

  // ---------- NEXT ----------
 const handleNextClick = () => {

  if (!detailsCompleted && !docsCompleted) {
    enqueueSnackbar('Please complete Issue Details and upload required Documents', {
      variant: 'error',
    });
    return;
  }
  if (!detailsCompleted) {
    enqueueSnackbar('Please complete the Issue Details section', {
      variant: 'error',
    });
    return;
  }
  if (!docsCompleted) {
    enqueueSnackbar('Please upload all required Documents', {
      variant: 'error',
    });
    return;
  }

    setActiveStepId('intermediaries');
  };

  // ---------- PERCENT ----------
  useEffect(() => {
    const total = detailsPercent + docsPercent; // SAME AS FUND POSITION
    percent?.(total);
  }, [detailsPercent, docsPercent]);

  console.log('percent', detailsPercent);
    console.log('Doc Percent', docsPercent);
  
  return (
    <>
      <Stack spacing={3}>
        <IssueDetailsCard
          setPercent={setDetailsPercent}
          setProgress={setDetailsCompleted}
          saveStepData={(data) => saveStepData('issueDetails', data)}
        />

        <IssueDocumentsCard
          setPercent={setDocsPercent}
          setProgress={setDocsCompleted}
          saveStepData={(data) => saveStepData('documentData', data)}
        />
      </Stack>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleNextClick}>
          Next
        </Button>
      </Box>
    </>
  );
}
