export interface SectionMeta {
  id: string;
  labelTh: string;
}

/** Fixed 7-section template order (CLUADE.md Section 2) — shared by
 * TopicPageTemplate, SectionSidebar, and SectionBottomSheet so anchors stay in sync. */
export const TOPIC_SECTIONS: SectionMeta[] = [
  { id: 'hook', labelTh: 'จุดเริ่มต้น' },
  { id: 'visual-explanation', labelTh: 'ภาพอธิบาย' },
  { id: 'try-it', labelTh: 'ลองเอง' },
  { id: 'walkthrough', labelTh: 'ทีละขั้นตอน' },
  { id: 'misconceptions', labelTh: 'เข้าใจผิดบ่อย' },
  { id: 'quiz', labelTh: 'แบบทดสอบ' },
  { id: 'practice', labelTh: 'โจทย์ฝึกฝน' },
];
