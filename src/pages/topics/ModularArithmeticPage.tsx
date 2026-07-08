import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { ModularArithmeticVisualizer } from './ModularArithmeticVisualizer';

export function ModularArithmeticPage() {
  return <TopicPageTemplate topicId="modular-arithmetic" visual={<ModularArithmeticVisualizer />} />;
}
