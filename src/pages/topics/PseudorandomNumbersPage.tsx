import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { PseudorandomVisualizer } from './PseudorandomVisualizer';

export function PseudorandomNumbersPage() {
  return <TopicPageTemplate topicId="pseudorandom-numbers" visual={<PseudorandomVisualizer />} hideIntro />;
}
