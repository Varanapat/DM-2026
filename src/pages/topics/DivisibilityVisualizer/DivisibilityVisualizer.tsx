import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState } from '@/components/widgets/NumberGrid';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import styles from './DivisibilityVisualizer.module.css';

const GRID_MAX = 60;

function clampA(v: number): number {
  if (Number.isNaN(v)) return 1;
  return Math.min(Math.max(Math.trunc(v), 1), 12);
}

function clampB(v: number): number {
  if (Number.isNaN(v)) return 1;
  return Math.min(Math.max(Math.trunc(v), 1), GRID_MAX);
}

export function DivisibilityVisualizer() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(14);

  const quotient = Math.floor(b / a);
  const remainder = b % a;
  const divisible = remainder === 0;

  // beats: setup, one per filled row, verdict
  const totalBeats = quotient + 2;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${b}`);

  const filledRows = Math.min(beatIndex, quotient); // rows visible so far
  const isVerdict = beatIndex >= quotient + 1;

  const dots = useMemo(
    () =>
      Array.from({ length: b }, (_, i) => {
        const row = Math.floor(i / a);
        const isLeftover = row >= quotient;
        return { index: i, row, col: i % a, isLeftover };
      }),
    [a, b, quotient],
  );

  const gridCellStates = useMemo(() => {
    const map: Record<number, CellState> = {};
    for (let m = a; m <= GRID_MAX; m += a) map[m] = 'success';
    map[b] = divisible ? 'gold' : 'current';
    return map;
  }, [a, b, divisible]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = Array.from({ length: filledRows }, (_, k) => ({
      swatchColor: 'var(--color-accent)',
      text: `แถวที่ ${k + 1}: ${a} × ${k + 1} = ${a * (k + 1)}`,
    }));
    if (isVerdict) {
      lines.push({
        text: `${b} = ${a} × ${quotient} + ${remainder}`,
        emphasis: true,
        swatchColor: divisible ? 'var(--color-success)' : 'var(--color-danger)',
      });
    }
    return lines;
  }, [filledRows, isVerdict, a, b, quotient, remainder, divisible]);

  return (
    <VisualizerFrame
      title="Divisibility Visualizer"
      headerExtra={
        <div className={styles.inputsRow}>
          <label className={styles.inputGroup}>
            ตัวหาร a
            <input type="number" className={styles.numberInput} value={a} onChange={(e) => setA(clampA(Number(e.target.value)))} />
          </label>
          <label className={styles.inputGroup}>
            ตัวตั้ง b
            <input type="number" className={styles.numberInput} value={b} onChange={(e) => setB(clampB(Number(e.target.value)))} />
          </label>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`แบ่ง ${b} ออกเป็นแถวละ ${a} — กด ▶ เพื่อเริ่มจัดแถว`}
          lines={monitorLines}
          badge={isVerdict && divisible ? `${a} | ${b} — หารลงตัว!` : undefined}
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
        <div className={styles.tray} style={{ '--cols': a } as React.CSSProperties}>
          {dots.map((dot) => {
            const rowFilled = dot.row < filledRows;
            const isNewRow = dot.row === filledRows - 1;
            const leftoverVisible = isVerdict && dot.isLeftover;
            const cls = leftoverVisible
              ? `${styles.dot} ${styles.dotLeftover}`
              : rowFilled
                ? `${styles.dot} ${styles.dotFilled}`
                : `${styles.dot} ${styles.dotPending}`;
            return (
              <span
                key={dot.index}
                className={cls}
                style={{ '--dot-index': isNewRow || leftoverVisible ? dot.col : 0 } as React.CSSProperties}
                title={`แถวที่ ${dot.row + 1}`}
              />
            );
          })}
        </div>

        {isVerdict && !divisible && (
          <p className={styles.verdictText}>
            เหลือเศษ <strong>{remainder}</strong> จุด — จัดแถวละ {a} ไม่ลงตัว ({a} ∤ {b})
          </p>
        )}

        <div className={styles.gridSection}>
          <p className={styles.gridLabel}>ตัวคูณของ {a} (กดเลขเพื่อเปลี่ยนตัวตั้ง b)</p>
          <NumberGrid max={GRID_MAX} cellStates={gridCellStates} onCellClick={(v) => setB(v)} compact />
        </div>
      </div>
    </VisualizerFrame>
  );
}
