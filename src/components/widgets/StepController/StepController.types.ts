export interface StepControllerProps {
  totalSteps: number;
  currentStep: number;
  mode: 'manual' | 'auto';
  speed?: number;
  onStepChange: (step: number) => void;
  onModeChange?: (mode: 'manual' | 'auto') => void;
  disabled?: boolean;
  /** show the "reset to start" (⏮) button — defaults to true */
  showReset?: boolean;
}
