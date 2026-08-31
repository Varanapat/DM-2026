import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState, CellDecor } from '@/components/widgets/NumberGrid';
import { SliderInput } from '@/components/widgets/SliderInput';
import { EquationHighlighter } from '@/components/widgets/EquationHighlighter';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, DefinitionStatement, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { gcdSteps } from '@/utils/algorithms/euclidean';
import { gcdTable, totient } from '@/utils/algorithms/modular';
import { primeFactorization } from '@/utils/algorithms/factorization';
import styles from './EulerTotientVisualizer.module.css';

const BATCH = 6;

function gcdTraceTitle(k: number, n: number): string {
  const steps = gcdSteps(Math.max(k, n), Math.min(k, n) || Math.max(k, n));
  const chain = steps.map((s) => `${s.a}=${s.quotient}·${s.b}+${s.remainder}`).join(', ');
  const g = steps.length > 0 ? steps[steps.length - 1].b : Math.max(k, n);
  return `gcd(${k}, ${n}): ${chain} → ${g}`;
}

export function EulerTotientVisualizer() {
  const [n, setN] = useState(12);

  const table = useMemo(() => gcdTable(n), [n]);
  const phi = useMemo(() => totient(n), [n]);
  const primes = useMemo(() => primeFactorization(n), [n]);

  const scanBeats = Math.ceil(n / BATCH);
  // beats: setup, scan batches, count reveal, one per formula term, final compute
  const totalBeats = 1 + scanBeats + 1 + primes.length + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${n}`);

  const scanned = Math.min(Math.max(beatIndex, 0) * BATCH, n);
  const isRevealed = beatIndex >= 1 + scanBeats;
  const formulaTerms = Math.min(Math.max(beatIndex - (1 + scanBeats) - 1 + 1, 0), primes.length);
  const isComputed = beatIndex >= totalBeats - 1;

  const { cellStates, cellDecor } = useMemo(() => {
    const states: Record<number, CellState> = {};
    const decor: Record<number, CellDecor> = {};
    table.slice(0, scanned).forEach(({ k, g }, i) => {
      const inNewBatch = i >= scanned - BATCH;
      if (g === 1) {
        states[k] = 'success';
        decor[k] = { delayIndex: inNewBatch ? i % BATCH : 0, title: gcdTraceTitle(k, n) };
      } else {
        states[k] = 'fallen';
        decor[k] = { title: `gcd(${k}, ${n}) = ${g} — ไม่ coprime` };
      }
    });
    return { cellStates: states, cellDecor: decor };
  }, [table, scanned, n]);

  const runningCount = useMemo(() => table.slice(0, scanned).filter(({ g }) => g === 1).length, [table, scanned]);

  const formulaExpression = useMemo(() => {
    if (formulaTerms === 0) return '';
    const terms = primes
      .slice(0, formulaTerms)
      .map(({ prime }) => `\\left(1-\\tfrac{1}{${prime}}\\right)`)
      .join(' \\times ');
    const tail = isComputed ? ` = ${phi}` : '';
    return `\\varphi(${n}) = ${n} \\times ${terms}${tail}`;
  }, [formulaTerms, primes, n, phi, isComputed]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = [];
    for (let bIdx = 0; bIdx < Math.min(Math.max(beatIndex, 0), scanBeats); bIdx++) {
      const from = bIdx * BATCH + 1;
      const to = Math.min((bIdx + 1) * BATCH, n);
      const found = table.slice(from - 1, to).filter(({ g }) => g === 1).length;
      lines.push({ text: `สแกน ${from}–${to}: เจอ coprime ${found} ตัว` });
    }
    if (isRevealed) {
      lines.push({ emphasis: true, swatchColor: 'var(--color-success)', text: `นับได้ φ(${n}) = ${phi}` });
    }
    primes.slice(0, formulaTerms).forEach(({ prime }) => {
      lines.push({ swatchColor: 'var(--color-secondary)', text: `ตัวประกอบเฉพาะ ${prime} → คูณ (1 − 1/${prime})` });
    });
    if (isComputed) {
      lines.push({ emphasis: true, text: `สูตรให้ ${phi} ตรงกับที่นับได้ ✓` });
    }
    return lines;
  }, [beatIndex, scanBeats, n, table, isRevealed, phi, primes, formulaTerms, isComputed]);

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            ฟังก์ชันในทางทฤษฎีจำนวนที่ใช้นับจำนวนเต็มบวก <code>m</code> ทั้งหมดที่น้อยกว่าหรือเท่ากับ <code>n</code>{' '}
            ซึ่งเป็นจำนวนเฉพาะสัมพัทธ์ (coprime หรือ relatively prime) กับ <code>n</code> (กล่าวคือ ห.ร.ม. ของ m และ n
            มีค่าเท่ากับ 1 หรือ gcd(m, n) = 1)
          </>
        }
        formula={
          <>
            φ(<b>n</b>) = จำนวนสมาชิกของ {'{ '}
            <b>k</b> ∈ ℤ : 1 ≤ <b>k</b> ≤ <b>n</b> และ gcd(<b>k</b>, <b>n</b>) = 1{' }'}
          </>
        }
        note={
          <DefinitionStatement
            given={
              <>
                ให้ <code>n</code> เป็นจำนวนเต็มบวก
              </>
            }
            claim={
              <>
                <strong>ฟังก์ชันออยเลอร์</strong> <code>φ(n)</code> นิยามให้เป็นขนาดของเซตด้านบน คือนับดูว่าในช่วง 1 ถึง n
                มีจำนวนเต็มกี่ตัวที่ <code>gcd(k, n) = 1</code>
              </>
            }
            restate={<>หรือกล่าวได้ว่า φ(n) คือจำนวนของจำนวนเต็มตั้งแต่ 1 ถึง n ที่เป็นจำนวนเฉพาะสัมพัทธ์กับ n</>}
          />
        }
      />
      <VisualizerFrame
      title="Euler's Totient — นับจำนวนที่ coprime กับ n"
      headerExtra={
        <div className={styles.controls}>
          <SliderInput label="n" min={2} max={36} value={n} onChange={setN} />
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`จะสแกน k = 1..${n} แล้วเก็บเฉพาะตัวที่ gcd(k, ${n}) = 1 — กด ▶`}
          lines={monitorLines}
          badge={isRevealed ? `φ(${n}) = ${phi}` : undefined}
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

        <div className={styles.counterRow}>
          <span className={styles.counter}>
            เจอแล้ว <strong>{runningCount}</strong> ตัว
          </span>
          <span className={styles.counterHint}>(ชี้เลขที่รอดเพื่อดูเส้นทาง gcd)</span>
        </div>

        <NumberGrid max={n} cellStates={cellStates} cellDecor={cellDecor} disabled={false} />

        {formulaTerms > 0 && (
          <div className={styles.formulaBox}>
            <EquationHighlighter
              expression={formulaExpression}
              highlightTerm={primes[formulaTerms - 1] ? `\\left(1-\\tfrac{1}{${primes[formulaTerms - 1].prime}}\\right)` : undefined}
            />
          </div>
        )}
      </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
