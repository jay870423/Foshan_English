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
  
  const isHeldRef = useRef(false);
  const currentWord = words[index];

  useEffect(() => {
    // Auto-play audio when switching to a new card
    if (currentWord) {
      setAudioUrl(null);
      setIsFlipped(false);
      // Small delay to ensure previous audio is cancelled
      setTimeout(() => speak(currentWord.text), 300);
    }
  }, [index, currentWord]);

  const handleNext = () => {
    if (index < words.length - 1) {
      setIndex(i => i + 1);
    } else {
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

  const handleStartRecording = async (e: React.SyntheticEvent) => {
    // Prevent default context menu on mobile long press
    if (e.type === 'touchstart') e.preventDefault();
    e.stopPropagation();

    isHeldRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If user has already released the button while we were waiting for permissions
      if (!isHeldRef.current) {
         stream.getTracks().forEach(track => track.stop());
         return;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert("Microphone access denied or not supported. Please allow permissions.");
      isHeldRef.current = false;
      setIsRecording(false);
    }
  };

  const handleStopRecording = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (e.type === 'touchend') e.preventDefault();

    isHeldRef.current = false;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
      }
  };

  const playTTS = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      // On mobile, preventing default on touch can sometimes block the click if handled redundantly, 
      // but here we just want to ensure the function runs.
      speak(currentWord.text);
  };

  if (!currentWord) return null;

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto p-6 select-none">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foshan-green">Flashcards & Learn</h2>
        <button onClick={onExit} className="text-gray-500 font-bold">✕ Exit</button>
      </div>

      {/* Card Area */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex-1 bg-white rounded-3xl shadow-xl border-4 border-foshan-yellow flex flex-col items-center justify-center p-8 relative cursor-pointer active:scale-[0.98] transition-transform"
      >
          <div className="text-sm text-gray-400 absolute top-4 left-4 font-bold">Tap to flip</div>
          <div className="text-sm text-gray-400 absolute top-4 right-4 font-bold">{index + 1} / {words.length}</div>
          
          <h1 className="text-6xl font-bold text-slate-800 mb-4 text-center">{currentWord.text}</h1>
          
          <div className="text-2xl text-foshan-green font-mono mb-8 opacity-80">{currentWord.ipa || ''}</div>
          
          <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-4xl text-foshan-darkYellow font-bold mb-2 text-center">{currentWord.translation}</h2>
              <p className="text-gray-500 italic text-center text-lg">{currentWord.sentence}</p>
          </div>
      </div>

      {/* Controls */}
      <div className="mt-8 grid grid-cols-3 gap-4">
          <button 
             onClick={playTTS} 
             className="flex flex-col items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 active:scale-95 transition-transform shadow-sm"
          >
             <span className="text-2xl">🔊</span>
             <span className="text-xs font-bold">Listen</span>
          </button>

          <button 
             onMouseDown={handleStartRecording}
             onMouseUp={handleStopRecording}
             onMouseLeave={handleStopRecording} // Handle dragging out
             onTouchStart={handleStartRecording}
             onTouchEnd={handleStopRecording}
             className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all shadow-md active:scale-95 border-b-4 select-none touch-manipulation
                ${isRecording 
                    ? 'bg-red-500 text-white border-red-700 shadow-inner scale-95' 
                    : 'bg-foshan-yellow text-white border-foshan-darkYellow'}`}
          >
             <span className="text-2xl">{isRecording ? '⏺' : '🎤'}</span>
             <span className="text-xs font-bold">{isRecording ? 'Recording...' : 'Hold & Speak'}</span>
          </button>

          <button 
             disabled={!audioUrl}
             onClick={playRecording} 
             className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors active:scale-95 shadow-sm
                ${audioUrl ? 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
          >
             <span className="text-2xl">▶️</span>
             <span className="text-xs font-bold">My Voice</span>
          </button>
      </div>

      <div className="flex justify-between mt-6">
          <button onClick={handlePrev} disabled={index === 0} className="px-6 py-3 rounded-lg bg-gray-200 text-gray-600 font-bold disabled:opacity-50 active:scale-95 transition-transform">← Prev</button>
          <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-foshan-green text-white font-bold shadow-lg active:scale-95 transition-transform">Next →</button>
      </div>
    </div>
  );
};