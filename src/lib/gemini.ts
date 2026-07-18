import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_INSTRUCTION = `You are BreakFree, an empathetic AI companion specializing in habit change and addiction recovery.
You use evidence-based techniques from Cognitive Behavioral Therapy (CBT) and motivational interviewing.
Core principles:
- Never shame or guilt the user. Relapses are part of recovery, not failure.
- Be warm, human, and specific. Never give generic advice.
- Always reference the user's own data, motivation, and history when available.
- Nudges: keep under 80 words. Coaching responses: under 250 words unless asked for more.
- If you detect crisis language (hopelessness, self-harm), respond with care and include: "Please reach out to a crisis helpline: 988 Suicide & Crisis Lifeline (call/text 988)"
- Celebrate wins — even small ones matter enormously in recovery.`

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: SYSTEM_INSTRUCTION,
})

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Gemini generateText error:', error)
    return ''
  }
}

export async function generateStream(
  messages: Array<{ role: string; parts: Array<{ text: string }> }>,
) {
  return geminiModel.generateContentStream({ contents: messages })
}
