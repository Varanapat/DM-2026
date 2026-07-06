import type { TopicMeta } from '@/data/topics';

export interface RoadmapNode {
  topic: TopicMeta;
  level: number;
  /** Horizontal position as a percentage (0-100) of the container width. */
  xPercent: number;
  /** Vertical position in pixels from the top of the roadmap container. */
  yPx: number;
}

export interface RoadmapEdge {
  from: RoadmapNode;
  to: RoadmapNode;
}

export interface RoadmapLayout {
  nodes: RoadmapNode[];
  nodesById: Map<string, RoadmapNode>;
  edges: RoadmapEdge[];
  rows: TopicMeta[][];
  totalHeightPx: number;
}

const ROW_HEIGHT = 150;
const TOP_PADDING = 70;
const BOTTOM_PADDING = 70;

/** Longest-path-from-root depth for each topic, based on dependsOn edges. */
function computeLevels(topics: TopicMeta[]): Map<string, number> {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const levels = new Map<string, number>();

  function levelOf(id: string): number {
    if (levels.has(id)) return levels.get(id)!;
    const topic = byId.get(id);
    if (!topic || topic.dependsOn.length === 0) {
      levels.set(id, 0);
      return 0;
    }
    const level = 1 + Math.max(...topic.dependsOn.map((depId) => levelOf(depId)));
    levels.set(id, level);
    return level;
  }

  topics.forEach((t) => levelOf(t.id));
  return levels;
}

export function computeRoadmapLayout(topics: TopicMeta[]): RoadmapLayout {
  const levels = computeLevels(topics);
  const maxLevel = Math.max(...Array.from(levels.values()));

  const rows: TopicMeta[][] = Array.from({ length: maxLevel + 1 }, () => []);
  topics.forEach((topic) => {
    rows[levels.get(topic.id)!].push(topic);
  });

  const nodes: RoadmapNode[] = [];
  const nodesById = new Map<string, RoadmapNode>();

  rows.forEach((row, level) => {
    const yPx = TOP_PADDING + level * ROW_HEIGHT;
    row.forEach((topic, index) => {
      const xPercent = ((index + 0.5) / row.length) * 100;
      const node: RoadmapNode = { topic, level, xPercent, yPx };
      nodes.push(node);
      nodesById.set(topic.id, node);
    });
  });

  const edges: RoadmapEdge[] = [];
  topics.forEach((topic) => {
    const to = nodesById.get(topic.id);
    if (!to) return;
    topic.dependsOn.forEach((depId) => {
      const from = nodesById.get(depId);
      if (from) edges.push({ from, to });
    });
  });

  const totalHeightPx = TOP_PADDING + maxLevel * ROW_HEIGHT + BOTTOM_PADDING;

  return { nodes, nodesById, edges, rows, totalHeightPx };
}
