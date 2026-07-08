import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { DivisibilityVisualizer } from './DivisibilityVisualizer';

export function DivisibilityPage() {
  return <TopicPageTemplate topicId="divisibility" visual={<DivisibilityVisualizer />} />;
}
