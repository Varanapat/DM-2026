export interface GlossaryTerm {
  term: string;
  definitionTh: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Divisor', definitionTh: 'ตัวหาร — a หาร b ลงตัว เขียนแทนด้วย a | b' },
  { term: 'Prime', definitionTh: 'จำนวนเต็ม > 1 ที่ไม่มีตัวหารอื่นนอกจาก 1 และตัวมันเอง' },
  { term: 'Composite', definitionTh: 'จำนวนเต็ม > 1 ที่ไม่ใช่ prime' },
  { term: 'GCD', definitionTh: 'ตัวหารร่วมมาก — ตัวเลขที่มากที่สุดที่หารทั้งสองจำนวนลงตัว' },
  { term: 'LCM', definitionTh: 'ตัวคูณร่วมน้อย — ตัวเลขที่น้อยที่สุดที่เป็น multiple ร่วมกัน' },
  { term: 'Modulus', definitionTh: 'ตัวหารในเลขคณิตมอดุลาร์ — a mod n คือเศษจากการหาร a ด้วย n' },
  { term: 'Congruence', definitionTh: 'a ≡ b (mod n) หมายถึง n หาร (a-b) ลงตัว' },
  { term: "Euler's Totient", definitionTh: 'φ(n) คือจำนวน k ใน [1,n] ที่ gcd(k,n)=1' },
  { term: "Bézout's Identity", definitionTh: 'ax+by=gcd(a,b) มีคำตอบ x,y เป็นจำนวนเต็มเสมอ' },
  { term: 'Coprime', definitionTh: 'สองจำนวนที่ gcd เท่ากับ 1' },
];
