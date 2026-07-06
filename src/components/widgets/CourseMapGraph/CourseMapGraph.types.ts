import type { TopicMeta } from '@/data/topics';

export interface CourseMapGraphProps {
  topics: TopicMeta[];
  completedIds: Set<string>;
  onNodeClick: (id: string) => void;
}
