import type { ReactNode } from 'react';

export interface MonitorLine {
  text: ReactNode;
  /** CSS color for the identity swatch (usually the round's palette color) */
  swatchColor?: string;
  emphasis?: boolean;
}

export interface ExecutionMonitorProps {
  title?: string;
  /** shown when there are no lines yet (setup beat) */
  hint?: ReactNode;
  lines: MonitorLine[];
  /** glowing termination badge, e.g. "GCD found: 2!" */
  badge?: ReactNode;
}
