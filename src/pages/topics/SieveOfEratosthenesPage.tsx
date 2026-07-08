import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { SieveVisualizer } from './SieveVisualizer';

export function SieveOfEratosthenesPage() {
  return <TopicPageTemplate topicId="sieve-of-eratosthenes" visual={<SieveVisualizer />} />;
}
