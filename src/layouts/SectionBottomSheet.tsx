import { useState } from 'react';
import { TOPIC_SECTIONS } from '@/data/sections';
import styles from './SectionBottomSheet.module.css';

export function SectionBottomSheet({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const activeLabel = TOPIC_SECTIONS.find((s) => s.id === activeId)?.labelTh ?? '';

  return (
    <div className={styles.wrapper}>
      {open && (
        <nav className={styles.sheet} aria-label="Section navigation">
          {TOPIC_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={section.id === activeId ? `${styles.link} ${styles.linkActive}` : styles.link}
              aria-current={section.id === activeId ? 'true' : undefined}
              onClick={() => {
                onSelect(section.id);
                setOpen(false);
              }}
            >
              {section.labelTh}
            </button>
          ))}
        </nav>
      )}
      <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen((prev) => !prev)}>
        {open ? '▾ ปิดสารบัญ' : `▴ ${activeLabel}`}
      </button>
    </div>
  );
}
