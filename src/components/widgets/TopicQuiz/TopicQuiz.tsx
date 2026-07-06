import { useState } from 'react';
import { QuizCard } from '@/components/widgets/QuizCard';
import { Button } from '@/components/ui/Button';
import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import { QUIZZES } from '@/data/quizzes';
import styles from './TopicQuiz.module.css';

export function TopicQuiz({ topicId }: { topicId: string }) {
  const questions = QUIZZES[topicId] ?? [];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (questions.length === 0) {
    return <PlaceholderBlock widgetName="QuizCard" note="ยังไม่มีแบบทดสอบสำหรับหัวข้อนี้" />;
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <div className={styles.wrapper}>
      <QuizCard
        question={question}
        selectedIndex={answers[question.id]}
        onAnswer={(choiceIndex) => setAnswers((prev) => ({ ...prev, [question.id]: choiceIndex }))}
      />
      <div className={styles.nav}>
        <span className={styles.progress}>
          ข้อ {index + 1}/{questions.length}
        </span>
        <div className={styles.navButtons}>
          <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            ก่อนหน้า
          </Button>
          <Button variant="secondary" disabled={isLast} onClick={() => setIndex((i) => i + 1)}>
            ถัดไป
          </Button>
        </div>
      </div>
      {allAnswered && (
        <div className={styles.summary}>
          ตอบถูก {correctCount}/{questions.length} ข้อ
        </div>
      )}
    </div>
  );
}
