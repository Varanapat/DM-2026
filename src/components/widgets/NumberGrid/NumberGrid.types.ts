export type CellState = 'default' | 'success' | 'danger' | 'muted' | 'current' | 'crossed' | 'gold' | 'fallen';

export interface CellDecor {
  /** small identity bar under the number (e.g. the sieve round that crossed it) */
  annotationColor?: string;
  /** stagger index for the state-change animation within a beat */
  delayIndex?: number;
  /** native tooltip */
  title?: string;
}

export interface NumberGridProps {
  max: number;
  /** first value shown (default 1) — the sieve starts at 2 */
  start?: number;
  cellStates?: Record<number, CellState>;
  cellDecor?: Record<number, CellDecor>;
  onCellClick?: (value: number) => void;
  disabled?: boolean;
  /** smaller cells for large grids (e.g. sieve up to 120) */
  compact?: boolean;
}
