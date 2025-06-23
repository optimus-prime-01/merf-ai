// src/utils/geminiClient.ts
import axios from 'axios';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function askGemini(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    return text;
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Error fetching response from Gemini.';
  }
}
