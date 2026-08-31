import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { ClockModulo } from '@/components/widgets/ClockModulo';
import { DefinitionCard, DefinitionStatement, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { lcgSequence } from '@/utils/algorithms/lcg';
import styles from './PseudorandomVisualizer.module.css';

const MAX_TERMS = 40;

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.min(Math.max(Math.trunc(v), lo), hi);
}

export function PseudorandomVisualizer() {
  const [a, setA] = useState(5);
  const [c, setC] = useState(3);
  const [m, setM] = useState(16);
  const [seed, setSeed] = useState(1);

  const terms = useMemo(() => lcgSequence(a, c, m, seed, MAX_TERMS), [a, c, m, seed]);

  const totalBeats = terms.length;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${c}:${m}:${seed}`);

  const current = terms[beatIndex];
  const shownTerms = terms.slice(0, beatIndex + 1);
  const isPeriodFound = current?.isRepeat === true;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = shownTerms.map((t) =>
      t.index === 0
        ? { text: `x₀ = seed = ${t.value}`, swatchColor: 'var(--color-secondary)' }
        : {
            text: `x${t.index} = (${a}×${terms[t.index - 1].value} + ${c}) mod ${m} = ${t.value}`,
            swatchColor: t.isRepeat ? 'var(--color-success)' : 'var(--color-accent)',
            emphasis: t.isRepeat,
          },
    );
    return lines;
  }, [shownTerms, a, c, m, terms]);

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            ชุดข้อมูลตัวเลขที่ดูเหมือนว่าถูกสุ่มขึ้นมาอย่างไม่มีระเบียบ แต่ความจริงแล้วถูกสร้างขึ้นจากขั้นตอนวิธีทางคณิตศาสตร์แบบกำหนดผลลัพธ์ล่วงหน้า
            (Deterministic Algorithm)
          </>
        }
        formula={
          <>
            x<sub>n+1</sub> = (<b>a</b>·x<sub>n</sub> + <b>c</b>) mod <b>m</b>
          </>
        }
        note={
          <DefinitionStatement
            given={
              <>
                ให้ <code>m</code> ∈ ℤ และ <code>m</code> ≥ 2 (เรียกว่ามอดุลัส) และให้ <code>a</code>, <code>c</code>,{' '}
                <code>x₀</code> ∈ ℤ โดยที่ 0 ≤ a, c, x₀ &lt; m
              </>
            }
            claim={
              <>
                <strong>ตัวสร้างเชิงเส้นสมภาค (LCG)</strong> นิยามลำดับ x<sub>0</sub>, x<sub>1</sub>, x<sub>2</sub>, …
                ด้วยความสัมพันธ์เวียนเกิดด้านบน คือนำพจน์ก่อนหน้ามาคูณ a บวก c แล้วหารเอาเศษด้วย m
              </>
            }
            restate={
              <>
                เนื่องจากค่าที่เป็นไปได้มีจำกัดเพียง m ค่า ลำดับนี้จึงต้อง<strong>วนกลับมาซ้ำ</strong>เสมอ
                ความยาวของช่วงก่อนเริ่มวนซ้ำเรียกว่าคาบ (period) — จึงเป็นการสุ่มเทียม ไม่ใช่การสุ่มจริง
              </>
            }
          />
        }
      />
      <VisualizerFrame
        headerExtra={
          <div className={styles.inputsRow}>
            <label className={styles.inputGroup}>
              a
              <input type="number" className={styles.numberInput} value={a} onChange={(e) => setA(clamp(Number(e.target.value), 1, 30))} />
            </label>
            <label className={styles.inputGroup}>
              c
              <input type="number" className={styles.numberInput} value={c} onChange={(e) => setC(clamp(Number(e.target.value), 0, 30))} />
            </label>
            <label className={styles.inputGroup}>
              m
              <input type="number" className={styles.numberInput} value={m} onChange={(e) => setM(clamp(Number(e.target.value), 2, 30))} />
            </label>
            <label className={styles.inputGroup}>
              seed x₀
              <input
                type="number"
                className={styles.numberInput}
                value={seed}
                onChange={(e) => setSeed(clamp(Number(e.target.value), 0, 30))}
              />
            </label>
          </div>
        }
        monitor={
          <ExecutionMonitor
            hint={`เดิน x บนนาฬิกา mod ${m} ด้วยสูตร (${a}x + ${c}) mod ${m} — กด ▶`}
            lines={monitorLines}
            badge={isPeriodFound ? `พบ period! วนกลับมาที่ ${current.value} ตอน x${current.index}` : undefined}
          />
        }
        footer={
          <StepController
            totalSteps={totalBeats}
            currentStep={beatIndex}
            mode={mode}
            onStepChange={setBeatIndex}
            onModeChange={setMode}
          />
        }
      >
        <div className={styles.canvas}>
          <ClockModulo modulus={m} value={current?.value ?? seed} size={180} />

          <div className={styles.sequenceRow}>
            {shownTerms.map((t) => (
              <span
                key={t.index}
                className={t.isRepeat ? `${styles.chip} ${styles.chipRepeat}` : t.index === 0 ? `${styles.chip} ${styles.chipSeed}` : styles.chip}
                title={`x${t.index} = ${t.value}`}
              >
                {t.value}
              </span>
            ))}
          </div>

          {isPeriodFound && (
            <p className={styles.periodNote}>
              ลำดับวนกลับมาที่ <strong>{current.value}</strong> อีกครั้งตอน x<sub>{current.index}</sub> — period ยาว{' '}
              <strong>{current.index}</strong> ก่อนวนซ้ำ
            </p>
          )}
        </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
