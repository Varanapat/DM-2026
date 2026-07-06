import type { FactorTreeProps } from './FactorTree.types';
import styles from './FactorTree.module.css';

/** D3 tree-layout + click-to-split logic is Phase 2 scope — this stub only
 * renders the root node so pages have something to import against. */
export function FactorTree({ rootValue }: FactorTreeProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.node}>{rootValue}</div>
      <span className={styles.note}>คลิกเพื่อแตกตัวประกอบ — เพิ่ม D3 tree layout ใน Phase 2</span>
    </div>
  );
}
