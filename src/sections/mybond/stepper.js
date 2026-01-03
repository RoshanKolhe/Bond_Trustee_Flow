import { useState, useEffect } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';

import MainFile from './borrowing/main';
import LaunchIssue from './launch-issue';
import AuditedFinancialDocument from './audited-financial/audited-financial-document';
import FundAndCreditForm from './fund-position-and-credit-rating/fundAndCreditForm';
import ProgressStepper from 'src/components/progress-stepper/ProgressStepper';
import ExecuteDocument from './execute-documents/execute-documents';
import IsinActivationMain from './isin-activation/isin-activation-main';
import IntermediariesView from './intermediates/intermediates-view/intermediate-view';
import MyBondNewIssue from './my-new-issue/my-bond-new-issue';
import CollateralAssets from './collateral-assets/collatralAssets';
import FinancialProfitableMainFile from './financial-details/financial-profitable-main';
import CreditRating from './creadit-rating/creditRatings';
import { useParams } from 'src/routes/hook';
import { useGetBondApplication } from 'src/api/bondApplications';
import RegulatoryFilingMain from './regulatory-filing/regulatory-filing-main';
import BorrowingDetails from './borrowing/borrowing-details';
import TrusteeDueDiligence from './regulatory-filing/trustee-due-diligence';
import InPrincipleApproval from './regulatory-filing/in-principle';

