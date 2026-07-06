import { Card } from '@/components/ui/Card';
import { GLOSSARY_TERMS } from '@/data/glossary';
import styles from './GlossaryPage.module.css';

export function GlossaryPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Glossary</h1>
      <div className={styles.list}>
        {GLOSSARY_TERMS.map((entry) => (
          <Card key={entry.term}>
            <p className={styles.term}>{entry.term}</p>
            <p>{entry.definitionTh}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
