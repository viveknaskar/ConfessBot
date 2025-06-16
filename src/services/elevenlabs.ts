const ELEVENLABS_API_KEY = 'sk_8ea3051772a9ea762b5c43c9e18d5753f43761437bc51fc0';
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

// Voice ID mappings for ElevenLabs
export const VOICE_MAPPINGS: Record<string, string> = {
  'morgan-freeman': 'GBv7mTt0atIp3Br8iCZE', // Thomas - deep, authoritative
  'donald-trump': 'VR6AewLTigWG4xSOukaG', // Antoni - confident, bold
  'scarlett-johansson': 'EXAVITQu4vr4xnSDxMaL', // Bella - smooth, sultry
  'elon-musk': 'ErXwobaYiN019PkySvjV', // Antoni - tech entrepreneur vibe
  'snoop-dogg': 'onwK4e9ZLuTAKqWW03F9', // Daniel - laid back, cool
  'mrbeast': 'pNInz6obpgDQGcFmaJgB', // Adam - energetic, young
};

export interface ElevenLabsResponse {
  audio: ArrayBuffer;
}

export async function generateSpeech(text: string, voiceId: string): Promise<string> {
  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return audioUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

export async function getAvailableVoices() {
  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error;
  }
}