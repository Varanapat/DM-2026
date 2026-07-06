import { useState } from 'react';
import type { MisconceptionCardProps } from './MisconceptionCard.types';
import styles from './MisconceptionCard.module.css';

/** Flip animation is Phase 2 scope — this stub toggles content on click/Enter. */
export function MisconceptionCard({ wrongText, correctText }: MisconceptionCardProps) {
  const [showCorrect, setShowCorrect] = useState(false);

  return (
    <button type="button" className={styles.card} onClick={() => setShowCorrect((prev) => !prev)}>
      <div className={styles.label}>{showCorrect ? 'ถูกต้อง — คลิกเพื่อดูข้อผิด' : 'ผิดบ่อย — คลิกเพื่อดูคำตอบที่ถูก'}</div>
      <p className={showCorrect ? styles.correct : styles.wrong}>{showCorrect ? correctText : wrongText}</p>
    </button>
  );
}
