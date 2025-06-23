import React, { useState } from 'react';

interface Props {
  alert: string;
  setResponse: (resp: string) => void;
}

const AIAgent: React.FC<Props> = ({ alert, setResponse }) => {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert })
      });
      const data = await res.json();
      setResponse(data.analysis);
    } catch (err) {
      console.error('AI analysis failed', err);
      setResponse('Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Alert Analysis</h2>
      <textarea value={alert} rows={4} readOnly className="input-area" />
      <button onClick={handleAnalyze} className="btn" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze with Gemini AI'}
      </button>
    </div>
  );
};

export default AIAgent;