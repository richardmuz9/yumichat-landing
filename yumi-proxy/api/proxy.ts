export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST allowed' });
    }
  
    const apiKey = process.env.OPENROUTER_API_KEY;
  
    if (!apiKey || !apiKey.trim()) {
      return res.status(500).json({ error: 'Missing OpenRouter API key' });
    }
  
    try {
      const cleanedKey = apiKey.trim().replace(/^Bearer\s+/i, ''); // clean header
  
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanedKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
  
      const data = await response.json();
  
      return res.status(response.status).json(data);
    } catch (err: any) {
      console.error('[Yumi Proxy Error]', err.message);
      return res.status(500).json({ error: 'Proxy error', detail: err.message });
    }
  }
  