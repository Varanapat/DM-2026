import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { extGcdSteps } from '@/utils/algorithms/extendedEuclidean';
import styles from './ExtendedEuclideanVisualizer.module.css';

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.min(Math.max(Math.trunc(v), lo), hi);
}

function signed(y: number): string {
  return y < 0 ? `− ${Math.abs(y)}` : `+ ${y}`;
}

export function ExtendedEuclideanVisualizer() {
  const [a, setA] = useState(240);
  const [b, setB] = useState(46);
  const [tryX, setTryX] = useState('');
  const [tryY, setTryY] = useState('');

  const trace = useMemo(() => extGcdSteps(a, b), [a, b]);
  const { forward, back, gcd, x, y } = trace;
  const A = Math.max(a, b);
  const B = Math.min(a, b);

  // beats: setup, one per forward row, pivot, one per back row, finale
  const totalBeats = 1 + forward.length + 1 + back.length + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${b}`);

  const forwardDone = Math.min(Math.max(beatIndex, 0), forward.length);
  const pivotReached = beatIndex >= forward.length + 1;
  const backDone = Math.min(Math.max(beatIndex - forward.length - 1, 0), back.length);
  const isFinale = beatIndex >= totalBeats - 1;

  const activeBack = backDone > 0 ? back[backDone - 1] : null;

  const tryCheck = useMemo(() => {
    if (tryX === '' || tryY === '') return null;
    const xi = Number(tryX);
    const yi = Number(tryY);
    if (Number.isNaN(xi) || Number.isNaN(yi)) return null;
    const value = A * xi + B * yi;
    return { value, ok: value === gcd };
  }, [tryX, tryY, A, B, gcd]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = forward.slice(0, forwardDone).map((row) => ({
      swatchColor: '#38bdf8',
      text: `${row.a} = ${row.quotient} × ${row.b} + ${row.remainder}`,
    }));
    if (pivotReached) {
      lines.push({ emphasis: true, swatchColor: 'var(--color-secondary)', text: `gcd = ${gcd} — ทีนี้ย้อนกลับขึ้นไป` });
    }
    back.slice(0, backDone).forEach((row) => {
      lines.push({
        swatchColor: '#a78bfa',
        text: `${gcd} = ${row.x} × ${row.a} ${signed(row.y)} × ${row.b}`,
      });
    });
    if (isFinale) {
      lines.push({
        emphasis: true,
        swatchColor: 'var(--color-success)',
        text: `${A}×(${x}) + ${B}×(${y}) = ${A * x + B * y} ✓`,
      });
    }
    return lines;
  }, [forward, forwardDone, pivotReached, back, backDone, isFinale, gcd, A, B, x, y]);

  return (
    <VisualizerFrame
      title="Extended Euclidean — ย้อนรอยหา x, y"
      headerExtra={
        <div className={styles.inputsRow}>
          <label className={styles.inputGroup}>
            a
            <input type="number" className={styles.numberInput} value={a} onChange={(e) => setA(clamp(Number(e.target.value), 1, 240))} />
          </label>
          <label className={styles.inputGroup}>
            b
            <input type="number" className={styles.numberInput} value={b} onChange={(e) => setB(clamp(Number(e.target.value), 1, 240))} />
          </label>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`เดินหน้า: หาร ${A} ด้วย ${B} ซ้ำ ๆ จนเจอ gcd แล้วค่อย "ย้อนกลับ" ไล่หา x, y — กด ▶`}
          lines={monitorLines}
          badge={isFinale ? `${A}x + ${B}y = ${gcd} โดย x=${x}, y=${y}` : undefined}
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
        <div className={styles.tableCard}>
          <p className={styles.tableTitle}>เฟสเดินหน้า (Euclidean)</p>
          <div className={styles.forwardTable}>
            {forward.slice(0, forwardDone).map((row, i) => {
              const isSource = activeBack !== null && row.a === activeBack.a && row.b === activeBack.b;
              return (
                <div key={i} className={isSource ? `${styles.forwardRow} ${styles.forwardRowSource}` : styles.forwardRow}>
                  {row.a} = {row.quotient} × {row.b} + <strong className={row.remainder === gcd && pivotReached ? styles.gcdMark : undefined}>{row.remainder}</strong>
                </div>
              );
            })}
            {forwardDone === 0 && <p className={styles.tableHint}>ยังไม่เริ่ม</p>}
          </div>
        </div>

        {pivotReached && back.length > 0 && (
          <div className={styles.backCard}>
            <p className={styles.tableTitle}>เฟสย้อนกลับ (back-substitution)</p>
            <div className={styles.backStack}>
              {back.slice(0, backDone).map((row, i) => (
                <div key={i} className={i === backDone - 1 ? `${styles.backRow} ${styles.backRowActive}` : styles.backRow}>
                  <span className={styles.backArrow}>{i === 0 ? '↰' : '↑'}</span>
                  <span className={styles.backEq}>
                    {gcd} = <strong className={styles.coefX}>{row.x}</strong>×{row.a} <strong className={styles.coefY}>{signed(row.y)}</strong>×{row.b}
                  </span>
                </div>
              ))}
              {backDone === 0 && <p className={styles.tableHint}>เริ่มจากแถวที่ให้ gcd แล้วแทนค่าขึ้นไปทีละแถว</p>}
            </div>
            {backDone > 0 && (
              <div className={styles.trackerRow}>
                <span className={styles.trackerChip}>x = {back[backDone - 1].x}</span>
                <span className={styles.trackerChip}>y = {back[backDone - 1].y}</span>
                <span className={styles.trackerFor}>
                  สำหรับคู่ ({back[backDone - 1].a}, {back[backDone - 1].b})
                </span>
              </div>
            )}
          </div>
        )}

        {isFinale && (
          <div className={styles.tryCard}>
            <p className={styles.tableTitle}>ลองเอง: หา x, y ของคู่เดิมด้วยวิธีคุณ แล้วเช็ค</p>
            <div className={styles.tryRow}>
              <span className={styles.tryEq}>
                {A}·x + {B}·y = {gcd} เมื่อ x =
              </span>
              <input className={styles.tryInput} value={tryX} onChange={(e) => setTryX(e.target.value)} placeholder="x" />
              <span className={styles.tryEq}>y =</span>
              <input className={styles.tryInput} value={tryY} onChange={(e) => setTryY(e.target.value)} placeholder="y" />
            </div>
            {tryCheck && (
              <p className={tryCheck.ok ? styles.tryOk : styles.tryNo}>
                {A}×({tryX}) + {B}×({tryY}) = {tryCheck.value} {tryCheck.ok ? '✓ ใช้ได้! (คำตอบมีได้หลายชุด)' : `≠ ${gcd} — ยังไม่ใช่`}
              </p>
            )}
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
