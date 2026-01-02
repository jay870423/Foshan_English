import { UserProgress, Word, Grade, Semester } from '../types';
import { INITIAL_WORDS } from '../constants';

const PROGRESS_KEY = 'foshan_english_progress';
const WORDS_KEY = 'foshan_english_custom_words';

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveProgress = (key: string, stars: number, score: number) => {
  const current = getProgress();
  const existing = current[key] || { stars: 0, unlocked: false, highScore: 0 };
  
  // Only update if better
  if (stars > existing.stars) existing.stars = stars;
  if (score > existing.highScore) existing.highScore = score;
  existing.unlocked = true;

  current[key] = existing;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
};

export const getWords = (): Word[] => {
  const stored = localStorage.getItem(WORDS_KEY);
  const customWords: Word[] = stored ? JSON.parse(stored) : [];
  
  // Strategy: Custom words SHADOW built-in words if they match location + text (case-insensitive)
  // This allows "Overwriting" a built-in word definition by importing a new one.
  
  const combined = [...INITIAL_WORDS];

  customWords.forEach(cw => {
      // Try to find a built-in word to shadow
      const existingIdx = combined.findIndex(iw => 
          iw.grade === cw.grade && 
          iw.semester === cw.semester && 
          iw.unit === cw.unit && 
          iw.text.toLowerCase() === cw.text.toLowerCase()
      );

      if (existingIdx >= 0) {
          // Shadow it (Replace)
          // Ensure we keep the ID consistent if possible, or just replace. 
          // Replacing is safer for the UI to reflect changes.
          combined[existingIdx] = cw; 
      } else {
          // No match, just append
          combined.push(cw);
      }
  });

  return combined;
};

export const saveCustomWords = (newWords: Word[]) => {
  const stored = localStorage.getItem(WORDS_KEY);
  const currentCustom: Word[] = stored ? JSON.parse(stored) : [];
  
  // Merge logic for custom words storage
  const updatedCustom = [...currentCustom];
  
  newWords.forEach(nw => {
      const idx = updatedCustom.findIndex(cw => cw.id === nw.id);
      if (idx >= 0) {
          updatedCustom[idx] = nw;
      } else {
          updatedCustom.push(nw);
      }
  });

  localStorage.setItem(WORDS_KEY, JSON.stringify(updatedCustom));
};

export const resetUnitWords = (grade: Grade, semester: Semester, unit: number) => {
  const stored = localStorage.getItem(WORDS_KEY);
  if (!stored) return;
  
  const customWords: Word[] = JSON.parse(stored);
  
  // Remove words that match the target criteria
  const remaining = customWords.filter(w => 
      !(w.grade === grade && w.semester === semester && w.unit === unit)
  );
  
  localStorage.setItem(WORDS_KEY, JSON.stringify(remaining));
};

export const clearCustomWords = () => {
    localStorage.removeItem(WORDS_KEY);
}