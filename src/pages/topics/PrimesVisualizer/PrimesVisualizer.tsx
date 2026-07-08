import { useEffect, useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { isPrime } from '@/utils/algorithms/factorization';
import styles from './PrimesVisualizer.module.css';

const VIEW_W = 100;
const VIEW_H = 56;
const MARGIN = 6;

function clampN(v: number): number {
  if (Number.isNaN(v)) return 2;
  return Math.min(Math.max(Math.trunc(v), 2), 100);
}

interface Arrangement {
  rows: number;
  cols: number;
  exact: boolean;
}

/** candidate heights 1..⌊√n⌋ — the trial-division story as rectangles */
function arrangements(n: number): Arrangement[] {
  const list: Arrangement[] = [{ rows: 1, cols: n, exact: true }];
  for (let h = 2; h * h <= n; h++) {
    list.push({ rows: h, cols: Math.ceil(n / h), exact: n % h === 0 });
  }
  return list;
}

export function PrimesVisualizer() {
  const [n, setN] = useState(12);
  const [guess, setGuess] = useState<'prime' | 'composite' | null>(null);
  const [streak, setStreak] = useState(0);
  const [scored, setScored] = useState(false);

  const candidates = useMemo(() => arrangements(n), [n]);
  const prime = useMemo(() => isPrime(n), [n]);

  // beats: one per arrangement (first = setup 1×n), then verdict
  const totalBeats = candidates.length + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${n}`);

  const currentIdx = Math.min(beatIndex, candidates.length - 1);
  const current = candidates[currentIdx];
  const isVerdict = beatIndex >= candidates.length;

  useEffect(() => {
    if (isVerdict && guess !== null && !scored) {
      setScored(true);
      setStreak((s) => ((guess === 'prime') === prime ? s + 1 : 0));
    }
  }, [isVerdict, guess, scored, prime]);

  const gallery = useMemo(
    () => candidates.slice(0, isVerdict ? candidates.length : currentIdx + 1).filter((c) => c.exact),
    [candidates, currentIdx, isVerdict],
  );

  // dot layout for the current arrangement
  const layout = useMemo(() => {
    const { rows, cols } = current;
    const cell = Math.min((VIEW_W - MARGIN * 2) / cols, (VIEW_H - MARGIN * 2) / rows, 6);
    const x0 = (VIEW_W - cols * cell) / 2;
    const y0 = (VIEW_H - rows * cell) / 2;
    return Array.from({ length: n }, (_, i) => ({
      x: x0 + (i % cols) * cell + cell / 2,
      y: y0 + Math.floor(i / cols) * cell + cell / 2,
      r: Math.max(cell * 0.32, 0.8),
    }));
  }, [current, n]);

  // dots in the final (incomplete) column of a non-exact arrangement glow red
  const overflowSet = useMemo(() => {
    const set = new Set<number>();
    if (!current.exact) {
      const fullRows = Math.floor(n / current.cols);
      for (let i = fullRows * current.cols; i < n; i++) set.add(i);
    }
    return set;
  }, [current, n]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const upTo = isVerdict ? candidates.length : currentIdx + 1;
    const lines: MonitorLine[] = candidates.slice(1, upTo).map((c) => ({
      swatchColor: c.exact ? 'var(--color-success)' : 'var(--color-danger)',
      text: c.exact ? `${n} ÷ ${c.rows} = ${n / c.rows} — ลงตัว! ได้สี่เหลี่ยม ${c.rows}×${n / c.rows}` : `${n} ÷ ${c.rows} — ไม่ลงตัว`,
    }));
    if (isVerdict) {
      lines.push({
        emphasis: true,
        text: prime
          ? `จัดได้แบบเดียวคือ 1×${n} → จำนวนเฉพาะ`
          : `จัดได้ ${gallery.length} แบบ → ไม่ใช่จำนวนเฉพาะ`,
      });
    }
    return lines;
  }, [candidates, currentIdx, isVerdict, n, prime, gallery.length]);

  const changeN = (value: number) => {
    setN(value);
    setGuess(null);
    setScored(false);
  };

  return (
    <VisualizerFrame
      title="Prime or Not?"
      headerExtra={
        <div className={styles.headerRow}>
          <label className={styles.inputGroup}>
            n
            <input type="number" className={styles.numberInput} value={n} onChange={(e) => changeN(clampN(Number(e.target.value)))} />
          </label>
          <button type="button" className={styles.randomBtn} onClick={() => changeN(2 + Math.floor(Math.random() * 99))}>
            🎲 สุ่มเลขใหม่
          </button>
          {!isVerdict && (
            <div className={styles.guessRow}>
              <span className={styles.guessLabel}>ทายก่อน:</span>
              <button
                type="button"
                className={guess === 'prime' ? `${styles.guessBtn} ${styles.guessBtnActive}` : styles.guessBtn}
                onClick={() => setGuess('prime')}
              >
                Prime
              </button>
              <button
                type="button"
                className={guess === 'composite' ? `${styles.guessBtn} ${styles.guessBtnActive}` : styles.guessBtn}
                onClick={() => setGuess('composite')}
              >
                Composite
              </button>
            </div>
          )}
          {isVerdict && guess !== null && (
            <span className={(guess === 'prime') === prime ? styles.guessResultRight : styles.guessResultWrong}>
              {(guess === 'prime') === prime ? `ทายถูก! 🔥 streak ${streak}` : 'ยังไม่ใช่ ลองเลขต่อไป'}
            </span>
          )}
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`${n} จุด เริ่มจากแถวเดียว 1×${n} — กด ▶ เพื่อลองจัดสี่เหลี่ยมทุกแบบ`}
          lines={monitorLines}
          badge={isVerdict ? (prime ? `${n} เป็น PRIME ✨` : `${n} เป็น COMPOSITE`) : undefined}
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
        <p className={styles.arrangementLabel}>
          {isVerdict
            ? prime
              ? `ไม่มีสี่เหลี่ยมอื่นนอกจาก 1×${n}`
              : `สี่เหลี่ยมที่จัดได้ทั้งหมด`
            : currentIdx === 0
              ? `จัดแบบพื้นฐาน: 1×${n}`
              : `ลองจัด ${current.rows} แถว`}
        </p>
        <svg className={styles.stage} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="จัดเรียงจุดเป็นสี่เหลี่ยม">
          {layout.map((dot, i) => (
            <circle
              key={i}
              className={overflowSet.has(i) ? `${styles.dot} ${styles.dotOverflow}` : isVerdict && prime ? `${styles.dot} ${styles.dotGold}` : styles.dot}
              style={{ transform: `translate(${dot.x}px, ${dot.y}px)` } as React.CSSProperties}
              r={dot.r}
            />
          ))}
        </svg>

        {gallery.length > 0 && (
          <div className={styles.gallery}>
            <p className={styles.galleryTitle}>จัดได้พอดี ({gallery.length} แบบ)</p>
            <div className={styles.galleryRow}>
              {gallery.map((g) => (
                <div key={g.rows} className={styles.galleryItem}>
                  <div
                    className={styles.galleryRect}
                    style={{ aspectRatio: `${g.cols} / ${g.rows}`, width: g.cols >= g.rows ? 72 : 72 * (g.cols / g.rows) }}
                  />
                  <span className={styles.galleryLabel}>
                    {g.rows}×{n / g.rows}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
