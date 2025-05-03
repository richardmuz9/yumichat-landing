const fetch = require('node-fetch');

(async () => {
  const response = await fetch('https://yumi-proxy-mwow.vercel.app/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      max_tokens: 300,
      messages: [
        { role: 'system', content: 'You are a tsundere anime mentor named Yumi.' },
        { role: 'user', content: 'How to prepare for the EJU exam?' }
      ]
    })
  });

  const data = await response.json();
  console.log('✅ Response from DashScope:', JSON.stringify(data, null, 2));
})();
