import React, { useState, useEffect, useRef } from 'react';
import { Word, GameSessionResult } from '../types';
import { speak } from '../services/audio';

interface Props {
  words: Word[];
  onEnd: (result: GameSessionResult) => void;
  onExit: () => void;
}

export const GameDropRace: React.FC<Props> = ({ words, onEnd, onExit }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [dropPosition, setDropPosition] = useState(0);
  const [wordPool, setWordPool] = useState<Word[]>([...words]);
  
  const timerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Setup Turn
  const nextTurn = () => {
    if (lives <= 0 || wordPool.length === 0) {
      endGame();
      return;
    }

    const next = wordPool[0];
    const remaining = wordPool.slice(1);
    setWordPool(remaining);
    setCurrentWord(next);
    setDropPosition(0);

    // Generate Options (1 correct + 3 random wrong)
    const otherWords = words.filter(w => w.id !== next.id);
    const wrongOptions = otherWords.sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.translation);
    const allOpts = [next.translation, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOpts);
    
    speak(next.text);
  };

  useEffect(() => {
    if(!currentWord) nextTurn();
    return () => stopLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopLoop = () => {
     if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }

  // Animation Loop
  useEffect(() => {
    if (!currentWord) return;

    let lastTime = performance.now();
    const speed = 0.05 + (score / 500); // Get faster as score increases

    const loop = (time: number) => {
      const delta = time - lastTime;
      if (delta > 16) {
        setDropPosition(prev => {
          if (prev > 90) { // Hit bottom
             handleMiss();
             return 0;
          }
          return prev + speed;
        });
        lastTime = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord, lives]); // Restart loop on word change or life loss handling

  const handleMiss = () => {
    stopLoop();
    setLives(l => {
        const newLives = l - 1;
        if(newLives <= 0) {
            setTimeout(endGame, 100);
            return 0;
        }
        return newLives;
    });
    if(currentWord) setMistakes(prev => [...prev, currentWord.id]);
    setCurrentWord(null); // Triggers nextTurn via useEffect logic needs careful handling
    setTimeout(nextTurn, 500);
  };

  const handleOptionClick = (option: string) => {
    if (!currentWord) return;
    if (option === currentWord.translation) {
      // Correct
      setScore(s => s + 10);
      stopLoop();
      setCurrentWord(null);
      setTimeout(nextTurn, 200);
    } else {
      // Wrong
      setScore(s => Math.max(0, s - 5));
      speak('Try again');
    }
  };

  const endGame = () => {
    stopLoop();
    onEnd({
      score,
      correctCount: words.length - wordPool.length - (3 - lives), // Approx
      totalQuestions: words.length,
      mistakes,
      timeTaken: 0
    });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 bg-sky-100 relative overflow-hidden">
       <div className="flex justify-between z-10">
         <div className="flex gap-1 text-red-500 text-xl">{'♥'.repeat(lives)}</div>
         <button onClick={onExit} className="font-bold text-gray-500">Stop</button>
       </div>

       {/* Drop Zone */}
       <div className="flex-1 relative border-b-4 border-foshan-green mt-2">
         {currentWord && (
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-foshan-yellow font-bold text-lg text-foshan-green"
              style={{ top: `${dropPosition}%` }}
            >
                🎈 {currentWord.text}
            </div>
         )}
       </div>

       {/* Options */}
       <div className="grid grid-cols-2 gap-3 mt-4 h-32">
         {options.map((opt, i) => (
           <button 
             key={i}
             onClick={() => handleOptionClick(opt)}
             className="bg-white border-b-4 border-foshan-green hover:bg-foshan-yellow rounded-lg font-bold text-slate-700 transition-colors"
           >
             {opt}
           </button>
         ))}
       </div>
    </div>
  );
};