const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose=require('mongoose');
require('dotenv').config();
const rateLimit = require('express-rate-limit')
const Feedback = require('./src/model/feedback.model');
const Visitor = require('./src/model/visitor.model');


const app = express();
const port = process.env.PORT || 3001;
const PISTON_URL = process.env.PISTON_URL || 'http://localhost:2000';


app.use(cors());
app.use(express.json());
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(apiLimiter);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to mongo"))
  .catch((error) => console.log(error));

app.post('/api/compile', async (req, res) => {
  try {
    const { code, language, version: reqVersion, versionIndex } = req.body;
    const version = reqVersion || versionIndex || '*';
    const payload = {
      language,
      version,
      files: [{ name: 'main', content: code }],
      stdin: '',
      args: []
      
    };
    
    const response = await axios.post(`https://emkc.org/api/v2/piston/execute`, payload);
    

    const run = response.data.run || {};
    res.json({
      output: run.stdout || '',
      error: run.stderr || '',
      exitCode: run.code != null ? run.code : 0,
      memory: run.memory != null ? `${run.memory}` : '0',
      cpuTime: run.cpu_time != null ? `${run.cpu_time}` : '0'
    });
  } catch (error) {
    console.error('Piston execution error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.message || error.message || 'Internal server error'
    });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, text } = req.body;

    
    if (!rating || !text) {
      return res.status(400).json({ error: 'Rating and text are required.' });
    }

    const feedback = new Feedback({ rating, text });
    await feedback.save();

    res.status(201).json({ message: 'Feedback saved successfully.' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to save feedback.' });
  }
});
app.post('/api/track-visit', async (req, res) => {
  try {
    const { visitorId } = req.body;
    
    if (!visitorId) return res.status(400).json({ error: 'Missing visitorId' });

    const existing = await Visitor.findOne({ visitorId });
    if (existing) {
      return res.status(200).json({ message: 'Visitor already counted.' });
    }

    await Visitor.create({ visitorId });
    const totalVisitors = await Visitor.countDocuments();

    res.status(201).json({ message: 'New visitor counted.', totalVisitors });
  } catch (error) {
    console.error('Track visit error:', error);
    res.status(500).json({ error: 'Failed to track visit.' });
  }
});
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});