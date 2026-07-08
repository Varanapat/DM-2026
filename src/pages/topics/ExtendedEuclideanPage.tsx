import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { ExtendedEuclideanVisualizer } from './ExtendedEuclideanVisualizer';

export function ExtendedEuclideanPage() {
  return <TopicPageTemplate topicId="extended-euclidean" visual={<ExtendedEuclideanVisualizer />} />;
}
