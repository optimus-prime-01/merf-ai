const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

app.post('/alert', (req, res) => {
  console.log('🚨 ALERT RECEIVED FROM:', req.headers['user-agent'] || 'Unknown');
  console.log('🌐 IP:', req.ip);
  console.log('📦 FULL PAYLOAD:', JSON.stringify(req.body, null, 2));
  res.status(200).send('Alert received');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/alert`);
});
