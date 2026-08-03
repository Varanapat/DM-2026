export interface StepControllerProps {
  totalSteps: number;
  currentStep: number;
  mode: 'manual' | 'auto';
  onStepChange: (step: number) => void;
  onModeChange?: (mode: 'manual' | 'auto') => void;
  disabled?: boolean;
}
