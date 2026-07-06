import type { EquationHighlighterProps } from './EquationHighlighter.types';
import styles from './EquationHighlighter.module.css';

/** Renders the raw expression as monospace text — KaTeX rendering and
 * synced term-highlighting land in Phase 2. */
export function EquationHighlighter({ expression }: EquationHighlighterProps) {
  return <span className={styles.expression}>{expression}</span>;
}
