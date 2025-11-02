
import * as ElevenLabsModule from '@11labs/client';

let elevenLabsClient: any = null;

export const useTextToSpeech = () => {
  const initializeClient = (apiKey: string) => {
    // Try different possible ways to access the ElevenLabs client
    const ElevenLabs = (ElevenLabsModule as any).ElevenLabs || (ElevenLabsModule as any).default || ElevenLabsModule;
    elevenLabsClient = new ElevenLabs({
      apiKey: apiKey
    });
  };

  const speak = async (text: string) => {
    if (!elevenLabsClient) {
      console.warn('ElevenLabs client not initialized. Please provide API key.');
      // Fallback to browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
      return;
    }

    try {
      const audio = await elevenLabsClient.generate({
        voice: "Aria", // Using Aria voice
        model_id: "eleven_turbo_v2_5",
        text: text,
      });

      // Convert the audio to a playable format
      const audioBlob = new Blob([audio], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      // Fallback to browser's built-in speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return { initializeClient, speak };
};
