'use client'

import React from 'react'
import { ArrowRight, Terminal, User, Globe, ShieldCheck } from 'lucide-react'

interface LandingResultLayoutProps {
    title: string
    description: string
    type: 'success' | 'warning' | 'error' | 'info' | 'dark' | 'secondary'
    uid?: string
    code?: string
    status?: string
    ip?: string
}

export default function LandingResultLayout({
    title,
    description,
    type,
    uid = 'N/A',
    code = 'N/A',
    status = 'N/A',
    ip = 'N/A'
}: LandingResultLayoutProps) {

    const themes = {
        success: { primary: '#f28c5a', secondary: '#fbd8c4' },
        warning: { primary: '#f59e0b', secondary: '#fef3c7' },
        error: { primary: '#f43f5e', secondary: '#ffe4e6' },
        info: { primary: '#6366f1', secondary: '#e0e7ff' },
        dark: { primary: '#1a2b3c', secondary: '#f1f5f9' },
        secondary: { primary: '#94a3b8', secondary: '#f8fafc' }
    }

    const t = themes[type] || themes.success

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-10 overflow-hidden relative apple-fade-in"
            style={{ backgroundColor: t.primary }}>

            {/* Background design elements */}
            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Main Creative Card */}
            <div className="relative w-full max-w-5xl h-full md:h-[650px] bg-[#fdfdfd] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row apple-reveal opacity-0">

                {/* Visual Graphics Section */}
                <div className="absolute top-0 right-0 w-full h-full md:w-3/5 pointer-events-none overflow-hidden hidden md:block">
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
                        style={{ background: `radial-gradient(circle, ${t.primary}ee 0%, ${t.primary}aa 40%, ${t.primary}44 70%, transparent 100%)` }} />
                    <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full shadow-2xl"
                        style={{ background: `radial-gradient(circle at 30% 30%, ${t.secondary}, ${t.primary})` }} />
                    <div className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full shadow-xl"
                        style={{ background: `radial-gradient(circle at 30% 30%, ${t.secondary}, ${t.primary})` }} />
                </div>

                {/* Content Section */}
                <div className="relative z-10 w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-between h-auto md:h-full">

                    {/* Brand */}
                    <div className="flex items-center space-x-3 apple-slide-up opacity-0">
                        <div className="w-10 h-10 bg-black rounded-xl rotate-45 flex items-center justify-center shadow-lg">
                            <div className="w-5 h-5 bg-white rounded-lg -rotate-45" style={{ backgroundColor: t.primary }} />
                        </div>
                        <span className="text-xl font-black text-[#1a1a1a] tracking-tighter uppercase">VOICELAB</span>
                    </div>

                    {/* Main Title & Description */}
                    <div className="apple-reveal opacity-0 stagger-1">
                        <h1 className="text-6xl md:text-8xl font-black text-[#1a1a1a] tracking-tighter leading-[0.85] mb-6">
                            THANK<br />
                            <span style={{ color: t.primary }}>YOU.</span>
                        </h1>
                        <p className="text-gray-400 font-black uppercase text-[12px] tracking-[0.3em] leading-relaxed max-w-xs">
                            {description || "Process completed successfully."}
                        </p>
                    </div>

                    {/* Standard Data Metrics */}
                    <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-10 apple-slide-up opacity-0 stagger-2">
                        <div className="group">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                                <User className="w-3 h-3" /> UID Reference
                            </p>
                            <p className="text-sm font-bold text-gray-800 font-mono">{uid}</p>
                        </div>
                        <div className="group">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                                <Terminal className="w-3 h-3" /> Project Node
                            </p>
                            <p className="text-sm font-bold text-gray-800 font-mono">{code}</p>
                        </div>
                    </div>
                </div>

                {/* Right Status Card */}
                <div className="relative z-10 w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center apple-fade-in opacity-0 stagger-3">
                    <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/40 shadow-2xl max-w-sm w-full mx-auto md:mx-0">
                        <div className="mb-10 text-center md:text-left">
                            <div className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a1a]/40 mb-4 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100/50">
                                <ShieldCheck className="w-3.5 h-3.5" /> SECURE HANDSHAKE
                            </div>
                            <h3 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase mb-2">
                                {title}
                            </h3>
                            <div className="inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl"
                                style={{ backgroundColor: t.primary }}>
                                Status: {status}
                            </div>
                        </div>

                        <a href="https://voicelab.research/"
                            className="flex items-center justify-between w-full bg-[#1a1a1a] text-white px-8 py-5 rounded-2xl group hover:bg-indigo-600 transition-all duration-500 active:scale-95 shadow-2xl shadow-indigo-200">
                            <span className="text-xs font-black uppercase tracking-widest">Return Home</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <div className="mt-12 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 bg-white shadow-sm">
                                <Globe className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">TRANSMITTED VIA</p>
                                <p className="text-xs font-bold text-gray-500 font-mono">{ip}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle disclaimer */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white/40 uppercase tracking-[1em] apple-fade-in opacity-0 stagger-4">
                VOICELAB INTELLIGENCE
            </div>
        </div>
    )
}
