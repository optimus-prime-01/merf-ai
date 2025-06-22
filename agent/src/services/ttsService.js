const axios = require('axios');
require('dotenv').config();

class TTSService {
  constructor() {
    this.apiKey = process.env.MURF_API_KEY;
  }

  async convertToSpeech(text, voiceId = 'en-US-evander', style = 'Friendly') {
    if (!this.apiKey) {
      console.warn('Murf API key not configured.');
      return {
        audioUrl: '/mock-audio.mp3',
        text,
        voice: 'mock-voice',
        duration: Math.ceil(text.length / 10)
      };
    }

    const payload = {
      text,
      voiceId,
      style
    };

    try {
      const response = await axios.post(
        'https://api.murf.ai/v1/speech/generate',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': this.apiKey
          }
        }
      );

      const data = response.data;

      return {
        audioUrl: data.audioUrl || '/fallback',
        text,
        voice: voiceId,
        duration: data.duration || Math.ceil(text.length / 10)
      };
    } catch (error) {
      console.error('Murf TTS Error:', error.message);
      return {
        audioUrl: '/error',
        text,
        error: error.message
      };
    }
  }

  generateTTSSummary(analysis) {
    if (typeof analysis === 'string') return analysis.slice(0, 200);
    if (analysis.suggestions?.length)
      return `Suggestions: ${analysis.suggestions.slice(0, 3).join(', ')}`;
    return 'No summary available.';
  }
}

module.exports = new TTSService();
