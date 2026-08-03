import type { ReactNode } from 'react';

export interface VisualizerFrameProps {
  /** omit to skip the header row entirely (e.g. when the page title above already covers it) */
  title?: string;
  /** tabs, number inputs, chips — rendered centered under the title */
  headerExtra?: ReactNode;
  /** right-hand panel (usually <ExecutionMonitor/>); omit for full-width canvas */
  monitor?: ReactNode;
  /** sticky footer controls (usually <StepController/>) */
  footer?: ReactNode;
  /** the canvas */
  children: ReactNode;
}
