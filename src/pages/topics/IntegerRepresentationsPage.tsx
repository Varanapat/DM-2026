import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { IntegerRepresentationsVisualizer } from './IntegerRepresentationsVisualizer';

export function IntegerRepresentationsPage() {
  return (
    <TopicPageTemplate topicId="integer-representations" visual={<IntegerRepresentationsVisualizer />} hideIntro />
  );
}
