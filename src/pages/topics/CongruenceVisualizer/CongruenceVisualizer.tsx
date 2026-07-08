import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { SliderInput } from '@/components/widgets/SliderInput';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import styles from './CongruenceVisualizer.module.css';

const CLASS_PALETTE = ['#38bdf8', 'var(--color-success)', '#a78bfa', '#f472b6', '#fb923c', '#22d3ee', '#facc15', '#94a3b8', '#4ade80', '#f87171', '#60a5fa', '#c084fc'];
const NUMBERS_MAX = 30;
const BATCH = 5;

export function CongruenceVisualizer() {
  const [n, setN] = useState(4);
  const [picked, setPicked] = useState<number[]>([]);

  const numbers = useMemo(() => Array.from({ length: NUMBERS_MAX + 1 }, (_, i) => i), []);
  const placementBeats = Math.ceil(numbers.length / BATCH);

  // beats: setup, placement batches, bridge (why n | a−b), done
  const totalBeats = placementBeats + 3;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${n}`);

  const placedCount = Math.min(Math.max(beatIndex, 0) * BATCH, numbers.length);
  const isBridge = beatIndex === placementBeats + 1;
  const isDone = beatIndex >= placementBeats + 2;

  // bridge example: two smallest numbers in the busiest early bucket
  const bridgePair = useMemo(() => {
    const first = 1 % n;
    const lo = first + n <= NUMBERS_MAX ? first + n : first;
    return [lo, lo + n <= NUMBERS_MAX ? lo + n : lo];
  }, [n]);

  const buckets = useMemo(() => {
    const list: number[][] = Array.from({ length: n }, () => []);
    numbers.slice(0, placedCount).forEach((v) => list[v % n].push(v));
    return list;
  }, [numbers, placedCount, n]);

  const pick = (v: number) => {
    setPicked((prev) => {
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (prev.length >= 2) return [v];
      return [...prev, v];
    });
  };

  const pairCheck = useMemo(() => {
    if (picked.length !== 2) return null;
    const [x, y] = [Math.max(picked[0], picked[1]), Math.min(picked[0], picked[1])];
    const diff = x - y;
    const congruent = diff % n === 0;
    return { x, y, diff, k: diff / n, congruent };
  }, [picked, n]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = [];
    if (placedCount > 0) {
      lines.push({ text: `วางเลข 0–${placedCount - 1} ลงตามช่อง mod ${n} แล้ว` });
    }
    if (isBridge || isDone) {
      lines.push({
        swatchColor: CLASS_PALETTE[bridgePair[0] % n],
        text: `${bridgePair[1]} − ${bridgePair[0]} = ${bridgePair[1] - bridgePair[0]} = ${(bridgePair[1] - bridgePair[0]) / n} × ${n} → ${n} | ผลต่าง`,
        emphasis: true,
      });
    }
    if (isDone) {
      for (let r = 0; r < Math.min(n, 3); r++) {
        const members = buckets[r].slice(0, 4).join(', ');
        lines.push({ swatchColor: CLASS_PALETTE[r % CLASS_PALETTE.length], text: `class ${r} = {${members}, …}` });
      }
    }
    if (pairCheck) {
      lines.push({
        swatchColor: pairCheck.congruent ? 'var(--color-success)' : 'var(--color-danger)',
        text: pairCheck.congruent
          ? `${pairCheck.x} ≡ ${pairCheck.y} (mod ${n}) เพราะ ${pairCheck.diff} = ${pairCheck.k}×${n}`
          : `${pairCheck.x} ≢ ${pairCheck.y} (mod ${n}) เพราะ ${n} ∤ ${pairCheck.diff}`,
        emphasis: true,
      });
    }
    return lines;
  }, [placedCount, n, isBridge, isDone, bridgePair, buckets, pairCheck]);

  return (
    <VisualizerFrame
      title="Congruence — เลขบ้านเดียวกัน"
      headerExtra={
        <div className={styles.controls}>
          <SliderInput label="mod n" min={2} max={12} value={n} onChange={setN} />
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`เลข 0–${NUMBERS_MAX} กำลังจะบินไปหาบ้าน mod ${n} ของตัวเอง — กด ▶`}
          lines={monitorLines}
          badge={isDone ? `${n} classes — ทุกเลขมีบ้านเดียว` : undefined}
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
        <p className={styles.hintLine}>
          {isBridge
            ? `ทำไมถึง "บ้านเดียวกัน"? เพราะผลต่างเป็นจำนวนเท่าของ ${n} พอดี`
            : `กดเลข 2 ตัว (ช่องไหนก็ได้) เพื่อเช็คว่า congruent กันไหม`}
        </p>
        <div className={styles.buckets} style={{ '--bucket-count': n } as React.CSSProperties}>
          {buckets.map((members, r) => (
            <div key={r} className={styles.bucket}>
              <span className={styles.bucketLabel} style={{ background: CLASS_PALETTE[r % CLASS_PALETTE.length] }}>
                {r}
              </span>
              <div className={styles.bucketStack}>
                {members.map((v, i) => {
                  const isNew = beatIndex > 0 && v >= placedCount - BATCH;
                  const raised = isBridge && bridgePair.includes(v);
                  const selected = picked.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      className={`${styles.chip} ${raised ? styles.chipRaised : ''} ${selected ? styles.chipSelected : ''}`}
                      style={
                        {
                          '--chip-color': CLASS_PALETTE[r % CLASS_PALETTE.length],
                          '--chip-index': isNew ? i % BATCH : 0,
                        } as React.CSSProperties
                      }
                      onClick={() => pick(v)}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {pairCheck && (
          <p className={pairCheck.congruent ? `${styles.pairResult} ${styles.pairResultOk}` : `${styles.pairResult} ${styles.pairResultNo}`}>
            {pairCheck.congruent
              ? `${pairCheck.x} ≡ ${pairCheck.y} (mod ${n}) — ${pairCheck.x} − ${pairCheck.y} = ${pairCheck.diff} = ${pairCheck.k} × ${n}`
              : `${pairCheck.x} ≢ ${pairCheck.y} (mod ${n}) — ${pairCheck.x} − ${pairCheck.y} = ${pairCheck.diff} ไม่ใช่จำนวนเท่าของ ${n}`}
          </p>
        )}
      </div>
    </VisualizerFrame>
  );
}
