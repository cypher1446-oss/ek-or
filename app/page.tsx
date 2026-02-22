'use client'

import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Extremely Minimal Central Login Button */}
      <div className="animate-in fade-in zoom-in duration-700">
        <Link
          href="/login"
          className="bg-[#1a2937] text-white px-12 py-5 rounded-full text-2xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:bg-[#2c4258] transition-all transform hover:-translate-y-1 active:translate-y-0 tracking-tight uppercase"
        >
          Admin Login
        </Link>
      </div>
    </main>
  )
}
