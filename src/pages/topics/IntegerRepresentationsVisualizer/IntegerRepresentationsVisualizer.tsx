import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { baseConversionSteps, digitChar, digitsToString } from '@/utils/algorithms/baseConversion';
import styles from './IntegerRepresentationsVisualizer.module.css';

const BASE_CHOICES = [2, 8, 16];
const BASE_LABEL: Record<number, string> = { 2: 'Binary', 8: 'Octal', 16: 'Hex' };

function clampN(v: number): number {
  if (Number.isNaN(v)) return 0;
  return Math.min(Math.max(Math.trunc(v), 0), 999);
}

export function IntegerRepresentationsVisualizer() {
  const [n, setN] = useState(156);
  const [base, setBase] = useState(2);

  const steps = useMemo(() => baseConversionSteps(n, base), [n, base]);
  const result = useMemo(() => digitsToString(steps), [steps]);

  // beats: one per division step, final beat = assembled answer
  const totalBeats = steps.length + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${n}:${base}`);

  const shown = Math.min(beatIndex, steps.length);
  const isFinal = beatIndex >= steps.length;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = steps.slice(0, shown).map((s) => ({
      swatchColor: 'var(--color-accent)',
      text: `${s.dividend} = ${base} × ${s.quotient} + ${s.remainder} → หลัก ${digitChar(s.remainder)}`,
    }));
    if (isFinal) {
      lines.push({ emphasis: true, text: `${n} (ฐาน 10) = ${result} (ฐาน ${base})` });
    }
    return lines;
  }, [steps, shown, base, isFinal, n, result]);

  return (
    <TopicPageStack>
      <DefinitionCard
        formula={
          <>
            <b>n</b> = <b>b</b>·q₀ + a₀ , &nbsp;q₀ = <b>b</b>·q₁ + a₁ , &nbsp;...
          </>
        }
        note={
          <>
            แทนจำนวนเต็มในฐานอื่นทำได้ด้วยการหาร <code>n</code> ด้วยฐาน <code>b</code> ซ้ำ ๆ แล้วเก็บเศษไว้ทีละหลัก
            ลองนึกภาพหารตัวตั้งด้วยฐานไปเรื่อย ๆ จนตัวตั้งเหลือ 0 — เศษที่ได้ทีละรอบคือหลักของคำตอบ แต่ต้อง
            <strong>อ่านย้อนกลับ</strong> จากรอบสุดท้ายไปรอบแรก เพราะรอบแรกให้หลักที่มีค่าน้อยที่สุด
          </>
        }
      />
      <VisualizerFrame
        headerExtra={
          <div className={styles.header}>
            <label className={styles.inputGroup}>
              n (ฐาน 10)
              <input
                type="number"
                className={styles.numberInput}
                value={n}
                onChange={(e) => setN(clampN(Number(e.target.value)))}
              />
            </label>
            <div className={styles.chipRow}>
              <span className={styles.chipLabel}>แปลงเป็นฐาน</span>
              {BASE_CHOICES.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={b === base ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                  onClick={() => setBase(b)}
                >
                  {b} ({BASE_LABEL[b]})
                </button>
              ))}
            </div>
          </div>
        }
        monitor={
          <ExecutionMonitor
            hint={`หาร ${n} ด้วย ${base} ซ้ำ ๆ จนเหลือ 0 — กด ▶`}
            lines={monitorLines}
            badge={isFinal ? `${n} = ${result} ในฐาน ${base}` : undefined}
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
          <div className={styles.table}>
            {steps.slice(0, shown).map((s, i) => (
              <div key={i} className={styles.row}>
                <span className={styles.eq}>
                  {s.dividend} = {base} × <strong>{s.quotient}</strong> + <strong className={styles.remainder}>{s.remainder}</strong>
                </span>
                <span className={styles.digitTag}>
                  หลักที่ {i + 1}: {digitChar(s.remainder)}
                </span>
              </div>
            ))}
          </div>

          {isFinal && (
            <div className={styles.resultPanel}>
              <p className={styles.resultTitle}>อ่านย้อนกลับ (รอบสุดท้าย → รอบแรก)</p>
              <div className={styles.digitsRow}>
                {steps
                  .slice()
                  .reverse()
                  .map((s, i) => (
                    <span key={i} className={styles.digitChip}>
                      {digitChar(s.remainder)}
                    </span>
                  ))}
              </div>
              <p className={styles.resultEq}>
                {n}<sub>10</sub> = {result}<sub>{base}</sub>
              </p>
            </div>
          )}
        </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
