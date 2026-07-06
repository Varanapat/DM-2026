import { TOPIC_ORDER, type TopicMeta } from '@/data/topics';

export interface PrevNext {
  prev: TopicMeta | null;
  next: TopicMeta | null;
}

export function getPrevNext(id: string): PrevNext {
  const index = TOPIC_ORDER.findIndex((t) => t.id === id);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? TOPIC_ORDER[index - 1] : null,
    next: index < TOPIC_ORDER.length - 1 ? TOPIC_ORDER[index + 1] : null,
  };
}
