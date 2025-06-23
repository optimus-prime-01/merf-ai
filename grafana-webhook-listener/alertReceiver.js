require('./tracing');

const express = require('express');
const { trace } = require('@opentelemetry/api');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino/file',
    options: {
      destination: path.join(logDir, 'alerts.log'),
      mkdir: true,
      sync: true,
    },
  },
});

const app = express();
const PORT = 30001;

app.use(express.json());

app.post('/alert', async (req, res) => {
  const tracer = trace.getTracer('default');
  const span = tracer.startSpan('handle_alert_post');

  try {
    const receiver = req.body.receiver || 'none';
    const status = req.body.status || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip;
    const traceId = span.spanContext().traceId;

    // Tracing
    span.setAttribute('http.user_agent', userAgent);
    span.setAttribute('alert.receiver', receiver);
    span.setAttribute('alert.status', status);
    span.setAttribute('alert.source_ip', ip);

    console.log('🚨 ALERT RECEIVED FROM:', userAgent);
    console.log('🌐 IP:', ip);
    console.log('📦 PAYLOAD:', JSON.stringify(req.body, null, 2));
    console.log('📎 Trace ID:', traceId);

    // 🔄 Call Gemini AI Agent
    let geminiSuggestion = 'N/A';
    try {
      const geminiResp = await axios.post('http://localhost:4000/analyze-alert', req.body, {
        headers: { 'Content-Type': 'application/json' },
      });
      geminiSuggestion = geminiResp.data.analysis;
      console.log('🤖 Gemini Suggestion:', geminiSuggestion);
    } catch (geminiErr) {
      console.error('⚠️ Gemini Agent Error:', geminiErr.message);
    }

    // ✅ Log
    logger.info({
      traceId,
      receiver,
      status,
      ip,
      userAgent,
      msg: 'Alert received',
      suggestion: geminiSuggestion,
      timestamp: new Date().toISOString(),
    });

    span.end();
    res.status(200).send('Alert received');
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: 2, message: err.message });

    logger.error({
      traceId: span.spanContext().traceId,
      error: err.message,
      msg: 'Error handling alert',
      timestamp: new Date().toISOString(),
    });

    span.end();
    res.status(500).send('Internal Server Error');
  }
});

// Prometheus metrics
const promClient = require('prom-client');
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/alert`);
});
