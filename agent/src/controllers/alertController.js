

const aiService = require('../services/aiService');
const ttsService = require('../services/ttsService');
const storage = require('../utils/storage');

const handleAnalyze = async (req, res) => {
  const alert = req.body;
  const analysis = await aiService.analyzeAlert(alert);
  await storage.saveAlert({ ...alert, analysis });
  res.json(analysis);
};

const handleTTS = (req, res) => {
  const { text } = req.body;
  const audio = ttsService.convertToSpeech(text);
  res.json(audio);
};

const handleFeedback = async (req, res) => {
  const feedback = req.body;
  await storage.saveFeedback(feedback);
  res.json({ message: 'Feedback saved' });
};

module.exports = {
  handleAnalyze,
  handleTTS,
  handleFeedback
};

module.exports = {
  handleAnalyze,
  handleTTS,
  handleFeedback
};
