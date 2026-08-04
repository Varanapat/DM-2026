import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { primeFactorization } from '@/utils/algorithms/factorization';
import styles from './GcdPrimeFactorizationVisualizer.module.css';

function clampInput(v: number): number {
  if (Number.isNaN(v)) return 1;
  return Math.min(Math.max(Math.trunc(v), 1), 100);
}

function factorizationString(powers: { prime: number; exponent: number }[], n: number): string {
  if (powers.length === 0) return `${n} = 1`;
  const expanded = powers.flatMap((p) => Array(p.exponent).fill(p.prime)).join(' × ');
  const powered = powers.map((p) => (p.exponent > 1 ? `${p.prime}^${p.exponent}` : `${p.prime}`)).join('×');
  return `${n} = ${expanded} = ${powered}`;
}

function Chip({ value, className }: { value: number | string; className: string }) {
  return <span className={`${styles.chip} ${className}`}>{value}</span>;
}

export function GcdPrimeFactorizationVisualizer() {
  const [a, setA] = useState(24);
  const [b, setB] = useState(36);
  const resetKey = `${a}:${b}`;

  const powersA = useMemo(() => primeFactorization(a), [a]);
  const powersB = useMemo(() => primeFactorization(b), [b]);

  const primeRows = useMemo(() => {
    const map = new Map<number, { expA: number; expB: number }>();
    powersA.forEach(({ prime, exponent }) => {
      map.set(prime, { expA: exponent, expB: map.get(prime)?.expB ?? 0 });
    });
    powersB.forEach(({ prime, exponent }) => {
      map.set(prime, { expA: map.get(prime)?.expA ?? 0, expB: exponent });
    });
    return Array.from(map.entries())
      .map(([prime, { expA, expB }]) => ({ prime, expA, expB, expMin: Math.min(expA, expB), isMatch: expA > 0 && expB > 0 }))
      .sort((x, y) => x.prime - y.prime);
  }, [powersA, powersB]);

  const matchedRows = useMemo(() => primeRows.filter((r) => r.isMatch), [primeRows]);
  const theGcd = useMemo(() => matchedRows.reduce((acc, r) => acc * r.prime ** r.expMin, 1), [matchedRows]);

  const totalBeats = primeRows.length + 2;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, resetKey);
  const pickedCount = Math.min(beatIndex, primeRows.length);
  const isFinal = beatIndex >= primeRows.length + 1;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = primeRows.slice(0, pickedCount).map((row) =>
      row.isMatch
        ? {
            swatchColor: 'var(--color-success)',
            text: `p=${row.prime}: A=${row.prime}^${row.expA}, B=${row.prime}^${row.expB} → ตรงกันทั้งคู่ เลือกกำลังต่ำสุด ${row.prime}^${row.expMin}`,
          }
        : {
            swatchColor: 'var(--color-border)',
            text: `p=${row.prime}: มีแค่ฝั่ง${row.expA > 0 ? 'A' : 'B'} (${row.prime}^${row.expA > 0 ? row.expA : row.expB}) → ไม่ตรงกัน ไม่นับ`,
          },
    );
    if (isFinal) {
      const formula = matchedRows.map((r) => (r.expMin > 1 ? `${r.prime}^${r.expMin}` : `${r.prime}`)).join(' × ');
      lines.push({ emphasis: true, text: `GCD = ${formula || 1} = ${theGcd}` });
    }
    return lines;
  }, [primeRows, pickedCount, isFinal, matchedRows, theGcd]);

  return (
    <TopicPageStack>
      <DefinitionCard
        formula={
          <>
            gcd(<b>a</b>, <b>b</b>) = ผลคูณของ p<sup>min(eₐ, e_b)</sup> สำหรับทุกจำนวนเฉพาะ p ที่ตรงกัน
          </>
        }
        note={
          <>
            หา GCD อีกวิธีหนึ่งคือแยกทั้งสองจำนวนเป็นผลคูณของจำนวนเฉพาะ หาจำนวนเฉพาะที่<strong>ตรงกันทั้งสองฝั่ง</strong>{' '}
            แล้วเลือก<strong>เลขชี้กำลังต่ำสุด</strong>ของแต่ละตัวมาคูณกัน เช่น <code>24 = 2³×3¹</code> และ <code>36 = 2²×3²</code>{' '}
            — ตัวร่วมคือ 2 กับ 3 เลือกกำลังต่ำสุด <code>2²</code> กับ <code>3¹</code> คูณกันได้ <code>4×3 = 12</code>{' '}
            (ข้อจำกัด: วิธีนี้<strong>ไม่ efficient</strong> เพราะยังไม่มีอัลกอริทึมที่มีประสิทธิภาพสำหรับแยกตัวประกอบเฉพาะของเลขจำนวนมาก
            — ต่างจาก Euclidean Algorithm ที่เร็วกว่ามาก)
          </>
        }
      />
      <VisualizerFrame
        title="GCD by Prime Factorisation"
        headerExtra={
          <div className={styles.inputsRow}>
            <label className={styles.inputGroup}>
              a
              <input type="number" className={styles.numberInput} value={a} onChange={(e) => setA(clampInput(Number(e.target.value)))} />
            </label>
            <label className={styles.inputGroup}>
              b
              <input type="number" className={styles.numberInput} value={b} onChange={(e) => setB(clampInput(Number(e.target.value)))} />
            </label>
          </div>
        }
        monitor={
          <ExecutionMonitor
            hint="Step 1: แยกตัวประกอบเฉพาะทั้งสองจำนวนแล้ว — ไล่เช็คทีละ prime ว่าตรงกันไหม กด ▶"
            lines={monitorLines}
            badge={isFinal ? `GCD(${a}, ${b}) = ${theGcd}` : undefined}
          />
        }
        footer={
          <StepController totalSteps={totalBeats} currentStep={beatIndex} mode={mode} onStepChange={setBeatIndex} onModeChange={setMode} />
        }
      >
        <div className={styles.canvas}>
          <div className={styles.factorHeader}>
            <p className={styles.factorLine}>{factorizationString(powersA, a)}</p>
            <p className={styles.factorLine}>{factorizationString(powersB, b)}</p>
          </div>

          {primeRows.length === 0 ? (
            <p className={styles.emptyNote}>a หรือ b เท่ากับ 1 — ไม่มีตัวประกอบเฉพาะให้เทียบ (GCD = 1)</p>
          ) : (
            <>
              <div className={styles.towerRowsWrap}>
                {primeRows.map((row, i) => {
                  const picked = i < pickedCount;
                  return (
                    <div key={row.prime} className={styles.towerGroup}>
                      <p className={styles.towerPrimeLabel}>p = {row.prime}</p>
                      <div className={styles.towerPair}>
                        <div className={styles.towerCol}>
                          <div className={styles.towerStack}>
                            {Array.from({ length: row.expA }, (_, j) => (
                              <span key={j} className={`${styles.unitBlock} ${styles.unitBlockA}`}>
                                {row.prime}
                              </span>
                            ))}
                          </div>
                          <span
                            className={
                              picked && row.isMatch ? `${styles.towerTag} ${styles.towerTagMatch}` : styles.towerTag
                            }
                          >
                            A: {row.prime}^{row.expA}
                          </span>
                        </div>
                        <div className={styles.towerCol}>
                          <div className={styles.towerStack}>
                            {Array.from({ length: row.expB }, (_, j) => (
                              <span key={j} className={`${styles.unitBlock} ${styles.unitBlockB}`}>
                                {row.prime}
                              </span>
                            ))}
                          </div>
                          <span
                            className={
                              picked && row.isMatch ? `${styles.towerTag} ${styles.towerTagMatch}` : styles.towerTag
                            }
                          >
                            B: {row.prime}^{row.expB}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.assemblyBox}>
                <p className={styles.assemblyTitle}>GCD assembly (กำลังต่ำสุดของ prime ที่ตรงกัน)</p>
                <div className={styles.chipRow}>
                  {primeRows.slice(0, pickedCount).map(
                    (row) =>
                      row.isMatch && (
                        <Chip
                          key={row.prime}
                          value={row.expMin > 1 ? `${row.prime}^${row.expMin}` : row.prime}
                          className={styles.chipGreen}
                        />
                      ),
                  )}
                </div>
                {isFinal && <span className={styles.resultBadge}>GCD = {theGcd}</span>}
              </div>
            </>
          )}
        </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
