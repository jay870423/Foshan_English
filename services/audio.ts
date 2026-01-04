// Simple robust TTS service
// Mobile browsers often have empty voice lists initially but can still speak via default voice.
// We avoid over-filtering voices to ensure sound is produced.

export const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // 1. Create the utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // 2. Set Basic Defaults (Crucial for mobile to know what language engine to use)
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9; 
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // 3. Attempt to find a better voice, but don't block if we can't
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
        // Try to match exact decent voices
        const preferredVoice = 
            voices.find(v => v.name.includes('Google US English')) || 
            voices.find(v => v.lang === 'en-US') || 
            voices.find(v => v.lang.startsWith('en'));
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
    }

    // 4. Handle Playback
    // Cancel current speech to avoid queueing (unless it's the same text, but generally cancel is safer for UI responsiveness)
    window.speechSynthesis.cancel();
    
    // Small timeout can sometimes help on specific Android WebViews that get stuck if cancel/speak happen too fast
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 10);
};

export const playSoundEffect = (type: 'correct' | 'wrong' | 'win') => {
    // Placeholder
};