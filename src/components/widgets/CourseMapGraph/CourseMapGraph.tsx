import type { CourseMapGraphProps } from './CourseMapGraph.types';
import styles from './CourseMapGraph.module.css';

/** Thinnest stub — D3 force-directed layout is Phase 2 scope. Renders an
 * unstyled-but-functional list so the Landing page has real navigation now. */
export function CourseMapGraph({ topics, completedIds, onNodeClick }: CourseMapGraphProps) {
  return (
    <div className={styles.list} role="list" aria-label="Course map">
      {topics.map((topic) => {
        const done = completedIds.has(topic.id);
        return (
          <button
            key={topic.id}
            type="button"
            className={`${styles.node} ${done ? styles.done : styles.dim}`}
            onClick={() => onNodeClick(topic.id)}
          >
            <span>{topic.titleTh}</span>
            {done && <span aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
