import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState } from '@/components/widgets/NumberGrid';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import styles from './DivisibilityVisualizer.module.css';

const GRID_MAX = 60;

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.min(Math.max(Math.trunc(v), lo), hi);
}

interface Row {
  n: number;
  leftover: boolean;
  tag: string;
}

export function DivisibilityVisualizer() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(14);

  const fullRows = Math.floor(b / a);
  const remainder = b % a;
  const divisible = remainder === 0;

  const rows = useMemo<Row[]>(() => {
    const list: Row[] = Array.from({ length: fullRows }, (_, i) => ({
      n: a,
      leftover: false,
      tag: `แถว ${i + 1} · เต็ม`,
    }));
    if (remainder > 0) list.push({ n: remainder, leftover: true, tag: `เศษเหลือ ${remainder}` });
    return list;
  }, [fullRows, a, remainder]);

  const totalBeats = rows.length + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${b}`);
  const filledRows = beatIndex;

  const gridCellStates = useMemo(() => {
    const map: Record<number, CellState> = {};
    for (let m = a; m <= GRID_MAX; m += a) map[m] = 'success';
    map[b] = divisible ? 'gold' : 'current';
    return map;
  }, [a, b, divisible]);

  return (
    <TopicPageStack>
        <DefinitionCard
          formula={
            <>
              <b>a</b> | <b>b</b> &nbsp;⟺&nbsp; ∃ k ∈ ℤ ที่ทำให้ <b>b</b> = <b>a</b> × k
            </>
          }
          note={
            <>
              อ่านว่า <strong>“a หาร b ลงตัว”</strong> — จะจริงก็ต่อเมื่อมีจำนวนเต็ม <code>k</code> ที่คูณ <code>a</code>{' '}
              แล้วได้ <code>b</code> พอดี ไม่มีเศษเหลือ ลองนึกภาพครูจัดนักเรียน <code>b</code> คน ลงเป็นแถวละ{' '}
              <code>a</code> คน — ถ้าลงตัวพอดีทุกแถว นั่นคือ a | b
            </>
          }
        />

        <section className={`${styles.cardFlat} ${styles.stage}`}>
          <div className={styles.controls}>
            <div className={styles.numBlock}>
              <div className={styles.numLabel}>
                นักเรียนทั้งหมด
                <span>Dividend · b</span>
              </div>
              <div className={styles.stepper}>
                <button type="button" onClick={() => setB(clamp(b - 1, 1, GRID_MAX))} disabled={b <= 1} aria-label="ลด b">
                  −
                </button>
                <input
                  type="number"
                  className={styles.stepperVal}
                  value={b}
                  onChange={(e) => setB(clamp(Number(e.target.value), 1, GRID_MAX))}
                />
                <button type="button" onClick={() => setB(clamp(b + 1, 1, GRID_MAX))} disabled={b >= GRID_MAX} aria-label="เพิ่ม b">
                  +
                </button>
              </div>
            </div>

            <div className={styles.numBlock}>
              <div className={styles.numLabel}>
                นักเรียนต่อแถว
                <span>Divisor · a</span>
              </div>
              <div className={styles.stepper}>
                <button type="button" onClick={() => setA(clamp(a - 1, 1, 12))} disabled={a <= 1} aria-label="ลด a">
                  −
                </button>
                <input
                  type="number"
                  className={`${styles.stepperVal} ${styles.stepperValAccent}`}
                  value={a}
                  onChange={(e) => setA(clamp(Number(e.target.value), 1, 12))}
                />
                <button type="button" onClick={() => setA(clamp(a + 1, 1, 12))} disabled={a >= 12} aria-label="เพิ่ม a">
                  +
                </button>
              </div>
            </div>

            <div className={divisible ? `${styles.result} ${styles.resultGood}` : `${styles.result} ${styles.resultWarn}`}>
              <span className={divisible ? `${styles.resultBadge} ${styles.resultBadgeGood}` : `${styles.resultBadge} ${styles.resultBadgeWarn}`}>
                {divisible ? '✓ ลงตัว' : '✗ ไม่ลงตัว'}
              </span>
              <div className={styles.resultEq}>
                {divisible ? (
                  <>
                    <b>{a}</b> | <b>{b}</b> เพราะ {b} = <b>{a}</b> × <span className={styles.q}>{fullRows}</span>
                  </>
                ) : (
                  <>
                    <b>{a}</b> ∤ <b>{b}</b> เพราะ {b} = <b>{a}</b> × <span className={styles.q}>{fullRows}</span> +{' '}
                    <span className={styles.r}>{remainder}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={styles.viz}>
            <div className={styles.vizHead}>
              <p className={styles.vizCaption}>
                จัดแถวละ <b>{a}</b> คน จาก <b>{b}</b> คน
              </p>
              <p className={styles.monitorLabel}>Execution Monitor</p>
            </div>

            <div className={styles.rows}>
              {rows.map((row, i) => (
                <div
                  key={i}
                  className={
                    i < filledRows
                      ? row.leftover
                        ? `${styles.rowLine} ${styles.rowLineOn} ${styles.rowLineLeftover}`
                        : `${styles.rowLine} ${styles.rowLineOn}`
                      : row.leftover
                        ? `${styles.rowLine} ${styles.rowLineLeftover}`
                        : styles.rowLine
                  }
                >
                  {Array.from({ length: row.n }, (_, c) => (
                    <span key={c} className={styles.cell} />
                  ))}
                  <span className={styles.rowTag}>{row.tag}</span>
                </div>
              ))}
            </div>

            <div className={styles.player}>
              <StepController
                totalSteps={totalBeats}
                currentStep={beatIndex}
                mode={mode}
                onStepChange={setBeatIndex}
                onModeChange={setMode}
              />
            </div>
          </div>
        </section>

        <section className={styles.cardFlat}>
          <div className={styles.multHead}>
            <p className={styles.cardTitle}>
              <span className={styles.cardTitleDot} aria-hidden="true" />
              ตัวคูณของ <span className={styles.accentText}>{a}</span>
            </p>
            <p className={styles.multHint}>กดตัวเลขเพื่อเปลี่ยนค่า b · สีเข้ม = หารลงตัว</p>
          </div>
          <NumberGrid max={GRID_MAX} cellStates={gridCellStates} onCellClick={(v) => setB(v)} compact />
          <div className={styles.legend}>
            <span>
              <span className={`${styles.swatch} ${styles.swatchMultiple}`} /> ตัวคูณของ a (ลงตัว)
            </span>
            <span>
              <span className={`${styles.swatch} ${styles.swatchGood}`} /> ค่า b ปัจจุบัน (ลงตัว)
            </span>
            <span>
              <span className={`${styles.swatch} ${styles.swatchWarn}`} /> b ปัจจุบัน (มีเศษเหลือ)
            </span>
          </div>
        </section>
    </TopicPageStack>
  );
}
