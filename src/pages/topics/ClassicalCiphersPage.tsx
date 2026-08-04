import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { ClassicalCiphersVisualizer } from './ClassicalCiphersVisualizer';

export function ClassicalCiphersPage() {
  return <TopicPageTemplate topicId="classical-ciphers" visual={<ClassicalCiphersVisualizer />} hideIntro />;
}
