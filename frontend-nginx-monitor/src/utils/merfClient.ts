// src/utils/murfClient.ts

export async function speakWithMurf(text: string): Promise<void> {
  try {
    const apiKey = process.env.REACT_APP_MURF_API_KEY;

    if (!apiKey) {
      console.error('❌ Murf API key not set in .env');
      return;
    }

    const response = await fetch('https://api.murf.ai/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text,
        voice: 'en-US-Wavenet-D', // You can replace with any valid Murf voice
      }),
    });

    if (!response.ok) {
      throw new Error(`Murf API failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('🔊 Murf error:', error);
  }
}
