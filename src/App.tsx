import React, { useState } from 'react';
import { Heart, Volume2, MessageSquare, Zap, AlertCircle, Sparkles } from 'lucide-react';
import { generateSpeech, VOICE_MAPPINGS } from './services/elevenlabs';
import { generateRoast, generateNarratorResponse } from './services/openai';
import { AudioPlayer } from './components/AudioPlayer';

interface Confession {
  id: string;
  text: string;
  voice: string;
  likes: number;
  audioUrl?: string;
  timestamp: Date;
}

const VOICES = [
  { id: 'morgan-freeman', name: 'Morgan Freeman', emoji: '🎭' },
  { id: 'donald-trump', name: 'Donald Trump', emoji: '🍊' },
  { id: 'scarlett-johansson', name: 'Scarlett Johansson', emoji: '💃' },
  { id: 'elon-musk', name: 'Elon Musk', emoji: '🚀' },
  { id: 'snoop-dogg', name: 'Snoop Dogg', emoji: '🎤' },
  { id: 'mrbeast', name: 'MrBeast', emoji: '💰' },
];

const SAMPLE_CONFESSIONS: Confession[] = [
  {
    id: '1',
    text: 'I secretly judge people who put pineapple on pizza, but I actually love it and eat it when nobody is watching...',
    voice: 'Morgan Freeman',
    likes: 42,
    timestamp: new Date('2024-01-15'),
  },
  {
    id: '2',
    text: 'I pretend to understand crypto and NFTs in conversations, but I have absolutely no idea what any of it means...',
    voice: 'Elon Musk',
    likes: 28,
    timestamp: new Date('2024-01-14'),
  },
  {
    id: '3',
    text: 'I use ChatGPT to write my dating app messages and it\'s working better than my actual personality...',
    voice: 'Snoop Dogg',
    likes: 67,
    timestamp: new Date('2024-01-13'),
  },
];

