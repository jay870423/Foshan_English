import React, { useState, useEffect, useRef } from 'react';
import { Word, GameSessionResult } from '../types';
import { speak } from '../services/audio';

interface Props {
  words: Word[];
  onEnd: (result: GameSessionResult) => void;
  onExit: () => void;
}

export const GameFlashCards: React.FC<Props> = ({ words, onEnd, onExit }) => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentWord = words[index];

  useEffect(() => {
    // Auto-play audio when switching to a new card
    if (currentWord) {
      setAudioUrl(null);
      setIsFlipped(false);
      setTimeout(() => speak(currentWord.text), 500);
    }
  }, [index, currentWord]);

  const handleNext = () => {
    if (index < words.length - 1) {
      setIndex(i => i + 1);
    } else {
      // End of stack
      if(window.confirm("You've finished the cards! Exit?")) {
          onEnd({
              score: 100,
              correctCount: words.length,
              totalQuestions: words.length,
              mistakes: [],
              timeTaken: 0
          });
      }
    }
  };

  const handlePrev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access required for follow-along.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
      if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
      }
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foshan-green">Flashcards & Learn</h2>
        <button onClick={onExit} className="text-gray-500 font-bold">✕ Exit</button>
      </div>

      {/* Card Area */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex-1 bg-white rounded-3xl shadow-xl border-4 border-foshan-yellow flex flex-col items-center justify-center p-8 relative cursor-pointer active:scale-[0.98] transition-transform"
      >
          <div className="text-sm text-gray-400 absolute top-4 left-4">Tap to flip</div>
          <div className="text-sm text-gray-400 absolute top-4 right-4">{index + 1} / {words.length}</div>
          
          <h1 className="text-6xl font-bold text-slate-800 mb-4 text-center">{currentWord.text}</h1>
          
          <div className="text-2xl text-foshan-green font-mono mb-8 opacity-80">{currentWord.ipa || ''}</div>
          
          <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl text-foshan-darkYellow font-bold mb-2 text-center">{currentWord.translation}</h2>
              <p className="text-gray-500 italic text-center text-lg">{currentWord.sentence}</p>
          </div>
      </div>

      {/* Controls */}
      <div className="mt-8 grid grid-cols-3 gap-4">
          <button onClick={(e) => { e.stopPropagation(); speak(currentWord.text); }} className="flex flex-col items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200">
             <span className="text-2xl">🔊</span>
             <span className="text-xs font-bold">Listen</span>
          </button>

          <button 
             onMouseDown={startRecording}
             onMouseUp={stopRecording}
             onTouchStart={startRecording}
             onTouchEnd={stopRecording}
             className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all shadow-md active:scale-95 border-b-4 
                ${isRecording ? 'bg-red-500 text-white border-red-700' : 'bg-foshan-yellow text-white border-foshan-darkYellow'}`}
          >
             <span className="text-2xl">{isRecording ? '⏺' : '🎤'}</span>
             <span className="text-xs font-bold">{isRecording ? 'Release' : 'Hold & Speak'}</span>
          </button>

          <button 
             disabled={!audioUrl}
             onClick={playRecording} 
             className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors
                ${audioUrl ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-300'}`}
          >
             <span className="text-2xl">▶️</span>
             <span className="text-xs font-bold">My Voice</span>
          </button>
      </div>

      <div className="flex justify-between mt-6">
          <button onClick={handlePrev} disabled={index === 0} className="px-6 py-3 rounded-lg bg-gray-200 text-gray-600 font-bold disabled:opacity-50">← Prev</button>
          <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-foshan-green text-white font-bold shadow-lg">Next →</button>
      </div>
    </div>
  );
};