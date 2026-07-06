import styles from './PlaceholderBlock.module.css';

export function PlaceholderBlock({ widgetName, note }: { widgetName: string; note?: string }) {
  return (
    <div className={styles.block}>
      <span className={styles.widgetName}>{`<${widgetName}>`}</span>
      <span>{note ?? 'Widget ตัวนี้จะทำงานจริงใน Phase 2'}</span>
    </div>
  );
}
