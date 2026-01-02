export const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
  
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; // Prefer British English for PEP alignment
    utterance.rate = 0.9; // Slightly slower for kids
  
    window.speechSynthesis.speak(utterance);
  };
  
  export const playSoundEffect = (type: 'correct' | 'wrong' | 'win') => {
      // In a real app with assets, we'd play audio files. 
      // For this constraint, we rely on visual feedback mostly, 
      // but could use Web Audio API for synthesized beeps if strictly needed.
      // Keeping it simple for now.
  };