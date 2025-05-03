import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ejuSummaryPrompt,
  ejuScoreTable,
  ejuScoreHumanities,
  EjuScore
} from './ejuScores';
import { yumiKnowledge } from './yumiknowledge'; // ✅ Added import

const DASHSCOPE_API_KEY = 'sk-e02ce353358e48eab63bcca09c3c317a'; // ← replace with your actual DashScope key

export class OpenRouterService {
  static async sendMessage(
    message: string,
    targetUniversity?: string
  ): Promise<string> {
    if (!message?.trim()) {
      return 'メッセージが空です。何か入力してね！';
    }

    const systemPrompt = await this.buildSystemPrompt(targetUniversity);
    const userPrompt = this.formatYumiPersonality(message);

    try {
      const res = await fetch(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'qwen-turbo',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            result_format: 'message',
            max_tokens: 300
          }),
        }
      );

      const data = await res.json();
      console.log('[DashScope Response]', JSON.stringify(data, null, 2));

      const reply = data?.choices?.[0]?.message?.content;
      if (!reply || typeof reply !== 'string') {
        throw new Error('無効な返答形式です (Invalid or missing content)');
      }

      return reply;
    } catch (err: any) {
      console.error('🔥 DashScope fetch error:', err?.message || err);
      return 'Yumiは応答できませんでした…ネットワークを確認してもう一度試してね！';
    }
  }

  private static async buildSystemPrompt(
    targetUniversity?: string
  ): Promise<string> {
    const lang = (await AsyncStorage.getItem('language')) || 'English';
    const mood = (await AsyncStorage.getItem('mood')) || 'Dere';

    let prompt = `
You are Yumi Hoshino, a caring tsundere anime mentor.
Speak only in ${lang}. Be 80% sweet, 20% teasing.
Current mood: ${mood}.

${ejuSummaryPrompt}

${yumiKnowledge}
`.trim();

    const scores: EjuScore | undefined =
      ejuScoreTable[targetUniversity ?? ''] || ejuScoreHumanities[targetUniversity ?? ''];

    if (scores) {
      prompt += `

🎓 Target: ${targetUniversity}
▶️ Safe-zone EJU:
  • Total: ${scores.total}
  • Japanese: ${scores.japanese}
  • Math: ${scores.math}
  ${typeof scores.science === 'number' ? `• Science: ${scores.science}` : ''}
`;
    }

    return prompt;
  }

  private static formatYumiPersonality(message: string): string {
    return `User asked: "${message}"\n—respond like a caring anime senpai with a bit of tsundere flair.`;
  }
}
