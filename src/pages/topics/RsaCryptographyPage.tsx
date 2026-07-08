import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { RsaVisualizer } from './RsaVisualizer';

export function RsaCryptographyPage() {
  return <TopicPageTemplate topicId="rsa-cryptography" visual={<RsaVisualizer />} />;
}
