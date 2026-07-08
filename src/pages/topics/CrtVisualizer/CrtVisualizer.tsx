import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { crtSearchSteps, pairwiseCoprime, type CrtCongruence } from '@/utils/algorithms/crt';
import styles from './CrtVisualizer.module.css';

const DIAL_PALETTE = ['#38bdf8', 'var(--color-success)', '#a78bfa'];
const DIAL_SIZE = 120;

function naiveSearch(pairs: CrtCongruence[], solution: number | null): { x: number; matched: boolean[] }[] {
  if (solution === null) return [];
  return Array.from({ length: solution + 1 }, (_, x) => ({
    x,
    matched: pairs.map(({ a, m }) => x % m === ((a % m) + m) % m),
  }));
}

export function CrtVisualizer() {
  const [pairs, setPairs] = useState<CrtCongruence[]>([
    { a: 2, m: 3 },
    { a: 3, m: 5 },
    { a: 2, m: 7 },
  ]);
  const [leapMode, setLeapMode] = useState(true);

  const coprime = useMemo(() => pairwiseCoprime(pairs.map((p) => p.m)), [pairs]);
  const trace = useMemo(() => crtSearchSteps(pairs), [pairs]);
  const candidates = useMemo(
    () => (leapMode ? trace.candidates : naiveSearch(pairs, trace.solution)),
    [leapMode, trace, pairs],
  );

  // beats: setup, one per candidate (last = unlock), uniqueness
  const totalBeats = candidates.length + 2;
  const resetKey = `${pairs.map((p) => `${p.a}/${p.m}`).join(',')}:${leapMode}`;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, resetKey);

  const tried = Math.min(Math.max(beatIndex, 0), candidates.length);
  const current = tried > 0 ? candidates[tried - 1] : null;
  const isUnlocked = tried === candidates.length && trace.solution !== null;
  const isUniqueness = beatIndex >= candidates.length + 1;

  const updatePair = (idx: number, field: 'a' | 'm', value: number) => {
    if (Number.isNaN(value)) return;
    setPairs((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, [field]: Math.min(Math.max(Math.trunc(value), field === 'm' ? 2 : 0), field === 'm' ? 13 : 12) } : p,
      ),
    );
  };

  const dialCenter = DIAL_SIZE / 2;
  const dialRadius = DIAL_SIZE / 2 - 18;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = [];
    if (!coprime) {
      lines.push({ swatchColor: 'var(--color-danger)', emphasis: true, text: 'moduli ไม่ coprime กัน — CRT ไม่การันตีคำตอบเดียว!' });
    }
    candidates.slice(0, tried).forEach((c) => {
      const locks = c.matched.filter(Boolean).length;
      lines.push({
        swatchColor: locks === pairs.length ? 'var(--color-success)' : DIAL_PALETTE[Math.max(locks - 1, 0)],
        text: `x = ${c.x}: ล็อกได้ ${locks}/${pairs.length} วง`,
        emphasis: locks === pairs.length,
      });
    });
    if (isUniqueness && trace.solution !== null) {
      lines.push({
        emphasis: true,
        text: `คำตอบถัดไป = ${trace.solution} + ${trace.M} = ${trace.solution + trace.M} → x ≡ ${trace.solution} (mod ${trace.M})`,
      });
      lines.push({
        swatchColor: 'var(--color-success)',
        text: leapMode ? `โหมดกระโดด: ลองแค่ ${candidates.length} ค่า` : `โหมดไล่ทีละค่า: ลองถึง ${candidates.length} ค่า`,
      });
    }
    return lines;
  }, [coprime, candidates, tried, pairs.length, isUniqueness, trace.solution, trace.M, leapMode]);

  return (
    <VisualizerFrame
      title="Chinese Remainder Theorem — Combination Lock"
      headerExtra={
        <div className={styles.controls}>
          <div className={styles.pairsRow}>
            {pairs.map((p, i) => (
              <div key={i} className={styles.pairCard} style={{ '--dial-color': DIAL_PALETTE[i] } as React.CSSProperties}>
                <span className={styles.pairLabel}>x ≡</span>
                <input
                  type="number"
                  className={styles.pairInput}
                  value={p.a}
                  onChange={(e) => updatePair(i, 'a', Number(e.target.value))}
                />
                <span className={styles.pairLabel}>(mod</span>
                <input
                  type="number"
                  className={styles.pairInput}
                  value={p.m}
                  onChange={(e) => updatePair(i, 'm', Number(e.target.value))}
                />
                <span className={styles.pairLabel}>)</span>
              </div>
            ))}
          </div>
          <button type="button" className={styles.modeToggle} onClick={() => setLeapMode((v) => !v)}>
            {leapMode ? '⚡ โหมดกระโดด (ฉลาด)' : '🐢 โหมดไล่ทีละค่า'} — กดสลับ
          </button>
          {!coprime && <span className={styles.coprimeWarn}>⚠️ moduli ต้อง coprime กันทุกคู่</span>}
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`หา x ที่ทำให้ทุกวงล็อกพร้อมกัน (M = ${trace.M}) — กด ▶`}
          lines={monitorLines}
          badge={isUnlocked ? `ปลดล็อก! x = ${trace.solution}` : undefined}
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
        <p className={styles.counterReadout}>
          {current ? (
            <>
              กำลังลอง x = <strong>{current.x}</strong>
            </>
          ) : (
            'ตั้งเป้าไว้ที่ช่องส้มของแต่ละวง'
          )}
        </p>

        <div className={styles.dialsRow}>
          {pairs.map((p, i) => {
            const locked = current?.matched[i] ?? false;
            const hand = current ? current.x % p.m : 0;
            const target = ((p.a % p.m) + p.m) % p.m;
            const angle = (slot: number) => (slot / p.m) * 2 * Math.PI - Math.PI / 2;
            return (
              <div key={i} className={styles.dialBlock}>
                <svg
                  className={locked ? `${styles.dial} ${styles.dialLocked}` : styles.dial}
                  viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
                  style={{ '--dial-color': DIAL_PALETTE[i] } as React.CSSProperties}
                >
                  <circle className={styles.dialFace} cx={dialCenter} cy={dialCenter} r={dialRadius + 10} />
                  {Array.from({ length: p.m }, (_, slot) => {
                    const x = dialCenter + dialRadius * Math.cos(angle(slot));
                    const y = dialCenter + dialRadius * Math.sin(angle(slot));
                    return (
                      <g key={slot}>
                        {slot === target && <circle className={styles.targetMark} cx={x} cy={y} r={8.5} />}
                        <text className={styles.dialTick} x={x} y={y} textAnchor="middle" dominantBaseline="middle">
                          {slot}
                        </text>
                      </g>
                    );
                  })}
                  <g className={styles.dialHandGroup} style={{ transform: `rotate(${current ? (current.x / p.m) * 360 : 0}deg)` }}>
                    <line className={styles.dialHand} x1={dialCenter} y1={dialCenter} x2={dialCenter} y2={dialCenter - dialRadius * 0.66} />
                  </g>
                  <circle cx={dialCenter} cy={dialCenter} r={3.5} className={styles.dialHub} />
                </svg>
                <span className={locked ? `${styles.lockTag} ${styles.lockTagLocked}` : styles.lockTag}>
                  {locked ? `🔒 ${hand} = ${target}` : `mod ${p.m} → ${target}`}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.numberLine}>
          {candidates.slice(0, tried).map((c) => {
            const locks = c.matched.filter(Boolean).length;
            const isSolution = locks === pairs.length;
            return (
              <span
                key={c.x}
                className={isSolution ? `${styles.lineTick} ${styles.lineTickSolution}` : styles.lineTick}
                style={{ left: `${(c.x / trace.M) * 100}%`, '--tick-color': DIAL_PALETTE[Math.max(locks - 1, 0)] } as React.CSSProperties}
                title={`x = ${c.x}`}
              >
                {isSolution ? '👑' : ''}
                <span className={styles.lineTickLabel}>{c.x}</span>
              </span>
            );
          })}
          <span className={styles.lineBase} />
          <span className={styles.lineEndLabel}>M = {trace.M}</span>
        </div>
      </div>
    </VisualizerFrame>
  );
}
