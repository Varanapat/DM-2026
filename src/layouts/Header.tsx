import { NavLink } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import styles from './Header.module.css';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        <span className={styles.logoMark} aria-hidden="true">
          DM
        </span>
        <span className={styles.logoWordmark}>Number Theory</span>
      </NavLink>
      <nav className={styles.nav} aria-label="Main">
        <NavLink
          to="/playground"
          className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
        >
          Playground
        </NavLink>
        <NavLink
          to="/glossary"
          className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
        >
          Glossary
        </NavLink>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  );
}
