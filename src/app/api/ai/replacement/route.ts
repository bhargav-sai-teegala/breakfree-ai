import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini'
import { buildReplacementPrompt } from '@/lib/prompts'

const FALLBACK_SUGGESTIONS: Record<string, string> = {
  social_media: 'Step outside and take a 5-minute walk around the block while noticing three things you can smell, hear, and see.',
  screen_time: 'Do 10 slow, mindful squats while breathing deeply — inhale on the way down, exhale on the way up.',
  gaming: 'Grab a glass of water and a notebook — write down three things you\'re looking forward to this week.',
  alcohol: 'Make a warm herbal tea and hold the mug with both hands, focusing on the warmth and scent for 5 minutes.',
  smoking: 'Do 5 slow, deep breaths with pursed lips (like you\'re blowing out candles), then call or text someone you haven\'t talked to in a while.',
  junk_food: 'Drink a full glass of cold water slowly, then cut up a piece of fruit and eat it mindfully, noticing every flavor.',
  gambling: 'Write down your monthly financial goal and calculate how much this money would help — then do 5 minutes of light stretching.',
  other: 'Set a 10-minute timer and tidy up one small area around you — the physical action redirects mental energy.',
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { category, motivation, triggers } = (await request.json()) as {
      category: string
      motivation: string
      triggers?: string[]
    }

    if (!category || !motivation) {
      return NextResponse.json({ suggestion: FALLBACK_SUGGESTIONS.other })
    }

    const prompt = buildReplacementPrompt(category, motivation) +
      (triggers?.length ? `\nCurrent triggers: ${triggers.join(', ')}` : '')

    let suggestion = await generateText(prompt)
    if (!suggestion) {
      suggestion = FALLBACK_SUGGESTIONS[category] || FALLBACK_SUGGESTIONS.other
    }

    return NextResponse.json({ suggestion: suggestion.trim() })
  } catch (error) {
    console.error('Replacement API error:', error)
    return NextResponse.json({
      suggestion: FALLBACK_SUGGESTIONS.other,
    })
  }
}
