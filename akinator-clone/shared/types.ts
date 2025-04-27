// Типы для персонажей, вопросов и ответов

export interface CharacterTrait {
  [traitKey: string]: boolean;
}

export interface Character {
  id: number;
  name: string;
  traits: CharacterTrait;
}

export interface Question {
  id: number;
  text: string;
  traitKey: string;
}

export interface GameState {
  currentQuestion: Question | null;
  answeredQuestions: Array<{
    questionId: number;
    answer: boolean | null;
  }>;
  progress: number;
  possibleCharacters: Character[];
  result: Character | null;
}

export type Answer = boolean | null; // true = да, false = нет, null = не знаю

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 