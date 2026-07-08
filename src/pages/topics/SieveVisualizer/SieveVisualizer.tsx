import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { NumberGrid } from '@/components/widgets/NumberGrid';
import type { CellState, CellDecor } from '@/components/widgets/NumberGrid';
import { SliderInput } from '@/components/widgets/SliderInput';
import { PredictReveal } from '@/components/widgets/PredictReveal';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { sieveRounds, primesUpTo } from '@/utils/algorithms/sieve';
import styles from './SieveVisualizer.module.css';

const ROUND_PALETTE = ['#38bdf8', 'var(--color-success)', '#a78bfa', '#f472b6', '#fb923c', '#22d3ee'];

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

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = rounds.slice(0, Math.max(currentRound + 1, 0)).map((round, r) => ({
      swatchColor: ROUND_PALETTE[r % ROUND_PALETTE.length],
      text:
        round.crossed.length > 0
          ? `รอบ p=${round.prime}: ตัด ${round.crossed.length} ตัว (เริ่มที่ ${round.prime}²=${round.firstCross})`
          : `รอบ p=${round.prime}: ไม่เหลืออะไรให้ตัด`,
    }));
    if (isFinal) {
      lines.push({ text: `หยุดได้เพราะ p ถัดไป > √${max} — ที่เหลือคือจำนวนเฉพาะทั้งหมด`, emphasis: true });
    }
    return lines;
  }, [rounds, currentRound, isFinal, max]);

  const nextRound = !isFinal && currentRound + 1 < rounds.length ? rounds[currentRound + 1] : null;

  return (
    <VisualizerFrame
      title="Sieve of Eratosthenes"
      headerExtra={
        <div className={styles.controls}>
          <SliderInput label="ตะแกรงถึง" min={30} max={120} step={10} value={max} onChange={setMax} />
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
          showReset={false}
        />
      }
    >
      <div className={styles.canvas}>
        {nextRound && (
          <PredictReveal key={`predict-${currentRound}`} question={`รอบต่อไปใช้ p=${nextRound.prime} — จะเริ่มตัดที่เลขอะไร?`}>
            <p className={styles.predictAnswer}>
              เริ่มที่ <strong>{nextRound.prime}² = {nextRound.firstCross ?? '—'}</strong> เพราะตัวคูณที่เล็กกว่านั้นโดนรอบก่อน ๆ
              ตัดไปหมดแล้ว
            </p>
          </PredictReveal>
        )}
        <NumberGrid max={max} start={2} cellStates={cellStates} cellDecor={cellDecor} compact disabled />
      </div>
    </VisualizerFrame>
  );
}
