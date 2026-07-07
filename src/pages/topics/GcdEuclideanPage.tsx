import { useEffect, useMemo, useState } from 'react';
import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState } from '@/components/widgets/NumberGrid';
import { ScanLog } from '@/components/widgets/ScanLog';
import { RibbonSegments } from '@/components/widgets/RibbonSegments';
import { PredictReveal } from '@/components/widgets/PredictReveal';
import { SliderInput } from '@/components/widgets/SliderInput';
import { gcd, divisors } from '@/utils/algorithms/euclidean';
import styles from './GcdEuclideanPage.module.css';

// fixed puzzle numbers for the Hook — independent of the interactive a,b below
const HOOK_A = 18;
const HOOK_B = 24;

function divideLogLine(n: number, i: number): string {
  const q = Math.floor(n / i);
  const r = n % i;
  return `${n} ÷ ${i} = ${q} R ${r}${r === 0 ? ' ✅' : ''}`;
}

function Chip({ value, state }: { value: number; state: CellState }) {
  const classes = [styles.chip, styles[`chip_${state}`]].join(' ');
  return <span className={classes}>{value}</span>;
}

export function GcdEuclideanPage() {
  const [a, setA] = useState(48);
  const [b, setB] = useState(36);
  const [globalStep, setGlobalStep] = useState(0);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  const divisorsA = useMemo(() => divisors(a), [a]);
  const divisorsB = useMemo(() => divisors(b), [b]);
  const divisorsBSet = useMemo(() => new Set(divisorsB), [divisorsB]);
  const result = useMemo(() => gcd(a, b), [a, b]);
  const hookGcd = gcd(HOOK_A, HOOK_B);
  const maxHookBar = Math.max(HOOK_A, HOOK_B);

  const phase1Len = a;
  const phase2Len = b;
  const phase3Len = divisorsA.length;
  const totalSteps = phase1Len + phase2Len + phase3Len + 1;
  const phase1End = phase1Len;
  const phase2End = phase1End + phase2Len;
  const phase3End = phase2End + phase3Len;

  useEffect(() => {
    setGlobalStep(0);
    setMode('manual');
  }, [a, b]);

  const step = Math.min(globalStep, totalSteps - 1);

  // Phase 1: scanning candidates 1..a
  const inPhase1 = step < phase1End;
  const phase1Candidate = inPhase1 ? step + 1 : null;
  const phase1Resolved = inPhase1 ? step : phase1Len;
  const foundDivisorsA = divisorsA.filter((d) => d <= phase1Resolved);

  // Phase 2: scanning candidates 1..b
  const inPhase2 = step >= phase1End && step < phase2End;
  const pastPhase2 = step >= phase2End;
  const phase2Local = step - phase1End;
  const phase2Candidate = inPhase2 ? phase2Local + 1 : null;
  const phase2Resolved = inPhase2 ? phase2Local : pastPhase2 ? phase2Len : 0;
  const foundDivisorsB = divisorsB.filter((d) => d <= phase2Resolved);

  // Phase 3: scanning divisorsA for membership in divisorsB
  const inPhase3 = step >= phase2End && step < phase3End;
  const pastPhase3 = step >= phase3End;
  const phase3Local = step - phase2End;
  const phase3Resolved = inPhase3 ? phase3Local : pastPhase3 ? phase3Len : 0;
  const commonSoFar = divisorsA.slice(0, phase3Resolved).filter((d) => divisorsBSet.has(d));
  const phase3CurrentValue = inPhase3 ? divisorsA[phase3Local] : null;

  const showCrown = pastPhase3;

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

  const logA = useMemo(() => {
    const lines: string[] = [];
    for (let i = 1; i <= phase1Resolved; i++) lines.push(divideLogLine(a, i));
    if (phase1Candidate) lines.push(divideLogLine(a, phase1Candidate));
    return lines;
  }, [a, phase1Resolved, phase1Candidate]);

  const logB = useMemo(() => {
    const lines: string[] = [];
    for (let i = 1; i <= phase2Resolved; i++) lines.push(divideLogLine(b, i));
    if (phase2Candidate) lines.push(divideLogLine(b, phase2Candidate));
    return lines;
  }, [b, phase2Resolved, phase2Candidate]);

  return (
    <TopicPageTemplate
      topicId="gcd-euclidean"
      hook={
        <div className={styles.hook}>
          <p>
            ริบบิ้น {HOOK_A} ซม. กับ {HOOK_B} ซม. — อยากตัดเป็นท่อนเท่ากันที่ <strong>ยาวที่สุด</strong> โดยไม่เหลือเศษ ท่อนละกี่ ซม.?
          </p>
          <div className={styles.plainBars}>
            <div>
              <div className={styles.plainBarLabel}>{HOOK_A} ซม.</div>
              <div className={styles.plainBarTrack} style={{ width: `${(HOOK_A / maxHookBar) * 100}%` }} />
            </div>
            <div>
              <div className={styles.plainBarLabel}>{HOOK_B} ซม.</div>
              <div className={`${styles.plainBarTrack} ${styles.plainBarTrackAlt}`} style={{ width: `${(HOOK_B / maxHookBar) * 100}%` }} />
            </div>
          </div>
          <PredictReveal question="ท่อนที่ยาวที่สุดที่ตัดได้พอดี ยาวกี่ ซม.?">
            <p>
              <strong>{hookGcd} ซม.</strong> — ได้ {HOOK_A / hookGcd} ท่อน และ {HOOK_B / hookGcd} ท่อน พอดีไม่เหลือเศษ
            </p>
            <RibbonSegments
              bars={[
                { label: `${HOOK_A} ซม.`, length: HOOK_A },
                { label: `${HOOK_B} ซม.`, length: HOOK_B },
              ]}
              unit={hookGcd}
            />
            <p className={styles.hookSub}>{hookGcd} คือ GCD (ตัวหารร่วมมาก) — หน่วยวัดใหญ่ที่สุดที่หารทั้งคู่ลงตัว</p>
          </PredictReveal>
        </div>
      }
      visual={
        <div className={styles.section}>
          <div className={styles.inputsRow}>
            <SliderInput label={`a = ${a}`} min={2} max={60} value={a} onChange={setA} />
            <SliderInput label={`b = ${b}`} min={2} max={60} value={b} onChange={setB} />
          </div>

          <StepController totalSteps={totalSteps} currentStep={step} mode={mode} onStepChange={setGlobalStep} onModeChange={setMode} />

          <div className={styles.phaseBlock}>
            <p className={styles.phaseHeading}>1. หาตัวหารของ {a}</p>
            <NumberGrid max={a} cellStates={cellStatesA} />
            <div className={styles.chipRow}>
              {foundDivisorsA.map((d) => (
                <Chip key={d} value={d} state="success" />
              ))}
            </div>
            <ScanLog title={`สแกน ${a}`} lines={logA} />
          </div>

          <div className={styles.phaseBlock}>
            <p className={styles.phaseHeading}>2. หาตัวหารของ {b}</p>
            <NumberGrid max={b} cellStates={cellStatesB} />
            <div className={styles.chipRow}>
              {foundDivisorsB.map((d) => (
                <Chip key={d} value={d} state="success" />
              ))}
            </div>
            <ScanLog title={`สแกน ${b}`} lines={logB} />
          </div>

          <div className={styles.phaseBlock}>
            <p className={styles.phaseHeading}>3. หาตัวหารร่วม</p>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>ตัวหารของ {a}:</span>
              <div className={styles.chipRow}>
                {divisorsA.map((d, i) => {
                  let state: CellState = 'default';
                  if (i < phase3Resolved) state = divisorsBSet.has(d) ? 'success' : 'muted';
                  else if (d === phase3CurrentValue) state = 'current';
                  return <Chip key={d} value={d} state={state} />;
                })}
              </div>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>ตัวหารของ {b}:</span>
              <div className={styles.chipRow}>
                {divisorsB.map((d) => {
                  const state: CellState = d === phase3CurrentValue ? 'current' : commonSoFar.includes(d) ? 'success' : 'default';
                  return <Chip key={d} value={d} state={state} />;
                })}
              </div>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareLabel}>ตัวหารร่วม:</span>
              <div className={styles.chipRow}>
                {commonSoFar.length === 0 && <span className={styles.hookSub}>ยังไม่พบ</span>}
                {commonSoFar.map((d) => (
                  <Chip key={d} value={d} state="success" />
                ))}
              </div>
            </div>
          </div>

          <div className={showCrown ? `${styles.crownBlock} ${styles.crownBlockActive}` : styles.crownBlock}>
            {showCrown ? (
              <>
                <span className={styles.crownIcon} aria-hidden="true">
                  👑
                </span>
                <span className={styles.crownValue}>gcd({a},{b}) = {result}</span>
              </>
            ) : (
              <span className={styles.hookSub}>4. รอผลลัพธ์...</span>
            )}
          </div>

          <PredictReveal question="a = 20, b = 8 → a mod b เท่ากับเท่าไร?">
            <p>20 = 8×2 + 4 → a mod b = 4</p>
          </PredictReveal>
        </div>
      }
    />
  );
}
