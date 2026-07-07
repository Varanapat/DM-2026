export interface RibbonBar {
  label: string;
  length: number;
}

export interface RibbonSegmentsProps {
  bars: RibbonBar[];
  /** the segment length to divide each bar into (e.g. the gcd) */
  unit: number;
  unitLabel?: string;
}
