import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { PredictRevealProps } from './PredictReveal.types';
import styles from './PredictReveal.module.css';

/** "Predict, then check" checkpoint — poses a question, hides the answer
 * until the learner has committed to a guess. Used to reinforce a concept
 * right after it's introduced, before moving on. */
export function PredictReveal({ question, children }: PredictRevealProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={styles.wrapper}>
      <p className={styles.question}>
        <span className={styles.icon} aria-hidden="true">
          🤔
        </span>
        {question}
      </p>
      {revealed ? (
        <div className={styles.answer}>{children}</div>
      ) : (
        <Button variant="secondary" onClick={() => setRevealed(true)}>
          ลองทายก่อน แล้วกดดูคำตอบ
        </Button>
      )}
    </div>
  );
}
