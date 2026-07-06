import { useEffect, useMemo, useState } from 'react';
import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { StepController } from '@/components/widgets/StepController';
import { CodeSyncPanel } from '@/components/widgets/CodeSyncPanel';
import { EquationHighlighter } from '@/components/widgets/EquationHighlighter';
import { BarCompare } from '@/components/widgets/BarCompare';
import { SliderInput } from '@/components/widgets/SliderInput';
import { gcd, gcdSteps, naiveDivisorCheckCount } from '@/utils/algorithms/euclidean';
import styles from './GcdEuclideanPage.module.css';

const PSEUDOCODE_LINES = ['function gcd(a, b):', '  if b == 0:', '    return a', '  return gcd(b, a mod b)'];

export function GcdEuclideanPage() {
  const [a, setA] = useState(48);
  const [b, setB] = useState(18);
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  const steps = useMemo(() => gcdSteps(a, b), [a, b]);
  const result = useMemo(() => gcd(a, b), [a, b]);
  const totalSteps = steps.length + 1;

  useEffect(() => {
    setCurrentStep(0);
    setMode('manual');
  }, [a, b]);

  const clampedStep = Math.min(currentStep, totalSteps - 1);
  const isFinalStep = clampedStep >= steps.length;
  const activeLine = isFinalStep ? 2 : 3;
  const current = steps[clampedStep];

  const equation = isFinalStep
    ? `\\gcd(${a}, ${b}) = \\htmlClass{eq-highlight}{${result}}`
    : `\\gcd(${current.a}, ${current.b}) = \\gcd(${current.b}, \\htmlClass{eq-highlight}{${current.remainder}})`;

  const naiveSteps = naiveDivisorCheckCount(a, b);

  return (
    <TopicPageTemplate
      topicId="gcd-euclidean"
      hook={
        <div className={styles.hook}>
          <p>ถ้าไม่รู้จัก Euclidean algorithm จะหา gcd(462, 1071) ได้เร็วแค่ไหน โดยไม่แจกแจงตัวหารทั้งหมดทีละตัว?</p>
          <p className={styles.hookSub}>
            เลื่อนลงไปลองเล่นกับตัวเลขของตัวเองด้านล่าง แล้วดูว่า Euclidean algorithm ใช้กี่ขั้นตอนเทียบกับวิธีไล่หารทีละตัว
          </p>
        </div>
      }
      visual={
        <div className={styles.visual}>
          <EquationHighlighter expression="\gcd(a, b) = \gcd(b, a \bmod b)" />
          <EquationHighlighter expression={equation} />
          <BarCompare
            labelA="a"
            valueA={isFinalStep ? a : current.a}
            labelB="b"
            valueB={isFinalStep ? b : current.b}
            maxValue={Math.max(a, b, 1)}
          />
        </div>
      }
      tryIt={
        <div className={styles.tryIt}>
          <SliderInput label={`a = ${a}`} min={1} max={1200} value={a} onChange={setA} />
          <SliderInput label={`b = ${b}`} min={1} max={1200} value={b} onChange={setB} />
          <p className={styles.resultLine}>
            gcd({a}, {b}) = <strong>{result}</strong>
          </p>
          <BarCompare labelA="ไล่หารทีละตัว" valueA={naiveSteps} labelB="Euclidean algorithm" valueB={steps.length} />
          <p className={styles.raceCaption}>
            จำนวนขั้นตอน (worst case): ไล่หารทีละตัว {naiveSteps} ครั้ง เทียบกับ Euclidean {steps.length} ครั้ง
          </p>
        </div>
      }
      walkthrough={
        <div className={styles.walkthrough}>
          <StepController
            totalSteps={totalSteps}
            currentStep={clampedStep}
            mode={mode}
            onStepChange={setCurrentStep}
            onModeChange={setMode}
          />
          <CodeSyncPanel lines={PSEUDOCODE_LINES} activeLine={activeLine} />
          <EquationHighlighter expression={equation} />
        </div>
      }
    />
  );
}
