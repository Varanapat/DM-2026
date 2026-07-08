import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { EulerTotientVisualizer } from './EulerTotientVisualizer';

export function EulerTotientPage() {
  return <TopicPageTemplate topicId="euler-totient" visual={<EulerTotientVisualizer />} />;
}
