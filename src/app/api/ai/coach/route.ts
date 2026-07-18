import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateStream } from '@/lib/gemini'

interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message, habitId, history } = (await request.json()) as {
      message: string
      habitId: string | null
      history: ChatMessage[]
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Save user message
    await supabase.from('coach_messages').insert({
      user_id: user.id,
      role: 'user',
      content: message,
      habit_id: habitId || null,
      type: 'chat',
    })

    // Build message history for Gemini
    const contents = [
      ...history.map((msg: ChatMessage) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    // Stream from Gemini
    const streamResult = await generateStream(contents)

    let fullResponse = ''

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text()
            if (text) {
              fullResponse += text
              const data = `data: ${JSON.stringify({ text })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()

          // Save AI response after stream completes
          if (fullResponse) {
            await supabase.from('coach_messages').insert({
              user_id: user.id,
              role: 'model',
              content: fullResponse,
              habit_id: habitId || null,
              type: 'chat',
            })
          }
        } catch (streamError) {
          console.error('Streaming error:', streamError)
          const fallback = "I'm having trouble connecting right now. Please try again in a moment. I'm here for you."
          const data = `data: ${JSON.stringify({ text: fallback })}\n\n`
          controller.enqueue(encoder.encode(data))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
