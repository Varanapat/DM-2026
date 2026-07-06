import { TOPIC_SECTIONS } from '@/data/sections';
import styles from './SectionSidebar.module.css';

export function SectionSidebar() {
  return (
    <nav className={styles.sidebar} aria-label="Jump to section">
      {TOPIC_SECTIONS.map((section) => (
        <a key={section.id} href={`#${section.id}`} className={styles.link}>
          {section.labelTh}
        </a>
      ))}
    </nav>
  );
}
