// Updated ElevenLabs service to use backend function
export const VOICE_MAPPINGS: Record<string, string> = {
  'morgan-freeman': 'GBv7mTt0atIp3Br8iCZE', // Thomas - deep, authoritative
  'donald-trump': 'VR6AewLTigWG4xSOukaG', // Antoni - confident, bold
  'scarlett-johansson': 'EXAVITQu4vr4xnSDxMaL', // Bella - smooth, sultry
  'elon-musk': 'ErXwobaYiN019PkySvjV', // Antoni - tech entrepreneur vibe
  'snoop-dogg': 'onwK4e9ZLuTAKqWW03F9', // Daniel - laid back, cool
  'mrbeast': 'pNInz6obpgDQGcFmaJgB', // Adam - energetic, young
};

interface VoiceResponse {
  audioBase64?: string;
  mimeType?: string;
  error?: boolean;
  message?: string;
}

export async function generateSpeech(text: string, voiceId: string): Promise<string> {
  try {
    // Call our backend function instead of directly calling ElevenLabs
    const response = await fetch('/api/generate-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voiceId,
      }),
    });

    const result: VoiceResponse = await response.json();

    if (result.error) {
      throw new Error(result.message || 'Unknown error occurred');
    }

    if (!result.audioBase64 || !result.mimeType) {
      throw new Error('Invalid response from voice generation service');
    }

    // Convert base64 to blob URL for audio playback
    const audioData = `data:${result.mimeType};base64,${result.audioBase64}`;
    const response2 = await fetch(audioData);
    const audioBlob = await response2.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return audioUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

// Keep the getAvailableVoices function for potential future use
export async function getAvailableVoices() {
  // This would need to be implemented as another backend function if needed
  throw new Error('getAvailableVoices not implemented with backend function');
}