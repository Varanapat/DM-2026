import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { GcdVisualizer } from './GcdVisualizer';

export function GcdEuclideanPage() {
  return <TopicPageTemplate topicId="gcd-euclidean" visual={<GcdVisualizer />} />;
}
