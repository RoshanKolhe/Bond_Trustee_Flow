import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';

import KYCCompanyDetails from './kyc-company-details';
import KYCBankDetails from './kyc-bank-details';
import KYCSignatories from './kyc-signatories';
import { AnimatePresence } from 'framer-motion';
import { m } from 'framer-motion';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function Stepper() {
  const router = useRouter();
  const steps = [
    { id: 'kyc_company_documents', number: 1, lines: ['Company', 'Documents'] },
    { id: 'kyc_bank_details', number: 2, lines: ['Bank', 'Details'] },
    { id: 'kyc_signatories', number: 3, lines: ['Authorized', 'Signatories'] },
  ];

  const [activeStepId, setActiveStepId] = useState('kyc_company_documents');

  const [stepsProgress, setStepsProgress] = useState({
    kyc_company_documents: { percent: 0 },
    kyc_bank_details: { percent: 0 },
    kyc_signatories: { percent: 0 },
  });

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const handleStepClick = (stepId) => {
    const index = steps.findIndex((s) => s.id === stepId);

    // Prevent skipping ahead
    for (let i = 0; i < index; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };

  const renderForm = () => {
    switch (activeStepId) {
      case 'kyc_company_documents':
        return (
          <KYCCompanyDetails
            percent={(p) => updateStepPercent('kyc_company_documents', p)}
            setActiveStepId={() => setActiveStepId('kyc_bank_details')}
          />
        );

      case 'kyc_bank_details':
        return (
          <KYCBankDetails
            percent={(p) => updateStepPercent('kyc_bank_details', p)}
            setActiveStepId={() => setActiveStepId('kyc_signatories')}
          />
        );

      case 'kyc_signatories':
        return (
          <KYCSignatories
            percent={(p) => updateStepPercent('kyc_signatories', p)}
            setActiveStepId={() => router.push(paths.auth.kyc.kycPending)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ProgressStepper
        steps={steps}
        activeStepId={activeStepId}
        stepsProgress={stepsProgress}
        onStepClick={handleStepClick}
      />

      <Stack sx={{ mt: 3 }}>
        <AnimatePresence mode="wait">
          <m.div
            key={activeStepId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderForm()}
          </m.div>
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
