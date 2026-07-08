import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { PrimesVisualizer } from './PrimesVisualizer';

export function PrimesPage() {
  return <TopicPageTemplate topicId="primes" visual={<PrimesVisualizer />} />;
}
