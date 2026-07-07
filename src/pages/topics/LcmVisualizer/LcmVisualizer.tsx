import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { BarCompare } from '@/components/widgets/BarCompare';
import { PredictReveal } from '@/components/widgets/PredictReveal';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { gcd, lcm, multiplesUntilLcm } from '@/utils/algorithms/euclidean';
import styles from './LcmVisualizer.module.css';

const VIEW_W = 100;
const VIEW_H = 34;
const LINE_A_Y = 10;
const LINE_B_Y = 24;
const MARGIN_X = 6;

function clampInput(v: number): number {
  if (Number.isNaN(v)) return 1;
  return Math.min(Math.max(Math.trunc(v), 1), 20);
}

export function LcmVisualizer() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(6);

  const entries = useMemo(() => multiplesUntilLcm(a, b), [a, b]);
  const theLcm = lcm(a, b);
  const theGcd = gcd(a, b);

  // beats: setup, one per multiple placed (last one = the meeting point), identity check
  const totalBeats = entries.length + 2;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${b}`);

  const placed = Math.min(beatIndex, entries.length);
  const metLcm = placed === entries.length;
  const isIdentity = beatIndex >= entries.length + 1;

  const toX = (v: number) => MARGIN_X + (v / theLcm) * (VIEW_W - MARGIN_X * 2);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = entries.slice(0, placed).map((e) => ({
      swatchColor: e.ofA && e.ofB ? 'var(--color-success)' : e.ofA ? '#38bdf8' : 'var(--color-secondary)',
      text:
        e.ofA && e.ofB
          ? `${e.value} — เจอกันครั้งแรก! (${e.value / a}×${a} และ ${e.value / b}×${b})`
          : e.ofA
            ? `${e.value} = ${e.value / a} × ${a}`
            : `${e.value} = ${e.value / b} × ${b}`,
      emphasis: e.ofA && e.ofB,
    }));
    if (isIdentity) {
      lines.push({
        emphasis: true,
        text: `a×b = ${a}×${b} = ${a * b} = gcd×lcm = ${theGcd}×${theLcm}`,
      });
    }
    return lines;
  }, [entries, placed, isIdentity, a, b, theGcd, theLcm]);

  return (
    <VisualizerFrame
      title="LCM — จุดนัดพบของตัวคูณ"
      headerExtra={
        <div className={styles.inputsRow}>
          <label className={styles.inputGroup}>
            a
            <input type="number" className={styles.numberInput} value={a} onChange={(e) => setA(clampInput(Number(e.target.value)))} />
          </label>
          <label className={styles.inputGroup}>
            b
            <input type="number" className={styles.numberInput} value={b} onChange={(e) => setB(clampInput(Number(e.target.value)))} />
          </label>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`รถไฟสองขบวน: ขบวน ${a} จอดทุก ${a} หน่วย, ขบวน ${b} จอดทุก ${b} หน่วย — กด ▶`}
          lines={monitorLines}
          badge={metLcm ? `LCM(${a}, ${b}) = ${theLcm}!` : undefined}
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
        {!metLcm && (
          <PredictReveal key={`${a}:${b}`} question={`ตัวคูณของ ${a} กับ ${b} จะเจอกันครั้งแรกที่เลขอะไร?`}>
            <p className={styles.predictAnswer}>
              เจอกันที่ <strong>{theLcm}</strong> — นั่นคือ LCM
            </p>
          </PredictReveal>
        )}

        <svg className={styles.stage} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="เส้นตัวคูณของ a และ b">
          <text className={styles.lineLabel} x={1} y={LINE_A_Y} dominantBaseline="middle">
            ×{a}
          </text>
          <text className={styles.lineLabel} x={1} y={LINE_B_Y} dominantBaseline="middle">
            ×{b}
          </text>
          <line className={styles.track} x1={MARGIN_X} y1={LINE_A_Y} x2={VIEW_W - MARGIN_X} y2={LINE_A_Y} />
          <line className={styles.track} x1={MARGIN_X} y1={LINE_B_Y} x2={VIEW_W - MARGIN_X} y2={LINE_B_Y} />

          {entries.slice(0, placed).map((e) => {
            const x = toX(e.value);
            const shared = e.ofA && e.ofB;
            return (
              <g key={e.value}>
                {shared && (
                  <>
                    <line className={styles.connector} x1={x} y1={LINE_A_Y} x2={x} y2={LINE_B_Y} />
                    <text className={styles.crown} x={x} y={LINE_A_Y - 5} textAnchor="middle">
                      👑
                    </text>
                  </>
                )}
                {e.ofA && (
                  <circle className={shared ? `${styles.dot} ${styles.dotShared}` : `${styles.dot} ${styles.dotA}`} cx={x} cy={LINE_A_Y} r={2.2}>
                    <title>{`${e.value / a} × ${a} = ${e.value}`}</title>
                  </circle>
                )}
                {e.ofB && (
                  <circle className={shared ? `${styles.dot} ${styles.dotShared}` : `${styles.dot} ${styles.dotB}`} cx={x} cy={LINE_B_Y} r={2.2}>
                    <title>{`${e.value / b} × ${b} = ${e.value}`}</title>
                  </circle>
                )}
                <text className={styles.dotLabel} x={x} y={VIEW_H - 1.5} textAnchor="middle">
                  {e.value}
                </text>
              </g>
            );
          })}
        </svg>

        {isIdentity && (
          <div className={styles.identity}>
            <p className={styles.identityTitle}>เช็คสูตร: a × b = gcd × lcm</p>
            <BarCompare labelA={`${a} × ${b}`} valueA={a * b} labelB={`${theGcd} × ${theLcm}`} valueB={theGcd * theLcm} />
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
