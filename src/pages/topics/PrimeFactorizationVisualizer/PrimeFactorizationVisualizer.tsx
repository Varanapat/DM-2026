import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { isPrime, primeFactorization } from '@/utils/algorithms/factorization';
import { buildTree, layoutTree, countSplits, altFirstPair, type PlacedNode } from './factorTreeModel';
import styles from './PrimeFactorizationVisualizer.module.css';

function clampN(v: number): number {
  if (Number.isNaN(v)) return 2;
  return Math.min(Math.max(Math.trunc(v), 2), 400);
}

interface TreeStageProps {
  nodes: PlacedNode[];
  width: number;
  depth: number;
  visibleSplits: number;
  onNodeClick?: (node: PlacedNode) => void;
}

function TreeStage({ nodes, width, depth, visibleSplits, onNodeClick }: TreeStageProps) {
  const CELL_W = 15;
  const CELL_H = 14;
  const PAD = 8;
  const viewW = width * CELL_W + PAD * 2;
  const viewH = (depth + 1) * CELL_H + PAD * 2;
  const px = (x: number) => PAD + x * CELL_W;
  const py = (y: number) => PAD + y * CELL_H + 4;

  const visible = nodes.filter((n) => n.revealedBySplit < visibleSplits);
  const isLeafNow = (n: PlacedNode) => n.isPrime || (n.splitIndex !== undefined && n.splitIndex >= visibleSplits);

  return (
    <svg className={styles.stage} viewBox={`0 0 ${viewW} ${viewH}`} role="img" aria-label="ต้นไม้แยกตัวประกอบ">
      {visible
        .filter((n) => n.parent && n.revealedBySplit < visibleSplits)
        .map((n, i) => (
          <line key={`e${i}`} className={styles.edge} x1={px(n.parent!.x)} y1={py(n.parent!.y)} x2={px(n.x)} y2={py(n.y)} />
        ))}
      {visible.map((n, i) => {
        const leaf = isLeafNow(n);
        const gold = leaf && n.isPrime;
        const splittable = leaf && !n.isPrime;
        return (
          <g
            key={`n${i}`}
            className={splittable && onNodeClick ? styles.nodeClickable : undefined}
            onClick={splittable && onNodeClick ? () => onNodeClick(n) : undefined}
          >
            <circle
              className={gold ? `${styles.node} ${styles.nodeGold}` : splittable ? `${styles.node} ${styles.nodeComposite}` : `${styles.node} ${styles.nodeInner}`}
              cx={px(n.x)}
              cy={py(n.y)}
              r={5.6}
            />
            <text className={gold ? `${styles.nodeText} ${styles.nodeTextGold}` : styles.nodeText} x={px(n.x)} y={py(n.y)} textAnchor="middle" dominantBaseline="middle">
              {n.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function PrimeFactorizationVisualizer() {
  const [n, setN] = useState(360);

  const mainTree = useMemo(() => buildTree(n), [n]);
  const mainLayout = useMemo(() => layoutTree(mainTree), [mainTree]);
  const mainSplits = useMemo(() => countSplits(mainTree), [mainTree]);

  const altPair = useMemo(() => altFirstPair(n), [n]);
  const altLayout = useMemo(() => (altPair ? layoutTree(buildTree(n, altPair)) : null), [n, altPair]);

  const powers = useMemo(() => primeFactorization(n), [n]);

  // beats: setup, one per split, formula assembly, uniqueness (if an alt tree exists)
  const totalBeats = 1 + mainSplits + 1 + (altLayout ? 1 : 0);
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${n}`);

  const visibleSplits = Math.min(Math.max(beatIndex, 0), mainSplits);
  const isFormula = beatIndex >= mainSplits + 1;
  const isUniqueness = altLayout !== null && beatIndex >= mainSplits + 2;

  const splitLines = useMemo(() => {
    return mainLayout.nodes
      .filter((node) => node.splitIndex !== undefined)
      .sort((a, b) => (a.splitIndex ?? 0) - (b.splitIndex ?? 0))
      .map((node) => {
        const children = mainLayout.nodes.filter((c) => c.parent && c.parent.x === node.x && c.parent.y === node.y);
        return { value: node.value, a: children[0]?.value, b: children[1]?.value, splitIndex: node.splitIndex ?? 0 };
      });
  }, [mainLayout]);

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = splitLines
      .filter((s) => s.splitIndex < visibleSplits)
      .map((s) => ({ swatchColor: '#38bdf8', text: `${s.value} = ${s.a} × ${s.b}` }));
    if (isFormula) {
      lines.push({
        emphasis: true,
        swatchColor: 'var(--color-secondary)',
        text: `${n} = ${powers.map(({ prime, exponent }) => (exponent > 1 ? `${prime}^${exponent}` : `${prime}`)).join(' × ')}`,
      });
    }
    if (isUniqueness) {
      lines.push({ emphasis: true, text: 'แตกต้นไม้คนละทาง แต่ใบ prime ชุดเดียวกันเสมอ (FTA)' });
    }
    return lines;
  }, [splitLines, visibleSplits, isFormula, isUniqueness, n, powers]);

  return (
    <VisualizerFrame
      title="Prime Factorization — ต้นไม้ตัวประกอบ"
      headerExtra={
        <div className={styles.headerRow}>
          <label className={styles.inputGroup}>
            n
            <input type="number" className={styles.numberInput} value={n} onChange={(e) => setN(clampN(Number(e.target.value)))} />
          </label>
          <button type="button" className={styles.randomBtn} onClick={() => setN(4 + Math.floor(Math.random() * 397))}>
            🎲 สุ่มเลขใหม่
          </button>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={
            isPrime(n)
              ? `${n} เป็นจำนวนเฉพาะอยู่แล้ว — ต้นไม้มีใบเดียว ลองเลขอื่นดู`
              : `กด ▶ หรือกดโหนดที่ยังไม่เป็นสีทองเพื่อแตกกิ่งเอง`
          }
          lines={monitorLines}
          badge={isFormula ? `${n} = ${powers.map(({ prime, exponent }) => (exponent > 1 ? `${prime}^${exponent}` : `${prime}`)).join('·')}` : undefined}
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
        <div className={styles.treesRow}>
          <div className={styles.treeBlock}>
            {isUniqueness && <p className={styles.treeCaption}>แบบที่ 1: เริ่มจาก {splitLines[0]?.a} × {splitLines[0]?.b}</p>}
            <TreeStage
              nodes={mainLayout.nodes}
              width={mainLayout.width}
              depth={mainLayout.depth}
              visibleSplits={visibleSplits}
              onNodeClick={() => setBeatIndex(Math.min(beatIndex + 1, totalBeats - 1))}
            />
          </div>
          {isUniqueness && altLayout && altPair && (
            <div className={styles.treeBlock}>
              <p className={styles.treeCaption}>
                แบบที่ 2: เริ่มจาก {altPair[0]} × {altPair[1]}
              </p>
              <TreeStage nodes={altLayout.nodes} width={altLayout.width} depth={altLayout.depth} visibleSplits={Infinity} />
            </div>
          )}
        </div>

        {isFormula && (
          <div className={styles.formulaBar}>
            {powers.map(({ prime, exponent }, i) => (
              <span key={prime} className={styles.formulaChip} style={{ '--chip-index': i } as React.CSSProperties}>
                {prime}
                {exponent > 1 && <sup>{exponent}</sup>}
              </span>
            ))}
            <span className={styles.formulaEquals}>= {n}</span>
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
