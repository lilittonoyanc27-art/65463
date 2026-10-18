export interface SubtitleItem {
  id: number;
  start: number; // in seconds
  end: number;   // in seconds
  es: string;
  hy: string;
  naturalForm?: {
    original: string;
    suggested: string;
    explanationEs: string;
    explanationHy: string;
  };
}

export interface QuizOption {
  id: string; // 'A', 'B', 'C', 'D'
  es: string;
  hy: string;
}

export interface QuizQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  options: QuizOption[];
  correctOptionId: string;
  explanationEs: string;
  explanationHy: string;
  videoTimestamp: number;
  videoQuoteEs: string;
  videoQuoteHy: string;
}

export interface FillBlankItem {
  id: number;
  beforeBlank: string;
  blankWord: string;
  afterBlank: string;
  fullSentenceEs: string;
  fullSentenceHy: string;
  options: { es: string; hy: string }[];
  correctAnswer: string;
  explanationEs: string;
  explanationHy: string;
}

export interface TrueFalseItem {
  id: number;
  statementEs: string;
  statementHy: string;
  isTrue: boolean;
  explanationEs: string;
  explanationHy: string;
  videoTimestamp?: number;
}

export interface WordOrderItem {
  id: number;
  scrambledWords: string[];
  correctWords: string[];
  fullSentenceEs: string;
  fullSentenceHy: string;
  hintEs: string;
  hintHy: string;
}

export interface InterviewItem {
  id: number;
  journalistQuestionEs: string;
  journalistQuestionHy: string;
  contextEs: string;
  contextHy: string;
  options: {
    id: string;
    es: string;
    hy: string;
    isAppropriate: boolean;
    feedbackEs: string;
    feedbackHy: string;
  }[];
}

export interface ListeningItem {
  id: number;
  startTime: number;
  endTime: number;
  questionEs: string;
  questionHy: string;
  options: QuizOption[];
  correctOptionId: string;
  quoteEs: string;
  quoteHy: string;
  explanationEs: string;
  explanationHy: string;
}

export interface VocabWord {
  id: string;
  es: string;
  hy: string;
  category: 'persona' | 'accion' | 'emocion' | 'competicion';
  exampleEs: string;
  exampleHy: string;
}

export interface GrammarRule {
  id: string;
  titleEs: string;
  titleHy: string;
  explanationEs: string;
  explanationHy: string;
  examples: {
    es: string;
    hy: string;
    noteEs?: string;
    noteHy?: string;
  }[];
}

export interface UserStats {
  quizScore: number;
  quizTotal: number;
  quizCompleted: boolean;

  fillScore: number;
  fillTotal: number;
  fillCompleted: boolean;

  tfScore: number;
  tfTotal: number;
  tfCompleted: boolean;

  orderScore: number;
  orderTotal: number;
  orderCompleted: boolean;

  interviewScore: number;
  interviewTotal: number;
  interviewCompleted: boolean;

  listeningScore: number;
  listeningTotal: number;
  listeningCompleted: boolean;

  vocabMatchedCount: number;
}
