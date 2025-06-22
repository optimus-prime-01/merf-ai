import './tracing';
import express from 'express';
import { fetchAlerts, fetchLokiLogs, fetchTraces } from './grafanaClient';
import { analyzeAlertLLM } from './gemini';

const app = express();
app.use(express.json());

app.get('/alerts', async (_, res) => {
  const alerts = await fetchAlerts();
  res.json(alerts);
});

app.get('/logs', async (req, res) => {
  const logs = await fetchLokiLogs(req.query.query as string || '{job="alertreceiver"}');
  res.json(logs);
});

app.get('/traces', async (_, res) => {
  const traces = await fetchTraces();
  res.json(traces);
});

app.post('/analyze', async (req, res) => {
  console.log("⚡ /analyze endpoint hit");
  console.log("Incoming alert body:", req.body);

  const alertText = req.body.alert;
  if (!alertText) {
    return res.status(400).json({ error: 'Alert field missing' });
  }

  try {
    const result = await analyzeAlertLLM(alertText);
    res.json({ analysis: result });
  } catch (err) {
    console.error("❌ Error analyzing alert:", err);
    res.status(500).json({ error: 'Failed to analyze alert' });
  }
});


const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 AI Agent running at http://localhost:${PORT}`));
