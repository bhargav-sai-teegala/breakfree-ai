import type { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-black text-white selection:bg-white/20">
      {/* Background Mesh */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Brand header */}
      <div className="mb-8 text-center relative z-10 flex flex-col items-center">
        <Link href="/" className="inline-flex items-center gap-3 group mb-4">
          <Logo size={40} className="transition-transform duration-500 group-hover:rotate-180" />
          <span className="text-3xl font-black tracking-tight text-white">
            BreakFree
          </span>
        </Link>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-[2rem] border border-[#222] bg-[#0A0A0A]/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}
