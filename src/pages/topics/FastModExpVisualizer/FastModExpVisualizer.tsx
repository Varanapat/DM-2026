import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import { DefinitionCard, DefinitionStatement, TopicPageStack } from '@/components/widgets/DefinitionCard';
import { CodeSyncPanel } from '@/components/widgets/CodeSyncPanel';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { rightToLeftExponentiationTrace, type ExpRoundStep } from '@/utils/algorithms/modular';
import styles from './FastModExpVisualizer.module.css';

const CODE_LINES = [
  'result = 1',
  'base = a',
  'exponent = b',
  'mod = n',
  '',
  'if exponent % 2 == 1:',
  '    result = (result × base) mod n',
  '',
  'base = (base × base) mod n',
  'exponent = exponent // 2',
];

const LINE_CHECK = 5;
const LINE_MULTIPLY = 6;
const LINE_SQUARE = 8;
const LINE_DIVIDE = 9;

type Phase = 0 | 1 | 2 | 3; // check | multiply | square | divide

function clamp(v: number, lo: number, hi: number): number {
  if (Number.isNaN(v)) return lo;
  return Math.min(Math.max(Math.trunc(v), lo), hi);
}

function valuesAtPhase(step: ExpRoundStep, phase: Phase) {
  return {
    result: phase >= 1 ? step.resultAfter : step.resultBefore,
    base: phase >= 2 ? step.baseAfter : step.baseBefore,
    exponent: phase >= 3 ? step.exponentAfter : step.exponentBefore,
  };
}

const PHASE_HINTS: Record<Phase, string> = {
  0: 'ตรวจสอบว่า exponent เป็นเลขคี่หรือเลขคู่',
  1: 'ถ้า exponent เป็นเลขคี่ ให้คูณเข้า result',
  2: 'ยกกำลังสอง base ไว้ใช้ในรอบถัดไป',
  3: 'หาร exponent ด้วย 2 (ปัดลง)',
};

