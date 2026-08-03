import type { ReactNode } from 'react';

export interface StepHistoryProps {
  title: string;
  entries: ReactNode[];
  emptyHint?: string;
  accent?: 'accent' | 'secondary';
}
