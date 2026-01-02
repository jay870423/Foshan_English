import React, { useState, useEffect } from 'react';
import { Word, GameSessionResult } from '../types';
import { speak } from '../services/audio';

interface Props {
  words: Word[];
  onEnd: (result: GameSessionResult) => void;
  onExit: () => void;
}

export const GameSentenceBuilder: React.FC<Props> = ({ words, onEnd, onExit }) => {
  const [gameWords, setGameWords] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<string[]>([]);

  useEffect(() => {
    // Only pick words with sentences
    const validWords = words.filter(w => w.sentence && w.sentence.length > 5);
    setGameWords(validWords);
  }, [words]);

  useEffect(() => {
    if (gameWords.length > 0 && idx < gameWords.length) {
      const current = gameWords[idx];
      // Basic split by space, remove punctuation for simplicity in matching
      const parts = current.sentence!.split(' ').sort(() => Math.random() - 0.5);
      setScrambled(parts);
      setBuilt([]);
      speak(current.text); // Hint with the word
    } else if (gameWords.length > 0 && idx >= gameWords.length) {
        onEnd({
            score,
            correctCount: gameWords.length - mistakes.length,
            totalQuestions: gameWords.length,
            mistakes,
            timeTaken: 0
        });
    }
  }, [gameWords, idx, mistakes, onEnd, score]); // Fixed deps

  const handleWordClick = (word: string, fromIndex: number) => {
    const newScrambled = [...scrambled];
    newScrambled.splice(fromIndex, 1);
    setScrambled(newScrambled);
    setBuilt([...built, word]);
  };

  const handleReset = () => {
    if (!gameWords[idx]) return;
    setScrambled(gameWords[idx].sentence!.split(' ').sort(() => Math.random() - 0.5));
    setBuilt([]);
  };

  const handleCheck = () => {
    const target = gameWords[idx].sentence!;
    // Remove punctuation from comparison for easier matching for kids
    const attempt = built.join(' ');
    
    if (attempt === target) {
      setScore(s => s + 20);
      speak(target);
      setTimeout(() => setIdx(i => i + 1), 1000);
    } else {
      speak("Try again");
      setMistakes(prev => prev.includes(gameWords[idx].id) ? prev : [...prev, gameWords[idx].id]);
      handleReset();
    }
  };

  if (!gameWords[idx]) return <div className="p-10 text-center">Loading sentences...</div>;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foshan-green">Sentence Builder</h2>
        <button onClick={onExit} className="text-gray-500">✕ Exit</button>
      </div>

      <div className="bg-amber-100 p-4 rounded-lg text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">Target Word: <span className="font-bold text-foshan-green">{gameWords[idx].text}</span></p>
          <p className="text-lg font-bold text-gray-700">{gameWords[idx].translation} (Use in a sentence)</p>
      </div>

      {/* Drop Zone */}
      <div className="min-h-[80px] bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap gap-2 mb-8 items-center">
         {built.map((w, i) => (
             <span key={i} className="px-3 py-1 bg-foshan-green text-white rounded shadow">{w}</span>
         ))}
         {built.length === 0 && <span className="text-gray-300">Tap words below to build</span>}
      </div>

      {/* Scrambled Words */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {scrambled.map((w, i) => (
            <button key={i} onClick={() => handleWordClick(w, i)} className="px-4 py-2 bg-white border border-foshan-yellow rounded-full shadow hover:bg-yellow-50 font-medium">
                {w}
            </button>
        ))}
      </div>

      <div className="flex justify-center gap-4">
          <button onClick={handleReset} className="px-6 py-2 rounded bg-gray-200 font-bold text-gray-600">Reset</button>
          <button onClick={handleCheck} className="px-6 py-2 rounded bg-foshan-yellow font-bold text-white shadow-lg hover:bg-foshan-darkYellow">Check!</button>
      </div>
    </div>
  );
};