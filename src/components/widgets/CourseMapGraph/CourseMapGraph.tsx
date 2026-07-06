import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { computeRoadmapLayout } from '@/utils/roadmapLayout';
import type { CourseMapGraphProps } from './CourseMapGraph.types';
import styles from './CourseMapGraph.module.css';

type NodeState = 'completed' | 'next' | 'available' | 'locked';

function findNextTopicId(topics: CourseMapGraphProps['topics'], completedIds: Set<string>): string | null {
  const topic = topics.find(
    (t) => !completedIds.has(t.id) && t.dependsOn.every((dep) => completedIds.has(dep)),
  );
  return topic?.id ?? null;
}

/** roadmap.sh-inspired node-link graph — levels/branches computed from the
 * topic dependency graph (src/utils/roadmapLayout.ts). Falls back to a simple
 * vertical list on mobile since a wide branching graph doesn't fit narrow screens. */
export function CourseMapGraph({ topics, completedIds, onNodeClick }: CourseMapGraphProps) {
  const isMobile = useIsMobile();
  const layout = useMemo(() => computeRoadmapLayout(topics), [topics]);
  const nextTopicId = useMemo(() => findNextTopicId(topics, completedIds), [topics, completedIds]);
  const maxRowSize = Math.max(...layout.rows.map((row) => row.length));
  const minWidth = Math.max(maxRowSize * 190, 720);

  const stateOf = (topicId: string, dependsOn: string[]): NodeState => {
    if (completedIds.has(topicId)) return 'completed';
    if (topicId === nextTopicId) return 'next';
    if (dependsOn.every((dep) => completedIds.has(dep))) return 'available';
    return 'locked';
  };

  if (isMobile) {
    return (
      <div className={styles.mobileList} role="list" aria-label="Course roadmap">
        {topics.map((topic) => {
          const state = stateOf(topic.id, topic.dependsOn);
          return (
            <button
              key={topic.id}
              type="button"
              className={`${styles.mobileNode} ${state === 'locked' ? styles.nodeMuted : ''}`}
              onClick={() => onNodeClick(topic.id)}
            >
              <span>{topic.titleTh}</span>
              {state === 'completed' && <span className={styles.check}>✓</span>}
              {state === 'next' && <span className={styles.mobileBadge}>ถัดไป</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotCompleted}`} /> เรียนแล้ว
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotNext}`} /> แนะนำให้เรียนต่อ
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} /> เรียนได้แล้ว
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotMuted}`} /> ยังไม่ปลดล็อก
        </span>
      </div>
      <div className={styles.scrollContainer}>
        <div className={styles.wrapper} style={{ height: layout.totalHeightPx, minWidth }}>
          <svg className={styles.svg} viewBox={`0 0 100 ${layout.totalHeightPx}`} preserveAspectRatio="none">
            {layout.edges.map((edge) => {
              const midY = (edge.from.yPx + edge.to.yPx) / 2;
              const d = `M ${edge.from.xPercent} ${edge.from.yPx} C ${edge.from.xPercent} ${midY}, ${edge.to.xPercent} ${midY}, ${edge.to.xPercent} ${edge.to.yPx}`;
              const active = completedIds.has(edge.from.topic.id);
              return <path key={`${edge.from.topic.id}-${edge.to.topic.id}`} d={d} className={active ? `${styles.edge} ${styles.edgeActive}` : styles.edge} />;
            })}
          </svg>
          {layout.nodes.map((node) => {
            const state = stateOf(node.topic.id, node.topic.dependsOn);
            const classes = [
              styles.node,
              state === 'completed' ? styles.nodeCompleted : '',
              state === 'next' ? styles.nodeNext : '',
              state === 'locked' ? styles.nodeMuted : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <button
                key={node.topic.id}
                type="button"
                className={classes}
                style={{ left: `${node.xPercent}%`, top: `${node.yPx}px` }}
                onClick={() => onNodeClick(node.topic.id)}
                aria-label={`${node.topic.titleTh}${state === 'completed' ? ' (เรียนแล้ว)' : ''}${state === 'next' ? ' (แนะนำให้เรียนต่อ)' : ''}`}
              >
                {state === 'next' && <span className={styles.nextBadge}>เริ่มตรงนี้</span>}
                <span>{node.topic.titleTh}</span>
                {state === 'completed' && <span className={styles.check}>✓ เรียนแล้ว</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
