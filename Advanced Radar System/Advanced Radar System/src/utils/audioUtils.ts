
// Audio context for generating beep sounds
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playBeep = (frequency: number = 800, duration: number = 100, volume: number = 0.3) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration / 1000);
};

export const playDetectionBeep = () => {
  // Double beep for object detection
  playBeep(1000, 150, 0.4);
  setTimeout(() => playBeep(1200, 150, 0.4), 200);
};

export const playScanBeep = () => {
  // Short low beep for scanning
  playBeep(400, 50, 0.2);
};

export const playAlertBeep = () => {
  // Urgent triple beep for close objects
  playBeep(1500, 100, 0.5);
  setTimeout(() => playBeep(1500, 100, 0.5), 150);
  setTimeout(() => playBeep(1500, 100, 0.5), 300);
};
