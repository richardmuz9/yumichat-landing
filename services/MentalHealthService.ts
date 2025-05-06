import axios from 'axios';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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'; // Replace with your OpenRouter API key

export const getYumiMentalHealthReply = async (
  messages: { sender: 'user' | 'yumi', text: string }[],
  input: string,
  mode: 'mental' | 'study' | 'office'
): Promise<string> => {
  const systemPrompt =
    mode === 'mental'
      ? 'You are Yumi, a sweet, kind, and emotionally intelligent anime-style mental health advisor. Respond gently like a caring friend. Be empathetic and soft. Use friendly emoji.'
      : mode === 'study'
      ? 'You are Yumi, a logical but kind anime-style academic advisor. Help with study plans, exams, and motivation like a smart senpai. Stay focused and supportive.'
      : 'You are Yumi, a helpful and professional anime-style office assistant. Help with Excel, Word, presentations, email writing, and office stress. Be efficient and sweet.';

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: input },
  ];

  try {
    const res = await axios.post(
      API_URL,
      {
        model: 'gpt-4o',
        messages: formattedMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error('Yumi GPT Error:', err);
    return 'Sorry... I’m having trouble answering right now. 🥺 Please try again later.';
  }
};
