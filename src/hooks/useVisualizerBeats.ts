import { useEffect, useState } from 'react';

export interface VisualizerBeats {
  beatIndex: number;
  setBeatIndex: (beat: number) => void;
  mode: 'manual' | 'auto';
  setMode: (mode: 'manual' | 'auto') => void;
  totalBeats: number;
}

/** Owns the StepController state every visualizer repeats: a clamped beat
 * index plus play mode, both reset whenever the inputs (resetKey) change. */
export function useVisualizerBeats(totalBeats: number, resetKey: string): VisualizerBeats {
  const [beatIndex, setBeatIndex] = useState(0);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  useEffect(() => {
    setBeatIndex(0);
    setMode('manual');
  }, [resetKey]);

  const total = Math.max(totalBeats, 1);
  return {
    beatIndex: Math.min(beatIndex, total - 1),
    setBeatIndex,
    mode,
    setMode,
    totalBeats: total,
  };
}
