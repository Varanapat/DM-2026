export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizCardProps {
  question: QuizQuestion;
  selectedIndex?: number;
  onAnswer?: (index: number) => void;
}
