import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TOPIC_ORDER } from '@/data/topics';

export interface ProgressContextValue {
  completed: Set<string>;
  isComplete: (topicId: string) => boolean;
  markComplete: (topicId: string) => void;
  markIncomplete: (topicId: string) => void;
  toggleComplete: (topicId: string) => void;
  percentComplete: number;
}

const STORAGE_KEY = 'dm2026:progress';

function loadCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Set<string>>(loadCompleted);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
  }, [completed]);

  const markComplete = useCallback((topicId: string) => {
    setCompleted((prev) => new Set(prev).add(topicId));
  }, []);

  const markIncomplete = useCallback((topicId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.delete(topicId);
      return next;
    });
  }, []);

  const toggleComplete = useCallback((topicId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  }, []);

  const isComplete = useCallback((topicId: string) => completed.has(topicId), [completed]);

  const percentComplete = useMemo(
    () => Math.round((completed.size / TOPIC_ORDER.length) * 100),
    [completed],
  );

  const value = useMemo(
    () => ({ completed, isComplete, markComplete, markIncomplete, toggleComplete, percentComplete }),
    [completed, isComplete, markComplete, markIncomplete, toggleComplete, percentComplete],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
