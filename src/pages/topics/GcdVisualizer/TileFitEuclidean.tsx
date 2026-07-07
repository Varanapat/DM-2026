import { useId, useMemo } from 'react';
import { gcd, gcdSteps, type EuclideanStep } from '@/utils/algorithms/euclidean';
import styles from './TileFitEuclidean.module.css';

export type EuclideanBeat = { kind: 'setup' } | { kind: 'fit'; round: number };

export function computeEuclideanBeats(a: number, b: number): { beats: EuclideanBeat[]; steps: EuclideanStep[] } {
  const steps = gcdSteps(Math.max(a, b), Math.min(a, b));
  const beats: EuclideanBeat[] = [{ kind: 'setup' }, ...steps.map((_, round) => ({ kind: 'fit' as const, round }))];
  return { beats, steps };
}

interface UnitRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface RoundGeometry {
  step: EuclideanStep;
  squares: { x: number; y: number; size: number }[];
  leftover: UnitRect | null;
}

/** Recursive in-place tiling: each round fills its region with the largest
 * possible squares; the leftover strip keeps its exact grid position so
 * spatial scale never resets between rounds. */
function computeRounds(steps: EuclideanStep[]): RoundGeometry[] {
  let region: UnitRect = { x: 0, y: 0, w: steps[0]?.a ?? 1, h: steps[0]?.b ?? 1 };
  return steps.map((step) => {
    const landscape = region.w >= region.h;
    const size = step.b;
    const squares = Array.from({ length: step.quotient }, (_, i) =>
      landscape ? { x: region.x + i * size, y: region.y, size } : { x: region.x, y: region.y + i * size, size },
    );
    const leftover: UnitRect | null =
      step.remainder > 0
        ? landscape
          ? { x: region.x + step.quotient * size, y: region.y, w: step.remainder, h: region.h }
          : { x: region.x, y: region.y + step.quotient * size, w: region.w, h: step.remainder }
        : null;
    const round = { step, squares, leftover };
    if (leftover) region = leftover;
    return round;
  });
}

const VIEW_W = 100;
const VIEW_H = 64;
const MARGIN = { top: 9, right: 8, bottom: 5, left: 7 };
const MAX_FLOOR_W = VIEW_W - MARGIN.left - MARGIN.right;
const MAX_FLOOR_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const TILE_GAP = 0.5;
const GRID_MIN_UNIT = 1.2;

const PALETTE = ['var(--tile-blue)', 'var(--tile-green)', 'var(--tile-purple)', 'var(--tile-pink)'];

interface TileFitEuclideanProps {
  a: number;
  b: number;
  beatIndex: number;
}

export function TileFitEuclidean({ a, b, beatIndex }: TileFitEuclideanProps) {
  const gridPatternId = useId();
  const { beats, steps } = useMemo(() => computeEuclideanBeats(a, b), [a, b]);
  const rounds = useMemo(() => computeRounds(steps), [steps]);
  const result = gcd(a, b);

  const beat = beats[Math.min(beatIndex, beats.length - 1)] ?? beats[0];
  const currentRound = beat.kind === 'setup' ? -1 : beat.round;
  const isDone = currentRound === rounds.length - 1;

  const floorW = Math.max(a, b);
  const floorH = Math.min(a, b);
  const scale = Math.min(MAX_FLOOR_W / floorW, MAX_FLOOR_H / floorH);
  const floor = {
    x: MARGIN.left + (MAX_FLOOR_W - floorW * scale) / 2,
    y: MARGIN.top + (MAX_FLOOR_H - floorH * scale) / 2,
    w: floorW * scale,
    h: floorH * scale,
  };
  const toX = (u: number) => floor.x + u * scale;
  const toY = (u: number) => floor.y + u * scale;

  const activeLeftover = currentRound >= 0 ? rounds[currentRound].leftover : null;
  const showGrid = scale >= GRID_MIN_UNIT;

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <div className={styles.canvasArea}>
          <svg className={styles.stage} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="เรขาคณิตแสดงขั้นตอนยูคลิด">
            <defs>
              <pattern
                id={gridPatternId}
                patternUnits="userSpaceOnUse"
                x={floor.x}
                y={floor.y}
                width={scale}
                height={scale}
              >
                <path d={`M ${scale} 0 L 0 0 0 ${scale}`} className={styles.gridLine} />
              </pattern>
            </defs>

            <text className={styles.axisLabel} x={floor.x + floor.w / 2} y={floor.y - 3} textAnchor="middle">
              กว้าง {floorW}
            </text>
            <text
              className={styles.axisLabel}
              x={floor.x + floor.w + 3.2}
              y={floor.y + floor.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(90, ${floor.x + floor.w + 3.2}, ${floor.y + floor.h / 2})`}
            >
              สูง {floorH}
            </text>

            <rect
              className={`${styles.floor} ${isDone ? styles.floorDone : ''}`}
              x={floor.x}
              y={floor.y}
              width={floor.w}
              height={floor.h}
              rx={1}
            />
            {rounds.slice(0, currentRound + 1).map((round, r) =>
              round.squares.map((sq, i) => (
                <rect
                  key={`${r}-${i}`}
                  className={`${styles.tile} ${r === currentRound && isDone ? styles.tileDone : ''}`}
                  style={{ '--tile-index': r === currentRound ? i : 0, fill: PALETTE[r % PALETTE.length] } as React.CSSProperties}
                  x={toX(sq.x) + TILE_GAP / 2}
                  y={toY(sq.y) + TILE_GAP / 2}
                  width={Math.max(sq.size * scale - TILE_GAP, 0.4)}
                  height={Math.max(sq.size * scale - TILE_GAP, 0.4)}
                  rx={0.8}
                />
              )),
            )}

            {showGrid && (
              <rect x={floor.x} y={floor.y} width={floor.w} height={floor.h} fill={`url(#${gridPatternId})`} pointerEvents="none" />
            )}

            {activeLeftover && (
              <rect
                className={styles.ghost}
                x={toX(activeLeftover.x)}
                y={toY(activeLeftover.y)}
                width={activeLeftover.w * scale}
                height={activeLeftover.h * scale}
                rx={0.8}
              />
            )}

            {activeLeftover && activeLeftover.w * scale > 3 && activeLeftover.h * scale > 3 && (
              <text
                className={styles.ghostLabel}
                x={toX(activeLeftover.x) + (activeLeftover.w * scale) / 2}
                y={toY(activeLeftover.y) + (activeLeftover.h * scale) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {rounds[currentRound].step.remainder}
              </text>
            )}
          </svg>
        </div>

        <aside className={styles.sidePanel}>
          <p className={styles.monitorTitle}>Execution Monitor</p>

          {currentRound < 0 ? (
            <p className={styles.monitorHint}>
              พื้นที่ {floorW} × {floorH} — กด ▶ เพื่อเริ่มปูตาราง
            </p>
          ) : (
            <div className={styles.log}>
              {rounds.slice(0, currentRound + 1).map((round, r) => (
                <div key={r} className={styles.logRow} style={{ '--tile-index': 0 } as React.CSSProperties}>
                  <span className={styles.logSwatch} style={{ background: PALETTE[r % PALETTE.length] }} />
                  <span className={styles.logText}>
                    GCD({round.step.a}, {round.step.b}) ➔ {round.step.a} mod {round.step.b} = {round.step.remainder}
                  </span>
                </div>
              ))}
            </div>
          )}

          {isDone && <span className={styles.doneBadge}>GCD found: {result}!</span>}
        </aside>
      </div>
    </div>
  );
}
