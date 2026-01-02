export type Grade = 1 | 2 | 3 | 4 | 5 | 6;
export type Semester = '1' | '2'; // 1 = 上册 (Shang), 2 = 下册 (Xia)

export interface Word {
  id: string;
  text: string;
  translation: string;
  ipa?: string;
  sentence?: string; // Example sentence
  sentenceTranslation?: string;
  grade: Grade;
  semester: Semester;
  unit: number; // Unit 1, Unit 2, etc.
}

export interface UserProgress {
  [key: string]: { // key is `${grade}-${semester}-${unit}`
    stars: number; // 0-3
    unlocked: boolean;
    highScore: number;
  };
}

export enum GameType {
  FLASH_CARDS = 'Flash Cards (Learn)',
  SPACE_SPELLER = 'Space Speller',
  MATCH_MASTER = 'Match Master',
  DROP_RACE = 'Drop Race',
  SENTENCE_BUILDER = 'Sentence Builder',
}

export interface GameSessionResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  mistakes: string[]; // IDs of words missed
  timeTaken: number;
}