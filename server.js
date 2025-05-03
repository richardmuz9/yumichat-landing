// server.js
import express from 'express';
import axios from 'axios';
const app = express();
app.use(express.json());

app.post('/proxy/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      { headers: { Authorization: `Bearer ${process.env.API_KEY}` } }
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () => console.log('Proxy listening on :3000'));
