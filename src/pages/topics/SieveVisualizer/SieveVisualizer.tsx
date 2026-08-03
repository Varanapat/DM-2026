import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState, CellDecor } from '@/components/widgets/NumberGrid';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { sieveRounds, primesUpTo } from '@/utils/algorithms/sieve';
import styles from './SieveVisualizer.module.css';

const ROUND_PALETTE = ['#38bdf8', 'var(--color-success)', '#a78bfa', '#f472b6', '#fb923c', '#22d3ee'];

function clampMax(v: number): number {
  if (Number.isNaN(v)) return 30;
  return Math.min(Math.max(Math.trunc(v), 10), 120);
}

export function SieveVisualizer() {
  const [max, setMax] = useState(60);

  const rounds = useMemo(() => sieveRounds(max), [max]);
  const primes = useMemo(() => primesUpTo(max), [max]);

  // beats: setup, one per round, final "survivors are prime"
  const totalBeats = rounds.length + 2;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${max}`);

  const currentRound = Math.min(beatIndex - 1, rounds.length - 1); // -1 during setup
  const isFinal = beatIndex >= rounds.length + 1;

  const { cellStates, cellDecor } = useMemo(() => {
    const states: Record<number, CellState> = {};
    const decor: Record<number, CellDecor> = {};

    rounds.forEach((round, r) => {
      if (r > currentRound) return;
      const isActive = r === currentRound && !isFinal;
      states[round.prime] = isActive ? 'current' : 'gold';
      round.crossed.forEach((value, i) => {
        states[value] = 'crossed';
        decor[value] = {
          annotationColor: ROUND_PALETTE[r % ROUND_PALETTE.length],
          delayIndex: isActive ? i : 0,
          title: `โดนตัดโดย ${round.prime} (รอบที่ ${r + 1})`,
        };
      });
    });

    if (isFinal) {
      primes.forEach((p, i) => {
        states[p] = 'gold';
        decor[p] = { ...decor[p], delayIndex: i, title: `${p} เป็นจำนวนเฉพาะ` };
      });
    }

    return { cellStates: states, cellDecor: decor };
  }, [rounds, primes, currentRound, isFinal]);

  const sqrtMax = Math.sqrt(max);
  const basePrimes = useMemo(() => rounds.map((r) => r.prime), [rounds]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = [
      {
        swatchColor: 'var(--color-secondary)',
        text:
          basePrimes.length > 0
            ? `√${max} ≈ ${sqrtMax.toFixed(2)} → เช็คตัวหารเฉพาะได้ถึง ${Math.floor(sqrtMax)}: ${basePrimes.join(', ')}`
            : `√${max} ≈ ${sqrtMax.toFixed(2)} → ไม่มีตัวหารเฉพาะให้เช็ค (n เล็กเกินไป)`,
      },
      ...rounds.slice(0, Math.max(currentRound + 1, 0)).map((round, r) => ({
        swatchColor: ROUND_PALETTE[r % ROUND_PALETTE.length],
        text:
          round.crossed.length > 0
            ? `รอบ p=${round.prime}: ตัด ${round.crossed.length} ตัว (เริ่มที่ ${round.prime}²=${round.firstCross})`
            : `รอบ p=${round.prime}: ไม่เหลืออะไรให้ตัด`,
      })),
    ];
    if (isFinal) {
      lines.push({ text: `หยุดได้เพราะ p ถัดไป > √${max} — ที่เหลือคือจำนวนเฉพาะทั้งหมด`, emphasis: true });
    }
    return lines;
  }, [rounds, currentRound, isFinal, max, basePrimes, sqrtMax]);

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            ตะแกรงเอราทอสเทนีส คือ อัลกอริทึมสำหรับหาจำนวนเฉพาะทั้งหมดในช่วง <code>2</code> ถึง <code>n</code> โดยไล่ "ขีดฆ่า"
            พหุคูณของจำนวนเฉพาะทีละตัว สิ่งที่รอดเหลือคือจำนวนเฉพาะ
          </>
        }
        formula={
          <>
            <b>C</b> = {'{ k·p : p เป็นจำนวนเฉพาะ, p ≤ √n, k ≥ 2, k·p ≤ n }'}
          </>
        }
        note={
          <>
            วางตัวเลข <code>2</code> ถึง <code>n</code> เรียงกันเป็นแถว สมมติทุกตัวเป็นจำนวนเฉพาะไว้ก่อน จากนั้นทำซ้ำสองจังหวะ:
            หยิบเลขตัวเล็กสุดที่ยังไม่ถูกขีด — นั่นคือ<strong>จำนวนเฉพาะตัวถัดไป</strong> — แล้วขีดฆ่าพหุคูณของมันทั้งหมดทิ้ง
            เพราะเลขที่หารด้วยมันลงตัวย่อมไม่ใช่จำนวนเฉพาะ
          </>
        }
      />
      <VisualizerFrame
      title="Sieve of Eratosthenes"
      headerExtra={
        <div className={styles.header}>
          <div className={styles.inputRow}>
            <label className={styles.inputGroup}>
              ตะแกรงถึง
              <input
                type="number"
                className={styles.numberInput}
                value={max}
                onChange={(e) => setMax(clampMax(Number(e.target.value)))}
              />
            </label>
            <button type="button" className={styles.randomBtn} onClick={() => setMax(10 + Math.floor(Math.random() * 111))}>
              🎲 สุ่มเลขใหม่
            </button>
          </div>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`ตาราง 2–${max} — กด ▶ เพื่อเริ่มกรองทีละรอบ`}
          lines={monitorLines}
          badge={isFinal ? `เหลือ ${primes.length} จำนวนเฉพาะ!` : undefined}
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
        <NumberGrid max={max} start={2} cellStates={cellStates} cellDecor={cellDecor} compact disabled />
      </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