export default function MybondStepper() {
  const params = useParams()
  const { applicationId } = params;

  const [applicationData, setApplicationData] = useState(null);
  const { bondApplication, bondApplicationLoading } = useGetBondApplication(applicationId);
  const [dataInitialized, setDataInitialized] = useState(false);



  const [activeStepId, setActiveStepId] = useState('my_bond_new_issue');
  const [formData, setFormData] = useState({
    my_bond_new_issue: {},
    fund_position: {},
    intermediaries: {},
    execute_document: {},
    audited_financial: {},
    borrowing_details: {},
    financial_details: {},
    // preliminary_bond_requirements: {},
    collateral_assets: {},
    regulatory_filing: {},
    isin_activation: {},
    launch_issue: {},
    credit_rating: {},
  });

  const steps = [
    {
      id: 'my_bond_new_issue',
      number: 1,
      lines: ['New Issue', 'Setup'],
    },
    {
      id: 'intermediaries',
      number: 2,
      lines: ['Intermediaries'],
    },
    {
      id: 'fund_position',
      number: 3,
      lines: ['Fund', 'Position'],
    },
    {
      id: 'audited_financial',
      number: 4,
      lines: ['Audited', 'Financials'],
    },
    {
      id: 'borrowing_details',
      number: 5,
      lines: ['Borrowing', 'Details'],
    },
    {
      id: 'collateral_assets',
      number: 6,
      lines: ['Collateral', 'Assets'],
    },
    {
      id: 'financial_details',
      number: 7,
      lines: ['Financial', 'Details'],
    },
    {
      id: 'credit_rating',
      number: 8,
      lines: ['Credit Rating'],
    },
    {
      id: 'regulatory_filing',
      number: 9,
      lines: ['Regulatory', 'Filing'],
    },
    {
      id: 'trustee_due_diligence',
      number: 10,
      lines: ['Trustee', 'Due Diligence'],
    },
    {
      id: 'principle_listing_approval',
      number: 11,
      lines: ['Principle', 'Listing Approval'],
    },
    {
      id: 'isin_activation',
      number: 12,
      lines: ['ISIN', 'Activation'],
    },
    {
      id: 'execute_document',
      number: 13,
      lines: ['Execute', 'Document'],
    },
    {
      id: 'launch_issue',
      number: 14,
      lines: ['Launch', 'Issue'],
    },
  ];

  const [stepsProgress, setStepsProgress] = useState({
    my_bond_new_issue: { percent: 0 },
    fund_position: { percent: 0 },
    intermediaries: { percent: 0 },
    audited_financial: { percent: 0 },
    borrowing_details: { percent: 0 },
    financial_details: { percent: 0 },
    collateral_assets: { percent: 0 },
    regulatory_filing: { percent: 0 },
    isin_activation: { percent: 0 },
    execute_document: { percent: 0 },
    launch_issue: { percent: 0 },
    credit_rating: { percent: 0 },
    trustee_due_diligence: { percent: 0 },
    principle_listing_approval: { percent: 0 }
  });

  useEffect(() => {
    const savedStep = localStorage.getItem('activeStepId');
    const savedForm = localStorage.getItem('formData');
    const savedProgress = localStorage.getItem('stepsProgress');

    if (savedStep) setActiveStepId(savedStep);
    if (savedForm) setFormData(JSON.parse(savedForm));
    if (savedProgress) setStepsProgress(JSON.parse(savedProgress));
  }, []);

  useEffect(() => {
    localStorage.setItem('activeStepId', activeStepId);
  }, [activeStepId]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('stepsProgress', JSON.stringify(stepsProgress));
  }, [stepsProgress]);

  const updateStepPercent = (stepId, percent) => {
    setStepsProgress((prev) => ({
      ...prev,
      [stepId]: { percent },
    }));
  };

  const saveStepData = (stepId, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        ...data, // merge new fields with old
      },
    }));
  };

  const handleStepClick = (stepId) => {
    // Prevent jumping forward if previous step is incomplete
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    for (let i = 0; i < stepIndex; i++) {
      if (stepsProgress[steps[i].id].percent < 100) return;
    }

    setActiveStepId(stepId);
  };


  useEffect(() => {
    if (bondApplication && !bondApplicationLoading && !dataInitialized) {

      setApplicationData(bondApplication);

      const completedStepCodes =
        bondApplication.completedSteps?.map((step) => step.code) || [];

      let currentStep = 'my_bond_new_issue';

      if (
        completedStepCodes.includes('initialized') &&
        completedStepCodes.includes('issue_details') &&
        completedStepCodes.includes('document_upload')
      ) {
        updateStepPercent('my_bond_new_issue', 100);
        currentStep = 'intermediaries';
      }

      if (
        completedStepCodes.includes('intermediary_appointments_pending') &&
        completedStepCodes.includes('intermediary_appointments_success')
      ) {
        updateStepPercent('intermediaries', 100);
        currentStep = 'fund_position';
      }

      if (
        completedStepCodes.includes('fund_position') &&
        completedStepCodes.includes('capital_details')
      ) {
        updateStepPercent('fund_position', 100);
        currentStep = 'audited_financial';
      }

      if (
        completedStepCodes.includes('financial_statements') &&
        completedStepCodes.includes('income_tax_returns') &&
        completedStepCodes.includes('gstr-9') &&
        completedStepCodes.includes('gst-3b')
      ) {
        updateStepPercent('audited_financial', 100);
        currentStep = 'borrowing_details';
      }

      if (
        completedStepCodes.includes('borrowing_details')
      ) {
        updateStepPercent('borrowing_details', 100);
        currentStep = 'collateral_assets';
      }


      if (
        completedStepCodes.includes('collateral_assets') &&
        completedStepCodes.includes('collateral_assets_approval')
      ) {
        updateStepPercent('collateral_assets', 100);
        currentStep = 'financial_details';
      }

      if (
        completedStepCodes.includes('financial_details')
      ) {
        updateStepPercent('financial_details', 100);
        currentStep = 'credit_rating';
      }

      setActiveStepId(currentStep);
      setDataInitialized(true);
    }
  }, [bondApplication, bondApplicationLoading, dataInitialized]);


  useEffect(() => {
    if (bondApplication && !bondApplicationLoading) {
      setApplicationData(bondApplication)
    }
  }, [bondApplication, bondApplicationLoading])
  const renderForm = () => {
    switch (activeStepId) {
      case 'my_bond_new_issue':
        return (
          <MyBondNewIssue
            percent={(p) => updateStepPercent('my_bond_new_issue', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'intermediaries':
        return (
          <IntermediariesView
            percent={(p) => updateStepPercent('intermediaries', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'fund_position':
        return (
          <FundAndCreditForm
            percent={(p) => updateStepPercent('fund_position', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'audited_financial':
        return (
          <AuditedFinancialDocument
            percent={(p) => updateStepPercent('audited_financial', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'borrowing_details':
        return (
          <BorrowingDetails
            percent={(p) => updateStepPercent('borrowing_details', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'collateral_assets':
        return (
          <CollateralAssets
            percent={(p) => updateStepPercent('collateral_assets', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'financial_details':
        return (
          <FinancialProfitableMainFile
            percent={(p) => updateStepPercent('financial_details', p)}
            setActiveStepId={setActiveStepId}
          />
        );

      case 'credit_rating':
        return (
          <CreditRating
            currentIssue={formData.my_bond_new_issue}
            percent={(p) => updateStepPercent('credit_rating', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('credit_rating', data)}
          />
        );

      // case 'preliminary_bond_requirements':
      //   return (
      //     <PriliminaryAndCollateralView
      //       currentPrliminaryRequirements={
      //         formData.preliminary_bond_requirements?.preliminaryData || null
      //       }
      //       currentCollateral={formData.preliminary_bond_requirements?.collateralData || null}
      //       percent={(p) => updateStepPercent('preliminary_bond_requirements', p)}
      //       setActiveStepId={setActiveStepId}
      //       saveStepData={(section, data) =>
      //         saveStepData('preliminary_bond_requirements', { [section]: data })
      //       }
      //     />
      //   );

      case 'regulatory_filing':
        return (
          <RegulatoryFilingMain
            currentPAS4Regulatory={formData.regulatory_filing?.pas4}
            currentTermSheetRegulatory={formData.regulatory_filing?.sebiApprovals}
            currentInformationMemorandumRegulatory={formData.regulatory_filing?.memorandum}
            percent={(p) => updateStepPercent('regulatory_filing', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('regulatory_filing', data)}
          />
        );

      case 'trustee_due_diligence':
        return (
          <TrusteeDueDiligence
            currentData={formData?.trustee_due_diligence}
            percent={(p) => updateStepPercent('trustee_due_diligence', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('trustee_due_diligence', data)}
          />
        );

      case 'principle_listing_approval':
        return (
          <InPrincipleApproval
            currentData={formData?.principle_listing_approval}
            percent={(p) => updateStepPercent('principle_listing_approval', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('principle_listing_approval', data)}
          />
        );

      case 'isin_activation':
        return (
          <IsinActivationMain
            currentIsin={formData.isin_activation?.isin_activation || {}}
            currentDemat={formData.isin_activation?.demat_credit_details || {}}
            currentTrusteeApproval={formData.isin_activation?.trustee_sebi_approval || {}}
            percent={(p) => updateStepPercent('isin_activation', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(section, data) => saveStepData('isin_activation', { [section]: data })}
          />
        );

      case 'execute_document':
        return (
          <ExecuteDocument
            currentExecuteDocument={formData.execute_document}
            percent={(p) => updateStepPercent('execute_document', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('execute_document', data)}
          />
        );
      case 'launch_issue':
        return (
          <LaunchIssue
            currentLaunchIssue={formData.launch_issue}
            percent={(p) => updateStepPercent('launch_issue', p)}
            setActiveStepId={setActiveStepId}
            saveStepData={(data) => saveStepData('launch_issue', data)}
          />
        );

      default:
        return <Box>Done</Box>;
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

      <Stack sx={{ mt: 3 }}>{renderForm()}</Stack>
    </Box>
  );
}
