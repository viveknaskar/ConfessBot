// Secure OpenAI service using Supabase edge functions
export async function generateNarratorResponse(confession: string, narratorName: string): Promise<string> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please set up your Supabase environment variables.');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/generate-ai-response`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confession,
        narratorName,
        type: 'narrator'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown server error'}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.message || 'Unknown error occurred');
    }

    return result.response || `${confession}... Well, that's quite the confession! We all have our moments, don't we?`;
  } catch (error) {
    console.error('Error generating narrator response:', error);
    // Return fallback response on error
    return getFallbackNarratorResponse(confession, narratorName);
  }
}

export async function generateRoast(confession: string): Promise<string> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing. Please set up your Supabase environment variables.');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/generate-ai-response`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confession,
        type: 'roast'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown server error'}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.message || 'Unknown error occurred');
    }

    return result.response || "Your confession is so wild, even Claude needs therapy after reading it! 🤖💭";
  } catch (error) {
    console.error('Error generating roast:', error);
    // Return fallback roast on error
    return getFallbackRoast();
  }
}

function getFallbackNarratorResponse(confession: string, narratorName: string): string {
  const responses = {
    'Morgan Freeman': [
      `You know, ${confession.toLowerCase()}... and that's when I realized, we all have our secrets. The question isn't whether we have them, but what we do with the weight of carrying them.`,
      `${confession}... *chuckles in that deep, knowing voice* Well now, that's quite the confession. Life has a funny way of teaching us lessons through our most embarrassing moments.`,
      `Listen here, ${confession.toLowerCase()}... and in that moment, you discovered something profound about the human condition. We're all just trying to figure it out as we go.`
    ],
    'Donald Trump': [
      `${confession}... Let me tell you, that's tremendous. Absolutely tremendous. I've done similar things, but much better. Much, much better. Believe me.`,
      `You know what? ${confession.toLowerCase()}... That's actually not that bad. I've seen worse. Much worse. Some people do terrible things. Terrible, terrible things.`,
      `${confession}... That's actually pretty smart. Very smart. I would have done the same thing, but probably better. I'm very good at these things.`
    ],
    'Scarlett Johansson': [
      `*laughs softly* Oh honey, ${confession.toLowerCase()}... We've all been there. Trust me, I've had my share of moments that make me want to disappear into the floor.`,
      `${confession}... You know what? That's actually kind of endearing. There's something beautifully human about these little secrets we keep.`,
      `*with a knowing smile* ${confession.toLowerCase()}... and here I thought I was the only one who did things like that. You're in good company, darling.`
    ],
    'Elon Musk': [
      `${confession}... *nervous laugh* Yeah, that's... that's actually pretty relatable. I mean, I once accidentally sent a rocket to the wrong orbit, so... we all make mistakes.`,
      `Interesting confession. ${confession.toLowerCase()}... This reminds me of a neural network optimization problem. Sometimes the most efficient solution isn't the most socially acceptable one.`,
      `${confession}... You know, this could actually be solved with AI. I'm thinking we could create an app for this. Maybe call it... ConfessX? *chuckles* Just kidding. Or am I?`
    ],
    'Snoop Dogg': [
      `Yo, yo, yo... ${confession.toLowerCase()}... *laughs* That's some real talk right there, nephew. We all got our little secrets, you feel me?`,
      `${confession}... *chuckles and takes a drag* Man, that's nothing. I remember this one time... actually, never mind, that's between me and my lawyer. But you good, homie.`,
      `For real though, ${confession.toLowerCase()}... That's just life, baby. Sometimes you gotta do what you gotta do. Keep it real, keep it 100.`
    ],
    'MrBeast': [
      `YOOO! ${confession}... That's actually INSANE! You know what? I'm gonna give you $10,000 just for being honest about it! Just kidding... or am I? 👀`,
      `${confession}... Dude, that's nothing! I once spent 24 hours doing something way more embarrassing for a video. At least you didn't have millions of people watching!`,
      `Wait, wait, wait... ${confession.toLowerCase()}... That gives me an idea for a video! "I Gave $100,000 To People Who Confess Their Secrets!" Actually... that's not a bad idea...`
    ]
  };

  const narratorResponses = responses[narratorName as keyof typeof responses] || responses['Morgan Freeman'];
  return narratorResponses[Math.floor(Math.random() * narratorResponses.length)];
}

function getFallbackRoast(): string {
  const fallbackRoasts = [
    "Wow, that's so embarrassing even your FBI agent is cringing right now! 😬",
    "I've heard better confessions from a Magic 8-Ball! At least it has some mystery! 🎱",
    "That confession is so basic, it makes vanilla ice cream look exotic! 🍦",
    "Even your search history is judging you right now! 📱💀",
    "I bet you're the type of person who says 'no offense' right before being offensive! 😂",
  ];
  
  return fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
}