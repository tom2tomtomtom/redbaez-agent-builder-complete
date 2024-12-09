import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generateResponse(prompt: string, config: any) {
  if (config.model.startsWith('gpt')) {
    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: 'system', content: config.systemPrompt }, { role: 'user', content: prompt }],
      temperature: config.temperature,
      max_tokens: config.maxTokens
    });
    return response.choices[0].message.content;
  } else {
    const response = await anthropic.messages.create({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      system: config.systemPrompt,
      max_tokens: config.maxTokens,
      temperature: config.temperature
    });
    return response.content[0].text;
  }
}
