import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'BreakFree AI — Break Bad Habits with AI',
  description:
    'AI-powered habit breaking app. Use evidence-based techniques and Gemini AI to overcome addiction and build a better you.',
  keywords: ['habit breaking', 'addiction recovery', 'AI coach', 'mental health', 'self-improvement'],
  authors: [{ name: 'BreakFree AI' }],
  openGraph: {
    title: 'BreakFree AI',
    description: 'Break bad habits with your AI companion',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
