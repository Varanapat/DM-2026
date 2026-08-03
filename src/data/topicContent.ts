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
    coreConceptTh:
      'จำนวนเฉพาะคือจำนวนเต็มที่มากกว่า 1 และไม่มีตัวหารอื่นนอกจาก 1 กับตัวมันเอง ลองนึกภาพจัดจุด n จุดเป็นสี่เหลี่ยมผืนผ้า (แถว × คอลัมน์) — ถ้าจัดได้แบบเดียวคือแถวเดียว (1×n) แปลว่า n เป็นจำนวนเฉพาะ ไม่มีทางแบ่งเป็นกลุ่มเท่า ๆ กันได้เลยนอกจากกลุ่มเดียว',
    misconceptionTh: '1 ไม่ใช่ prime, เลขคู่ทุกตัว (ยกเว้น 2) ไม่ใช่ prime',
    primaryWidgets: ['NumberGrid'],
  },
  'sieve-of-eratosthenes': {
    coreConceptTh:
      'อัลกอริทึมสำหรับหาจำนวนเฉพาะทั้งหมดในช่วงหนึ่ง โดยเริ่มจาก 2 แล้ว "ตัด" ตัวคูณของมันออกไปเรื่อย ๆ ลองนึกภาพกระดานเลข 1 ถึง n วนไปที่เลขตัวแรกที่ยังไม่โดนตัด (เริ่มที่ 2) ขีดฆ่าตัวคูณของมันทั้งหมด แล้ววนไปเลขถัดไปที่รอด ทำซ้ำจนถึง √n — เลขที่เหลือรอดไม่โดนขีดเลยคือจำนวนเฉพาะทั้งหมด',
    misconceptionTh: 'คิดว่าต้องตัดจนถึง n ทั้งหมด (จริง ๆ หยุดที่ √n ได้)',
    primaryWidgets: ['NumberGrid', 'StepController'],
  },
  'gcd-euclidean': {
    coreConceptTh:
      'ตัวหารร่วมมาก (GCD) ของสองจำนวนหาได้ด้วยการหารเศษซ้ำ ๆ ลองนึกภาพกระดาษสี่เหลี่ยมผืนผ้าขนาด a × b ต้องการตัดเป็นสี่เหลี่ยมจัตุรัสที่ใหญ่ที่สุดเท่าที่จะพอดีโดยไม่เหลือเศษ — ตัดจัตุรัสใหญ่สุดออกซ้ำ ๆ จากกระดาษที่เหลือ ขนาดจัตุรัสสุดท้ายที่ตัดได้พอดีคือ gcd(a, b)',
    misconceptionTh: 'คิดว่าต้องหา factor ทั้งหมดก่อนถึงจะหา gcd ได้ (ไม่จำเป็น!)',
    primaryWidgets: ['StepController', 'CodeSyncPanel', 'BarCompare'],
  },
  lcm: {
    coreConceptTh:
      'ตัวคูณร่วมน้อย (LCM) คือจำนวนที่น้อยที่สุดที่เป็นตัวคูณร่วมของทั้งสองตัว ลองนึกภาพรถเมล์สองสายออกจากป้ายพร้อมกันตอนนาทีที่ 0 สายแรกออกทุก a นาที สายที่สองออกทุก b นาที — ครั้งถัดไปที่ทั้งสองสายจะออกพร้อมกันอีกครั้งคือนาทีที่ lcm(a, b)',
    misconceptionTh: 'คิดว่า lcm ต้องหาจาก multiples ทั้งหมดเสมอ (ไม่ efficient สำหรับเลขใหญ่)',
    primaryWidgets: ['SliderInput', 'BarCompare'],
  },
  'prime-factorization': {
    coreConceptTh:
      'ทุกจำนวนเต็มที่มากกว่า 1 เขียนเป็นผลคูณของจำนวนเฉพาะได้แบบเดียวเท่านั้น (ไม่นับลำดับ) — นี่คือทฤษฎีบทมูลฐานของเลขคณิต ลองนึกภาพจำนวน n เหมือนโมเลกุลที่แยกเป็นอะตอม (จำนวนเฉพาะ) ได้ ไม่ว่าจะเริ่มแยกจากตัวประกอบไหนก่อน สุดท้ายจะได้ชุดอะตอมชุดเดียวกันเสมอ',
    misconceptionTh: 'คิดว่าการแตกเลขต่างวิธีจะได้ prime factor ต่างชุด (จริง ๆ ชุดเดียวกันเสมอ)',
    primaryWidgets: ['FactorTree'],
  },
  'modular-arithmetic': {
    coreConceptTh:
      'a mod n คือเศษที่เหลือจากการหาร a ด้วย n หรือมองเป็นตำแหน่งที่ a ตกลงบนวงกลมที่มี n ช่อง ลองนึกภาพนาฬิกาที่มี n ชั่วโมงแทนที่จะเป็น 12 เข็มเดินวนจาก 0 ไป n−1 แล้ววนกลับมาที่ 0 ใหม่เรื่อย ๆ — a mod n คือช่องที่เข็มจะไปหยุด ถ้าเริ่มจาก 0 แล้วเดินไป a ช่อง',
    misconceptionTh: 'คิดว่า mod ให้ผลลบได้ แต่ในคณิตศาสตร์ mod ต้องไม่ติดลบ',
    primaryWidgets: ['ClockModulo', 'SliderInput'],
  },
  congruence: {
    coreConceptTh:
      'a และ b จะ "สมภาค" กัน mod n (เขียนว่า a ≡ b (mod n)) ก็ต่อเมื่อ n หาร (a − b) ลงตัว ลองนึกภาพนาฬิกา n ช่องแบบเดียวกับ modular arithmetic — a กับ b congruent กันแปลว่าเข็มนาฬิกาชี้ไปที่ "ช่องเดียวกัน" แม้ a กับ b จะเป็นคนละตัวเลข เช่น 2 กับ 14 อยู่ช่องเดียวกันบนนาฬิกา 12 ช่อง',
    misconceptionTh: 'สับสนระหว่าง "=" กับ "≡" — congruent ไม่ได้แปลว่าค่าเท่ากัน แต่อยู่ "class" เดียวกัน',
    primaryWidgets: ['ClockModulo', 'NumberGrid'],
  },
  'fast-modular-exponentiation': {
    coreConceptTh:
      'การหา a^b mod n อย่างรวดเร็วด้วยการยกกำลังสองซ้ำ ๆ (binary exponentiation) แทนการคูณทีละครั้ง ลองนึกภาพแตกเลขชี้กำลัง b เป็นเลขฐานสอง แล้วยกกำลังสองผลคูณต่อเนื่องไปเรื่อย ๆ คูณเข้าเฉพาะตอนที่ bit นั้นเป็น 1 — เหมือนทบต้นแบบทวีคูณ ใช้ขั้นตอนแค่ประมาณ log₂(b) แทนที่จะเป็น b ครั้ง',
    misconceptionTh: 'คิดว่าต้องคูณ a เข้าไปทุก bit เหมือนกันหมด (จริง ๆ คูณเฉพาะ bit ที่เป็น 1)',
    primaryWidgets: ['StepController', 'CodeSyncPanel', 'BarCompare'],
  },
  'euler-totient': {
    coreConceptTh:
      'ฟังก์ชันออยเลอร์ φ(n) คือจำนวนของ k ในช่วง [1, n] ที่ coprime กับ n (คือ gcd(k, n) = 1) ลองนึกภาพเรียงเลข 1 ถึง n แล้วนับว่ามีกี่ตัวที่ "ไม่มีตัวประกอบร่วม" กับ n เลยนอกจาก 1 — จำนวนที่นับได้คือ φ(n) เช่น φ(6) นับได้แค่ 1 กับ 5 เพราะ 2, 3, 4, 6 ล้วนมีตัวประกอบร่วมกับ 6',
    misconceptionTh: 'คิดว่า φ(n) ต้อง count 1 ออก (จริง ๆ gcd(1,n)=1 เสมอ นับรวม)',
    primaryWidgets: ['NumberGrid', 'EquationHighlighter'],
  },
  'fermats-little-theorem': {
    coreConceptTh:
      'ถ้า p เป็นจำนวนเฉพาะ และ gcd(a, p) = 1 แล้ว a^(p−1) mod p จะเท่ากับ 1 เสมอ ลองนึกภาพคูณ a เข้าตัวเองซ้ำ ๆ บนนาฬิกา mod p — ไม่ว่า a จะเป็นค่าไหน (ที่ไม่ใช่ตัวคูณของ p) พอคูณครบ p−1 ครั้ง เข็มจะวนกลับมาชี้ที่ 1 เสมอ เป็น pattern ที่คงที่อย่างน่าประหลาดใจ',
    misconceptionTh: 'ลืมเงื่อนไข p ต้อง prime และ gcd(a,p)=1',
    primaryWidgets: ['ClockModulo'],
  },
  'extended-euclidean': {
    coreConceptTh:
      "นอกจากหา gcd(a, b) ได้แล้ว ขั้นตอนวิธียูคลิดแบบขยายยังหาสัมประสิทธิ์ x, y ที่ทำให้ ax + by = gcd(a, b) ได้ด้วย (Bézout's identity) ลองนึกภาพเดินย้อนรอยทุกขั้นตอนของการหารเศษซ้ำ ๆ จากขั้นตอนสุดท้ายกลับไปขั้นแรก แทนค่ากลับไปเรื่อย ๆ จนไล่หาค่า x, y ได้ — เหมือนไขปริศนาย้อนรอยจากคำตอบกลับไปจุดเริ่มต้น",
    misconceptionTh: 'คิดว่า x,y ที่หาได้มีคำตอบเดียว (จริง ๆ มีอนันต์คำตอบ, มีแค่ "particular solution")',
    primaryWidgets: ['StepController', 'CodeSyncPanel'],
  },
  'chinese-remainder-theorem': {
    coreConceptTh:
      'ทฤษฎีบทเศษเหลือจีนผสานระบบสมภาคหลายสมการ เช่น x ≡ a1 (mod m1), x ≡ a2 (mod m2), ... ให้เหลือคำตอบเดียว ลองนึกภาพนาฬิกาหลายเรือนเดินพร้อมกัน แต่ละเรือนมี moduli ต่างกันและชี้เศษที่ต่างกัน — ถ้า moduli ทุกคู่ไม่มีตัวประกอบร่วมกัน จะมีตัวเลข x เพียงค่าเดียว (ในช่วง mod m1×m2×...) ที่ทำให้นาฬิกาทุกเรือนชี้ถูกพร้อมกันหมด',
    misconceptionTh: 'ใช้ CRT กับ moduli ที่ไม่ coprime กัน (ไม่การันตีคำตอบเดียว)',
    primaryWidgets: ['ClockModulo', 'StepController'],
  },
  'rsa-cryptography': {
    coreConceptTh:
      'RSA คือระบบเข้ารหัสแบบกุญแจสาธารณะ ที่อาศัยความจริงที่ว่าแยกตัวประกอบเฉพาะของเลขจำนวนมหาศาลนั้นยากมาก แต่การยกกำลังมอดุลาร์กลับทำได้เร็ว ลองนึกภาพกุญแจสองดอก ดอกหนึ่งใช้ล็อกกล่อง (public key เผยแพร่ให้ใครก็ได้) อีกดอกใช้ปลดล็อกเท่านั้น (private key เก็บเป็นความลับ) — ต่อให้รู้กุญแจล็อก ก็ไขปลดล็อกไม่ได้ถ้าไม่รู้ตัวประกอบเฉพาะที่ซ่อนอยู่',
    misconceptionTh: 'คิดว่า e กับ d เลือกอะไรก็ได้ (จริง ๆ ต้องเป็น modular inverse กัน mod φ(n))',
    primaryWidgets: ['StepController', 'ClockModulo', 'CodeSyncPanel'],
  },
};
