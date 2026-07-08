import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { FermatVisualizer } from './FermatVisualizer';

export function FermatsLittleTheoremPage() {
  return <TopicPageTemplate topicId="fermats-little-theorem" visual={<FermatVisualizer />} />;
}
