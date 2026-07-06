export type ExerciseDifficulty = 'easy' | 'medium' | 'hard' | 'open-ended';

export interface Exercise {
  id: string;
  difficulty: ExerciseDifficulty;
  promptTh: string;
}

/** 4 exercises per topic — easy, medium, hard, and an open-ended/creative
 * prompt that stays within course content but has no single numeric answer. */
export const EXERCISES: Record<string, Exercise[]> = {
  divisibility: [
    { id: 'divisibility-easy', difficulty: 'easy', promptTh: 'หาตัวหารทั้งหมดของ 18' },
    { id: 'divisibility-medium', difficulty: 'medium', promptTh: 'หาตัวหารร่วมทั้งหมดของ 24 และ 36 ให้ครบภายใน 30 วิ' },
    {
      id: 'divisibility-hard',
      difficulty: 'hard',
      promptTh: 'หาจำนวนเต็มบวกที่น้อยที่สุดที่หารด้วย 2, 3, 4, 5 และ 6 ลงตัวทั้งหมด โดยไม่คูณเลขทั้งห้าตัวเข้าด้วยกันตรง ๆ',
    },
    {
      id: 'divisibility-open',
      difficulty: 'open-ended',
      promptTh: 'ลองคิดกฎการหารลงตัวด้วย 9 ด้วยตัวเอง (ทำไมบวกเลขโดดแล้วเช็คได้ว่าหาร 9 ลงตัวหรือไม่) แล้วอธิบายด้วยคำพูดของตัวเองว่าทำไมกฎนี้ถึงใช้ได้',
    },
  ],
  primes: [
    { id: 'primes-easy', difficulty: 'easy', promptTh: 'ในจำนวน 1, 9, 13, 21 ข้อใดเป็นจำนวนเฉพาะ และเพราะเหตุใด' },
    { id: 'primes-medium', difficulty: 'medium', promptTh: 'หา prime ทั้งหมดใน 1–50 ด้วยมือ ก่อนไปเจอ Sieve ในหัวข้อถัดไป' },
    {
      id: 'primes-hard',
      difficulty: 'hard',
      promptTh: 'หา "twin prime" (คู่ prime ที่ห่างกัน 2 เช่น 11,13) ทั้งหมดที่อยู่ในช่วง 1–100 ให้ครบ',
    },
    {
      id: 'primes-open',
      difficulty: 'open-ended',
      promptTh: 'นักคณิตศาสตร์เชื่อว่ามี prime จำนวนอนันต์ ลองคิดว่าถ้าสมมติว่ามี prime แค่จำนวนจำกัด จะเกิดความขัดแย้งอะไรขึ้น (ไม่ต้องพิสูจน์แบบเป็นทางการ แค่อธิบายไอเดียของตัวเอง)',
    },
  ],
  'sieve-of-eratosthenes': [
    { id: 'sieve-easy', difficulty: 'easy', promptTh: 'ใช้ sieve ตัด multiples ของ 2 และ 3 ออกจาก 1–30 เหลือเลขอะไรบ้าง' },
    { id: 'sieve-medium', difficulty: 'medium', promptTh: '"เดามือ" ว่า 1–200 มี prime กี่ตัว ก่อนรัน sieve จริงเทียบคำตอบ' },
    {
      id: 'sieve-hard',
      difficulty: 'hard',
      promptTh: 'ถ้าต้องหา prime ใน 1–1,000,000 ลองประมาณว่าการหยุดตัดที่ √n ช่วยลดจำนวนรอบที่ต้องทำเมื่อเทียบกับตัดไปจนถึง n มากแค่ไหน',
    },
    {
      id: 'sieve-open',
      difficulty: 'open-ended',
      promptTh: 'ออกแบบวิธี "sieve" ของตัวเองสำหรับหาจำนวนที่หารด้วย 3 ลงตัวทั้งหมดใน 1–100 โดยใช้แค่การนับ ไม่ใช้การหารเลยสักครั้ง',
    },
  ],
  'gcd-euclidean': [
    { id: 'gcd-easy', difficulty: 'easy', promptTh: 'หา gcd(48, 18)' },
    { id: 'gcd-medium', difficulty: 'medium', promptTh: 'หา gcd(252, 105) ด้วยมือ ทีละ step' },
    {
      id: 'gcd-hard',
      difficulty: 'hard',
      promptTh: 'ลองหา gcd ของเลข Fibonacci ที่อยู่ติดกันหลายคู่ (เช่น gcd(13,21), gcd(21,34), gcd(34,55)) แล้วเดาว่าทำไมผลลัพธ์ถึงเป็นแบบนั้นเสมอ',
    },
    {
      id: 'gcd-open',
      difficulty: 'open-ended',
      promptTh: 'อธิบายด้วยคำพูดของตัวเอง (ไม่ต้องเขียนพิสูจน์ทางการ) ว่าทำไม gcd(a,b) = gcd(b, a mod b) ถึงใช้ได้เสมอ',
    },
  ],
  lcm: [
    { id: 'lcm-easy', difficulty: 'easy', promptTh: 'หา lcm(4, 6)' },
    { id: 'lcm-medium', difficulty: 'medium', promptTh: 'รถบัสสองสายออกจากป้ายพร้อมกัน สายแรกทุก 12 นาที สายที่สองทุก 18 นาที อีกกี่นาทีจะออกพร้อมกันอีกครั้ง' },
    {
      id: 'lcm-hard',
      difficulty: 'hard',
      promptTh: 'ถ้า lcm(a,b) = 180 และ gcd(a,b) = 6 หาคู่ (a,b) ที่เป็นไปได้ทั้งหมด (มีมากกว่าหนึ่งคู่)',
    },
    {
      id: 'lcm-open',
      difficulty: 'open-ended',
      promptTh: 'คิดสถานการณ์ในชีวิตจริงอีกอย่างหนึ่งที่ต้องใช้ lcm ในการแก้ปัญหา แล้วลองตั้งเป็นโจทย์ของตัวเอง',
    },
  ],
  'prime-factorization': [
    { id: 'prime-factorization-easy', difficulty: 'easy', promptTh: 'แยกตัวประกอบเฉพาะของ 60' },
    { id: 'prime-factorization-medium', difficulty: 'medium', promptTh: 'แตก 360 เป็น prime factorization แล้วใช้หาจำนวนตัวหารทั้งหมดของ 360' },
    {
      id: 'prime-factorization-hard',
      difficulty: 'hard',
      promptTh: 'หาจำนวนเต็มบวกที่น้อยที่สุดที่มีตัวหารทั้งหมดพอดี 10 ตัว โดยใช้ความสัมพันธ์ระหว่าง prime factorization กับจำนวนตัวหาร',
    },
    {
      id: 'prime-factorization-open',
      difficulty: 'open-ended',
      promptTh: 'ทำไมการแยกตัวประกอบเฉพาะของเลขจำนวนมาก (หลักร้อยหลัก) ถึงยากมากสำหรับคอมพิวเตอร์ ทั้งที่การคูณเลขสองตัวเข้าด้วยกันทำได้เร็วมาก ลองคิดว่าความไม่สมมาตรนี้มีประโยชน์อย่างไร (ใบ้: เชื่อมโยงกับ RSA ในบทหลัง)',
    },
  ],
  'modular-arithmetic': [
    { id: 'modular-arithmetic-easy', difficulty: 'easy', promptTh: '17 mod 5 มีค่าเท่าไร' },
    { id: 'modular-arithmetic-medium', difficulty: 'medium', promptTh: 'ถ้าวันนี้เป็นวันพุธ อีก 100 วันจะเป็นวันอะไร' },
    {
      id: 'modular-arithmetic-hard',
      difficulty: 'hard',
      promptTh: '(-100) mod 7 มีค่าเท่าไร และอธิบายว่าทำไมคำตอบทางคณิตศาสตร์ต้องไม่ติดลบ',
    },
    {
      id: 'modular-arithmetic-open',
      difficulty: 'open-ended',
      promptTh: 'ออกแบบระบบวนรอบของตัวเองในชีวิตจริง (ไม่ใช่นาฬิกา 12/24 ชั่วโมง) แล้วเขียนเป็นตัวอย่างการคำนวณ mod n พร้อมอธิบาย',
    },
  ],
  congruence: [
    { id: 'congruence-easy', difficulty: 'easy', promptTh: '17 ≡ 5 (mod 6) จริงหรือไม่ อธิบายเหตุผล' },
    { id: 'congruence-medium', difficulty: 'medium', promptTh: 'จัดกลุ่มเลข 1–30 ตาม mod 5 equivalence class ให้ครบทุกกลุ่ม' },
    {
      id: 'congruence-hard',
      difficulty: 'hard',
      promptTh: 'ถ้า a ≡ b (mod n) และ c ≡ d (mod n) จงแสดงด้วยตัวอย่างตัวเลขจริง 3 ชุดว่า a+c ≡ b+d (mod n) เสมอ',
    },
    {
      id: 'congruence-open',
      difficulty: 'open-ended',
      promptTh: 'congruence class เปรียบได้กับการ "จัดกลุ่มคนที่เกิดวันเดียวกันของสัปดาห์" ลองคิด metaphor ของตัวเองอีกหนึ่งอย่างที่อธิบาย equivalence class ได้ดี',
    },
  ],
  'fast-modular-exponentiation': [
    { id: 'fast-modular-exponentiation-easy', difficulty: 'easy', promptTh: 'คำนวณ 7^13 mod 11 ด้วยมือทีละ step' },
    { id: 'fast-modular-exponentiation-medium', difficulty: 'medium', promptTh: 'คำนวณ 5^117 mod 13 โดยใช้ binary exponentiation' },
    {
      id: 'fast-modular-exponentiation-hard',
      difficulty: 'hard',
      promptTh: 'ถ้า b มีค่าประมาณ 10^18 การคูณทีละครั้ง (naive) กับ fast exponentiation ใช้จำนวนขั้นตอนต่างกันประมาณกี่เท่า (คำนวณคร่าว ๆ ด้วย log₂)',
    },
    {
      id: 'fast-modular-exponentiation-open',
      difficulty: 'open-ended',
      promptTh: 'อธิบายว่าทำไมการ "mod ทุกขั้นตอน" ระหว่างคำนวณถึงสำคัญมากในทางปฏิบัติ ทั้งที่ทางคณิตศาสตร์ผลลัพธ์สุดท้ายเหมือนกันไม่ว่าจะ mod ตอนไหน',
    },
  ],
  'euler-totient': [
    { id: 'euler-totient-easy', difficulty: 'easy', promptTh: 'หา φ(9)' },
    { id: 'euler-totient-medium', difficulty: 'medium', promptTh: 'หา φ(36) ด้วยสูตรจาก prime factorization แล้วเทียบกับนับ grid จริง' },
    {
      id: 'euler-totient-hard',
      difficulty: 'hard',
      promptTh: 'หา n ทั้งหมดที่ φ(n) = 8 (มีคำตอบมากกว่าหนึ่งตัว)',
    },
    {
      id: 'euler-totient-open',
      difficulty: 'open-ended',
      promptTh: 'φ(n) เกี่ยวข้องกับ RSA อย่างไร ลองเดาหรือค้นคว้าเบื้องต้นแล้วเขียนอธิบายด้วยคำพูดตัวเองว่าทำไม RSA ถึงต้องใช้ φ(n) ในการหา key',
    },
  ],
  'fermats-little-theorem': [
    { id: 'fermats-little-theorem-easy', difficulty: 'easy', promptTh: 'ตามทฤษฎีบทเล็กของแฟร์มา a^(p-1) mod p มีค่าเท่าไรเสมอ เมื่อ p เป็น prime และ gcd(a,p)=1' },
    { id: 'fermats-little-theorem-medium', difficulty: 'medium', promptTh: "ใช้ Fermat's Little Theorem ลัดคำนวณ 3^200 mod 7 โดยไม่คูณตรง ๆ" },
    {
      id: 'fermats-little-theorem-hard',
      difficulty: 'hard',
      promptTh: 'ทดสอบว่า 2^340 mod 341 ให้ผลเป็น 1 หรือไม่ (341 ไม่ใช่ prime) ผลที่ได้บอกอะไรเกี่ยวกับข้อจำกัดของการใช้ Fermat test เป็นตัวเช็ค primality',
    },
    {
      id: 'fermats-little-theorem-open',
      difficulty: 'open-ended',
      promptTh: 'ลองอธิบายว่าทำไม "Fermat primality test" ถึงบอกได้แค่ว่าตัวเลข "น่าจะเป็น prime" เท่านั้น ไม่ใช่ "เป็น prime แน่นอน 100%"',
    },
  ],
  'extended-euclidean': [
    { id: 'extended-euclidean-easy', difficulty: 'easy', promptTh: 'หา x, y ที่ทำให้ 3x + 5y = 1' },
    { id: 'extended-euclidean-medium', difficulty: 'medium', promptTh: 'หา modular inverse ของ 7 mod 26 โดยใช้ extended Euclidean' },
    {
      id: 'extended-euclidean-hard',
      difficulty: 'hard',
      promptTh: 'หาชุดคำตอบทั่วไป (general solution) ทั้งหมดของสมการ 12x + 18y = 6 ไม่ใช่แค่คำตอบเดียว',
    },
    {
      id: 'extended-euclidean-open',
      difficulty: 'open-ended',
      promptTh: 'modular inverse สำคัญกับการเข้ารหัส (เช่น affine cipher หรือ RSA) อย่างไร ลองอธิบายว่าทำไมเราต้อง "หารกลับ" ในโลกของ mod แทนที่จะหารตรง ๆ แบบเลขปกติ',
    },
  ],
  'chinese-remainder-theorem': [
    { id: 'chinese-remainder-theorem-easy', difficulty: 'easy', promptTh: 'x ≡ 2 (mod 3) และ x ≡ 3 (mod 5) หาค่า x ที่น้อยที่สุด' },
    { id: 'chinese-remainder-theorem-medium', difficulty: 'medium', promptTh: "นับ 2 เหลือ 1, นับ 3 เหลือ 2, นับ 5 เหลือ 4 มีไข่กี่ฟอง (Sun Tzu's problem)" },
    {
      id: 'chinese-remainder-theorem-hard',
      difficulty: 'hard',
      promptTh: 'ลองแสดงว่าทำไมระบบ x ≡ 2 (mod 4) และ x ≡ 3 (mod 6) ไม่มีคำตอบ (เชื่อมโยงกับเงื่อนไข moduli ต้อง coprime)',
    },
    {
      id: 'chinese-remainder-theorem-open',
      difficulty: 'open-ended',
      promptTh: 'CRT ถูกใช้ช่วยให้คำนวณแบบขนาน (parallel computation) ได้ ลองคิดว่าทำไมการ "แตกปัญหาใหญ่เป็น mod เล็ก ๆ หลายอัน" ถึงช่วยให้คำนวณเร็วขึ้น',
    },
  ],
  'rsa-cryptography': [
    { id: 'rsa-cryptography-easy', difficulty: 'easy', promptTh: 'ให้ p=5, q=11 คำนวณ n และ φ(n)' },
    { id: 'rsa-cryptography-medium', difficulty: 'medium', promptTh: 'จากค่า n, φ(n) ในข้อก่อนหน้า เลือก e ที่ใช้ได้ แล้วหา d ที่เป็น modular inverse ของ e mod φ(n)' },
    {
      id: 'rsa-cryptography-hard',
      difficulty: 'hard',
      promptTh: 'ใช้กุญแจ (n, e, d) ที่หาได้จากสองข้อก่อนหน้า เข้ารหัสและถอดรหัสตัวเลข 8 ด้วยมือให้ครบทุกขั้นตอน',
    },
    {
      id: 'rsa-cryptography-open',
      difficulty: 'open-ended',
      promptTh: 'ถ้า Eve รู้ค่า n และ e (public key) แต่ไม่รู้ p, q เธอจะพยายามหา d ได้อย่างไร และทำไมวิธีนั้นถึงใช้เวลานานมากถ้า p, q เป็นเลขจำนวนมหาศาลจริง ๆ (เชื่อมโยงกับความยากของ prime factorization)',
    },
  ],
};
