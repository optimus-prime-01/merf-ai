const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const alertController = require('./controllers/alertController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/analyze', alertController.handleAnalyze);
app.post('/tts', alertController.handleTTS);
app.post('/feedback', alertController.handleFeedback);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Agent running on port ${PORT}`));