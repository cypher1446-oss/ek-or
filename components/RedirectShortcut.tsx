'use client'

import React from 'react'

export default function RedirectShortcut() {
    return (
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-[2rem] shadow-2xl shadow-indigo-200/50 p-8 text-white relative overflow-hidden group cursor-pointer active:scale-95 transition-all duration-500">
            {/* Ambient Background Glows */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

            <div className="absolute right-6 top-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:rotate-12 transition-transform">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <div className="bg-white/15 backdrop-blur-md w-max p-3 rounded-2xl mb-6 shadow-inner ring-1 ring-white/20">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Redirect Center</h3>
                    <p className="text-indigo-100/80 text-[11px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                        Control real-time routing & callback endpoints
                    </p>
                </div>

                <div className="mt-auto">
                    <a
                        href="#redirect-center"
                        className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 rounded-2xl text-[10px] font-black hover:bg-indigo-50 transition-all uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/20 group-hover:px-8 transition-all"
                    >
                        Access Now
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
