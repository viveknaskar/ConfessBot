const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface VoiceRequest {
  text: string;
  voiceId: string;
}

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

// Utility function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binaryString = '';
  
  // Manually construct binary string to ensure Latin-1 compatibility
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binaryString);
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voiceId }: VoiceRequest = await req.json();

    // Validate inputs
    if (!text || !voiceId) {
      return new Response(
        JSON.stringify({
          error: true,
          message: 'Missing required parameters: text and voiceId are required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Sanitize the text before sending to ElevenLabs
    const sanitizedText = sanitizeText(text);
    
    if (!sanitizedText.trim()) {
      return new Response(
        JSON.stringify({
          error: true,
          message: 'Text is empty after sanitization'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get API key from environment
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: true,
          message: 'ElevenLabs API key not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Make request to ElevenLabs API with sanitized text
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: sanitizedText, // Use sanitized text
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: true,
          message: `ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        }
      );
    }

    // Convert audio buffer to base64 using the fixed method
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = arrayBufferToBase64(audioBuffer);

    const result: VoiceResponse = {
      audioBase64,
      mimeType: 'audio/mpeg'
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-voice function:', error);
    return new Response(
      JSON.stringify({
        error: true,
        message: `Server error: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});