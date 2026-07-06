import { ROADMAP_STRUCTURE } from '@/data/roadmapStructure';
import { getTopicById, type TopicMeta } from '@/data/topics';

export interface RoadmapNode {
  topic: TopicMeta;
  kind: 'spine' | 'branch';
  x: number;
  y: number;
}

export interface RoadmapConnector {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** id of the topic this connector originates from — used to color it "active" once that topic is completed. */
  fromTopicId: string;
}

export interface RoadmapLayout {
  nodes: RoadmapNode[];
  connectors: RoadmapConnector[];
  width: number;
  height: number;
  centerX: number;
}

const ROW_HEIGHT = 130;
const TOP_PADDING = 60;
const BOTTOM_PADDING = 60;
export const SPINE_WIDTH = 260;
export const BRANCH_WIDTH = 200;
const BRANCH_GAP = 48;
const SIDE_MARGIN = 40;

/**
 * Single straight vertical spine down the center, with short horizontal
 * branch stubs — no diagonal or long-spanning connectors, so nothing crosses.
 */
export function computeRoadmapLayout(): RoadmapLayout {
  const branchOffset = SPINE_WIDTH / 2 + BRANCH_GAP + BRANCH_WIDTH / 2;
  const centerX = branchOffset + BRANCH_WIDTH / 2 + SIDE_MARGIN;
  const width = centerX * 2;

  const nodes: RoadmapNode[] = [];
  const connectors: RoadmapConnector[] = [];

  ROADMAP_STRUCTURE.forEach((item, index) => {
    const y = TOP_PADDING + index * ROW_HEIGHT;
    const topic = getTopicById(item.topicId);
    if (!topic) return;

    nodes.push({ topic, kind: 'spine', x: centerX, y });

    if (index > 0) {
      const prevY = TOP_PADDING + (index - 1) * ROW_HEIGHT;
      connectors.push({
        id: `spine-${item.topicId}`,
        x1: centerX,
        y1: prevY,
        x2: centerX,
        y2: y,
        fromTopicId: ROADMAP_STRUCTURE[index - 1].topicId,
      });
    }

    (item.branches ?? []).forEach((branch) => {
      const branchTopic = getTopicById(branch.topicId);
      if (!branchTopic) return;
      const bx = branch.side === 'left' ? centerX - branchOffset : centerX + branchOffset;
      nodes.push({ topic: branchTopic, kind: 'branch', x: bx, y });

      const spineEdgeX = branch.side === 'left' ? centerX - SPINE_WIDTH / 2 : centerX + SPINE_WIDTH / 2;
      const branchEdgeX = branch.side === 'left' ? bx + BRANCH_WIDTH / 2 : bx - BRANCH_WIDTH / 2;
      connectors.push({
        id: `branch-${branch.topicId}`,
        x1: spineEdgeX,
        y1: y,
        x2: branchEdgeX,
        y2: y,
        fromTopicId: item.topicId,
      });
    });
  });

  const height = TOP_PADDING + (ROADMAP_STRUCTURE.length - 1) * ROW_HEIGHT + BOTTOM_PADDING;

  return { nodes, connectors, width, height, centerX };
}
