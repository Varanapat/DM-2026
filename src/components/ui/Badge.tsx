import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'danger' | 'accent' | 'secondary';

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: BadgeVariant }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
