import { useMemo, useState } from 'react';
import { StepController } from '@/components/widgets/StepController';
import { VisualizerFrame } from '@/components/widgets/VisualizerFrame';
import { ExecutionMonitor } from '@/components/widgets/ExecutionMonitor';
import type { MonitorLine } from '@/components/widgets/ExecutionMonitor';
import { useVisualizerBeats } from '@/hooks/useVisualizerBeats';
import { gcd } from '@/utils/algorithms/euclidean';
import { extGcdSteps } from '@/utils/algorithms/extendedEuclidean';
import { modPow } from '@/utils/algorithms/modular';
import styles from './RsaVisualizer.module.css';

const P_CHOICES = [5, 7, 11, 13, 17, 19];

function clampM(v: number, n: number): number {
  if (Number.isNaN(v)) return 2;
  return Math.min(Math.max(Math.trunc(v), 2), n - 1);
}

export function RsaVisualizer() {
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [eIdx, setEIdx] = useState(0);
  const [m, setM] = useState(42);

  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const eChoices = useMemo(() => [3, 5, 7, 11, 13, 17].filter((e) => e < phi && gcd(e, phi) === 1), [phi]);
  const e = eChoices[Math.min(eIdx, eChoices.length - 1)] ?? 3;

  const d = useMemo(() => {
    // extGcdSteps orders inputs as (max, min) = (phi, e), so 1 = x·phi + y·e → d = y mod phi
    const { y } = extGcdSteps(phi, e);
    return ((y % phi) + phi) % phi;
  }, [e, phi]);

  const mSafe = Math.min(m, n - 1);
  const c = useMemo(() => modPow(mSafe, e, n), [mSafe, e, n]);
  const decrypted = useMemo(() => modPow(c, d, n), [c, d, n]);

  // beats: setup, p·q, n+φ, e, d, encrypt, decrypt, roundtrip, attacker
  const totalBeats = 9;
  const { beatIndex, setBeatIndex, mode, setMode } = useVisualizerBeats(totalBeats, `${p}:${q}:${e}:${mSafe}`);

  const stagePQ = beatIndex >= 1;
  const stageN = beatIndex >= 2;
  const stageE = beatIndex >= 3;
  const stageD = beatIndex >= 4;
  const stageEnc = beatIndex >= 5;
  const stageDec = beatIndex >= 6;
  const stageRound = beatIndex >= 7;
  const stageAttack = beatIndex >= 8;

  const monitorLines = useMemo<MonitorLine[]>(() => {
    const lines: MonitorLine[] = [];
    if (stagePQ) lines.push({ swatchColor: '#38bdf8', text: `เลือก prime ลับ: p=${p}, q=${q} (บทที่ 2)` });
    if (stageN) lines.push({ swatchColor: '#38bdf8', text: `n = p×q = ${n}, φ(n) = (p−1)(q−1) = ${phi} (บท φ)` });
    if (stageE) lines.push({ swatchColor: 'var(--color-success)', text: `เลือก e = ${e} โดย gcd(e, φ) = 1 → public key (n=${n}, e=${e})` });
    if (stageD) lines.push({ swatchColor: '#a78bfa', text: `d = e⁻¹ mod φ = ${d} จาก Extended Euclid → private key (d=${d})` });
    if (stageEnc) lines.push({ swatchColor: 'var(--color-secondary)', text: `เข้ารหัส: c = m^e mod n = ${mSafe}^${e} mod ${n} = ${c} (บท fast mod-exp)` });
    if (stageDec) lines.push({ swatchColor: 'var(--color-secondary)', text: `ถอดรหัส: c^d mod n = ${c}^${d} mod ${n} = ${decrypted}` });
    if (stageRound) lines.push({ emphasis: true, swatchColor: 'var(--color-success)', text: `${mSafe} → ${c} → ${decrypted} — กลับมาครบ!` });
    if (stageAttack)
      lines.push({
        emphasis: true,
        swatchColor: 'var(--color-danger)',
        text: `ผู้แอบอ่านมีแค่ (n=${n}, e=${e}, c=${c}) — จะหา d ต้องรู้ φ(n) ต้องแยก n เป็น p×q ซึ่งยากมากเมื่อ n ใหญ่`,
      });
    return lines;
  }, [stagePQ, stageN, stageE, stageD, stageEnc, stageDec, stageRound, stageAttack, p, q, n, phi, e, d, mSafe, c, decrypted]);

  return (
    <VisualizerFrame
      title="RSA — Capstone: ประกอบทุกบทเป็นระบบเข้ารหัส"
      headerExtra={
        <div className={styles.controls}>
          <div className={styles.chipRow}>
            <span className={styles.chipLabel}>p =</span>
            {P_CHOICES.map((v) => (
              <button
                key={v}
                type="button"
                className={v === p ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                disabled={v === q}
                onClick={() => setP(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className={styles.chipRow}>
            <span className={styles.chipLabel}>q =</span>
            {P_CHOICES.map((v) => (
              <button
                key={v}
                type="button"
                className={v === q ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                disabled={v === p}
                onClick={() => setQ(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className={styles.chipRow}>
            <span className={styles.chipLabel}>e =</span>
            {eChoices.map((v, i) => (
              <button
                key={v}
                type="button"
                className={v === e ? `${styles.chipBtn} ${styles.chipBtnActive}` : styles.chipBtn}
                onClick={() => setEIdx(i)}
              >
                {v}
              </button>
            ))}
            <span className={styles.chipLabel}>ข้อความ m =</span>
            <input
              type="number"
              className={styles.numberInput}
              value={mSafe}
              onChange={(ev) => setM(clampM(Number(ev.target.value), n))}
            />
          </div>
        </div>
      }
      monitor={
        <ExecutionMonitor
          hint={`สร้างกุญแจจาก p, q แล้วส่งข้อความ m=${mSafe} ให้ปลอดภัย — กด ▶ ดูทุกบทที่เรียนมาประกอบกัน`}
          lines={monitorLines}
          badge={stageRound ? `ถอดรหัสสำเร็จ! m → c → m ✓` : undefined}
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
        <div className={styles.pipeline}>
          <div className={`${styles.station} ${stagePQ ? styles.stationOn : ''}`}>
            <span className={styles.stationTag}>1 · Primes</span>
            <span className={styles.stationBody}>
              p = <strong>{stagePQ ? p : '?'}</strong>, q = <strong>{stagePQ ? q : '?'}</strong>
            </span>
            <span className={styles.stationSecret}>🤫 ความลับ</span>
          </div>

          <div className={`${styles.station} ${stageN ? styles.stationOn : ''}`}>
            <span className={styles.stationTag}>2 · φ(n)</span>
            <span className={styles.stationBody}>
              n = <strong>{stageN ? n : '?'}</strong>, φ = <strong>{stageN ? phi : '?'}</strong>
            </span>
          </div>

          <div className={`${styles.station} ${stageE ? styles.stationOn : ''}`}>
            <span className={styles.stationTag}>3 · gcd</span>
            <span className={styles.stationBody}>
              e = <strong>{stageE ? e : '?'}</strong> (gcd(e, φ)=1)
            </span>
            {stageE && <span className={styles.keyPublic}>🔓 public (n, e)</span>}
          </div>

          <div className={`${styles.station} ${stageD ? styles.stationOn : ''}`}>
            <span className={styles.stationTag}>4 · Ext-Euclid</span>
            <span className={styles.stationBody}>
              d = e⁻¹ mod φ = <strong>{stageD ? d : '?'}</strong>
            </span>
            {stageD && <span className={styles.keyPrivate}>🔑 private (d)</span>}
          </div>
        </div>

        <div className={styles.tubes}>
          <div className={`${styles.tube} ${stageEnc ? styles.tubeOn : ''}`}>
            <span className={styles.tubeLabel}>เข้ารหัส (fast mod-exp): m^e mod n</span>
            <div className={styles.tubeFlow}>
              <span className={styles.msgToken}>{mSafe}</span>
              <span className={styles.tubeArrow}>{stageEnc ? '⟶ 🔓 ⟶' : '⟶ ? ⟶'}</span>
              <span className={stageEnc ? `${styles.msgToken} ${styles.msgCipher}` : styles.msgTokenHidden}>{stageEnc ? c : '?'}</span>
            </div>
          </div>
          <div className={`${styles.tube} ${stageDec ? styles.tubeOn : ''}`}>
            <span className={styles.tubeLabel}>ถอดรหัส: c^d mod n</span>
            <div className={styles.tubeFlow}>
              <span className={stageDec ? `${styles.msgToken} ${styles.msgCipher}` : styles.msgTokenHidden}>{stageDec ? c : '?'}</span>
              <span className={styles.tubeArrow}>{stageDec ? '⟶ 🔑 ⟶' : '⟶ ? ⟶'}</span>
              <span className={stageDec ? `${styles.msgToken} ${stageRound ? styles.msgDone : ''}` : styles.msgTokenHidden}>
                {stageDec ? decrypted : '?'}
              </span>
            </div>
          </div>
        </div>

        {stageAttack && (
          <div className={styles.attacker}>
            <p className={styles.attackerTitle}>😈 ลองแอบอ่าน: มีแค่ (n={n}, e={e}, c={c})</p>
            <p className={styles.attackerBody}>
              ต้องการ d → ต้องรู้ φ(n) → ต้องแยก <span className={styles.attackerShake}>n = {n} = ? × ?</span> —
              factorization คือกำแพงที่กันทั้งระบบ
            </p>
          </div>
        )}
      </div>
    </VisualizerFrame>
  );
}