export function FastModExpVisualizer() {
  const [a, setA] = useState(3);
  const [e, setE] = useState(13);
  const [n, setN] = useState(17);

  const trace = useMemo(() => rightToLeftExponentiationTrace(a, e, n), [a, e, n]);
  const { steps, result } = trace;
  const numRounds = steps.length;

  const totalBeats = Math.max(numRounds * 4 + 2, 2);
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${a}:${e}:${n}`);

  const isInit = beatIndex === 0;
  const finalBeat = numRounds * 4 + 1;
  const isFinal = beatIndex >= finalBeat;

  const roundIndex = !isInit && !isFinal ? Math.floor((beatIndex - 1) / 4) : -1;
  const phase = !isInit && !isFinal ? (((beatIndex - 1) % 4) as Phase) : null;
  const step = roundIndex >= 0 ? steps[roundIndex] : null;

  const changeInput = (setter: (v: number) => void, lo: number, hi: number) => (ev: React.ChangeEvent<HTMLInputElement>) =>
    setter(clamp(Number(ev.target.value), lo, hi));

  const baseMod = ((a % n) + n) % n;

  const values = isInit
    ? { result: 1 % n, base: baseMod, exponent: e }
    : isFinal
      ? { result: steps[numRounds - 1]?.resultAfter ?? 1 % n, base: steps[numRounds - 1]?.baseAfter ?? baseMod, exponent: 0 }
      : step && phase !== null
        ? valuesAtPhase(step, phase)
        : { result: 1 % n, base: baseMod, exponent: e };

  const changedField: 'result' | 'base' | 'exponent' | null =
    phase === 0 ? null : phase === 1 ? 'result' : phase === 2 ? 'base' : phase === 3 ? 'exponent' : null;

  const activeLine =
    phase === 0 ? LINE_CHECK : phase === 1 ? LINE_MULTIPLY : phase === 2 ? LINE_SQUARE : phase === 3 ? LINE_DIVIDE : undefined;

  const hint = isInit
    ? 'เริ่มต้น: result = 1, base = a, exponent = b, mod = n'
    : isFinal
      ? `ได้ผลลัพธ์สุดท้ายแล้ว: ${a}^${e} mod ${n} = ${result}`
      : phase !== null
        ? PHASE_HINTS[phase]
        : '';

  return (
    <TopicPageStack>
      <DefinitionCard
        definition={
          <>
            อัลกอริทึมในการคำนวณหาค่าของ{' '}
            <code>
              a<sup>b</sup> mod n
            </code>{' '}
            อย่างมีประสิทธิภาพ
            โดยมีจุดเด่นคือช่วยให้คำนวณผลลัพธ์ได้รวดเร็วมากและประหยัดหน่วยความจำ แม้ว่าตัวเลขฐาน (<code>a</code>)
            หรือตัวเลขชี้กำลัง (<code>b</code>) จะมีขนาดใหญ่โตมหาศาลก็ตาม อัลกอริทึมนี้มักถูกนำไปใช้ในระบบวิทยาการรหัสลับ (Cryptography)
            เช่น RSA Encryption และ Diffie-Hellman Key Exchange ซึ่งจำเป็นต้องจัดการกับตัวเลขที่มีความยาวหลายร้อยหลายพันบิต
          </>
        }
        formula={
          <>
            <b>a</b>
            <sup>
              <b>b</b>
            </sup>{' '}
            mod <b>n</b> — คำนวณด้วยการยกกำลังสองซ้ำ (repeated squaring)
          </>
        }
        note={
          <DefinitionStatement
            given={
              <>
                ให้ <code>a</code> ∈ ℤ, <code>b</code> เป็นจำนวนเต็มที่ไม่เป็นลบ และ <code>n</code> เป็นจำนวนเต็มบวก
                โดยเขียน b ในรูปเลขฐานสองได้เป็น{' '}
                <code>
                  b = b<sub>0</sub>·2<sup>0</sup> + b<sub>1</sub>·2<sup>1</sup> + … + b<sub>t</sub>·2<sup>t</sup>
                </code>{' '}
                เมื่อแต่ละบิต b<sub>i</sub> เป็น 0 หรือ 1
              </>
            }
            claim={<>เนื่องจากกำลังของ a แตกตามหลักฐานสองของ b ได้ เราจึงคูณเฉพาะกำลังที่ตรงกับบิต 1 เท่านั้น</>}
            equation={
              <>
                a<sup>b</sup> mod n = ผลคูณของ a<sup>
                  2<sup>i</sup>
                </sup>{' '}
                mod n &nbsp;เฉพาะ i ที่ b<sub>i</sub> = 1
              </>
            }
            restate={
              <>
                หรือกล่าวได้ว่า แทนที่จะคูณ a ซ้ำ b ครั้ง เราสร้าง a<sup>
                  2<sup>i</sup>
                </sup>{' '}
                ด้วยการยกกำลังสองซ้ำ ๆ แล้วหยิบมาคูณเฉพาะตัวที่ตรงกับบิต 1{' '}
                <strong>จากประมาณ b ขั้นตอน จึงเหลือเพียง log₂(b) ขั้นตอน</strong>
              </>
            }
          />
        }
      />
      <VisualizerFrame
        title="Fast Modular Exponentiation — Square & Multiply"
        headerExtra={
          <div className={styles.inputsRow}>
            <label className={styles.inputGroup}>
              a
              <input type="number" className={styles.numberInput} value={a} onChange={changeInput(setA, 2, 12)} />
            </label>
            <label className={styles.inputGroup}>
              e
              <input type="number" className={styles.numberInput} value={e} onChange={changeInput(setE, 1, 64)} />
            </label>
            <label className={styles.inputGroup}>
              mod n
              <input type="number" className={styles.numberInput} value={n} onChange={changeInput(setN, 2, 50)} />
            </label>
          </div>
        }
        monitor={<ExecutionMonitor hint={hint} lines={[]} badge={isFinal ? `${a}^${e} mod ${n} = ${result}` : undefined} />}
        footer={
          <StepController totalSteps={totalBeats} currentStep={beatIndex} mode={mode} onStepChange={setBeatIndex} onModeChange={setMode} />
        }
      >
        <div className={styles.canvas}>
          <p className={styles.problemLine}>
            {a}<sup>{e}</sup> mod {n}
          </p>

          <p className={styles.roundIndicator}>
            {isInit ? 'INITIALIZE' : isFinal ? 'FINAL RESULT' : `ROUND ${roundIndex + 1} / ${numRounds}`}
          </p>

          <div className={styles.mainSplit}>
            <div className={styles.formulaPanelWrap}>
              <p className={styles.panelLabel}>Formula / Algorithm</p>
              <CodeSyncPanel lines={CODE_LINES} activeLine={activeLine} />
            </div>
            <div className={styles.valuesPanel}>
              <p className={styles.panelLabel}>Current Values</p>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>result</span>
                <span className={changedField === 'result' ? `${styles.valueNum} ${styles.valueChanged}` : styles.valueNum}>
                  {values.result}
                </span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>base</span>
                <span className={changedField === 'base' ? `${styles.valueNum} ${styles.valueChanged}` : styles.valueNum}>
                  {values.base}
                </span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>exponent</span>
                <span className={changedField === 'exponent' ? `${styles.valueNum} ${styles.valueChanged}` : styles.valueNum}>
                  {values.exponent}
                </span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>mod</span>
                <span className={styles.valueNum}>{n}</span>
              </div>
            </div>
          </div>

          <div className={styles.calcPanel}>
            <p className={styles.panelLabel}>Current Calculation</p>

            {isInit && (
              <div className={styles.calcLines}>
                <p className={styles.flowLine}>result = 1</p>
                <p className={styles.flowLine}>base = {baseMod}</p>
                <p className={styles.flowLine}>exponent = {e}</p>
                <p className={styles.flowLine}>mod = {n}</p>
              </div>
            )}

            {step && phase === 0 && (
              <div className={styles.calcLines}>
                <p className={styles.flowLine}>exponent = {step.exponentBefore}</p>
                <p className={styles.flowLine}>
                  {step.exponentBefore} % 2 = {step.exponentBefore % 2}
                </p>
                <p className={styles.decisionLine}>→ {step.isOdd ? 'ODD' : 'EVEN'}</p>
                <p className={step.isOdd ? `${styles.decisionLine} ${styles.decisionUse}` : `${styles.decisionLine} ${styles.decisionSkip}`}>
                  → {step.isOdd ? 'MULTIPLY' : 'SKIP MULTIPLY'}
                </p>
              </div>
            )}

            {step && phase === 1 && (
              <div className={styles.calcLines}>
                {step.isOdd ? (
                  <>
                    <p className={styles.flowLine}>result = (result × base) mod n</p>
                    <p className={styles.flowLine}>
                      ({step.resultBefore} × {step.baseBefore}) mod {n}
                    </p>
                    <p className={styles.flowArrow}>↓</p>
                    <p className={styles.flowLine}>
                      {step.resultBefore * step.baseBefore} mod {n}
                    </p>
                    <p className={styles.flowArrow}>↓</p>
                    <p className={styles.flowResultBig}>{step.resultAfter}</p>
                  </>
                ) : (
                  <>
                    <p className={styles.decisionLine}>exponent เป็นเลขคู่ → SKIP MULTIPLY</p>
                    <p className={styles.flowLine}>result ไม่เปลี่ยน = {step.resultBefore}</p>
                  </>
                )}
              </div>
            )}

            {step && phase === 2 && (
              <div className={styles.calcLines}>
                <p className={styles.flowLine}>base = (base × base) mod n</p>
                <p className={styles.flowLine}>
                  {step.baseBefore} × {step.baseBefore} = {step.baseSquared}
                </p>
                <p className={styles.flowLine}>
                  {step.baseSquared} mod {n} = <strong>{step.baseAfter}</strong>
                </p>
              </div>
            )}

            {step && phase === 3 && (
              <div className={styles.calcLines}>
                <p className={styles.flowLine}>exponent = exponent // 2</p>
                <p className={styles.flowLine}>
                  {step.exponentBefore} // 2 = <strong>{step.exponentAfter}</strong>
                </p>
                <p className={styles.roundCompleteTag}>
                  ROUND {step.round} COMPLETE{step.exponentAfter === 0 ? ' — exponent = 0 → หยุด Algorithm' : ''}
                </p>
              </div>
            )}

            {isFinal && (
              <div className={styles.calcLines}>
                <p className={styles.flowLine}>exponent = 0 → หยุด Algorithm</p>
              </div>
            )}
          </div>

          {isFinal && (
            <div className={styles.finalBlock}>
              <p className={styles.flowLine}>
                {a}^{e} mod {n} = <strong>{result}</strong>
              </p>
              <p className={styles.finalResultBig}>{result}</p>
              <p className={styles.finalTag}>RESULT = {result}</p>
            </div>
          )}
        </div>
      </VisualizerFrame>
    </TopicPageStack>
  );
}
