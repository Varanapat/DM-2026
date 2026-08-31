import { useEffect, useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { isPrime } from '@/utils/algorithms/factorization';
import { primesUpTo } from '@/utils/algorithms/sieve';
import styles from './PrimesVisualizer.module.css';

const VIEW_W = 100;
const VIEW_H = 56;
const MARGIN = 6;

function clampN(v: number): number {
  if (Number.isNaN(v)) return 2;
  return Math.min(Math.max(Math.trunc(v), 2), 100);
}

interface TrialStep {
  prime: number;
  divides: boolean;
}

interface Arrangement {
  rows: number;
  cols: number;
  exact: boolean;
}

/** Trial division using only prime candidates ≤ √n — stops at the first
 * divisor found (composite), or exhausts the list (prime). */
function trialDivisionSteps(n: number, testPrimes: number[]): TrialStep[] {
  const steps: TrialStep[] = [];
  for (const p of testPrimes) {
    const divides = n % p === 0;
    steps.push({ prime: p, divides });
    if (divides) break;
  }
  return steps;
}

export function PrimesVisualizer() {
  const [n, setN] = useState(12);
  const [guess, setGuess] = useState<'prime' | 'composite' | null>(null);
  const [streak, setStreak] = useState(0);
  const [scored, setScored] = useState(false);

  const prime = useMemo(() => isPrime(n), [n]);
  const sqrtN = Math.sqrt(n);
  const limit = Math.floor(sqrtN);
  const testPrimes = useMemo(() => primesUpTo(limit), [limit]);
  const steps = useMemo(() => trialDivisionSteps(n, testPrimes), [n, testPrimes]);
  const foundDivisor = steps.find((s) => s.divides);

  // beats: 0 = √n calculation, 1..steps.length = one per prime test, last = verdict
  const totalBeats = steps.length + 2;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${n}`);

  const isSqrtBeat = beatIndex === 0;
  const isVerdict = beatIndex >= steps.length + 1;
  const stepsShown = isSqrtBeat ? 0 : isVerdict ? steps.length : beatIndex;
  const currentStep = !isSqrtBeat && !isVerdict ? steps[beatIndex - 1] : undefined;

  useEffect(() => {
    if (isVerdict && guess !== null && !scored) {
      setScored(true);
      setStreak((s) => ((guess === 'prime') === prime ? s + 1 : 0));
    }
  }, [isVerdict, guess, scored, prime]);

  // the rectangle currently on stage: 1×n while computing √n or once confirmed
  // prime, the found factor pair once composite, otherwise the prime being tested
  const arrangement: Arrangement = useMemo(() => {
    if (isVerdict) {
      return foundDivisor ? { rows: foundDivisor.prime, cols: n / foundDivisor.prime, exact: true } : { rows: 1, cols: n, exact: true };
    }
    if (currentStep) {
      return {
        rows: currentStep.prime,
        cols: currentStep.divides ? n / currentStep.prime : Math.ceil(n / currentStep.prime),
        exact: currentStep.divides,
      };
    }
    return { rows: 1, cols: n, exact: true };
  }, [isVerdict, foundDivisor, currentStep, n]);

  // dot layout for the current arrangement
  const layout = useMemo(() => {
    const { rows, cols } = arrangement;
    const cell = Math.min((VIEW_W - MARGIN * 2) / cols, (VIEW_H - MARGIN * 2) / rows, 6);
    const x0 = (VIEW_W - cols * cell) / 2;
    const y0 = (VIEW_H - rows * cell) / 2;
    return Array.from({ length: n }, (_, i) => ({
      x: x0 + (i % cols) * cell + cell / 2,
      y: y0 + Math.floor(i / cols) * cell + cell / 2,
      r: Math.max(cell * 0.32, 0.8),
    }));
  }, [arrangement, n]);

  // dots in the final (incomplete) column of a non-exact arrangement glow red
  const overflowSet = useMemo(() => {
    const set = new Set<number>();
    if (!arrangement.exact) {
      const fullRows = Math.floor(n / arrangement.cols);
      for (let i = fullRows * arrangement.cols; i < n; i++) set.add(i);
    }
    return set;
  }, [arrangement, n]);

  const primeChips = useMemo(
    () =>
      testPrimes.map((p, i) => {
        const tested = i < stepsShown;
        const state: 'pending' | 'clear' | 'hit' = tested ? (steps[i].divides ? 'hit' : 'clear') : 'pending';
        return { prime: p, state, remainder: n % p };
      }),
    [testPrimes, stepsShown, steps, n],
  );

  const sqrtHintText =
    testPrimes.length > 0
      ? `√${n} ≈ ${sqrtN.toFixed(2)} → เช็คตัวหารเฉพาะได้ถึง ${limit}: ${testPrimes.join(', ')}`
      : `√${n} ≈ ${sqrtN.toFixed(2)} → ไม่มีตัวหารเฉพาะให้เช็ค (n เล็กเกินไป)`;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = [];
    steps.slice(0, stepsShown).forEach((s) => {
      lines.push({
        swatchColor: s.divides ? 'var(--color-danger)' : 'var(--color-success)',
        text: s.divides
          ? `${n} ÷ ${s.prime} = ${n / s.prime} — ลงตัว! พบตัวประกอบ`
          : `${n} ÷ ${s.prime} — เศษ ${n % s.prime}, ไม่ลงตัว`,
      });
    });
    if (isVerdict) {
      lines.push({
        emphasis: true,
        text: prime ? `ไม่มีตัวหารเฉพาะไหนหารลงตัวเลย → จำนวนเฉพาะ` : `หารลงตัวด้วย ${foundDivisor?.prime} → ไม่ใช่จำนวนเฉพาะ`,
      });
    }
    return lines;
  }, [n, steps, stepsShown, isVerdict, prime, foundDivisor]);

  const changeN = (value: number) => {
    setN(value);
    setGuess(null);
    setScored(false);
  };

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            จำนวนเต็มบวกที่มากกว่า 1 และมีตัวหารที่เป็นบวกหรือตัวประกอบเพียง 2 จำนวนเท่านั้น คือ <code>1</code> และตัวมันเอง
          </>
        }
        formula={
          <>
            <b>n</b> เป็น prime &nbsp;⟺&nbsp; ไม่มีจำนวนเฉพาะ <b>p</b> ≤ √<b>n</b> ที่หาร <b>n</b> ลงตัว
          </>
        }
        note={
          <>
            หากไม่มีจำนวนเต็มใดตั้งแต่ <code>2</code> ถึง <code>√n</code> ที่หาร <code>n</code> ลงตัว แปลว่า <code>n</code>{' '}
            จะไม่มีตัวหารอื่นอีกเลย นอกจาก <code>1</code> และตัวมันเอง
          </>
        }
      />
      <VisualizerFrame
      title="Prime or Not?"
      headerExtra={
        <div className={styles.header}>
          <div className={styles.inputRow}>
            <label className={styles.inputGroup}>
              n
              <input type="number" className={styles.numberInput} value={n} onChange={(e) => changeN(clampN(Number(e.target.value)))} />
            </label>
            <button type="button" className={styles.randomBtn} onClick={() => changeN(2 + Math.floor(Math.random() * 99))}>
              🎲 สุ่มเลขใหม่
            </button>
          </div>

          <p className={styles.sqrtHint}>{sqrtHintText}</p>

          <div className={styles.guessSection}>
            {!isVerdict && (
              <div className={styles.guessRow}>
                <span className={styles.guessLabel}>ทายก่อนกด ▶:</span>
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
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`กด ▶ เพื่อเริ่มคำนวณ √${n} แล้วทดลองหารด้วยจำนวนเฉพาะทีละตัว`}
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
        />
      }
    >
      <div className={styles.canvas}>
        <ul className={styles.ruleList}>
          <li>
            เงื่อนไข:
            <ul className={styles.ruleSubList}>
              <li>
                1. ถ้าหารลงตัว (ไม่มี
                <span className={styles.ruleDot} aria-hidden="true" />
                จุดสีแดง) → <strong>n เป็น composite</strong>
              </li>
              <li>
                2. ถ้าหารไม่ลงตัว (มี
                <span className={styles.ruleDot} aria-hidden="true" />
                จุดสีแดง) → ลองจำนวนเฉพาะตัวถัดไป
              </li>
            </ul>
          </li>
        </ul>

        {!isSqrtBeat && (
          <p className={styles.arrangementLabel}>
            {isVerdict
              ? foundDivisor
                ? `พบตัวประกอบ ${foundDivisor.prime} × ${n / foundDivisor.prime}`
                : `ไม่มีตัวหารเฉพาะไหนหารลงตัว`
              : `ลองหาร ${n} ด้วยจำนวนเฉพาะ ${currentStep?.prime}`}
          </p>
        )}

        {testPrimes.length > 0 && (
          <div className={isSqrtBeat ? `${styles.chipsRow} ${styles.chipsRowSpotlight}` : styles.chipsRow}>
            {primeChips.map((c, i) => (
              <div key={c.prime} className={styles.chipCol}>
                <span
                  style={isSqrtBeat ? ({ '--index': i } as React.CSSProperties) : undefined}
                  className={
                    c.state === 'hit'
                      ? `${styles.chip} ${styles.chipHit}`
                      : c.state === 'clear'
                        ? `${styles.chip} ${styles.chipClear}`
                        : isSqrtBeat
                          ? `${styles.chip} ${styles.chipSpotlight}`
                          : styles.chip
                  }
                >
                  {c.prime}
                </span>
                {c.state !== 'pending' && (
                  <span className={c.state === 'hit' ? `${styles.chipResult} ${styles.chipResultHit}` : styles.chipResult}>
                    {c.state === 'hit' ? 'ลงตัว!' : `เศษ ${c.remainder}`}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

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

        {isVerdict && foundDivisor && (
          <div className={styles.gallery}>
            <p className={styles.galleryTitle}>ตัวประกอบที่พบ</p>
            <div className={styles.galleryRow}>
              <div className={styles.galleryItem}>
                <div
                  className={styles.galleryRect}
                  style={{
                    aspectRatio: `${n / foundDivisor.prime} / ${foundDivisor.prime}`,
                    width: n / foundDivisor.prime >= foundDivisor.prime ? 72 : 72 * ((n / foundDivisor.prime) / foundDivisor.prime),
                  }}
                />
                <span className={styles.galleryLabel}>
                  {foundDivisor.prime}×{n / foundDivisor.prime}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
