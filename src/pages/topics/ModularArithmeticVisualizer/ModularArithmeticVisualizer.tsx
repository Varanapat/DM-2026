import { useEffect, useMemo, useRef, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { SliderInput } from '@/components/widgets/SliderInput';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import styles from './ModularArithmeticVisualizer.module.css';

const LAP_PALETTE = ['#38bdf8', 'var(--color-success)', '#a78bfa', '#f472b6', '#fb923c', '#22d3ee'];
const CLOCK_SIZE = 200;

export function ModularArithmeticVisualizer() {
  const [a, setA] = useState(14);
  const [n, setN] = useState(5);
  const autoNext = useRef(false);

  // beats: token walks 0 → a one unit at a time
  const totalBeats = a + 1;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${n}`);

  useEffect(() => {
    if (autoNext.current) {
      autoNext.current = false;
      const t = requestAnimationFrame(() => setMode('auto'));
      return () => cancelAnimationFrame(t);
    }
  }, [a, setMode]);

  const k = beatIndex; // current walked distance
  const lap = Math.floor(k / n);
  const position = k % n;
  const isDone = k === a;
  const finalLap = Math.floor(a / n);
  const finalR = a % n;

  const bump = (delta: number) => {
    autoNext.current = true;
    setA((prev) => Math.min(Math.max(prev + delta, 0), 48));
  };

  // clock geometry
  const center = CLOCK_SIZE / 2;
  const radius = CLOCK_SIZE / 2 - 26;
  const angleOf = (slot: number) => (slot / n) * 2 * Math.PI - Math.PI / 2;
  const handAngleDeg = (k / n) * 360; // continuous, so multiple laps keep rotating

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = Array.from({ length: lap }, (_, q) => ({
      swatchColor: LAP_PALETTE[q % LAP_PALETTE.length],
      text: `ครบรอบที่ ${q + 1}: เดินมาแล้ว ${(q + 1) * n} ก้าว`,
    }));
    if (isDone) {
      lines.push({ emphasis: true, text: `${a} = ${n} × ${finalLap} + ${finalR}` });
    }
    return lines;
  }, [lap, isDone, a, n, finalLap, finalR]);

  return (
    <VisualizerFrame
      title="Modular Arithmetic — นาฬิกา mod n"
      headerExtra={
        <div className={styles.controls}>
          <SliderInput label="เดิน a ก้าว" min={0} max={48} value={a} onChange={setA} />
          <SliderInput label="นาฬิกา n ช่อง" min={2} max={12} value={n} onChange={setN} />
          <div className={styles.quickRow}>
            <button type="button" className={styles.quickBtn} onClick={() => bump(1)}>
              +1
            </button>
            <button type="button" className={styles.quickBtn} onClick={() => bump(10)}>
              +10
            </button>
          </div>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`เดิน ${a} ก้าวบนนาฬิกา ${n} ช่อง — กด ▶ แล้วดูว่าเข็มวนกี่รอบ`}
          lines={monitorLines}
          badge={isDone ? `${a} mod ${n} = ${finalR}` : undefined}
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
        <div className={styles.walkLine}>
          {Array.from({ length: a + 1 }, (_, i) => {
            const isLapMark = i > 0 && i % n === 0;
            const walked = i <= k;
            return (
              <span
                key={i}
                className={`${styles.walkTick} ${walked ? styles.walkTickDone : ''} ${i === k ? styles.walkTickCurrent : ''}`}
                style={walked && i > 0 ? ({ '--lap-color': LAP_PALETTE[Math.floor((i - 1) / n) % LAP_PALETTE.length] } as React.CSSProperties) : undefined}
              >
                {(isLapMark || i === 0 || i === a) && <span className={styles.walkLabel}>{i}</span>}
              </span>
            );
          })}
        </div>

        <svg
          className={styles.clock}
          viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
          role="img"
          aria-label={`นาฬิกา mod ${n} — ตอนนี้อยู่ที่ ${position}`}
        >
          <circle className={styles.face} cx={center} cy={center} r={radius + 14} />

          {Array.from({ length: Math.min(lap, 6) }, (_, q) => (
            <circle
              key={q}
              className={styles.lapArc}
              cx={center}
              cy={center}
              r={radius - 8 - q * 5}
              style={{ stroke: LAP_PALETTE[q % LAP_PALETTE.length] }}
            />
          ))}

          {Array.from({ length: n }, (_, slot) => {
            const x = center + radius * Math.cos(angleOf(slot));
            const y = center + radius * Math.sin(angleOf(slot));
            const isLanding = isDone && slot === position;
            return (
              <g key={slot}>
                {isLanding && <circle className={styles.landingGlow} cx={x} cy={y} r={13} />}
                <text
                  className={isLanding ? `${styles.tickLabel} ${styles.tickLabelLanding}` : styles.tickLabel}
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

          <g className={styles.handGroup} style={{ transform: `rotate(${handAngleDeg}deg)` }}>
            <line className={styles.hand} x1={center} y1={center} x2={center} y2={center - radius * 0.72} />
          </g>
          <circle cx={center} cy={center} r={4.5} className={styles.handHub} />
        </svg>

        <p className={styles.readout}>
          เดินแล้ว <strong>{k}</strong> ก้าว → วนครบ <strong>{lap}</strong> รอบ เหลือ <strong>{position}</strong>
        </p>
      </div>
    </VisualizerFrame>
  );
}
