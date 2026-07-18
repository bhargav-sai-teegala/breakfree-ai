'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Activity, Zap, Layers, Sparkles, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

// --- 3D Tilt Card Component ---
function BentoCard({
  children,
  className = '',
  gradient = 'rgba(255,255,255,0.03)',
}: {
  children: React.ReactNode
  className?: string
  gradient?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - left - width / 2)
    mouseY.set(e.clientY - top - height / 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Tilt effect
  const rotateX = useTransform(mouseY, [-200, 200], [5, -5])
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5])

  // Glow effect following mouse
  const background = useMotionTemplate`radial-gradient(400px circle at ${useTransform(mouseX, x => x + 200)}px ${useTransform(mouseY, y => y + 200)}px, ${gradient}, transparent 80%)`

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative group rounded-[2rem] border border-[#222] bg-[#0A0A0A] overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background }}
      />
      <div className="relative z-10 h-full p-8 flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  )
}

export function LandingPageClient() {
  const { scrollYProgress } = useScroll()
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-hidden">
      
      {/* Background Mesh */}
      <motion.div 
        style={{ y: yBg }}
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen" />
      </motion.div>

      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5 mix-blend-difference">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo size={28} className="transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-xl font-bold tracking-tight">BreakFree</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Start Free
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Powered by Google Gemini 1.5 Flash
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-8">
              Break bad habits.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600">
                Rewire your life.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              The AI-native companion for beating addiction. Real-time cognitive behavioral support, precisely when cravings hit.
            </p>
            
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Start your journey</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

        {/* Bento Grid Features */}
        <section className="w-full max-w-7xl mx-auto px-6 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[400px]"
          >
            
            {/* Bento Box 1: Large Span */}
            <BentoCard className="md:col-span-2 md:row-span-1" gradient="rgba(59, 130, 246, 0.15)">
              <div className="max-w-sm relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Urge Interceptor</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Real-time cognitive behavioral support exactly when cravings hit. Our AI guides you through breathing exercises and distractions to break the cycle.
                </p>
              </div>
              {/* Mockup decoration */}
              <div className="absolute -right-8 -bottom-8 w-64 md:w-80 pointer-events-none">
                <div className="w-full h-40 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur shadow-2xl p-6 flex flex-col gap-4 transform group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-500">
                  <div className="h-4 w-1/3 bg-zinc-700 rounded-full" />
                  <div className="h-4 w-2/3 bg-blue-500/50 rounded-full" />
                  <div className="h-4 w-1/2 bg-zinc-700 rounded-full" />
                </div>
              </div>
            </BentoCard>

            {/* Bento Box 2: Small */}
            <BentoCard className="md:col-span-1" gradient="rgba(16, 185, 129, 0.15)">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3">Streak Tracking</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Visualize your progress. Every day counts, and every milestone is celebrated.
                </p>
              </div>
            </BentoCard>

            {/* Bento Box 3: Small */}
            <BentoCard className="md:col-span-1" gradient="rgba(236, 72, 153, 0.15)">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3">No Shame Zone</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Relapses happen. Our AI helps you recover gracefully without judgment or shame.
                </p>
              </div>
            </BentoCard>

            {/* Bento Box 4: Large Span */}
            <BentoCard className="md:col-span-2 md:row-span-1" gradient="rgba(139, 92, 246, 0.15)">
              <div className="max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Deep Pattern Insights</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Our AI analyzes your logs to identify hidden triggers. Understand your behavior patterns so you can proactively avoid pitfalls.
                </p>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 pointer-events-none overflow-hidden">
                <div className="absolute w-[200%] h-[200%] -top-1/2 -right-1/4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent animate-[spin_20s_linear_infinite]" />
              </div>
            </BentoCard>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="w-full border-t border-zinc-900 bg-zinc-950 px-6 py-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl flex flex-col items-center"
          >
            <Logo size={48} className="mb-8 opacity-80" />
            <h2 className="text-5xl font-black tracking-tight mb-6">Ready to take control?</h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of others breaking free from their worst habits. Your personal AI coach is waiting.
            </p>
            <Link
              href="/register"
              className="px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3"
            >
              Start for free
              <Zap className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black px-6 py-12 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Logo size={20} className="opacity-50" />
          <span>© 2026 BreakFree AI</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <span>Built for Hack2Skill PromptWars</span>
          <span className="hidden md:inline text-zinc-800">|</span>
          <span className="text-zinc-400">If you're in crisis: <strong className="text-white font-medium hover:underline cursor-pointer">Call or text 988</strong></span>
        </div>
      </footer>
    </div>
  )
}
