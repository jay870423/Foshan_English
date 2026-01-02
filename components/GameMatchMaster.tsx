import React, { useState, useEffect } from 'react';
import { Word, GameSessionResult } from '../types';
import { speak } from '../services/audio';

interface Props {
  words: Word[];
  onEnd: (result: GameSessionResult) => void;
  onExit: () => void;
}

interface Card {
  id: string; // Unique ID for the card instance
  wordId: string;
  content: string;
  type: 'text' | 'translation';
  isFlipped: boolean;
  isMatched: boolean;
}

export const GameMatchMaster: React.FC<Props> = ({ words, onEnd, onExit }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState<Set<string>>(new Set());

  // Initialize Game
  useEffect(() => {
    // Select top 6 words to prevent overcrowding (12 cards)
    const gameWords = words.slice(0, 6);
    const newCards: Card[] = [];
    
    gameWords.forEach((w) => {
      newCards.push({ id: `${w.id}-txt`, wordId: w.id, content: w.text, type: 'text', isFlipped: false, isMatched: false });
      newCards.push({ id: `${w.id}-trn`, wordId: w.id, content: w.translation, type: 'translation', isFlipped: false, isMatched: false });
    });

    // Shuffle
    setCards(newCards.sort(() => Math.random() - 0.5));
  }, [words]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [c1, c2] = flippedCards;
      if (c1.wordId === c2.wordId) {
        // Match
        setCards(prev => prev.map(c => c.wordId === c1.wordId ? { ...c, isMatched: true, isFlipped: true } : c));
        setScore(s => s + 20);
        // Play audio if text card
        const word = words.find(w => w.id === c1.wordId);
        if (word) speak(word.text);
        setFlippedCards([]);
      } else {
        // No Match
        setMistakes(prev => new Set(prev).add(c1.wordId));
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.id === c1.id || c.id === c2.id) ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flippedCards, words]);

  // Check End Game
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setTimeout(() => {
          onEnd({
              score: Math.max(0, score - moves),
              correctCount: words.slice(0, 6).length,
              totalQuestions: words.slice(0, 6).length,
              mistakes: Array.from(mistakes),
              timeTaken: 0
          });
      }, 1000);
    }
  }, [cards, score, moves, mistakes, onEnd, words]);

  const handleCardClick = (card: Card) => {
    if (flippedCards.length >= 2 || card.isFlipped || card.isMatched) return;
    
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    setFlippedCards(prev => [...prev, card]);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foshan-green">Match Master</h2>
        <button onClick={onExit} className="text-gray-500">✕ Exit</button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 flex-1 auto-rows-fr">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
                rounded-xl flex items-center justify-center p-2 text-center text-sm font-bold shadow-sm transition-all duration-300 transform
                ${card.isFlipped || card.isMatched 
                    ? 'bg-white border-2 border-foshan-yellow text-foshan-green rotate-0' 
                    : 'bg-foshan-green text-transparent border-2 border-foshan-green hover:bg-foshan-lightGreen rotate-y-180'}
            `}
            style={{ perspective: '1000px' }}
          >
             {(card.isFlipped || card.isMatched) ? card.content : '?'}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center text-gray-500">Moves: {moves} | Score: {score}</div>
    </div>
  );
};