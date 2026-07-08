import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { FastModExpVisualizer } from './FastModExpVisualizer';

export function FastModularExponentiationPage() {
  return <TopicPageTemplate topicId="fast-modular-exponentiation" visual={<FastModExpVisualizer />} />;
}
