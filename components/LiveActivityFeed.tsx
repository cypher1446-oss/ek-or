'use client'

import React from 'react'

export default function LiveActivityFeed({ responses }: { responses: any[] }) {
    return (
        <div className="bg-white shadow-sm rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col h-[600px] transition-all duration-500 hover:shadow-xl group">
            <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center relative overflow-hidden">
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-125 transition-transform" />

                <div className="relative z-10">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Live Activity Tracker</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Global response streams</p>
                </div>

                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50 relative z-10">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">LIVE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <table className="min-w-full divide-y divide-gray-50 px-4">
                    <thead className="bg-white sticky top-0 z-20 shadow-sm shadow-gray-50">
                        <tr>
                            <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">User ID</th>
                            <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Project</th>
                            <th className="px-8 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50/50">
                        {responses.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-8 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                                        <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Signals...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            responses.slice(0, 20).map((r, i) => (
                                <tr key={r.id} className="hover:bg-indigo-50/30 transition-all duration-300 animate-in fade-in slide-in-from-right-4 group/row" style={{ animationDelay: `${i * 50}ms` }}>
                                    <td className="px-8 py-4 whitespace-nowrap">
                                        <div className="text-[11px] font-black text-gray-500 font-mono tracking-tighter truncate max-w-[90px] group-hover/row:text-gray-900 transition-colors" title={r.uid || 'N/A'}>
                                            {r.uid || 'Anonymous'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap text-center">
                                        <span className="text-[11px] font-black text-gray-900 px-2 py-1 bg-gray-100 rounded-lg group-hover/row:bg-white transition-all shadow-sm group-hover/row:shadow-md">
                                            {r.project_code}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 whitespace-nowrap text-right">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${r.status === 'started' ? 'bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-200' :
                                                r.status === 'complete' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200' :
                                                    r.status === 'terminate' ? 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200' :
                                                        r.status === 'quota_full' ? 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200' :
                                                            'bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-200'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 text-center relative z-10">
                <a href="/admin/responses" className="group/link inline-flex items-center text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">
                    View Full Intelligence Logs
                    <svg className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
