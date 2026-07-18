import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ habitId: string }> },
) {
  try {
    const { habitId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30', 10)
    const limit = Math.min(Math.max(days, 7), 365)

    // Verify habit belongs to user
    const { data: habit } = await supabase
      .from('habits')
      .select('id')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (!habit) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - limit)
    const cutoffStr = cutoffDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .gte('date', cutoffStr)
      .order('date', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('GET /api/logs/[habitId] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
