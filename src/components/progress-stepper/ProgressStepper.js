/* eslint-disable react/jsx-no-duplicate-props */
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
} from '@mui/material';

// ---------------- CUSTOM CONNECTOR ----------------
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  top: '20px', // Centers line between 40px step icons
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  [`& .${StepConnector.line}`]: {
    borderTopWidth: 3,
    borderColor: '#d1d5db',
  },
}));

// --------------- CUSTOM STEP ICON --------------
function StepIconComponent(props) {
  const { active, completed, icon, progress } = props;

  const getColor = (percent) => {
    if (percent === 100) return '#22c55e';
    if (percent >= 0) return '#f59e0b';
    return '#ef4444';
  };

  const borderColor = active || completed ? getColor(progress) : '#d1d5db';
  const textColor = active || completed ? getColor(progress) : '#6b7280';

  return (
    <Box sx={{ width: 40, height: 40, position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" stroke="#e5e7eb" strokeWidth="3" fill="none" />
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke={borderColor}
          strokeWidth="3"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontWeight: 700,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
}

// ---------------- MAIN REUSABLE STEPPER ----------------
export default function ProgressStepper({
  steps,
  activeStepId,
  stepsProgress,
  onStepClick,
}) {
  const activeIndex = steps.findIndex((s) => s.id === activeStepId);

  return (
    <Stepper
      activeStep={activeIndex}
      alternativeLabel
      connector={<ColorConnector />}
      sx={{ my: 3, position: 'relative' }}
    >
      {steps.map((step, index) => {
        const progress = stepsProgress[step.id]?.percent || 0;
        const isActive = step.id === activeStepId;
        const isCompleted = progress === 100;

        const getColor = (percent) => {
          if (percent === 100) return '#22c55e';
          if (percent >= 0) return '#f59e0b';
          return '#ef4444';
        };

        return (
          <Step
            key={step.id}
            onClick={() => (isCompleted || isActive) && onStepClick(step.id)}
            completed={isCompleted}
            sx={{
               cursor: isCompleted || isActive ? 'pointer' : 'not-allowed',
              '& .MuiStepConnector-line': {
                borderColor:
                  index === 0
                    ? '#d1d5db'
                    : getColor(stepsProgress[steps[index - 1].id]?.percent || 0),
              },
            }}
          >
            <StepLabel
              StepIconComponent={(props) =>
                StepIconComponent({
                  ...props,
                  progress,
                })
              }
            >
              <Typography sx={{ fontSize: '0.75rem', mt: 1 }}>
                {step.lines.join(' ')}
              </Typography>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
}
