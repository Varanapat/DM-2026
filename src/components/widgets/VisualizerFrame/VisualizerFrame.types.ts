import type { ReactNode } from 'react';

export interface VisualizerFrameProps {
  title: string;
  /** tabs, number inputs, chips — rendered centered under the title */
  headerExtra?: ReactNode;
  /** right-hand panel (usually <ExecutionMonitor/>); omit for full-width canvas */
  monitor?: ReactNode;
  /** sticky footer controls (usually <StepController/>) */
  footer?: ReactNode;
  /** the canvas */
  children: ReactNode;
}
