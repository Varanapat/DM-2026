export interface TopicContent {
  coreConceptTh: string;
  misconceptionTh: string;
  primaryWidgets: string[];
}

/** Per-topic copy pulled from CLUADE.md Section 4 (Core Concept / Misconceptions /
 * Practice Challenge bullets). Kept as data, separate from TopicPageTemplate,
 * so it can be edited without touching component code. */
export const TOPIC_CONTENT: Record<string, TopicContent> = {
  divisibility: {
    coreConceptTh: 'b หารด้วย a ลงตัว ก็ต่อเมื่อมี integer k ที่ b = a×k',
    misconceptionTh: 'สับสนระหว่าง "a หาร b" กับ "b หาร a" (เทียบ 3|12 ✅ vs 12|3 ❌)',
    primaryWidgets: ['NumberGrid', 'SliderInput'],
  },
  primes: {
    coreConceptTh: 'จำนวนเต็ม > 1 ที่ไม่มีตัวหารอื่นนอกจาก 1 และตัวมันเอง',
    misconceptionTh: '1 ไม่ใช่ prime, เลขคู่ทุกตัว (ยกเว้น 2) ไม่ใช่ prime',
    primaryWidgets: ['NumberGrid'],
  },
  'sieve-of-eratosthenes': {
    coreConceptTh: 'เริ่มจาก 2 แล้ว "ตัด" multiples ทั้งหมดออกไปเรื่อย ๆ จนเหลือแต่ prime',
    misconceptionTh: 'คิดว่าต้องตัดจนถึง n ทั้งหมด (จริง ๆ หยุดที่ √n ได้)',
    primaryWidgets: ['NumberGrid', 'StepController'],
  },
  'gcd-euclidean': {
    coreConceptTh: 'ตัวหารร่วมมากที่สุดของสองจำนวน หาได้ด้วยการหารเศษซ้ำ ๆ',
    misconceptionTh: 'คิดว่าต้องหา factor ทั้งหมดก่อนถึงจะหา gcd ได้ (ไม่จำเป็น!)',
    primaryWidgets: ['StepController', 'CodeSyncPanel', 'BarCompare'],
  },
  lcm: {
    coreConceptTh: 'จำนวนที่น้อยที่สุดที่เป็น multiple ร่วมของทั้งสองตัว',
    misconceptionTh: 'คิดว่า lcm ต้องหาจาก multiples ทั้งหมดเสมอ (ไม่ efficient สำหรับเลขใหญ่)',
    primaryWidgets: ['SliderInput', 'BarCompare'],
  },
  'prime-factorization': {
    coreConceptTh: 'ทุกจำนวนเต็ม > 1 เขียนเป็นผลคูณของ prime ได้แบบเดียว (ไม่นับลำดับ)',
    misconceptionTh: 'คิดว่าการแตกเลขต่างวิธีจะได้ prime factor ต่างชุด (จริง ๆ ชุดเดียวกันเสมอ)',
    primaryWidgets: ['FactorTree'],
  },
  'modular-arithmetic': {
    coreConceptTh: 'a mod n คือตำแหน่งที่ a ตกลงบนวงกลมที่มี n ช่อง',
    misconceptionTh: 'คิดว่า mod ให้ผลลบได้ แต่ในคณิตศาสตร์ mod ต้องไม่ติดลบ',
    primaryWidgets: ['ClockModulo', 'SliderInput'],
  },
  congruence: {
    coreConceptTh: 'a และ b congruent mod n ก็ต่อเมื่อ n | (a−b)',
    misconceptionTh: 'สับสนระหว่าง "=" กับ "≡" — congruent ไม่ได้แปลว่าค่าเท่ากัน แต่อยู่ "class" เดียวกัน',
    primaryWidgets: ['ClockModulo', 'NumberGrid'],
  },
  'fast-modular-exponentiation': {
    coreConceptTh: 'Binary exponentiation — แตก exponent เป็นเลขฐานสอง แล้วยกกำลังสองต่อเนื่อง คูณเข้าเฉพาะ bit ที่เป็น 1',
    misconceptionTh: 'คิดว่าต้องคูณ a เข้าไปทุก bit เหมือนกันหมด (จริง ๆ คูณเฉพาะ bit ที่เป็น 1)',
    primaryWidgets: ['StepController', 'CodeSyncPanel', 'BarCompare'],
  },
  'euler-totient': {
    coreConceptTh: 'φ(n) = จำนวน k ใน [1,n] ที่ gcd(k,n)=1',
    misconceptionTh: 'คิดว่า φ(n) ต้อง count 1 ออก (จริง ๆ gcd(1,n)=1 เสมอ นับรวม)',
    primaryWidgets: ['NumberGrid', 'EquationHighlighter'],
  },
  'fermats-little-theorem': {
    coreConceptTh: 'ถ้า p เป็น prime และ gcd(a,p)=1 แล้ว a^(p−1) mod p = 1 เสมอ',
    misconceptionTh: 'ลืมเงื่อนไข p ต้อง prime และ gcd(a,p)=1',
    primaryWidgets: ['ClockModulo'],
  },
  'extended-euclidean': {
    coreConceptTh: 'ย้อนรอย (back-substitute) ทุกขั้นตอนของ Euclidean algorithm เพื่อไล่หาสัมประสิทธิ์ x,y',
    misconceptionTh: 'คิดว่า x,y ที่หาได้มีคำตอบเดียว (จริง ๆ มีอนันต์คำตอบ, มีแค่ "particular solution")',
    primaryWidgets: ['StepController', 'CodeSyncPanel'],
  },
  'chinese-remainder-theorem': {
    coreConceptTh: 'ผสาน (combine) x ≡ a1 (mod m1), x ≡ a2 (mod m2), ... เป็นคำตอบเดียว',
    misconceptionTh: 'ใช้ CRT กับ moduli ที่ไม่ coprime กัน (ไม่การันตีคำตอบเดียว)',
    primaryWidgets: ['ClockModulo', 'StepController'],
  },
  'rsa-cryptography': {
    coreConceptTh: 'Public key encryption จากคุณสมบัติที่ว่า factorization ของเลขจำนวนมากทำได้ยากมาก แต่ modular exponentiation ทำได้เร็ว',
    misconceptionTh: 'คิดว่า e กับ d เลือกอะไรก็ได้ (จริง ๆ ต้องเป็น modular inverse กัน mod φ(n))',
    primaryWidgets: ['StepController', 'ClockModulo', 'CodeSyncPanel'],
  },
};
