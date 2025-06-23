// src/App.tsx
import React, { useState } from 'react';
import LogsViewer from './components/LogsViewer';
import TimeSeriesChart from './components/TimeSeriesChart';
import AIAgent from './components/AIAgent';
import ChatBox from './components/ChatBox';
import AlertsPanel from './components/AlertsPanel';
import MicrophoneButton from './components/MicrophoneButton';
import './index.css';

const App: React.FC = () => {
  const [alert, setAlert] = useState<string>('Memory usage on node-2 is above 95%');
  const [aiResponse, setAiResponse] = useState<string>('');

  return (
    <div className="app-container">
      <header>
        <h1>Services AI Monitoring Dashboard</h1>
      </header>

      <section className="grid">
        {/* <div className="panel">
          <LogsViewer job="alert-receiver" title="Alert Receiver Logs" />
          <MicrophoneButton context="logs" label="🎤 Ask AI about Logs" />
        </div> */}

        <div className="panel">
          <LogsViewer job="nginx" title="NGINX Logs" useFilenameQuery={true} />
          <MicrophoneButton context="logs" label="🎤 Ask AI about Logs" />
        </div>

        <div className="panel">
          <TimeSeriesChart title="Active Handles Over Time" />
        </div>

        {/* <div className="panel">
          <TimeSeriesChart title="AI Analysis of Alert Metrics" />
        </div> */}

        <div className="panel">
          <AlertsPanel />
          <MicrophoneButton context="alerts" label="🎤 Ask AI about Alerts" />
        </div>

        {/* <div className="panel">
          <AIAgent alert={alert} setResponse={setAiResponse} />
        </div>

        <div className="panel">
          <ChatBox aiResponse={aiResponse} />
        </div> */}
      </section>
    </div>
  );
};

export default App;
