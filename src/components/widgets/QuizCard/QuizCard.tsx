import type { QuizCardProps } from './QuizCard.types';
import styles from './QuizCard.module.css';

export function QuizCard({ question, selectedIndex, onAnswer }: QuizCardProps) {
  const answered = selectedIndex !== undefined;

  return (
    <div className={styles.card}>
      <p className={styles.prompt}>{question.prompt}</p>
      <div className={styles.choices}>
        {question.choices.map((choice, index) => {
          let variant = '';
          if (answered) {
            if (index === question.correctIndex) variant = styles.correct;
            else if (index === selectedIndex) variant = styles.incorrect;
          }
          return (
            <button
              key={choice}
              type="button"
              className={`${styles.choice} ${index === selectedIndex ? styles.selected : ''} ${variant}`}
              onClick={() => onAnswer?.(index)}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {answered && <p className={styles.explanation}>{question.explanation}</p>}
    </div>
  );
}
