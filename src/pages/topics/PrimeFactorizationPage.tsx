import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { PrimeFactorizationVisualizer } from './PrimeFactorizationVisualizer';

export function PrimeFactorizationPage() {
  return <TopicPageTemplate topicId="prime-factorization" visual={<PrimeFactorizationVisualizer />} />;
}
