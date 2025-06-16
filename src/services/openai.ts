// OpenAI integration for roast generation
// Note: You'll need to add your OpenAI API key here
const OPENAI_API_KEY = ''; // Add your OpenAI API key here

export async function generateRoast(confession: string): Promise<string> {
  if (!OPENAI_API_KEY) {
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating roast:', error);
    // Return fallback roast on error
    return "Your confession is so wild, even ChatGPT needs therapy after reading it! 🤖💭";
  }
}