import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import {
  upcCheckDigitSteps,
  computeUpcCheckDigit,
  isbn10Steps,
  computeIsbn10CheckDigit,
  isbn10CheckChar,
} from '@/utils/algorithms/checkDigit';
import styles from './CheckDigitsVisualizer.module.css';

type Mode = 'upc' | 'isbn10';
type Stage = 1 | 2;

const UPC_DEFAULT_DIGITS_STR = '01234567890';
const ISBN10_DEFAULT_DIGITS_STR = '097522980';

interface Challenge {
  digits: number[];
  receivedCheck: number;
}

const UPC_CHALLENGES: Challenge[] = [
  { digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], receivedCheck: 5 },
  { digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], receivedCheck: 3 },
  { digits: [0, 3, 6, 0, 0, 0, 2, 9, 1, 4, 5], receivedCheck: 2 },
  { digits: [0, 3, 6, 0, 0, 0, 2, 9, 1, 4, 5], receivedCheck: 7 },
];

const ISBN10_CHALLENGES: Challenge[] = [
  { digits: [0, 9, 7, 5, 2, 2, 9, 8, 0], receivedCheck: 10 },
  { digits: [0, 9, 7, 5, 2, 2, 9, 8, 0], receivedCheck: 5 },
  { digits: [0, 3, 0, 6, 4, 0, 6, 1, 5], receivedCheck: 2 },
  { digits: [0, 3, 0, 6, 4, 0, 6, 1, 5], receivedCheck: 9 },
];

function requiredLength(mode: Mode): number {
  return mode === 'upc' ? 11 : 9;
}

function weightAt(mode: Mode, index: number): number {
  return mode === 'upc' ? (index % 2 === 0 ? 3 : 1) : 10 - index;
}

function stepsFor(mode: Mode, digits: number[]) {
  return mode === 'upc' ? upcCheckDigitSteps(digits) : isbn10Steps(digits);
}

function computeFor(mode: Mode, digits: number[]): number {
  return mode === 'upc' ? computeUpcCheckDigit(digits) : computeIsbn10CheckDigit(digits);
}

function formatCheckValue(mode: Mode, value: number): string {
  return mode === 'upc' ? String(value) : isbn10CheckChar(value);
}

/** Spells out, in plain language, how a running sum turns into a check digit
 * via the "remainder from division" meaning of mod — built for readers with
 * no prior modular-arithmetic background. */
function explainCheckDigit(mode: Mode, sum: number, modulus: number, checkDigit: number): MonitorLine[] {
  const quotient = Math.floor(sum / modulus);
  const remainder = sum % modulus;
  const lines: MonitorLine[] = [
    { text: `ผลรวมก่อนเติม Check Digit = ${sum}` },
    { text: `mod ${modulus} คือเศษที่เหลือจากการหารด้วย ${modulus}` },
    { text: `${sum} ÷ ${modulus} = ${quotient} เศษ ${remainder}` },
    { text: `ดังนั้น ${sum} mod ${modulus} = ${remainder}` },
    { text: `เป้าหมาย: ทำให้ผลรวมสุดท้ายหารด้วย ${modulus} ลงตัว (เศษเป็น 0)` },
  ];
  if (remainder === 0) {
    lines.push({ text: 'ตอนนี้เศษเป็น 0 อยู่แล้ว จึงไม่ต้องเติมอะไรเพิ่ม' });
  } else {
    lines.push({ text: `ตอนนี้เศษคือ ${remainder} จึงต้องเติมอีก ${modulus} − ${remainder} = ${modulus - remainder}` });
  }
  lines.push({ emphasis: true, text: `ดังนั้น Check Digit = ${formatCheckValue(mode, checkDigit)}` });

  const finalSum = sum + checkDigit;
  const finalRemainder = finalSum % modulus;
  lines.push({ text: `ตรวจสอบ: ${sum} + ${formatCheckValue(mode, checkDigit)} = ${finalSum}` });
  lines.push({
    swatchColor: finalRemainder === 0 ? 'var(--color-success)' : 'var(--color-danger)',
    text: `${finalSum} ÷ ${modulus} = ${Math.floor(finalSum / modulus)} เศษ ${finalRemainder}${finalRemainder === 0 ? ' ✓ (หารลงตัว)' : ''}`,
  });
  return lines;
}