function App() {
  const [confession, setConfession] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [roastMe, setRoastMe] = useState(false);
  const [narratorResponse, setNarratorResponse] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [confessionAudio, setConfessionAudio] = useState<string | null>(null);
  const [roastAudio, setRoastAudio] = useState<string | null>(null);
  const [roastText, setRoastText] = useState<string>('');
  const [narratorText, setNarratorText] = useState<string>('');
  const [confessions, setConfessions] = useState<Confession[]>(SAMPLE_CONFESSIONS);
  const [error, setError] = useState<string | null>(null);
  const [justGenerated, setJustGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!confession.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setConfessionAudio(null);
    setRoastAudio(null);
    setRoastText('');
    setNarratorText('');
    setJustGenerated(false);
    
    try {
      const selectedVoiceData = VOICES.find(v => v.id === selectedVoice);
      const voiceId = VOICE_MAPPINGS[selectedVoice];
      
      let textToSpeak = confession;
      
      // Generate narrator response if enabled
      if (narratorResponse && selectedVoiceData) {
        const response = await generateNarratorResponse(confession, selectedVoiceData.name);
        setNarratorText(response);
        textToSpeak = response; // The narrator responds instead of just reading the confession
      }
      
      // Generate confession audio with narrator response or original confession
      const audioUrl = await generateSpeech(textToSpeak, voiceId);
      setConfessionAudio(audioUrl);
      setJustGenerated(true);
      
      // Generate roast if requested
      if (roastMe) {
        const roast = await generateRoast(confession);
        setRoastText(roast);
        
        // Use a different voice for the roast (cycle through voices)
        const roastVoiceOptions = Object.keys(VOICE_MAPPINGS).filter(v => v !== selectedVoice);
        const roastVoice = roastVoiceOptions[Math.floor(Math.random() * roastVoiceOptions.length)];
        const roastVoiceId = VOICE_MAPPINGS[roastVoice];
        
        const roastAudioUrl = await generateSpeech(roast, roastVoiceId);
        setRoastAudio(roastAudioUrl);
      }
      
      // Add confession to the feed
      const newConfession: Confession = {
        id: Date.now().toString(),
        text: confession,
        voice: selectedVoiceData?.name || 'Unknown',
        likes: 0,
        audioUrl: audioUrl,
        timestamp: new Date(),
      };
      
      setConfessions(prev => [newConfession, ...prev]);
      
    } catch (err: any) {
      console.error('Error generating audio:', err);
      setError(err.message || 'Failed to generate audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLike = (confessionId: string) => {
    setConfessions(prev => 
      prev.map(c => 
        c.id === confessionId 
          ? { ...c, likes: c.likes + 1 }
          : c
      )
    );
  };

  const selectedVoiceData = VOICES.find(v => v.id === selectedVoice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            ConfessBot 🤖
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Forgive me, Internet, for I have sinned... 😈
          </p>
        </div>

        {/* Main Confession Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4 flex items-center space-x-3">
                  <AlertCircle className="text-red-400" size={20} />
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Confession Input */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  <MessageSquare className="inline mr-2" size={20} />
                  Spill your secrets... 🗣️
                </label>
                <textarea
                  value={confession}
                  onChange={(e) => setConfession(e.target.value)}
                  placeholder="Type your confession here... Don't worry, we won't judge... much 😏"
                  className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg"
                  maxLength={500}
                />
                <div className="text-right text-gray-400 text-sm mt-2">
                  {confession.length}/500
                </div>
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  <Volume2 className="inline mr-2" size={20} />
                  Choose your narrator 🎭
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  {VOICES.map(voice => (
                    <option key={voice.id} value={voice.id}>
                      {voice.emoji} {voice.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Narrator Response Toggle */}
              <div className="flex items-center justify-between bg-gray-700/30 rounded-2xl p-4">
                <div>
                  <span className="text-white font-semibold text-lg">
                    <Sparkles className="inline mr-2" size={20} />
                    Interactive Response ✨
                  </span>
                  <p className="text-gray-400 text-sm mt-1">
                    Let the narrator respond to your confession in their personality
                  </p>
                </div>
                <button
                  onClick={() => setNarratorResponse(!narratorResponse)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    narratorResponse ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      narratorResponse ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Roast Toggle */}
              <div className="flex items-center justify-between bg-gray-700/30 rounded-2xl p-4">
                <div>
                  <span className="text-white font-semibold text-lg">
                    <Zap className="inline mr-2" size={20} />
                    Roast Me 🔥
                  </span>
                  <p className="text-gray-400 text-sm mt-1">
                    Let AI roast your confession for extra spice
                  </p>
                </div>
                <button
                  onClick={() => setRoastMe(!roastMe)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    roastMe ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      roastMe ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!confession.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-black text-xl py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Generating Magic... ✨
                  </div>
                ) : (
                  <>
                    <Volume2 className="inline mr-2" size={24} />
                    {narratorResponse ? 'Get Response 🎵' : 'Generate Voice 🎵'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Audio Players */}
          {(confessionAudio || roastAudio) && (
            <div className="mt-8 space-y-4">
              {confessionAudio && (
                <div className="space-y-3">
                  <AudioPlayer
                    audioUrl={confessionAudio}
                    title={narratorResponse ? `🎭 ${selectedVoiceData?.name} Responds` : `🎭 Your Confession`}
                    voice={selectedVoiceData?.name}
                    color="purple"
                    autoPlay={justGenerated}
                  />
                  {narratorText && (
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50">
                      <p className="text-gray-300 italic">"{narratorText}"</p>
                    </div>
                  )}
                </div>
              )}

              {roastAudio && roastText && (
                <div className="space-y-3">
                  <AudioPlayer
                    audioUrl={roastAudio}
                    title="🔥 AI Roast"
                    voice="Random Voice"
                    color="pink"
                    autoPlay={false}
                  />
                  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50">
                    <p className="text-gray-300 italic">"{roastText}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Confessions */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-8 text-center">
            🏆 Top Confessions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {confessions.map((conf) => (
              <div
                key={conf.id}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                  "{conf.text}"
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-400 font-semibold text-sm">
                    🎭 {conf.voice}
                  </span>
                  {conf.audioUrl && (
                    <AudioPlayer
                      audioUrl={conf.audioUrl}
                      title="Play Confession"
                      className="!p-0 !bg-transparent !border-0"
                      color="cyan"
                      autoPlay={false}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleLike(conf.id)}
                    className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    <Heart size={18} className="fill-current" />
                    <span className="font-semibold">{conf.likes}</span>
                  </button>
                  <span className="text-gray-500 text-xs">
                    {conf.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-lg rounded-full px-6 py-3 border border-gray-700/50">
            <span className="text-gray-400">Built on</span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
              Bolt ⚡
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;