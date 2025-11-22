import { useState, useEffect } from "react";
import MainFile from "./stepThree/main";
import { Box, Stepper, Step, StepLabel, Card, Stack } from "@mui/material";
import StepFour from "./stepFour";
import FundPositionForm from "./fund-positions";
import PreliminaryBondRequirements from "./preliminary-bond-requirements";

const steps = ["1", "2", "3", "4"];

export default function RoiStepper() {
  // --- Load saved data from localStorage ---
  const [activeSteps, setActiveSteps] = useState(() => {
    const savedStep = Number(localStorage.getItem("roi_active_step"));

    // Prevent loading an invalid or completed step (like 4)
    if (!isNaN(savedStep) && savedStep >= 0 && savedStep < steps.length) {
      return savedStep;
    }

    return 0; // reset to first step
  });

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("roi_form_data");
    return savedData ? JSON.parse(savedData) : null;
  });

  // --- Save step and form data on every change ---
  useEffect(() => {
    localStorage.setItem("roi_active_step", activeSteps);
  }, [activeSteps]);

  useEffect(() => {
    localStorage.setItem("roi_form_data", JSON.stringify(formData));
  }, [formData]);

  const handleSave = (key, data) => {
  setFormData((prev) => ({
    ...prev,
    [key]: {
      ...(prev?.[key] || {}),
      ...data,
    },
  }));
};


  const renderForm = () => {
    switch (activeSteps) {
      case 0:
        return (
          <FundPositionForm
            currentFund={formData?.fundPosition}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
          />
        );
      case 1:
        return (
          <MainFile
            currentDetails={formData}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
          />
        );
      case 2:
        return (
          <StepFour
            currentFinancial={formData}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
          />
        );
      case 3:
        return (
          <PreliminaryBondRequirements
            currentBondRequirements={formData}
            setActiveStep={setActiveSteps}
            onSave={handleSave}
          />
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <h3>All steps completed successfully!</h3>
          </Box>
        );
    }
  };

  return (
    <Card sx={{ p: 3, boxShadow: "none" }}>
      <Stepper activeStep={activeSteps} sx={{ mb: 3 }}>
        {steps.map((_, index) => (
          <Step key={index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <Stack spacing={3}>{renderForm()}</Stack>
    </Card>
  );
}
