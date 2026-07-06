import { useMemo } from 'react';
import katex from 'katex';
import type { EquationHighlighterProps } from './EquationHighlighter.types';
import styles from './EquationHighlighter.module.css';

/** Renders a LaTeX expression via KaTeX. Pass `highlightTerm` to wrap the
 * first literal occurrence of that substring in the expression with a
 * highlighted span (e.g. highlightTerm="a \\bmod b" for "\\gcd(a,b) = \\gcd(b, a \\bmod b)"). */
export function EquationHighlighter({ expression, highlightTerm }: EquationHighlighterProps) {
  const html = useMemo(() => {
    const source =
      highlightTerm && expression.includes(highlightTerm)
        ? expression.replace(highlightTerm, `\\htmlClass{eq-highlight}{${highlightTerm}}`)
        : expression;
    try {
      return katex.renderToString(source, {
        throwOnError: false,
        displayMode: false,
        // only \htmlClass is needed (for eq-highlight spans) — keep \href/\includegraphics/etc. blocked
        trust: (context) => context.command === '\\htmlClass',
      });
    } catch {
      return source;
    }
  }, [expression, highlightTerm]);

  return <span className={styles.expression} dangerouslySetInnerHTML={{ __html: html }} />;
}
