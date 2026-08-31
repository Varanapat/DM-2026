import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { encryptSteps, modInverse, type CipherMode } from '@/utils/algorithms/cipher';
import styles from './ClassicalCiphersVisualizer.module.css';

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.min(Math.max(Math.trunc(v), lo), hi);
}

export function ClassicalCiphersVisualizer() {
  const [message, setMessage] = useState('HELLO WORLD');
  const [mode, setMode] = useState<CipherMode>('shift');
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);

  const text = message.toUpperCase().slice(0, 20);
  const steps = useMemo(() => encryptSteps(text, mode, a, b), [text, mode, a, b]);
  const aInverse = mode === 'affine' ? modInverse(a, 26) : null;
  const affineInvalid = mode === 'affine' && aInverse === null;

  const totalBeats = steps.length + 1;
  const { beatIndex, setBeatIndex, mode: playMode, setMode: setPlayMode } = useVisualizerBeats(totalBeats, `${text}:${mode}:${a}:${b}`);

  const shown = Math.min(beatIndex, steps.length);
  const isFinal = beatIndex >= steps.length;
  const current = shown > 0 ? steps[shown - 1] : undefined;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = steps.slice(0, shown).map((s) => {
      if (s.plainNum === null) return { text: `"${s.plainChar}" — ไม่ใช่ตัวอักษร ผ่านไม่เปลี่ยน`, swatchColor: 'var(--color-border)' };
      const formula =
        mode === 'shift'
          ? `(${s.plainNum} + ${b}) mod 26 = ${s.cipherNum}`
          : `(${a}×${s.plainNum} + ${b}) mod 26 = ${s.cipherNum}`;
      return { text: `${s.plainChar} (${s.plainNum}) → ${formula} → ${s.cipherChar}`, swatchColor: 'var(--color-accent)' };
    });
    if (isFinal) {
      lines.push({ emphasis: true, text: `ข้อความเข้ารหัส: ${steps.map((s) => s.cipherChar).join('')}` });
    }
    return lines;
  }, [steps, shown, mode, a, b, isFinal]);

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            วิธีการแปลงข้อความปกติ (Plaintext) ให้กลายเป็นข้อความลับ (Ciphertext) โดยใช้มือหรืออุปกรณ์กลไกง่าย ๆ ในอดีต
            ก่อนที่จะมีคอมพิวเตอร์และระบบดิจิทัลเข้ามาช่วยคำนวณทางคณิตศาสตร์ที่ซับซ้อน
          </>
        }
        formula={
          <>
            Shift: E(p) = (p + <b>b</b>) mod 26 &nbsp;·&nbsp; Affine: E(p) = (<b>a</b>p + <b>b</b>) mod 26
          </>
        }
        note={
          <>
            การเข้ารหัสแบบ Shift/Affine แปลงตัวอักษรเป็นตัวเลข (A=0..Z=25) แล้วบวกหรือคูณด้วยกุญแจภายใต้ mod 26
            ลองนึกภาพหมุนวงล้อตัวอักษร 26 ช่อง — เข้ารหัสคือหมุนไปข้างหน้าตามกุญแจ ถอดรหัสคือหมุนกลับ (Affine ต้องใช้
            <strong>ตัวผกผันมอดุลาร์</strong> <code>a⁻¹</code> จาก Extended Euclidean ในการถอดรหัส)
          </>
        }
      />
      <VisualizerFrame
        headerExtra={
          <div className={styles.header}>
            <label className={styles.messageInputGroup}>
              ข้อความ
              <input
                type="text"
                className={styles.messageInput}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={20}
              />
            </label>
            <div className={styles.modeToggle} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'shift'}
                className={mode === 'shift' ? `${styles.modeBtn} ${styles.modeBtnActive}` : styles.modeBtn}
                onClick={() => setMode('shift')}
              >
                Shift (Caesar)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'affine'}
                className={mode === 'affine' ? `${styles.modeBtn} ${styles.modeBtnActive}` : styles.modeBtn}
                onClick={() => setMode('affine')}
              >
                Affine
              </button>
            </div>
            <div className={styles.keysRow}>
              {mode === 'affine' && (
                <label className={styles.keyGroup}>
                  a
                  <input type="number" className={styles.keyInput} value={a} onChange={(e) => setA(clamp(Number(e.target.value), 1, 25))} />
                </label>
              )}
              <label className={styles.keyGroup}>
                b
                <input type="number" className={styles.keyInput} value={b} onChange={(e) => setB(clamp(Number(e.target.value), 0, 25))} />
              </label>
            </div>
          </div>
        }
        monitor={
          <ExecutionMonitor
            hint={affineInvalid ? `gcd(${a}, 26) ≠ 1 — ถอดรหัสกลับไม่ได้ ลอง a อื่น` : 'เข้ารหัสทีละตัวอักษร — กด ▶'}
            lines={monitorLines}
            badge={isFinal ? `${text} → ${steps.map((s) => s.cipherChar).join('')}` : undefined}
          />
        }
        footer={
          <StepController
            totalSteps={totalBeats}
            currentStep={beatIndex}
            mode={playMode}
            onStepChange={setBeatIndex}
            onModeChange={setPlayMode}
          />
        }
      >
        <div className={styles.canvas}>
          {current && (
            <div className={styles.transformPanel}>
              {current.plainNum === null ? (
                <span className={styles.transformSkip}>"{current.plainChar}" ไม่ใช่ตัวอักษร — ผ่านไม่เปลี่ยน</span>
              ) : (
                <>
                  <span className={styles.transformLetter}>
                    {current.plainChar}
                    <span className={styles.transformNum}>{current.plainNum}</span>
                  </span>
                  <span className={styles.transformArrow}>→</span>
                  <span className={styles.transformLetter}>
                    {current.cipherChar}
                    <span className={styles.transformNum}>{current.cipherNum}</span>
                  </span>
                </>
              )}
            </div>
          )}

          <div className={styles.textRows}>
            <div className={styles.textRow}>
              {[...text].map((ch, i) => (
                <span key={i} className={i === shown - 1 ? `${styles.letterCell} ${styles.letterCellActive}` : styles.letterCell}>
                  {ch}
                </span>
              ))}
            </div>
            <div className={styles.textRow}>
              {steps.map((s, i) => (
                <span
                  key={i}
                  className={
                    i < shown
                      ? i === shown - 1
                        ? `${styles.letterCell} ${styles.letterCellCipher} ${styles.letterCellActive}`
                        : `${styles.letterCell} ${styles.letterCellCipher}`
                      : `${styles.letterCell} ${styles.letterCellPending}`
                  }
                >
                  {i < shown ? s.cipherChar : '·'}
                </span>
              ))}
            </div>
          </div>

          {isFinal && (
            <p className={styles.keyNote}>
              {mode === 'shift'
                ? `ถอดรหัส: ลบ b คืน — P = (C − ${b}) mod 26`
                : affineInvalid
                  ? `⚠️ gcd(${a}, 26) ≠ 1 — ไม่มีตัวผกผัน ถอดรหัสกลับไม่ได้!`
                  : `ถอดรหัส: a⁻¹ = ${aInverse} (จาก Extended Euclidean) — P = ${aInverse}×(C − ${b}) mod 26`}
            </p>
          )}
        </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
