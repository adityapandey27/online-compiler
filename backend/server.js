const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/compile', async (req, res) => {
  try {
    const { code, language, versionIndex } = req.body;
    
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      language,
      versionIndex
    });

    res.json(response.data);
  } catch (error) {
    console.error('Compilation error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error || error.message || 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
}); 