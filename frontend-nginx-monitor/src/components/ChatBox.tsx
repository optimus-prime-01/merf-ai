// src/components/ChatBox.tsx
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

interface Props {
  aiResponse: string;
}

const ChatBox: React.FC<Props> = ({ aiResponse }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const send = async () => {
    if (input.trim()) {
      const userMsg = `🧑‍💻 You: ${input}`;
      const aiMsg = `🤖 AI: (mock) Resolving "${input}"...`;
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setInput('');

      // 🔊 Call Murf API (dummy response logic)
      try {
        const res = await axios.post(
          'https://api.murf.ai/v1/speech',
          {
            text: aiMsg,
            voice: 'en-US-Wavenet-D'
          },
          {
            headers: {
              'Authorization': `Bearer ap2_930f4b9d-c9ed-4dc1-8901-197f697d9ad2`,
              'Content-Type': 'application/json'
            }
          }
        );
        const audio = new Audio(res.data.audioUrl);
        audio.play();
      } catch (e) {
        console.error('Failed to play voice from Murf');
      }
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setInput(transcript);
    resetTranscript();
  };

  return (
    <div>
      <h2>🎙️ AI Chat</h2>
      <div className="log-box">
        {messages.map((msg, i) => <div key={i}>{msg}</div>)}
        {aiResponse && <div> Gemini: {aiResponse}</div>}
      </div>
      <div className="chat-controls">
        <input
          type="text"
          value={input}
          placeholder="Talk to AI..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="btn" onClick={send}>Send</button>
        <button className="btn" onClick={listening ? stopListening : startListening}>
          {listening ? '🎤 Stop' : '🎙️ Speak'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
