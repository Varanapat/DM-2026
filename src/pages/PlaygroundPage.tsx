import { useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import { ClockModulo } from '@/components/widgets/ClockModulo';
import { SliderInput } from '@/components/widgets/SliderInput';
import { BarCompare } from '@/components/widgets/BarCompare';
import { FactorTree } from '@/components/widgets/FactorTree';
import { EquationHighlighter } from '@/components/widgets/EquationHighlighter';
import { CodeSyncPanel } from '@/components/widgets/CodeSyncPanel';
import { MisconceptionCard } from '@/components/widgets/MisconceptionCard';
import { QuizCard } from '@/components/widgets/QuizCard';
import type { QuizQuestion } from '@/components/widgets/QuizCard';
import styles from './PlaygroundPage.module.css';

const sampleQuestion: QuizQuestion = {
  id: 'sample',
  prompt: 'gcd(24, 36) มีค่าเท่าไร?',
  choices: ['6', '12', '18', '24'],
  correctIndex: 1,
  explanation: 'gcd(24,36) = 12',
};

export function PlaygroundPage() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [n, setN] = useState(12);
  const [quizAnswer, setQuizAnswer] = useState<number>();

  return (
    <div className={styles.wrapper}>
      <div>
        <h1 className={styles.title}>Playground</h1>
        <p className={styles.intro}>ทดลองเล่นกับ widget ทุกตัวในที่เดียว (chrome เท่านั้นใน Phase 1 นี้)</p>
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;StepController&gt;</span>
        <StepController totalSteps={5} currentStep={step} mode={mode} onStepChange={setStep} onModeChange={setMode} />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;SliderInput&gt; + &lt;NumberGrid&gt;</span>
        <SliderInput label="n" min={1} max={60} value={n} onChange={setN} />
        <NumberGrid max={n} onCellClick={() => undefined} />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;ClockModulo&gt;</span>
        <ClockModulo modulus={12} value={n} />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;BarCompare&gt;</span>
        <BarCompare labelA="Naive" valueA={n} labelB="Fast" valueB={Math.ceil(Math.log2(n + 1))} />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;FactorTree&gt;</span>
        <FactorTree rootValue={n} />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;EquationHighlighter&gt;</span>
        <EquationHighlighter expression="gcd(a, b) = gcd(b, a mod b)" />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;CodeSyncPanel&gt;</span>
        <CodeSyncPanel lines={['function gcd(a, b) {', '  if (b === 0) return a;', '  return gcd(b, a % b);', '}']} activeLine={2} />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;MisconceptionCard&gt;</span>
        <MisconceptionCard wrongText="ต้องหา factor ทั้งหมดก่อนถึงจะหา gcd ได้" correctText="ใช้ Euclidean algorithm หารเศษซ้ำ ๆ ได้เลย ไม่ต้องหา factor" />
      </div>

      <div className={styles.block}>
        <span className={styles.blockTitle}>&lt;QuizCard&gt;</span>
        <QuizCard question={sampleQuestion} selectedIndex={quizAnswer} onAnswer={setQuizAnswer} />
      </div>
    </div>
  );
}
