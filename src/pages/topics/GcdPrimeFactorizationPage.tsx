import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { GcdPrimeFactorizationVisualizer } from './GcdPrimeFactorizationVisualizer';

export function GcdPrimeFactorizationPage() {
  return <TopicPageTemplate topicId="gcd-prime-factorization" visual={<GcdPrimeFactorizationVisualizer />} hideIntro />;
}
