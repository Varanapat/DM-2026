import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { CongruenceVisualizer } from './CongruenceVisualizer';

export function CongruencePage() {
  return <TopicPageTemplate topicId="congruence" visual={<CongruenceVisualizer />} />;
}
