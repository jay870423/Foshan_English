import React, { useState, useMemo, useEffect } from 'react';
import { GRADES, UNITS } from './constants';
import { Grade, Semester, Word, GameType, GameSessionResult } from './types';
import { getWords, getProgress, saveProgress } from './services/storage';
import { GameSpaceSpeller } from './components/GameSpaceSpeller';
import { GameMatchMaster } from './components/GameMatchMaster';
import { GameDropRace } from './components/GameDropRace';
import { GameSentenceBuilder } from './components/GameSentenceBuilder';
import { GameFlashCards } from './components/GameFlashCards';
import { TeacherPanel } from './TeacherPanel';
import { speak } from './services/audio';

// --- Screens ---
type Screen = 'HOME' | 'UNIT_SELECT' | 'GAME_MENU' | 'PLAYING' | 'RESULT' | 'TEACHER';

export default function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(3);
  const [selectedSemester, setSelectedSemester] = useState<Semester>('1');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.SPACE_SPELLER);
  const [lastResult, setLastResult] = useState<GameSessionResult | null>(null);
  
  // Initialize immediately to ensure data is present on first render if possible
  const [allWords, setAllWords] = useState<Word[]>(getWords());
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    // Refresh data whenever we return to the HOME screen
    // This ensures that if we added words in Teacher Panel, they are loaded.
    if (screen === 'HOME') {
        setAllWords(getWords());
        setProgress(getProgress());
    }
  }, [screen]);

  // Filter words based on selection
  const unitWords = useMemo(() => {
    return allWords.filter(w => 
      w.grade === selectedGrade && 
      w.semester === selectedSemester && 
      w.unit === selectedUnit
    );
  }, [allWords, selectedGrade, selectedSemester, selectedUnit]);

  const handleGameEnd = (result: GameSessionResult) => {
    const key = `${selectedGrade}-${selectedSemester}-${selectedUnit}`;
    const stars = result.score > 80 ? 3 : result.score > 50 ? 2 : 1;
    saveProgress(key, stars, result.score);
    setLastResult(result);
    setScreen('RESULT');
  };

  const renderGame = () => {
    const commonProps = { words: unitWords, onEnd: handleGameEnd, onExit: () => setScreen('GAME_MENU') };
    switch (selectedGame) {
      case GameType.FLASH_CARDS: return <GameFlashCards {...commonProps} />;
      case GameType.SPACE_SPELLER: return <GameSpaceSpeller {...commonProps} />;
      case GameType.MATCH_MASTER: return <GameMatchMaster {...commonProps} />;
      case GameType.DROP_RACE: return <GameDropRace {...commonProps} />;
      case GameType.SENTENCE_BUILDER: return <GameSentenceBuilder {...commonProps} />;
      default: return null;
    }
  };

  // --- Render Helpers ---

  const UnitCard: React.FC<{ unit: number }> = ({ unit }) => {
    const key = `${selectedGrade}-${selectedSemester}-${unit}`;
    const p = progress[key] || { stars: 0, unlocked: unit === 1 };
    
    // Check if this unit actually has words
    const hasWords = allWords.some(w => w.grade === selectedGrade && w.semester === selectedSemester && w.unit === unit);

    // UNLOCK LOGIC: Unit 1 is always unlocked. Subsequent units need previous unit to have > 0 stars.
    const isUnlocked = unit === 1 || (progress[`${selectedGrade}-${selectedSemester}-${unit - 1}`]?.stars > 0);

    return (
      <button
        disabled={(!isUnlocked || !hasWords)} 
        onClick={() => { setSelectedUnit(unit); setScreen('GAME_MENU'); }}
        className={`relative p-4 rounded-xl border-b-4 transition-all active:scale-95 flex flex-col items-center justify-between h-32
          ${isUnlocked && hasWords
            ? 'bg-white border-foshan-yellow shadow-lg hover:bg-yellow-50 cursor-pointer' 
            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-80'}`}
      >
        <div className="flex justify-between w-full items-start">
            <span className="text-xl font-bold font-sans">Unit {unit}</span>
            {hasWords ? (
                isUnlocked && <span className="bg-foshan-green text-white text-[10px] px-2 py-0.5 rounded-full font-bold">PLAY</span>
            ) : (
                <span className="text-xs text-red-400 font-bold">NO DATA</span>
            )}
        </div>
        
        {hasWords ? (
             <div className="flex gap-1">
               {[1, 2, 3].map(s => (
                  <span key={s} className={`text-xl ${s <= p.stars ? 'text-foshan-yellow' : 'text-gray-200'}`}>★</span>
               ))}
             </div>
        ) : (
             <span className="text-2xl opacity-20">🚫</span>
        )}
        
        {!isUnlocked && hasWords && (
            <div className="absolute inset-0 bg-gray-200/50 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                <span className="text-3xl filter drop-shadow-md">🔒</span>
            </div>
        )}
      </button>
    );
  };

  // --- Main View Logic ---

  if (screen === 'TEACHER') {
    return <TeacherPanel onBack={() => setScreen('HOME')} />;
  }

  if (screen === 'PLAYING') {
    return <div className="h-screen bg-slate-50 overflow-hidden">{renderGame()}</div>;
  }

  if (screen === 'RESULT') {
    return (
      <div className="h-screen bg-foshan-yellow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center border-b-8 border-foshan-darkYellow">
          <h2 className="text-3xl font-bold text-foshan-green mb-4">Good Job! 🎉</h2>
          <div className="text-6xl mb-6">
            {lastResult!.score > 80 ? '⭐⭐⭐' : lastResult!.score > 50 ? '⭐⭐' : '⭐'}
          </div>
          <div className="grid grid-cols-2 gap-4 text-left mb-6 bg-gray-50 p-4 rounded-lg">
             <p>Score: <b>{lastResult!.score}</b></p>
             <p>Correct: <b>{lastResult!.correctCount}/{lastResult!.totalQuestions}</b></p>
          </div>
          
          {lastResult!.mistakes.length > 0 && (
            <div className="mb-6">
                <p className="text-sm text-red-500 font-bold mb-2">Review Words:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {allWords.filter(w => lastResult!.mistakes.includes(w.id)).map(w => (
                        <span key={w.id} onClick={() => speak(w.text)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs cursor-pointer">
                            {w.text} 🔊
                        </span>
                    ))}
                </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
             <button onClick={() => setScreen('GAME_MENU')} className="bg-foshan-green text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 shadow-md">Play Again / Choose Game</button>
             <button onClick={() => setScreen('UNIT_SELECT')} className="text-gray-500 font-bold">Back to Map</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="bg-foshan-yellow p-4 text-white shadow-md flex justify-between items-center z-10 sticky top-0">
        <h1 className="text-xl font-bold tracking-tight text-shadow-sm text-foshan-green">🦁 Foshan English</h1>
        {screen !== 'HOME' && <button onClick={() => setScreen('HOME')} className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">Home</button>}
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        
        {screen === 'HOME' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-4">Select Textbook</h2>
                
                <div className="mb-4">
                   <label className="block text-sm font-bold text-foshan-green mb-2">Grade</label>
                   <div className="flex justify-between bg-gray-100 p-1 rounded-lg">
                      {GRADES.map(g => (
                        <button 
                          key={g} 
                          onClick={() => setSelectedGrade(g)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${selectedGrade === g ? 'bg-white shadow text-foshan-darkYellow' : 'text-gray-400'}`}
                        >
                            {g}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-foshan-green mb-2">Semester</label>
                   <div className="flex gap-2">
                      <button onClick={() => setSelectedSemester('1')} className={`flex-1 py-2 rounded-lg font-bold border-2 ${selectedSemester === '1' ? 'border-foshan-yellow bg-yellow-50 text-foshan-darkYellow' : 'border-gray-100 text-gray-400'}`}>
                          Term 1 (上)
                      </button>
                      <button onClick={() => setSelectedSemester('2')} className={`flex-1 py-2 rounded-lg font-bold border-2 ${selectedSemester === '2' ? 'border-foshan-yellow bg-yellow-50 text-foshan-darkYellow' : 'border-gray-100 text-gray-400'}`}>
                          Term 2 (下)
                      </button>
                   </div>
                </div>
             </div>

             <button 
                onClick={() => setScreen('UNIT_SELECT')}
                className="w-full bg-foshan-green text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-emerald-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
             >
                Start Learning 🚀
             </button>

             <div className="text-center mt-10">
                 <button onClick={() => setScreen('TEACHER')} className="text-gray-300 text-xs hover:text-gray-400">Teacher Login</button>
             </div>
          </div>
        )}

        {screen === 'UNIT_SELECT' && (
            <div className="grid grid-cols-2 gap-4">
               {UNITS.map(u => <UnitCard key={u} unit={u} />)}
            </div>
        )}

        {screen === 'GAME_MENU' && (
            <div className="space-y-4">
               <div className="bg-indigo-600 text-white p-6 rounded-2xl mb-6 shadow-lg">
                   <div className="flex justify-between items-center mb-1">
                      <h2 className="text-2xl font-bold">Unit {selectedUnit}</h2>
                      <span className="text-xs bg-indigo-500 px-2 py-1 rounded">G{selectedGrade}-{selectedSemester}-U{selectedUnit}</span>
                   </div>
                   <p className="opacity-80 font-medium">{unitWords.length} Words Available</p>
               </div>

               <h3 className="font-bold text-gray-700 ml-1">Choose a Game Mode:</h3>
               
               {[
                   { id: GameType.FLASH_CARDS, icon: '🎤', color: 'bg-green-100 border-green-300 text-green-800' },
                   { id: GameType.SPACE_SPELLER, icon: '🚀', color: 'bg-purple-100 border-purple-300 text-purple-800' },
                   { id: GameType.MATCH_MASTER, icon: '🃏', color: 'bg-blue-100 border-blue-300 text-blue-800' },
                   { id: GameType.DROP_RACE, icon: '🎈', color: 'bg-red-100 border-red-300 text-red-800' },
                   { id: GameType.SENTENCE_BUILDER, icon: '🧩', color: 'bg-amber-100 border-amber-300 text-amber-800' },
               ].map(g => (
                   <button 
                     key={g.id}
                     onClick={() => { setSelectedGame(g.id); setScreen('PLAYING'); }}
                     className={`w-full p-4 rounded-xl border-l-8 text-left shadow-sm flex items-center gap-4 transition-transform hover:translate-x-1 ${g.color}`}
                   >
                       <span className="text-3xl">{g.icon}</span>
                       <span className="font-bold text-lg">{g.id}</span>
                   </button>
               ))}
               
               {unitWords.length === 0 && (
                   <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
                       <p className="text-red-500 font-bold">No words found for this unit.</p>
                       <p className="text-xs text-red-400 mt-2">Go to Teacher Panel to Import data.</p>
                   </div>
               )}
            </div>
        )}

      </main>
    </div>
  );
}
