import React, { useState, useEffect } from 'react';
import { Word, GameSessionResult } from '../types';
import { speak } from '../services/audio';

interface Props {
  words: Word[];
  onEnd: (result: GameSessionResult) => void;
  onExit: () => void;
}

export const GameSpaceSpeller: React.FC<Props> = ({ words, onEnd, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [userSpelling, setUserSpelling] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0); // 0: None, 1: Speak, 2: Show First Letter

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      // Scramble letters
      const letters = currentWord.text.split('').sort(() => Math.random() - 0.5);
      setShuffledLetters(letters);
      setUserSpelling([]);
      setHintLevel(0);
      speak(currentWord.text);
    }
  }, [currentIndex, currentWord]);

  const handleLetterClick = (letter: string, index: number) => {
    const newSpelling = [...userSpelling, letter];
    setUserSpelling(newSpelling);
    
    // Remove used letter from pool visually (simple approach: remove by index from shuffled array)
    const newShuffled = [...shuffledLetters];
    newShuffled.splice(index, 1);
    setShuffledLetters(newShuffled);

    // Check correctness immediately if length matches
    if (newSpelling.join('').length === currentWord.text.length) {
      if (newSpelling.join('').toLowerCase() === currentWord.text.toLowerCase()) {
        // Correct
        const points = Math.max(10 - hintLevel * 2, 5);
        setScore(s => s + points);
        setTimeout(nextWord, 500);
      } else {
        // Wrong
        setHintLevel(h => h + 1);
        setMistakes(prev => prev.includes(currentWord.id) ? prev : [...prev, currentWord.id]);
        
        // Reset for retry
        setTimeout(() => {
           setUserSpelling([]);
           setShuffledLetters(currentWord.text.split('').sort(() => Math.random() - 0.5));
        }, 500);
      }
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      onEnd({
        score,
        correctCount: words.length - mistakes.length,
        totalQuestions: words.length,
        mistakes,
        timeTaken: 0 
      });
    }
  };

  const resetWord = () => {
      setUserSpelling([]);
      setShuffledLetters(currentWord.text.split('').sort(() => Math.random() - 0.5));
  }

  if (!currentWord) return null;

  return (
    <div className="flex flex-col items-center h-full max-w-2xl mx-auto p-4 relative">
       <div className="absolute top-0 right-0 p-4">
         <button onClick={onExit} className="text-gray-500 font-bold">✕ Exit</button>
       </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Planet/Image Placeholder */}
        <div className="w-32 h-32 rounded-full bg-foshan-yellow border-4 border-foshan-green flex items-center justify-center mb-8 shadow-lg animate-bounce-short">
             <span className="text-4xl">🚀</span>
        </div>

        {/* Prompt */}
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foshan-green mb-1">{currentWord.translation}</h2>
            {hintLevel > 0 && <p className="text-sm text-gray-500">Hint: {currentWord.sentence}</p>}
        </div>

        {/* Slots */}
        <div className="flex gap-2 mb-8 min-h-[50px]">
          {currentWord.text.split('').map((_, i) => (
            <div key={i} className="w-10 h-10 border-b-4 border-gray-300 flex items-center justify-center text-xl font-bold font-mono">
              {userSpelling[i] || ''}
            </div>
          ))}
        </div>

        {/* Letter Meteorites */}
        <div className="flex flex-wrap justify-center gap-3">
          {shuffledLetters.map((letter, i) => (
            <button
              key={`${letter}-${i}`}
              onClick={() => handleLetterClick(letter, i)}
              className="w-12 h-12 rounded-full bg-indigo-500 text-white font-bold text-xl shadow-md hover:bg-indigo-600 active:scale-95 transition-all"
            >
              {letter}
            </button>
          ))}
        </div>
        
         <button onClick={resetWord} className="mt-8 text-sm text-gray-400 underline">Reset Letters</button>
      </div>

      <div className="w-full flex justify-between items-center text-sm font-bold text-gray-400">
          <span>Score: {score}</span>
          <span>{currentIndex + 1} / {words.length}</span>
      </div>
    </div>
  );
};