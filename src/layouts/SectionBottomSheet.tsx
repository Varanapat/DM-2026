import { useState } from 'react';
import { TOPIC_SECTIONS } from '@/data/sections';
import styles from './SectionBottomSheet.module.css';

export function SectionBottomSheet() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {open && (
        <nav className={styles.sheet} aria-label="Jump to section">
          {TOPIC_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={styles.link}
              onClick={() => setOpen(false)}
            >
              {section.labelTh}
            </a>
          ))}
        </nav>
      )}
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? '▾ ปิดสารบัญ' : '▴ สารบัญหัวข้อย่อย'}
      </button>
    </div>
  );
}
