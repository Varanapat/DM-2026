import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { CodeSyncPanel } from '@/components/widgets/CodeSyncPanel';
import { BarCompare } from '@/components/widgets/BarCompare';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { modPowSteps } from '@/utils/algorithms/modular';
import styles from './FastModExpVisualizer.module.css';

const CODE_LINES = [
  'result = 1',
  'for bit in bits(e):   # MSB → LSB',
  '    result = result² mod n',
  '    if bit == 1:',
  '        result = result × a mod n',
  'return result',
];

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.min(Math.max(Math.trunc(v), lo), hi);
}

export function FastModExpVisualizer() {
  const [a, setA] = useState(3);
  const [e, setE] = useState(13);
  const [n, setN] = useState(7);

  const { bits, steps, result } = useMemo(() => modPowSteps(a, e, n), [a, e, n]);

  // beats: setup (binary decomposition), one per bit, result, naive-vs-fast race
  const totalBeats = bits.length + 3;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${e}:${n}`);

  const bitsDone = Math.min(Math.max(beatIndex - 1, 0), bits.length);
  const activeBit = beatIndex >= 1 && beatIndex <= bits.length ? beatIndex - 1 : null;
  const isResult = beatIndex >= bits.length + 1;
  const isRace = beatIndex >= bits.length + 2;

  const currentStep = activeBit !== null ? steps[activeBit] : null;
  const registerValue = bitsDone === 0 ? 1 % n : steps[bitsDone - 1].result;

  const activeCodeLine = currentStep === null ? (isResult ? 5 : 0) : currentStep.bit === 1 ? 4 : 2;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = steps.slice(0, bitsDone).map((s) => ({
      swatchColor: s.bit === 1 ? 'var(--color-success)' : '#94a3b8',
      text:
        s.squared === null
          ? s.bit === 1
            ? `bit=1: result = 1 × ${a % n} = ${s.result}`
            : `bit=0: result = 1`
          : s.bit === 1
            ? `bit=1: (${s.squared === s.result ? '' : ''}result² = ${s.squared}) × ${a % n} mod ${n} = ${s.result}`
            : `bit=0: result² mod ${n} = ${s.result} (ไม่คูณ a)`,
    }));
    if (isResult) {
      lines.push({ emphasis: true, text: `${a}^${e} mod ${n} = ${result}` });
    }
    if (isRace) {
      lines.push({
        emphasis: true,
        swatchColor: 'var(--color-success)',
        text: `naive คูณ ${e} ครั้ง vs fast ${bits.length} ขั้น (log₂)`,
      });
    }
    return lines;
  }, [steps, bitsDone, a, e, n, result, isResult, isRace, bits.length]);

  return (
    <VisualizerFrame
      title="Fast Modular Exponentiation — Square & Multiply"
      headerExtra={
        <div className={styles.inputsRow}>
          <label className={styles.inputGroup}>
            a
            <input type="number" className={styles.numberInput} value={a} onChange={(ev) => setA(clamp(Number(ev.target.value), 2, 12))} />
          </label>
          <label className={styles.inputGroup}>
            e
            <input type="number" className={styles.numberInput} value={e} onChange={(ev) => setE(clamp(Number(ev.target.value), 1, 64))} />
          </label>
          <label className={styles.inputGroup}>
            mod n
            <input type="number" className={styles.numberInput} value={n} onChange={(ev) => setN(clamp(Number(ev.target.value), 2, 50))} />
          </label>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`e = ${e} = ${e.toString(2)}₂ — เลขฐานสองของ e คือตัวบทของอัลกอริทึม กด ▶`}
          lines={monitorLines}
          badge={isResult ? `${a}^${e} mod ${n} = ${result}` : undefined}
        />
      }
      footer={
        <StepController
          totalSteps={totalBeats}
          currentStep={beatIndex}
          mode={mode}
          onStepChange={setBeatIndex}
          onModeChange={setMode}
          showReset={false}
        />
      }
    >
      <div className={styles.canvas}>
        <div className={styles.bitStrip}>
          <span className={styles.bitStripLabel}>
            e = {e} = <span className={styles.bitStripBinary}>{beatIndex === 0 ? '?' : e.toString(2)}</span>₂
          </span>
          <div className={styles.bitRow}>
            {bits.map((bit, i) => {
              const done = i < bitsDone;
              const active = i === activeBit;
              return (
                <span
                  key={i}
                  className={`${styles.bitChip} ${bit === 1 ? styles.bitOne : styles.bitZero} ${active ? styles.bitActive : ''} ${!done && !active && beatIndex > 0 ? styles.bitPending : ''} ${beatIndex === 0 ? styles.bitHidden : ''}`}
                  style={{ '--bit-index': i } as React.CSSProperties}
                  title={`bit นี้แทน ${a}^${2 ** (bits.length - 1 - i)}`}
                >
                  {bit}
                </span>
              );
            })}
          </div>
        </div>

        <div className={styles.machineRow}>
          <div className={styles.registers}>
            <div className={`${styles.register} ${currentStep?.bit === 1 || currentStep?.squared !== null ? styles.registerActive : ''}`}>
              <span className={styles.registerLabel}>result</span>
              <span className={isResult ? `${styles.registerValue} ${styles.registerValueDone}` : styles.registerValue}>{registerValue}</span>
            </div>
            <div className={`${styles.arrow} ${currentStep?.bit === 1 ? styles.arrowFire : styles.arrowIdle}`}>
              {currentStep?.bit === 1 ? '× a ↗' : currentStep ? '(ข้าม)' : ''}
            </div>
            <div className={styles.register}>
              <span className={styles.registerLabel}>base a</span>
              <span className={styles.registerValue}>{a % n}</span>
            </div>
          </div>

          <CodeSyncPanel lines={CODE_LINES} activeLine={activeCodeLine} />
        </div>

        {bitsDone > 0 && (
          <div className={styles.bitTable}>
            <span className={styles.bitTableHead}>bit</span>
            <span className={styles.bitTableHead}>ทำอะไร</span>
            <span className={styles.bitTableHead}>result</span>
            {steps.slice(0, bitsDone).map((s, i) => (
              <div key={i} className={styles.bitTableRow}>
                <span className={s.bit === 1 ? styles.bitCellOne : styles.bitCellZero}>{s.bit}</span>
                <span>{s.squared === null ? (s.bit === 1 ? 'ตั้งต้น ×a' : 'ตั้งต้น') : s.bit === 1 ? 'ยกกำลังสอง แล้ว ×a' : 'ยกกำลังสองอย่างเดียว'}</span>
                <span className={styles.bitCellResult}>{s.result}</span>
              </div>
            ))}
          </div>
        )}

        {isRace && (
          <div className={styles.race}>
            <p className={styles.raceTitle}>จำนวนการคูณ: naive vs fast</p>
            <BarCompare labelA={`naive (${e})`} valueA={e} labelB={`fast (${bits.length})`} valueB={bits.length} maxValue={e} />
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
