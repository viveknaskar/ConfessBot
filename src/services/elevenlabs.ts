// Updated ElevenLabs service to use deployed Supabase edge function
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

// Utility function to sanitize text for ElevenLabs API
function sanitizeText(text: string): string {
  return text
    .replace(/[^\x00-\xFF]/g, '')        // Remove non-Latin1 characters
    .replace(/[\u2018\u2019]/g, "'")     // Curly apostrophes to straight
    .replace(/[\u201C\u201D]/g, '"')     // Curly quotes to straight
    .replace(/[\u2013\u2014]/g, '-')     // En/em dashes to hyphen
    .replace(/[^\w\s.,!?'"()-]/g, '');   // Strip other funky symbols
}

export async function generateSpeech(text: string, voiceId: string): Promise<string> {
  try {
    // Sanitize the text before sending to API
    const sanitizedText = sanitizeText(text);
    
    if (!sanitizedText.trim()) {
      throw new Error('Text is empty after sanitization');
    }

    // Use the deployed Supabase edge function URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please set up your Supabase environment variables.');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/generate-voice`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: sanitizedText, // Use sanitized text
        voiceId,
      }),
    });

    // Check if the response is ok before attempting to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown server error'}`);
    }

    let result: VoiceResponse;
    try {
      result = await response.json();
    } catch (jsonError) {
      const responseText = await response.text();
      throw new Error(`Invalid JSON response: ${responseText}`);
    }

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