'use client'

import React, { useState, useEffect } from 'react'

export default function GlobalRedirects() {
    const [baseUrl, setBaseUrl] = useState('')
    const [copied, setCopied] = useState<string | null>(null)

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [])

    const copy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const systemLinks = [
        { label: 'Success Callback', url: `${baseUrl}/status?type=complete&uid=[UID]`, id: 'sys-complete', color: 'bg-emerald-500', icon: 'M5 13l4 4L19 7' },
        { label: 'Terminate Callback', url: `${baseUrl}/status?type=terminate&uid=[UID]`, id: 'sys-term', color: 'bg-rose-500', icon: 'M6 18L18 6M6 6l12 12' },
        { label: 'Quota Full Callback', url: `${baseUrl}/status?type=quota&uid=[UID]`, id: 'sys-quota', color: 'bg-amber-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { label: 'Security Flag', url: `${baseUrl}/status?type=security_terminate&uid=[UID]`, id: 'sys-sec', color: 'bg-indigo-500', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    ]

    return (
        <section className="mb-12">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-2">Master System Endpoints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemLinks.map((link) => (
                    <div key={link.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${link.color} opacity-[0.03] rounded-bl-[4rem] group-hover:scale-110 transition-transform`} />

                        <div className="flex items-center space-x-4 mb-4">
                            <div className={`w-10 h-10 rounded-xl ${link.color} flex items-center justify-center text-white shadow-lg shadow-indigo-200/50`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={link.icon} />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-tighter">{link.label}</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Protocol</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                                <p className="text-[10px] font-mono text-slate-400 break-all leading-relaxed line-clamp-2">{link.url}</p>
                            </div>
                            <button
                                onClick={() => copy(link.url, link.id)}
                                className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${copied === link.id ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'
                                    }`}
                            >
                                {copied === link.id ? 'SYNCHRONIZED' : 'COPY ENDPOINT'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
