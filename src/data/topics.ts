export interface TopicMeta {
  id: string;
  path: string;
  titleTh: string;
  objectiveTh: string;
  /** ids of prerequisite topics — used for CourseMapGraph edges */
  dependsOn: string[];
}

/**
 * Ordered learning path (not alphabetical) — this array order drives routing,
 * prev/next footer nav, and the Course Map's dependency graph. Order is a
 * topological sort of the dependency hints in CLUADE.md Section 2/4.
 */
export const TOPIC_ORDER: TopicMeta[] = [
  {
    id: 'divisibility',
    path: '/divisibility',
    titleTh: 'การหารลงตัว (Divisibility)',
    objectiveTh: 'เข้าใจว่า a | b หมายถึงอะไร และเห็น pattern ของตัวหารผ่านภาพ',
    dependsOn: [],
  },
  {
    id: 'primes',
    path: '/primes',
    titleTh: 'จำนวนเฉพาะ (Prime Numbers)',
    objectiveTh: 'เข้าใจนิยาม prime และทำไม prime ถึงพิเศษ ผ่านการเห็นว่าตัวประกอบมีแค่ 1 กับตัวมันเอง',
    dependsOn: ['divisibility'],
  },
  {
    id: 'sieve-of-eratosthenes',
    path: '/sieve-of-eratosthenes',
    titleTh: 'ตะแกรงเอราทอสเทนีส (Sieve of Eratosthenes)',
    objectiveTh: 'เข้าใจ algorithm การ "กรอง" composite numbers ออกอย่างเป็นระบบ',
    dependsOn: ['primes'],
  },
  {
    id: 'gcd-euclidean',
    path: '/gcd-euclidean',
    titleTh: 'ตัวหารร่วมมาก — ขั้นตอนวิธียูคลิด (GCD — Euclidean Algorithm)',
    objectiveTh: 'เข้าใจว่า gcd(a,b) = gcd(b, a mod b) และทำไมมันลู่เข้าเร็ว',
    dependsOn: ['divisibility'],
  },
  {
    id: 'lcm',
    path: '/lcm',
    titleTh: 'ตัวคูณร่วมน้อย (LCM)',
    objectiveTh: 'เห็นความสัมพันธ์ lcm(a,b) × gcd(a,b) = a × b ผ่านภาพ ไม่ใช่ท่องสูตร',
    dependsOn: ['gcd-euclidean'],
  },
  {
    id: 'prime-factorization',
    path: '/prime-factorization',
    titleTh: 'การแยกตัวประกอบเฉพาะ (Prime Factorization)',
    objectiveTh: 'เข้าใจ Fundamental Theorem of Arithmetic ผ่านการแตกเลขเป็นต้นไม้',
    dependsOn: ['primes'],
  },
  {
    id: 'modular-arithmetic',
    path: '/modular-arithmetic',
    titleTh: 'เลขคณิตมอดุลาร์ (Modular Arithmetic)',
    objectiveTh: 'มองเลข mod n เป็น "นาฬิกา" ที่วนซ้ำ แทนที่จะเป็นแค่เศษจากการหาร',
    dependsOn: ['divisibility'],
  },
  {
    id: 'congruence',
    path: '/congruence',
    titleTh: 'สมภาค (Congruence)',
    objectiveTh: 'เข้าใจว่า a ≡ b (mod n) หมายถึง a กับ b "อยู่ตำแหน่งเดียวกัน" บนนาฬิกา mod n',
    dependsOn: ['modular-arithmetic'],
  },
  {
    id: 'fast-modular-exponentiation',
    path: '/fast-modular-exponentiation',
    titleTh: 'การยกกำลังมอดุลาร์แบบเร็ว (Fast Modular Exponentiation)',
    objectiveTh: 'เข้าใจว่าทำไม a^b mod n คำนวณได้เร็วด้วย "ยกกำลังสองซ้ำ" แทนการคูณทีละครั้ง',
    dependsOn: ['modular-arithmetic'],
  },
  {
    id: 'euler-totient',
    path: '/euler-totient',
    titleTh: "ฟังก์ชันออยเลอร์ (Euler's Totient Function φ(n))",
    objectiveTh: 'เข้าใจ φ(n) เป็น "จำนวนตัวเลขที่ coprime กับ n" ผ่านการนับจริงบนภาพ ก่อนเจอสูตร',
    dependsOn: ['gcd-euclidean', 'prime-factorization'],
  },
  {
    id: 'fermats-little-theorem',
    path: '/fermats-little-theorem',
    titleTh: "ทฤษฎีบทเล็กของแฟร์มา (Fermat's Little Theorem)",
    objectiveTh: 'เห็น pattern ว่า a^(p−1) ≡ 1 (mod p) เกิดขึ้นจริงกับหลาย ๆ ค่า ก่อนเชื่อทฤษฎีบท',
    dependsOn: ['fast-modular-exponentiation', 'euler-totient'],
  },
  {
    id: 'extended-euclidean',
    path: '/extended-euclidean',
    titleTh: 'ขั้นตอนวิธียูคลิดแบบขยาย (Extended Euclidean Algorithm)',
    objectiveTh: 'เข้าใจว่านอกจากหา gcd แล้ว เราหาค่า x,y ที่ทำให้ ax+by=gcd(a,b) ได้ด้วย (Bézout\'s identity)',
    dependsOn: ['gcd-euclidean'],
  },
  {
    id: 'chinese-remainder-theorem',
    path: '/chinese-remainder-theorem',
    titleTh: 'ทฤษฎีบทเศษเหลือจีน (Chinese Remainder Theorem)',
    objectiveTh: 'เข้าใจว่าระบบ congruence หลายสมการ (ที่ moduli coprime กัน) มีคำตอบเดียวที่ไม่ซ้ำใน mod (m1×m2×...)',
    dependsOn: ['congruence', 'extended-euclidean'],
  },
  {
    id: 'rsa-cryptography',
    path: '/rsa-cryptography',
    titleTh: 'การเข้ารหัส RSA (RSA Cryptography) — Capstone',
    objectiveTh: 'เห็นภาพรวมว่า Number Theory ที่เรียนมาทั้งหมดประกอบกันเป็นระบบเข้ารหัส RSA ได้จริง',
    dependsOn: ['fermats-little-theorem', 'euler-totient', 'extended-euclidean', 'chinese-remainder-theorem'],
  },
];

export function getTopicById(id: string): TopicMeta | undefined {
  return TOPIC_ORDER.find((t) => t.id === id);
}

export function getTopicByPath(path: string): TopicMeta | undefined {
  return TOPIC_ORDER.find((t) => t.path === path);
}
