import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { LcmVisualizer } from './LcmVisualizer';

export function LcmPage() {
  return <TopicPageTemplate topicId="lcm" visual={<LcmVisualizer />} />;
}