/** Extends explainCheckDigit with the received-vs-computed comparison used
 * once a learner is verifying an existing (possibly tampered) code. */
function explainVerification(mode: Mode, sum: number, modulus: number, receivedCheck: number, computedCheck: number): MonitorLine[] {
  const lines = explainCheckDigit(mode, sum, modulus, computedCheck);
  lines.push({ text: `Check Digit ที่ได้รับ (พิมพ์ไว้บนป้าย): ${formatCheckValue(mode, receivedCheck)}` });
  lines.push({ text: `Check Digit ที่ระบบคำนวณได้ (จากขั้นตอนด้านบน): ${formatCheckValue(mode, computedCheck)}` });
  const isValid = receivedCheck === computedCheck;
  lines.push({
    emphasis: true,
    swatchColor: isValid ? 'var(--color-success)' : 'var(--color-danger)',
    text: isValid
      ? `เปรียบเทียบ: ${formatCheckValue(mode, receivedCheck)} = ${formatCheckValue(mode, computedCheck)} → ถูกต้อง (VALID)`
      : `เปรียบเทียบ: ${formatCheckValue(mode, receivedCheck)} ≠ ${formatCheckValue(mode, computedCheck)} → ไม่ถูกต้อง (INVALID)`,
  });
  return lines;
}

const STAGE_LABELS: Record<Stage, string> = {
  1: '1. สร้างชุดตัวเลข',
  2: '2. ตรวจสอบ',
};

