import { useEffect, useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { gcd } from '@/utils/algorithms/euclidean';
import { multiplyTrail } from '@/utils/algorithms/modular';
import { isPrime } from '@/utils/algorithms/factorization';
import styles from './FermatVisualizer.module.css';

const P_CHOICES = [3, 5, 7, 11, 13];
const P_BROKEN = [4, 6, 8, 9, 10];
const CLOCK_SIZE = 200;

interface ExperimentRow {
  a: number;
  p: number;
  result: number;
}

export function FermatVisualizer() {
  const [a, setA] = useState(3);
  const [p, setP] = useState(7);
  const [breakMode, setBreakMode] = useState(false);
  const [guess, setGuess] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [scored, setScored] = useState(false);
  const [experiments, setExperiments] = useState<ExperimentRow[]>([]);

  const hops = p - 1;
  const trail = useMemo(() => multiplyTrail(a, p, hops), [a, p, hops]);
  const finalResult = trail[hops - 1] ?? 1;
  const landsOnOne = finalResult === 1;
  const conditionsHold = isPrime(p) && gcd(a, p) === 1;

  // beats: setup, one per multiplication, landing
  const totalBeats = hops + 2;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${p}`);

  const hopsDone = Math.min(Math.max(beatIndex, 0), hops);
  const isLanding = beatIndex >= hops + 1;
  const position = hopsDone === 0 ? 1 % p : trail[hopsDone - 1];

  useEffect(() => {
    if (isLanding && !scored) {
      setScored(true);
      setExperiments((rows) => [...rows, { a, p, result: finalResult }].slice(-6));
      if (guess !== null) setStreak((s) => (guess === landsOnOne ? s + 1 : 0));
    }
  }, [isLanding, scored, a, p, finalResult, guess, landsOnOne]);

  const pickInputs = (nextA: number, nextP: number) => {
    setA(nextA);
    setP(nextP);
    setGuess(null);
    setScored(false);
  };

  // clock geometry
  const center = CLOCK_SIZE / 2;
  const radius = CLOCK_SIZE / 2 - 26;
  const angleOf = (slot: number) => (slot / p) * 2 * Math.PI - Math.PI / 2;
  const slotXY = (slot: number) => ({
    x: center + radius * Math.cos(angleOf(slot)),
    y: center + radius * Math.sin(angleOf(slot)),
  });

  const arcs = useMemo(() => {
    const c = CLOCK_SIZE / 2;
    const r = CLOCK_SIZE / 2 - 26;
    const xy = (slot: number) => {
      const angle = (slot / p) * 2 * Math.PI - Math.PI / 2;
      return { x: c + r * Math.cos(angle), y: c + r * Math.sin(angle) };
    };
    const points = [1 % p, ...trail.slice(0, hopsDone)];
    return points.slice(0, -1).map((from, i) => {
      const to = points[i + 1];
      const f = xy(from);
      const t = xy(to);
      const mx = (f.x + t.x) / 2 + (c - (f.x + t.x) / 2) * 0.5;
      const my = (f.y + t.y) / 2 + (c - (f.y + t.y) / 2) * 0.5;
      return { d: `M ${f.x} ${f.y} Q ${mx} ${my} ${t.x} ${t.y}`, key: i };
    });
  }, [trail, hopsDone, p]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = trail.slice(0, hopsDone).map((pos, i) => ({
      swatchColor: '#38bdf8',
      text: `${a}^${i + 1} mod ${p} = ${pos}`,
    }));
    if (isLanding) {
      lines.push({
        emphasis: true,
        swatchColor: landsOnOne ? 'var(--color-success)' : 'var(--color-danger)',
        text: landsOnOne
          ? `${a}^${hops} ≡ 1 (mod ${p}) — ตามทฤษฎีบท!`
          : `${a}^${hops} mod ${p} = ${finalResult} ≠ 1 — เงื่อนไขไม่ครบ (${!isPrime(p) ? `${p} ไม่ใช่ prime` : `gcd(${a},${p}) ≠ 1`})`,
      });
    }
    return lines;
  }, [trail, hopsDone, a, p, isLanding, landsOnOne, hops, finalResult]);

  return (
    <VisualizerFrame
      title="Fermat's Little Theorem — วนกลับมาที่ 1 เสมอ"
      headerExtra={
        <div className={styles.controls}>
          <div className={styles.chipRow}>
            <span className={styles.chipLabel}>a =</span>
            {[2, 3, 4, 5, 6].map((v) => (
              <button
                key={v}
                type="button"
                className={v === a ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                onClick={() => pickInputs(v, p)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className={styles.chipRow}>
            <span className={styles.chipLabel}>{breakMode ? 'p (ไม่ prime!) =' : 'p ='}</span>
            {(breakMode ? P_BROKEN : P_CHOICES).map((v) => (
              <button
                key={v}
                type="button"
                className={v === p ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                onClick={() => pickInputs(a, v)}
              >
                {v}
              </button>
            ))}
            <button
              type="button"
              className={breakMode ? `${styles.breakBtn} ${styles.breakBtnActive}` : styles.breakBtn}
              onClick={() => setBreakMode((v) => !v)}
            >
              ลองเงื่อนไขพัง
            </button>
          </div>
          {!isLanding && (
            <div className={styles.chipRow}>
              <span className={styles.chipLabel}>ทายก่อน — จะจบที่ 1 ไหม?</span>
              <button
                type="button"
                className={guess === true ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                onClick={() => setGuess(true)}
              >
                จบที่ 1
              </button>
              <button
                type="button"
                className={guess === false ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                onClick={() => setGuess(false)}
              >
                ไม่จบที่ 1
              </button>
            </div>
          )}
          {isLanding && guess !== null && (
            <span className={guess === landsOnOne ? styles.guessRight : styles.guessWrong}>
              {guess === landsOnOne ? `ทายถูก! 🔥 streak ${streak}` : 'พลาด — streak รีเซ็ต'}
            </span>
          )}
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={
            conditionsHold
              ? `เริ่มที่ 1 แล้วคูณด้วย ${a} ทั้งหมด ${hops} ครั้งบนนาฬิกา mod ${p} — จุดหมายถูกวงไว้แล้ว`
              : `เงื่อนไขพัง: ${!isPrime(p) ? `${p} ไม่ใช่จำนวนเฉพาะ` : `gcd(${a},${p}) = ${gcd(a, p)}`} — ดูซิว่ายังจบที่ 1 ไหม`
          }
          lines={monitorLines}
          badge={isLanding && landsOnOne ? `a^(p−1) ≡ 1 (mod p) ✓` : undefined}
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
        <svg className={styles.clock} viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`} role="img" aria-label={`นาฬิกา mod ${p}`}>
          <circle className={styles.face} cx={center} cy={center} r={radius + 14} />

          {(() => {
            const one = slotXY(1 % p);
            return <circle className={styles.targetRing} cx={one.x} cy={one.y} r={12} />;
          })()}

          {arcs.map((arc) => (
            <path key={arc.key} className={styles.hopArc} d={arc.d} />
          ))}

          {Array.from({ length: p }, (_, slot) => {
            const { x, y } = slotXY(slot);
            const isToken = slot === position;
            return (
              <g key={slot}>
                {isToken && <circle className={isLanding && landsOnOne ? `${styles.token} ${styles.tokenDone}` : styles.token} cx={x} cy={y} r={11} />}
                <text
                  className={isToken ? `${styles.tickLabel} ${styles.tickLabelToken}` : styles.tickLabel}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {slot}
                </text>
              </g>
            );
          })}
        </svg>

        <p className={styles.readout}>
          {hopsDone === 0 ? `เริ่มที่ 1` : `${a}^${hopsDone} mod ${p} = `}
          {hopsDone > 0 && <strong>{position}</strong>}
        </p>

        {experiments.length > 0 && (
          <div className={styles.expTable}>
            <p className={styles.expTitle}>ตารางทดลอง</p>
            <div className={styles.expGrid}>
              <span className={styles.expHead}>a</span>
              <span className={styles.expHead}>p</span>
              <span className={styles.expHead}>a^(p−1) mod p</span>
              {experiments.map((row, i) => (
                <div key={i} className={styles.expRow}>
                  <span>{row.a}</span>
                  <span>{row.p}</span>
                  <span className={row.result === 1 ? styles.expOne : styles.expNotOne}>{row.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
