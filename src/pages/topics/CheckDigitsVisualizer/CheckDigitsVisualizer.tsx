import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { upcCheckDigitSteps, computeUpcCheckDigit } from '@/utils/algorithms/checkDigit';
import styles from './CheckDigitsVisualizer.module.css';

const DEFAULT_DIGITS = [0, 3, 6, 0, 0, 0, 2, 9, 1, 4, 5];

export function CheckDigitsVisualizer() {
  const [digits, setDigits] = useState<number[]>(DEFAULT_DIGITS);

  const steps = useMemo(() => upcCheckDigitSteps(digits), [digits]);
  const checkDigit = useMemo(() => computeUpcCheckDigit(digits), [digits]);

  // beats: one per digit's weighted product, final beat = sum + check digit
  const totalBeats = steps.length + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, digits.join(''));

  const shown = Math.min(beatIndex, steps.length);
  const isFinal = beatIndex >= steps.length;
  const runningSum = steps.slice(0, shown).reduce((acc, s) => acc + s.product, 0);

  const bumpDigit = (index: number) => {
    setDigits((prev) => prev.map((d, i) => (i === index ? (d + 1) % 10 : d)));
  };

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = steps.slice(0, shown).map((s) => ({
      swatchColor: s.weight === 3 ? 'var(--color-accent)' : 'var(--color-secondary)',
      text: `หลักที่ ${s.position}: ${s.digit} × ${s.weight} = ${s.product}`,
    }));
    if (isFinal) {
      lines.push({
        emphasis: true,
        text: `ผลรวม = ${runningSum} → check digit = (10 − ${runningSum} mod 10) mod 10 = ${checkDigit}`,
      });
    }
    return lines;
  }, [steps, shown, isFinal, runningSum, checkDigit]);

  return (
    <TopicPageStack>
      <DefinitionCard
        formula={
          <>
            3·(d1+d3+...+d11) + (d2+d4+...+d10) + <b>check</b> ≡ 0 (mod 10)
          </>
        }
        note={
          <>
            เลขตรวจสอบ (check digit) คำนวณจากตัวเลขอื่นในรหัสด้วยผลรวมถ่วงน้ำหนัก mod 10 ลองนึกภาพบาร์โค้ด UPC เอา
            <strong>หลักคี่คูณ 3 หลักคู่คูณ 1</strong> แล้วบวกกันทั้งหมด ถ้าผลรวม mod 10 ไม่เท่ากับเลขตรวจสอบที่พิมพ์ไว้
            แปลว่ามีที่พิมพ์ผิดแน่นอน — ลองกดตัวเลขด้านล่างเพื่อ "พิมพ์ผิด" แล้วดู <code>check digit</code> เปลี่ยน
          </>
        }
      />
      <VisualizerFrame
        headerExtra={<p className={styles.hint}>กดตัวเลขในบาร์โค้ดเพื่อสลับค่า (จำลองพิมพ์ผิด)</p>}
        monitor={
          <ExecutionMonitor
            hint="คูณแต่ละหลักด้วยน้ำหนัก 3 หรือ 1 สลับกัน แล้วรวมทั้งหมด — กด ▶"
            lines={monitorLines}
            badge={isFinal ? `check digit = ${checkDigit}` : undefined}
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
          <div className={styles.barcodeRow}>
            {digits.map((d, i) => {
              const active = i === shown - 1 && !isFinal;
              const done = i < shown;
              return (
                <div key={i} className={styles.digitBlock}>
                  <button
                    type="button"
                    className={active ? `${styles.digitBtn} ${styles.digitBtnActive}` : done ? `${styles.digitBtn} ${styles.digitBtnDone}` : styles.digitBtn}
                    onClick={() => bumpDigit(i)}
                  >
                    {d}
                  </button>
                  <span className={styles.weightTag}>×{i % 2 === 0 ? 3 : 1}</span>
                </div>
              );
            })}
            <div className={styles.digitBlock}>
              <span className={isFinal ? `${styles.digitBtn} ${styles.checkDigit}` : `${styles.digitBtn} ${styles.checkDigitPending}`}>
                {isFinal ? checkDigit : '?'}
              </span>
              <span className={styles.weightTag}>check</span>
            </div>
          </div>

          <p className={styles.sumReadout}>
            ผลรวมสะสม: <strong>{runningSum}</strong>
          </p>
        </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
