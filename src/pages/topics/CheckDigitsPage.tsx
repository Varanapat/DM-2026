import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { CheckDigitsVisualizer } from './CheckDigitsVisualizer';

export function CheckDigitsPage() {
  return <TopicPageTemplate topicId="check-digits" visual={<CheckDigitsVisualizer />} hideIntro />;
}
