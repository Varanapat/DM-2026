import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState } from '@/components/widgets/NumberGrid';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { gcd, divisors } from '@/utils/algorithms/euclidean';
import { computeEuclideanBeats, tileFitMonitorData, TileFitEuclidean } from './TileFitEuclidean';
import styles from './GcdVisualizer.module.css';

type Method = 'intersection' | 'euclidean';

function clampInput(value: number): number {
  if (Number.isNaN(value)) return 1;
  return Math.min(Math.max(Math.trunc(value), 1), 200);
}

function Chip({ value, className }: { value: number; className: string }) {
  return <span className={`${styles.chip} ${className}`}>{value}</span>;
}

export function GcdVisualizer() {
  const [a, setA] = useState(48);
  const [b, setB] = useState(36);
  const [method, setMethod] = useState<Method>('intersection');
  const resetKey = `${a}:${b}`;

  const divisorsA = useMemo(() => divisors(a), [a]);
  const divisorsB = useMemo(() => divisors(b), [b]);
  const divisorsBSet = useMemo(() => new Set(divisorsB), [divisorsB]);
  const commonDivisors = useMemo(() => divisorsA.filter((d) => divisorsBSet.has(d)), [divisorsA, divisorsBSet]);
  const result = useMemo(() => gcd(a, b), [a, b]);

  // ---------- Method 1: Intersection of divisors ----------
  const phase1Len = a;
  const phase2Len = b;
  const interTotalSteps = phase1Len + phase2Len + 2;
  const phase1End = phase1Len;
  const phase2End = phase1End + phase2Len;

  const inter = useVisualizerBeats(interTotalSteps, resetKey);
  const interClamped = inter.beatIndex;

  const inPhase1 = interClamped < phase1End;
  const phase1Candidate = inPhase1 ? interClamped + 1 : null;
  const phase1Resolved = inPhase1 ? interClamped : phase1Len;
  const foundDivisorsA = divisorsA.filter((d) => d <= phase1Resolved);

  const inPhase2 = interClamped >= phase1End && interClamped < phase2End;
  const pastPhase2 = interClamped >= phase2End;
  const phase2Local = interClamped - phase1End;
  const phase2Candidate = inPhase2 ? phase2Local + 1 : null;
  const phase2Resolved = inPhase2 ? phase2Local : pastPhase2 ? phase2Len : 0;
  const foundDivisorsB = divisorsB.filter((d) => d <= phase2Resolved);

  const showCommon = interClamped >= phase2End;
  const showCrown = interClamped >= phase2End + 1;

  const cellStatesA = useMemo(() => {
    const map: Record<number, CellState> = {};
    for (let i = 1; i <= phase1Resolved; i++) map[i] = a % i === 0 ? 'success' : 'muted';
    if (phase1Candidate) map[phase1Candidate] = 'current';
    return map;
  }, [a, phase1Resolved, phase1Candidate]);

  const cellStatesB = useMemo(() => {
    const map: Record<number, CellState> = {};
    for (let i = 1; i <= phase2Resolved; i++) map[i] = b % i === 0 ? 'success' : 'muted';
    if (phase2Candidate) map[phase2Candidate] = 'current';
    return map;
  }, [b, phase2Resolved, phase2Candidate]);

  const timelineTarget: 'A' | 'B' = inPhase1 ? 'A' : 'B';
  const timelineN = timelineTarget === 'A' ? a : b;
  const timelineMax = timelineN;
  const timelineCellStates = timelineTarget === 'A' ? cellStatesA : cellStatesB;
  const timelineCandidate = timelineTarget === 'A' ? phase1Candidate : phase2Candidate;

  const tooltipText = useMemo(() => {
    if (!timelineCandidate) return null;
    const q = Math.floor(timelineN / timelineCandidate);
    const r = timelineN % timelineCandidate;
    return `${timelineN} ÷ ${timelineCandidate} = ${q} R ${r}`;
  }, [timelineN, timelineCandidate]);

  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!timelineCandidate || !gridWrapperRef.current) {
      setTooltipPos(null);
      return;
    }
    const cells = gridWrapperRef.current.querySelectorAll('button');
    const cell = cells[timelineCandidate - 1];
    if (!cell) return;
    const cellRect = cell.getBoundingClientRect();
    const containerRect = gridWrapperRef.current.getBoundingClientRect();
    setTooltipPos({
      left: cellRect.left - containerRect.left + cellRect.width / 2,
      top: cellRect.top - containerRect.top,
    });
  }, [timelineCandidate, timelineMax]);

  // ---------- Method 2: Euclidean tile-fitting geometry ----------
  const euclidBeats = useMemo(() => computeEuclideanBeats(a, b), [a, b]);
  const euclid = useVisualizerBeats(euclidBeats.beats.length, resetKey);
  const monitorData = useMemo(() => tileFitMonitorData(a, b, euclid.beatIndex), [a, b, euclid.beatIndex]);

  const active = method === 'intersection' ? inter : euclid;

  return (
    <VisualizerFrame
      title="Interactive GCD Visualizer"
      headerExtra={
        <>
          <div className={styles.methodToggle} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={method === 'intersection'}
              className={method === 'intersection' ? `${styles.methodToggleBtn} ${styles.methodToggleBtnActive}` : styles.methodToggleBtn}
              onClick={() => setMethod('intersection')}
            >
              Intersection Method
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={method === 'euclidean'}
              className={method === 'euclidean' ? `${styles.methodToggleBtn} ${styles.methodToggleBtnActive}` : styles.methodToggleBtn}
              onClick={() => setMethod('euclidean')}
            >
              Euclidean Algorithm
            </button>
          </div>
          <div className={styles.inputsRow}>
            <label className={styles.numberInputGroup}>
              Number A
              <input type="number" className={styles.numberInput} value={a} onChange={(e) => setA(clampInput(Number(e.target.value)))} />
            </label>
            <label className={styles.numberInputGroup}>
              Number B
              <input type="number" className={styles.numberInput} value={b} onChange={(e) => setB(clampInput(Number(e.target.value)))} />
            </label>
          </div>
        </>
      }
      monitor={
        method === 'euclidean' ? (
          <ExecutionMonitor hint={monitorData.hint} lines={monitorData.lines} badge={monitorData.badge} />
        ) : undefined
      }
      footer={
        <StepController
          totalSteps={active.totalBeats}
          currentStep={active.beatIndex}
          mode={active.mode}
          onStepChange={active.setBeatIndex}
          onModeChange={active.setMode}
          showReset={false}
        />
      }
    >
      {method === 'intersection' ? (
        <div className={styles.canvas}>
          <div className={styles.timelineWrapper} ref={gridWrapperRef}>
            <p className={styles.timelineLabel}>Scanning divisors of {timelineN}</p>
            <NumberGrid max={timelineMax} cellStates={timelineCellStates} />
            {tooltipPos && tooltipText && (
              <span className={styles.tooltip} style={{ left: tooltipPos.left, top: tooltipPos.top }}>
                {tooltipText}
              </span>
            )}
          </div>

          <div className={styles.poolsRow}>
            <div className={`${styles.poolBox} ${styles.poolBoxBlue}`}>
              <p className={styles.poolTitle}>Divisors of A: {a}</p>
              <div className={styles.chipRow}>
                {foundDivisorsA.map((d) => (
                  <Chip key={d} value={d} className={styles.chipBlue} />
                ))}
              </div>
            </div>
            <div className={`${styles.poolBox} ${styles.poolBoxOrange}`}>
              <p className={styles.poolTitle}>Divisors of B: {b}</p>
              <div className={styles.chipRow}>
                {foundDivisorsB.map((d) => (
                  <Chip key={d} value={d} className={styles.chipOrange} />
                ))}
              </div>
            </div>
          </div>

          <div
            className={`${styles.climaxPanel} ${showCrown ? styles.climaxPanelDone : showCommon ? styles.climaxPanelReady : ''}`}
          >
            <p className={styles.climaxTitle}>
              Common Divisors: {a} &amp; {b}
            </p>
            {showCommon && (
              <div className={styles.chipRow}>
                {commonDivisors.map((d) =>
                  showCrown && d === result ? (
                    <span key={d} className={styles.winnerChip}>
                      <span className={styles.crownIcon} aria-hidden="true">
                        👑
                      </span>
                      {d}
                    </span>
                  ) : (
                    <Chip key={d} value={d} className={styles.chipGreen} />
                  ),
                )}
              </div>
            )}
            {showCrown && <span className={styles.winnerBadge}>GCD found: {result}!</span>}
          </div>
        </div>
      ) : (
        <TileFitEuclidean a={a} b={b} beatIndex={euclid.beatIndex} />
      )}
    </VisualizerFrame>
  );
}
