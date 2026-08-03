import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { TopicLayout } from '@/layouts/TopicLayout';
import { LandingPage } from '@/pages/LandingPage';
import { PlaygroundPage } from '@/pages/PlaygroundPage';
import { GlossaryPage } from '@/pages/GlossaryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { TOPIC_ORDER } from '@/data/topics';
import { TOPIC_PAGE_COMPONENTS } from './routeConfig';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
      </Route>
      <Route element={<TopicLayout />}>
        {TOPIC_ORDER.map((topic) => {
          const PageComponent = TOPIC_PAGE_COMPONENTS[topic.id];
          return (
            <Route
              key={topic.id}
              path={topic.path}
              element={
                <Suspense fallback={null}>
                  <PageComponent />
                </Suspense>
              }
            />
          );
        })}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