export function CheckDigitsVisualizer() {
  const [mode, setModeValue] = useState<Mode>('upc');
  const [stage, setStage] = useState<Stage>(1);
  const [upcDigitsStr, setUpcDigitsStr] = useState(UPC_DEFAULT_DIGITS_STR);
  const [isbnDigitsStr, setIsbnDigitsStr] = useState(ISBN10_DEFAULT_DIGITS_STR);

  const [challengeIndex, setChallengeIndex] = useState(0);
  const [guess, setGuess] = useState<'valid' | 'invalid' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);

  const reqLen = requiredLength(mode);
  const digitsStr = mode === 'upc' ? upcDigitsStr : isbnDigitsStr;
  const isComplete = digitsStr.length === reqLen;
  const digits = useMemo(() => (isComplete ? digitsStr.split('').map(Number) : []), [isComplete, digitsStr]);
  const checkDigit = useMemo(() => (isComplete ? computeFor(mode, digits) : 0), [isComplete, mode, digits]);
  const steps = useMemo(() => (isComplete ? stepsFor(mode, digits) : []), [isComplete, mode, digits]);
  const modulus = mode === 'upc' ? 10 : 11;

  const handleDigitsChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '').slice(0, reqLen);
    if (mode === 'upc') setUpcDigitsStr(cleaned);
    else setIsbnDigitsStr(cleaned);
  };

  const changeMode = (next: Mode) => {
    setModeValue(next);
    setStage(1);
    setChallengeIndex(0);
    setGuess(null);
    setRevealed(false);
  };

  // ---------- Stage 1: build-and-calculate beats ----------
  const totalBeats = Math.max(steps.length + 1, 1);
  const { beatIndex, setBeatIndex, mode: playMode, setMode: setPlayMode } = useVisualizerBeats(totalBeats, `${mode}:${digitsStr}`);
  const shown = Math.min(beatIndex, steps.length);
  const calcDone = isComplete && beatIndex >= steps.length;
  const runningSum = steps.slice(0, shown).reduce((acc, s) => acc + s.product, 0);

  const stage1MonitorLines = useMemo<MonitorLine[]>(() => {
    if (!isComplete) return [];
    const lines: MonitorLine[] = steps.slice(0, shown).map((s) => ({
      swatchColor: s.weight >= 5 ? 'var(--color-accent)' : 'var(--color-secondary)',
      text: `หลักที่ ${s.position}: ${s.digit} × ${s.weight} = ${s.product}`,
    }));
    if (calcDone) lines.push(...explainCheckDigit(mode, runningSum, modulus, checkDigit));
    return lines;
  }, [isComplete, steps, shown, calcDone, runningSum, modulus, mode, checkDigit]);

  // ---------- Stage 2: verify challenge ----------
  const challenge = (mode === 'upc' ? UPC_CHALLENGES : ISBN10_CHALLENGES)[challengeIndex];
  const challengeSteps = useMemo(() => stepsFor(mode, challenge.digits), [mode, challenge]);
  const challengeComputed = useMemo(() => computeFor(mode, challenge.digits), [mode, challenge]);
  const challengeIsValid = challengeComputed === challenge.receivedCheck;

  const challengeTotalBeats = challengeSteps.length + 1;
  const {
    beatIndex: challengeBeatIndex,
    setBeatIndex: setChallengeBeatIndex,
    mode: challengePlayMode,
    setMode: setChallengePlayMode,
  } = useVisualizerBeats(challengeTotalBeats, `${mode}:challenge:${challengeIndex}`);
  const challengeShown = Math.min(challengeBeatIndex, challengeSteps.length);
  const challengeCalcDone = challengeBeatIndex >= challengeSteps.length;
  const challengeRunningSum = challengeSteps.slice(0, challengeShown).reduce((acc, s) => acc + s.product, 0);

  const stage2MonitorLines = useMemo<MonitorLine[]>(() => {
    if (!revealed) return [];
    const lines: MonitorLine[] = challengeSteps.slice(0, challengeShown).map((s) => ({
      swatchColor: s.weight >= 5 ? 'var(--color-accent)' : 'var(--color-secondary)',
      text: `หลักที่ ${s.position}: ${s.digit} × ${s.weight} = ${s.product}`,
    }));
    if (challengeCalcDone) {
      lines.push(...explainVerification(mode, challengeRunningSum, modulus, challenge.receivedCheck, challengeComputed));
    }
    return lines;
  }, [revealed, challengeSteps, challengeShown, challengeCalcDone, mode, modulus, challenge, challengeRunningSum, challengeComputed]);

  const checkGuess = () => {
    setRevealed(true);
    if (guess !== null) setStreak((s) => (guess === (challengeIsValid ? 'valid' : 'invalid') ? s + 1 : 0));
  };

  const newChallenge = () => {
    const pool = mode === 'upc' ? UPC_CHALLENGES : ISBN10_CHALLENGES;
    let idx = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && idx === challengeIndex) idx = (idx + 1) % pool.length;
    setChallengeIndex(idx);
    setGuess(null);
    setRevealed(false);
  };

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            เลขตรวจสอบ (Check Digit) คือ ตัวเลขหนึ่งหลัก (หรือตัวอักษร) ที่ถูกคำนวณขึ้นมาจากชุดตัวเลขหลักอื่น ๆ ก่อนหน้า
            โดยมีวัตถุประสงค์เพื่อใช้ตรวจสอบความถูกต้องของข้อมูล และป้องกันความผิดพลาดที่อาจเกิดขึ้นจากการคีย์ข้อมูลผิด
            การสลับตำแหน่งตัวเลข หรือการส่งผ่านข้อมูลในระบบคอมพิวเตอร์
          </>
        }
        formula={
          mode === 'upc' ? (
            <>
              3·(d1+d3+...+d11) + (d2+d4+...+d10) + <b>check</b> ≡ 0 (mod 10)
            </>
          ) : (
            <>
              10·d1 + 9·d2 + ... + 2·d9 + <b>check</b> ≡ 0 (mod 11) &nbsp; — &nbsp; check = 10 เขียนเป็น <b>X</b>
            </>
          )
        }
        note={
          <>
            บทเรียนนี้แบ่งเป็น 2 ขั้นตอน: <strong>1) สร้างชุดตัวเลขของคุณเอง พร้อมดูขั้นตอนการคำนวณ Check Digit</strong> และ{' '}
            <strong>2) ตรวจสอบความถูกต้องของชุดตัวเลข</strong> — สามารถสลับโหมด UPC และ ISBN-10 ได้ด้านบน ทั้งสองระบบใช้หลักการเดียวกัน
            เพียงแต่น้ำหนักและฐานมอดุลัสต่างกัน (ระบบ ISBN-10 ใช้มอดุลัส 11 จึงอาจได้ Check Digit เป็นตัวอักษร <code>X</code>{' '}
            แทนตัวเลขในบางกรณี)
          </>
        }
      />
      <VisualizerFrame
        headerExtra={
          <div className={styles.header}>
            <div className={styles.modeToggle} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'upc'}
                className={mode === 'upc' ? `${styles.modeBtn} ${styles.modeBtnActive}` : styles.modeBtn}
                onClick={() => changeMode('upc')}
              >
                UPC
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'isbn10'}
                className={mode === 'isbn10' ? `${styles.modeBtn} ${styles.modeBtnActive}` : styles.modeBtn}
                onClick={() => changeMode('isbn10')}
              >
                ISBN-10
              </button>
            </div>
            <div className={styles.stageToggle} role="tablist">
              {([1, 2] as Stage[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={stage === s}
                  className={stage === s ? `${styles.stageBtn} ${styles.stageBtnActive}` : styles.stageBtn}
                  onClick={() => setStage(s)}
                >
                  {STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        }
        monitor={
          stage === 1 ? (
            <ExecutionMonitor
              hint={
                isComplete
                  ? `คูณเลขแต่ละหลักด้วยน้ำหนักที่กำหนด แล้วรวมผลคูณทั้งหมด (mod ${modulus}) — กด ▶ เพื่อเริ่ม`
                  : `กรอกเลขให้ครบ ${reqLen} หลักก่อน จึงจะเริ่มคำนวณ Check Digit ได้`
              }
              lines={stage1MonitorLines}
              badge={calcDone ? `Check Digit = ${formatCheckValue(mode, checkDigit)}` : undefined}
            />
          ) : (
            <ExecutionMonitor
              hint="โปรดเลือกคำตอบว่าชุดตัวเลขนี้ถูกต้องหรือไม่ ก่อนกดตรวจสอบ"
              lines={stage2MonitorLines}
              badge={challengeCalcDone && revealed ? (challengeIsValid ? 'ถูกต้อง (VALID)' : 'ไม่ถูกต้อง (INVALID)') : undefined}
            />
          )
        }
        footer={
          stage === 1 ? (
            isComplete ? (
              <StepController
                totalSteps={totalBeats}
                currentStep={beatIndex}
                mode={playMode}
                onStepChange={setBeatIndex}
                onModeChange={setPlayMode}
              />
            ) : undefined
          ) : !revealed ? (
            <div className={styles.stage2Footer}>
              <button type="button" className={styles.nextBtn} disabled={guess === null} onClick={checkGuess}>
                ตรวจสอบ
              </button>
              <button type="button" className={styles.resetBtn} onClick={newChallenge}>
                🎲 สุ่มโจทย์ใหม่
              </button>
            </div>
          ) : (
            <div className={styles.stage2Footer}>
              <StepController
                totalSteps={challengeTotalBeats}
                currentStep={challengeBeatIndex}
                mode={challengePlayMode}
                onStepChange={setChallengeBeatIndex}
                onModeChange={setChallengePlayMode}
              />
              <button type="button" className={styles.resetBtn} onClick={newChallenge}>
                🎲 สุ่มโจทย์ใหม่
              </button>
            </div>
          )
        }
      >
        {stage === 1 && (
          <div className={styles.canvas}>
            <p className={styles.stageTitle}>สร้างชุดตัวเลขของคุณเอง</p>
            <p className={styles.stageDesc}>
              กำหนดเลขหลักข้อมูลได้ตามต้องการ หลักสุดท้าย (<strong>Check Digit</strong>) จะคำนวณได้จากเลขหลักข้างหน้าโดยอัตโนมัติ
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={reqLen}
              className={styles.mainInput}
              placeholder={`กรอกเลข ${reqLen} หลัก`}
              value={digitsStr}
              onChange={(e) => handleDigitsChange(e.target.value)}
              aria-label="เลขหลักข้อมูล"
            />

            {!isComplete && (
              <p className={styles.incompleteNote}>
                กรอกแล้ว {digitsStr.length} จาก {reqLen} หลัก — กรุณากรอกให้ครบก่อน
              </p>
            )}

            <div className={styles.barcodeRow}>
              {Array.from({ length: reqLen }, (_, i) => {
                const char = digitsStr[i];
                const active = isComplete && i === shown - 1 && !calcDone;
                const done = isComplete && i < shown;
                return (
                  <div key={i} className={styles.digitBlock}>
                    <span
                      className={
                        active
                          ? `${styles.digitBtn} ${styles.digitBtnActive}`
                          : done
                            ? `${styles.digitBtn} ${styles.digitBtnDone}`
                            : char === undefined
                              ? `${styles.digitBtn} ${styles.checkDigitPending}`
                              : styles.digitBtn
                      }
                    >
                      {char ?? '_'}
                    </span>
                    <span className={styles.weightTag}>×{weightAt(mode, i)}</span>
                  </div>
                );
              })}
              <div className={styles.digitBlock}>
                <span className={calcDone ? `${styles.digitBtn} ${styles.checkDigit}` : `${styles.digitBtn} ${styles.checkDigitPending}`}>
                  {calcDone ? formatCheckValue(mode, checkDigit) : '?'}
                </span>
                <span className={styles.weightTag}>check</span>
              </div>
            </div>

            {isComplete && (
              <p className={styles.sumReadout}>
                ผลรวมสะสม: <strong>{runningSum}</strong>
              </p>
            )}

            {calcDone && (
              <div className={styles.resultBanner}>
                ชุดตัวเลขที่สมบูรณ์: {digitsStr}
                {formatCheckValue(mode, checkDigit)}
              </div>
            )}
          </div>
        )}

        {stage === 2 && (
          <div className={styles.canvas}>
            <p className={styles.stageTitle}>ตรวจสอบว่าชุดตัวเลข {mode === 'upc' ? 'UPC' : 'ISBN-10'} นี้ถูกต้องหรือไม่</p>
            <div className={styles.barcodeRow}>
              {challenge.digits.map((d, i) => {
                const active = revealed && i === challengeShown - 1 && !challengeCalcDone;
                const done = revealed && i < challengeShown;
                return (
                  <div key={i} className={styles.digitBlock}>
                    <span
                      className={
                        active
                          ? `${styles.digitBtn} ${styles.digitBtnActive}`
                          : done
                            ? `${styles.digitBtn} ${styles.digitBtnDone}`
                            : styles.digitBtn
                      }
                    >
                      {d}
                    </span>
                    <span className={styles.weightTag}>×{challengeSteps[i]?.weight ?? ''}</span>
                  </div>
                );
              })}
              <div className={styles.digitBlock}>
                <span className={`${styles.digitBtn} ${styles.checkDigitReceived}`}>
                  {formatCheckValue(mode, challenge.receivedCheck)}
                </span>
                <span className={styles.weightTag}>ได้รับ</span>
              </div>
            </div>

            {!revealed ? (
              <div className={styles.guessRow}>
                <button
                  type="button"
                  className={guess === 'valid' ? `${styles.guessBtn} ${styles.guessBtnActive}` : styles.guessBtn}
                  onClick={() => setGuess('valid')}
                >
                  🟢 Valid
                </button>
                <button
                  type="button"
                  className={guess === 'invalid' ? `${styles.guessBtn} ${styles.guessBtnActive}` : styles.guessBtn}
                  onClick={() => setGuess('invalid')}
                >
                  🔴 Invalid
                </button>
              </div>
            ) : (
              <>
                <p className={styles.sumReadout}>
                  ผลรวมสะสม: <strong>{challengeRunningSum}</strong>
                </p>
                {challengeCalcDone && (
                  <div
                    className={
                      challengeIsValid ? `${styles.verifyPanel} ${styles.verifyPanelOk}` : `${styles.verifyPanel} ${styles.verifyPanelBad}`
                    }
                  >
                    <p>Check Digit ที่ได้รับ: {formatCheckValue(mode, challenge.receivedCheck)}</p>
                    <p>Check Digit ที่คำนวณได้: {formatCheckValue(mode, challengeComputed)}</p>
                    <p className={styles.verifyVerdict}>{challengeIsValid ? 'ถูกต้อง (VALID)' : 'ไม่ถูกต้อง (INVALID)'}</p>
                    {guess !== null && (
                      <p className={styles.verifyGuessNote}>
                        {guess === (challengeIsValid ? 'valid' : 'invalid')
                          ? `ตอบถูกต้อง (ถูกต่อเนื่อง ${streak} ครั้ง)`
                          : 'คำตอบไม่ถูกต้อง โปรดลองข้อถัดไป'}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </VisualizerFrame>
    </TopicPageStack>
  );
}
