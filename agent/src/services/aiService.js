const fetch = require('node-fetch');
require('dotenv').config();

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  async analyzeAlert(alertData, context = {}) {
    if (!this.apiKey) {
      return {
        analysis: 'Gemini API key not configured',
        confidence: 0,
        suggestions: ['Set GEMINI_API_KEY in your .env']
      };
    }

    const prompt = `Analyze this alert:
Alert: ${alertData.alertname || 'Unknown'}
Summary: ${alertData.annotations?.summary || 'N/A'}
Description: ${alertData.annotations?.description || 'N/A'}\n`;

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + this.apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await res.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return {
      analysis: content,
      confidence: 7,
      suggestions: content.split('\n').filter(l => l.startsWith('-') || l.startsWith('1.'))
    };
  }
}

module.exports = new AIService();