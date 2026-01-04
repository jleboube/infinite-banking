import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIProvider = 'OPENAI' | 'ANTHROPIC' | 'GEMINI' | 'GROK' | 'SELF_HOSTED'

interface AIConfig {
  provider: AIProvider
  apiKey?: string
  selfHostedUrl?: string
  selfHostedModel?: string
}

interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function generateAIResponse(
  config: AIConfig,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const fullMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages

  switch (config.provider) {
    case 'OPENAI':
      return generateOpenAI(config.apiKey || process.env.OPENAI_API_KEY || '', fullMessages)
    case 'ANTHROPIC':
      return generateAnthropic(
        config.apiKey || process.env.ANTHROPIC_API_KEY || '',
        fullMessages,
        systemPrompt
      )
    case 'GEMINI':
      return generateGemini(config.apiKey || process.env.GEMINI_API_KEY || '', fullMessages)
    case 'GROK':
      return generateGrok(config.apiKey || process.env.GROK_API_KEY || '', fullMessages)
    case 'SELF_HOSTED':
      return generateSelfHosted(
        config.selfHostedUrl || process.env.SELF_HOSTED_AI_URL || '',
        config.selfHostedModel || process.env.SELF_HOSTED_AI_MODEL || 'llama2',
        fullMessages
      )
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`)
  }
}

async function generateOpenAI(apiKey: string, messages: AIMessage[]): Promise<string> {
  const openai = new OpenAI({ apiKey })
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    temperature: 0.7,
    max_tokens: 2048,
  })
  return response.choices[0]?.message?.content || ''
}

async function generateAnthropic(
  apiKey: string,
  messages: AIMessage[],
  systemPrompt?: string
): Promise<string> {
  const anthropic = new Anthropic({ apiKey })
  const nonSystemMessages = messages.filter((m) => m.role !== 'system')

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 2048,
    system: systemPrompt,
    messages: nonSystemMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const textContent = response.content.find((c) => c.type === 'text')
  return textContent && 'text' in textContent ? textContent.text : ''
}

async function generateGemini(apiKey: string, messages: AIMessage[]): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const systemMessage = messages.find((m) => m.role === 'system')
  const chatMessages = messages.filter((m) => m.role !== 'system')

  const prompt =
    (systemMessage ? `System: ${systemMessage.content}\n\n` : '') +
    chatMessages.map((m) => `${m.role}: ${m.content}`).join('\n\n')

  const result = await model.generateContent(prompt)
  return result.response.text()
}

async function generateGrok(apiKey: string, messages: AIMessage[]): Promise<string> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

async function generateSelfHosted(
  url: string,
  model: string,
  messages: AIMessage[]
): Promise<string> {
  const prompt = messages.map((m) => `${m.role}: ${m.content}`).join('\n\n')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  })

  const data = await response.json()
  return data.response || data.choices?.[0]?.message?.content || ''
}
