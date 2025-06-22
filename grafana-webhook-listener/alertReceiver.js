// require('./tracing'); // Add this line first

// const express = require('express');
// const app = express();
// const PORT = 10000;

// app.use(express.json());

// app.post('/alert', (req, res) => {
//   console.log('🚨 ALERT RECEIVED FROM:', req.headers['user-agent'] || 'Unknown');
//   console.log('🌐 IP:', req.ip);
//   console.log('📦 FULL PAYLOAD:', JSON.stringify(req.body, null, 2));
//   res.status(200).send('Alert received');
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}/alert`);
// });

/////////////
// require('./tracing'); // OpenTelemetry must come first

// const express = require('express');
// const { trace } = require('@opentelemetry/api');

// const app = express();
// const PORT = 10001;

// app.use(express.json());

// app.post('/alert', (req, res) => {
//   const span = trace.getTracer('default').startSpan('handle_alert_post');

//   console.log('🚨 ALERT RECEIVED FROM:', req.headers['user-agent'] || 'Unknown');
//   console.log('🌐 IP:', req.ip);
//   console.log('📦 FULL PAYLOAD:', JSON.stringify(req.body, null, 2));

//   span.end();  // Finish the trace span
//   res.status(200).send('Alert received');
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}/alert`);
// });

// Initialize tracing before anything else
require('./tracing');

const express = require('express');
const { trace } = require('@opentelemetry/api');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Ensure log directory exists
const logDir = '/var/log/app';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Pino logger setup for Loki-compatible logs
const logger = pino(
  {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: false,
      },
    },
  },
  pino.destination(path.join(logDir, 'alerts.log'))
);

const app = express();
const PORT = 50000;

app.use(express.json());

app.post('/alert', (req, res) => {
  const tracer = trace.getTracer('default');
  const span = tracer.startSpan('handle_alert_post');

  try {
    // 🔖 Trace metadata
    const receiver = req.body.receiver || 'none';
    const status = req.body.status || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip;
    const traceId = span.spanContext().traceId;

    span.setAttribute('http.user_agent', userAgent);
    span.setAttribute('alert.receiver', receiver);
    span.setAttribute('alert.status', status);
    span.setAttribute('alert.source_ip', ip);

    // ✅ Log to console
    console.log('🚨 ALERT RECEIVED FROM:', userAgent);
    console.log('🌐 IP:', ip);
    console.log('📦 FULL PAYLOAD:', JSON.stringify(req.body, null, 2));

    // ✅ Structured log for Loki
    logger.info({
      traceId,
      receiver,
      status,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      msg: 'Alert received',
    });

    span.end();
    res.status(200).send('Alert received');
  } catch (err) {
    span.recordException(err);
    span.setStatus({ code: 2, message: err.message });
    logger.error({ err, msg: 'Error processing alert' });
    span.end();
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/alert`);
});
