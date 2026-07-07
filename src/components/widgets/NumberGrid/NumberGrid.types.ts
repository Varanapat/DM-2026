export type CellState = 'default' | 'success' | 'danger' | 'muted' | 'current';

export interface NumberGridProps {
  max: number;
  cellStates?: Record<number, CellState>;
  onCellClick?: (value: number) => void;
  disabled?: boolean;
}
