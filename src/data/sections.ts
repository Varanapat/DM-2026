export interface SectionMeta {
  id: string;
  labelTh: string;
}

/** 4-section template order — shared by TopicPageTemplate and the section
 * nav (SectionSidebar / SectionBottomSheet). Only one section is rendered at
 * a time; clicking a nav item switches which one is active. "Visual
 * Explanation" carries both the concept AND the step-by-step algorithm in one
 * merged animation timeline — there's no separate Try-It or Walkthrough. */
export const TOPIC_SECTIONS: SectionMeta[] = [
  { id: 'hook', labelTh: 'จุดเริ่มต้น' },
  { id: 'visual-explanation', labelTh: 'ภาพอธิบาย' },
  { id: 'misconceptions', labelTh: 'เข้าใจผิดบ่อย' },
  { id: 'quiz', labelTh: 'แบบทดสอบ' },
];
