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
  /** the block below the formula — normally a <DefinitionStatement> spelling out the formal definition */
  note: ReactNode;
}

export interface DefinitionStatementProps {
  /** the "ให้ a, b ∈ ℤ และ a ≠ 0" line naming the objects and their conditions */
  given: ReactNode;
  /** the "เรากล่าวว่า … ก็ต่อเมื่อ …" line stating the definition itself */
  claim: ReactNode;
  /** the displayed condition/equation the claim resolves to */
  equation?: ReactNode;
  /** an optional closing "หรือกล่าวได้ว่า …" restatement in plain words */
  restate?: ReactNode;
}
