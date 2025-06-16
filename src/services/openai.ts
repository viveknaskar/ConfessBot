// OpenRouter integration for narrator responses and roast generation
const OPENROUTER_API_KEY = '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';

export async function generateNarratorResponse(confession: string, narratorName: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    // Fallback responses based on narrator personality
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

  try {
    const personalityPrompts = {
      'Morgan Freeman': 'You are Morgan Freeman. Respond to this confession with your characteristic wisdom, deep voice inflection, and philosophical insights. Keep it warm and understanding, like you\'re narrating a documentary about the human condition.',
      'Donald Trump': 'You are Donald Trump. Respond to this confession in your characteristic style - confident, sometimes boastful, using phrases like "tremendous," "believe me," and comparing it to your own experiences.',
      'Scarlett Johansson': 'You are Scarlett Johansson. Respond to this confession with warmth, understanding, and a touch of sultry humor. Be relatable and supportive.',
      'Elon Musk': 'You are Elon Musk. Respond to this confession with your characteristic mix of tech references, nervous humor, and innovative thinking. Maybe relate it to rockets, AI, or your companies.',
      'Snoop Dogg': 'You are Snoop Dogg. Respond to this confession in your laid-back, cool style with some slang and humor. Keep it real and supportive.',
      'MrBeast': 'You are MrBeast. Respond to this confession with high energy, excitement, and maybe reference giving away money or creating a video about it. Use caps and exclamation points.'
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ConfessBot'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: personalityPrompts[narratorName as keyof typeof personalityPrompts] || personalityPrompts['Morgan Freeman'] + ' Maximum 3 sentences. Use emojis sparingly.',
          },
          {
            role: 'user',
            content: `Here's a confession: "${confession}"`,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating narrator response:', error);
    // Return fallback response on error
    return `${confession}... Well, that's quite the confession! We all have our moments, don't we?`;
  }
}

export async function generateRoast(confession: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    // Fallback roasts for demo purposes
    const fallbackRoasts = [
      "Wow, that's so embarrassing even your FBI agent is cringing right now! 😬",
      "I've heard better confessions from a Magic 8-Ball! At least it has some mystery! 🎱",
      "That confession is so basic, it makes vanilla ice cream look exotic! 🍦",
      "Even your search history is judging you right now! 📱💀",
      "I bet you're the type of person who says 'no offense' right before being offensive! 😂",
    ];
    
    return fallbackRoasts[Math.floor(Math.random() * fallbackRoasts.length)];
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ConfessBot'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: 'You are a witty AI that creates funny, light-hearted roasts of confessions. Keep it playful and not mean-spirited. Use emojis and internet slang. Maximum 2 sentences.',
          },
          {
            role: 'user',
            content: `Roast this confession in a funny way: "${confession}"`,
          },
        ],
        max_tokens: 100,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating roast:', error);
    // Return fallback roast on error
    return "Your confession is so wild, even Claude needs therapy after reading it! 🤖💭";
  }
}