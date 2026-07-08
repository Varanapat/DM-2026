import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { CrtVisualizer } from './CrtVisualizer';

export function ChineseRemainderTheoremPage() {
  return <TopicPageTemplate topicId="chinese-remainder-theorem" visual={<CrtVisualizer />} />;
}
