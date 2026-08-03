import type { ReactNode } from 'react';

export interface DefinitionCardProps {
  /** card title, defaults to "นิยาม" */
  title?: string;
  /** optional plain-language definition sentence shown above the formula; when
   * provided, a "สูตร" sub-label appears above the formula box too */
  definition?: ReactNode;
  /** sub-label shown above the formula box, only rendered when `definition` is set — defaults to "สูตร" */
  formulaLabel?: string;
  /** the boxed formula line, e.g. <><b>a</b> | <b>b</b> ⟺ ...</> */
  formula: ReactNode;
  /** the story/analogy paragraph below the formula — use <code>/<strong> for emphasis */
  note: ReactNode;
}
