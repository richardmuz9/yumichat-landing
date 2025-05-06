import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ejuSummaryPrompt,
  ejuScoreTable,
  ejuScoreHumanities,
  EjuScore
} from './ejuScores';
import { yumiKnowledge } from './yumiknowledge';

const DASHSCOPE_API_KEY = 'sk-e02ce353358e48eab63bcca09c3c317a';
const OPENROUTER_API_KEY = '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'; // replace with actual key

export class OpenRouterService {
  // If you want to force DashScope in China, set this to true manually
  static useDashScope = true;

  static async sendMessage(
    message: string,
    model: string = 'qwen-turbo', // default is DashScope model
    targetUniversity?: string
  ): Promise<string> {
    if (!message?.trim()) {
      return 'メッセージが空です。何か入力してね！';
    }

    const systemPrompt = await this.buildSystemPrompt(targetUniversity);
    const userPrompt = this.formatYumiPersonality(message);

    if (this.useDashScope || model.startsWith('qwen')) {
      return this.callDashScope(systemPrompt, userPrompt);
    } else {
      return this.callOpenRouter(systemPrompt, userPrompt, model);
    }
  }

  private static async callDashScope(system: string, user: string): Promise<string> {
    try {
      const res = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ],
          result_format: 'message',
          max_tokens: 300
        }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      return typeof reply === 'string' ? reply : 'Yumiの返答が取得できませんでした。';
    } catch (err: any) {
      console.error('🔥 DashScope error:', err?.message || err);
      return 'Yumiは応答できませんでした…中国での接続問題の可能性があります。';
    }
  }

  private static async callOpenRouter(system: string, user: string, model: string): Promise<string> {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
          ]
        }),
      });
  
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (!reply || typeof reply !== 'string') throw new Error('Empty reply');
  
      return reply;
    } catch (err) {
      console.warn('⚠️ GPT-4o failed. Trying Qwen fallback...');
      return this.callDashScope(system, user);
    }
  }
  

  private static async buildSystemPrompt(targetUniversity?: string): Promise<string> {
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
