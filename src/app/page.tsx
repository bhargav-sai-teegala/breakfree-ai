import type { Metadata } from 'next'
import { LandingPageClient } from '@/components/home/LandingPageClient'

export const metadata: Metadata = {
  title: 'BreakFree AI — Break Bad Habits with AI Coaching',
}

export default function LandingPage() {
  return <LandingPageClient />
}
