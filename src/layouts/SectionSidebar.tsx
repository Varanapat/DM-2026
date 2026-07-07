import { TOPIC_SECTIONS } from '@/data/sections';
import styles from './SectionSidebar.module.css';

export function SectionSidebar({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <nav className={styles.sidebar} aria-label="Section navigation">
      {TOPIC_SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          className={section.id === activeId ? `${styles.link} ${styles.linkActive}` : styles.link}
          aria-current={section.id === activeId ? 'true' : undefined}
          onClick={() => onSelect(section.id)}
        >
          {section.labelTh}
        </button>
      ))}
    </nav>
  );
}
