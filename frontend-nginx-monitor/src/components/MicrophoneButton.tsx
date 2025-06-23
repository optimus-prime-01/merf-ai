import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { askGemini } from '../utils/geminiClient';
// import { speakWithMurf } from '../utils/murfClient';
interface Props {
  context: 'logs' | 'alerts';
  label: string;
}

const MicrophoneButton: React.FC<Props> = ({ context, label }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleMicClick = async () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    } else {
      SpeechRecognition.stopListening();
      const prompt = `Analyze the following ${context}: ${transcript}`;
    //   const aiResponse = await askGemini(prompt);
    //   await speakWithMurf(aiResponse);
    }
  };

  return (
    <button onClick={handleMicClick} className="mic-button">
      {listening ? '🛑 Stop' : label}
    </button>
  );
};

export default MicrophoneButton;
