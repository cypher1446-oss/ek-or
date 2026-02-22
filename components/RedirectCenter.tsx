'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'

interface RedirectCenterProps {
    projects: (Project & { client_name: string })[]
}

export default function RedirectCenter({ projects }: RedirectCenterProps) {
    const [baseUrl, setBaseUrl] = useState('')
    const [copiedLink, setCopiedLink] = useState<string | null>(null)

    useEffect(() => {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL
        const calculatedBaseUrl = appUrl
            ? (appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl)
            : (typeof window !== 'undefined' ? window.location.origin : '')

        setBaseUrl(calculatedBaseUrl)
    }, [])

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedLink(id)
            setTimeout(() => setCopiedLink(null), 2000)
        } catch (err) {
            console.error('Copy failed:', err)
        }
    }

    const participantLinks = (code: string) => [
        { label: 'Short Entry Link', url: `${baseUrl}/r/${code}/[uid]`, id: `${code}-entry-short`, desc: 'Recommended setup' },
        { label: 'Explicit Tracking', url: `${baseUrl}/track?pid=${code}&uid=[uid]`, id: `${code}-entry-track`, desc: 'Direct hit bridge' },
    ]

    const landingPageLinks = (code: string) => [
        { label: 'Complete', url: `${baseUrl}/status?code=${code}&uid=[UID]&type=complete`, id: `${code}-complete`, desc: 'Success redirect' },
        { label: 'Terminate', url: `${baseUrl}/status?code=${code}&uid=[UID]&type=terminate`, id: `${code}-terminate`, desc: 'Quality dropout' },
        { label: 'Quota Full', url: `${baseUrl}/status?code=${code}&uid=[UID]&type=quota`, id: `${code}-quota`, desc: 'Capacity reach' },
        { label: 'Duplicate Check', url: `${baseUrl}/status?code=${code}&uid=[UID]&type=duplicate_string`, id: `${code}-dup-str`, desc: 'Re-entry block' },
        { label: 'IP Security', url: `${baseUrl}/status?code=${code}&uid=[UID]&type=security_terminate`, id: `${code}-sec-term`, desc: 'Abuse detected' },
    ]

    const postbackLinks = (code: string) => [
        { label: 'S2S Complete', url: `${baseUrl}/api/callback?cid=[cid]&type=complete`, id: `${code}-pb-complete`, desc: 'Server callback' },
        { label: 'S2S Terminate', url: `${baseUrl}/api/callback?cid=[cid]&type=terminate`, id: `${code}-pb-terminate`, desc: 'Server callback' },
        { label: 'S2S Quota', url: `${baseUrl}/api/callback?cid=[cid]&type=quota`, id: `${code}-pb-quota`, desc: 'Server callback' },
    ]

    return (
        <section className="mt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 px-2">
                <div>
                    <h2 className="text-3xl font-black text-[#1a2b3c] tracking-tighter uppercase">Unified Link Orchestrator</h2>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Cross-project routing & callback endpoints</p>
                </div>
                <div className="px-5 py-2.5 bg-indigo-600/5 rounded-2xl border border-indigo-100 flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em]">Logic V2.4 Active</span>
                </div>
            </div>

            <div className="space-y-8">
                {projects.length === 0 ? (
                    <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                        <div className="flex flex-col items-center opacity-30 space-y-4">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Standby: No projects detected</span>
                        </div>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
                            <details className="group/details">
                                <summary className="flex items-center justify-between p-8 cursor-pointer list-none bg-gray-50/20 group-open/details:bg-white transition-all">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 group-open/details:border-indigo-100 group-open/details:text-indigo-600 group-open/details:shadow-indigo-100/50 transition-all duration-300">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[#1a2b3c] tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
                                                {project.project_name || project.project_code}
                                            </h3>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-[10px] font-black text-gray-400 tracking-[0.1em] uppercase">UID: {project.project_code}</span>
                                                <span className="text-gray-200">|</span>
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{project.client_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${project.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/20'
                                            : 'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}>
                                            {project.status === 'active' ? '● ONLINE' : '○ SHUTDOWN'}
                                        </span>
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-300 group-open/details:rotate-180 group-open/details:text-indigo-600 transition-all duration-500 bg-white border border-gray-100 shadow-sm group-hover:bg-indigo-50/50 group-hover:border-indigo-100 group-hover:text-indigo-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </summary>
                                <div className="p-8 pt-2 border-t border-gray-50/50">
                                    <div className="space-y-12 py-4">
                                        {/* PARTICIPANT ENTRY */}
                                        <div>
                                            <h4 className="flex items-center space-x-3 text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">
                                                <span className="w-6 h-0.5 bg-indigo-200/50"></span>
                                                <span>Participant Entry Matrix</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {participantLinks(project.project_code).map((link) => (
                                                    <div key={link.id} className="relative group/link bg-gray-50/30 p-5 rounded-[2rem] border border-gray-100 hover:border-indigo-200 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <label className="text-[10px] font-black text-[#1a2b3c] uppercase tracking-widest">{link.label}</label>
                                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{link.desc}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative flex-1">
                                                                <input
                                                                    type="text"
                                                                    readOnly
                                                                    value={link.url}
                                                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-mono text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all truncate"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white pointer-events-none rounded-2xl" />
                                                            </div>
                                                            <button
                                                                onClick={() => copyToClipboard(link.url, link.id)}
                                                                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${copiedLink === link.id
                                                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20 scale-95'
                                                                    : 'bg-[#1a2b3c] text-white hover:bg-indigo-600 shadow-indigo-500/20 active:scale-95'
                                                                    }`}
                                                            >
                                                                {copiedLink === link.id ? 'COPIED!' : 'COPY'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* LANDING PAGE REDIRECTS */}
                                        <div>
                                            <h4 className="flex items-center space-x-3 text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">
                                                <span className="w-6 h-0.5 bg-emerald-200/50"></span>
                                                <span>Direct Response Handlers</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {landingPageLinks(project.project_code).map((link) => (
                                                    <div key={link.id} className="relative group/link bg-gray-50/20 p-5 rounded-[2rem] border border-gray-50 hover:border-emerald-200 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <label className="text-[10px] font-black text-[#1a2b3c] uppercase tracking-widest">{link.label}</label>
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={link.url}
                                                                className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-[11px] font-mono text-gray-400 group-hover:text-gray-600 transition-colors focus:outline-none truncate"
                                                            />
                                                            <button
                                                                onClick={() => copyToClipboard(link.url, link.id)}
                                                                className={`w-full py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${copiedLink === link.id
                                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-95'
                                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-600 active:scale-95'
                                                                    }`}
                                                            >
                                                                {copiedLink === link.id ? 'SYNCHRONIZED' : 'COPY HANDLER'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* S2S POSTBACKS */}
                                        <div className="bg-[#1a2b3c] rounded-[2.5rem] p-10 relative overflow-hidden">
                                            {/* Accent Decoration */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                                            <h4 className="flex items-center space-x-3 text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 relative z-10">
                                                <span className="w-6 h-0.5 bg-indigo-500/30"></span>
                                                <span>Partner Protocol Integration (S2S)</span>
                                            </h4>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                                                {postbackLinks(project.project_code).map((link) => (
                                                    <div key={link.id} className="relative group/link bg-white/5 backdrop-blur-md p-6 rounded-[1.8rem] border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all duration-300">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <label className="text-[10px] font-black text-white/90 uppercase tracking-[0.1em]">{link.label}</label>
                                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_white]" />
                                                        </div>
                                                        <div className="flex flex-col space-y-4">
                                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                                <p className="text-[9px] font-mono text-indigo-200/60 break-all leading-relaxed">{link.url}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => copyToClipboard(link.url, link.id)}
                                                                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${copiedLink === link.id
                                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 translate-y-[-2px]'
                                                                    : 'bg-white text-[#1a2b3c] hover:bg-indigo-50 active:scale-95'
                                                                    }`}
                                                            >
                                                                {copiedLink === link.id ? 'PROTOCOCOLS COPIED' : 'COPY S2S ENDPOINT'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}
