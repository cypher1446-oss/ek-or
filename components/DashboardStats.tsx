'use client'

import React from 'react'

interface CardProps {
    name: string
    value: string | number
    icon: React.ReactNode
    bg: string
    label: string
    gradient: string
    textColor: string
}

export default function DashboardStats({ stats }: { stats: any }) {
    if (!stats) return null;

    const cards: CardProps[] = [
        {
            name: 'Clicks Today',
            value: stats.clicks_today || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            bg: 'bg-blue-500/10',
            gradient: 'from-blue-600 to-indigo-600',
            textColor: 'text-blue-600',
            label: 'Total incoming entries'
        },
        {
            name: 'Completes Today',
            value: stats.completes_today || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: 'bg-emerald-500/10',
            gradient: 'from-emerald-500 to-teal-600',
            textColor: 'text-emerald-600',
            label: 'Successful surveys'
        },
        {
            name: 'Quotafull Today',
            value: stats.quotafull_today || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            bg: 'bg-purple-500/10',
            gradient: 'from-purple-500 to-indigo-700',
            textColor: 'text-purple-600',
            label: 'Capacity reached'
        },
        {
            name: 'Terminates Today',
            value: stats.terminates_today || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: 'bg-rose-500/10',
            gradient: 'from-rose-500 to-pink-600',
            textColor: 'text-rose-600',
            label: 'User dropouts'
        },
        {
            name: 'Conversion rate',
            value: stats.clicks_today > 0
                ? `${((stats.completes_today / stats.clicks_today) * 100).toFixed(1)}%`
                : '0%',
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            bg: 'bg-amber-500/10',
            gradient: 'from-amber-500 to-orange-600',
            textColor: 'text-amber-600',
            label: 'Global yield'
        },
        {
            name: 'Active Links',
            value: stats.active_projects || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
            bg: 'bg-cyan-500/10',
            gradient: 'from-cyan-500 to-blue-600',
            textColor: 'text-cyan-600',
            label: `Total: ${stats.total_projects || 0}`
        },
        {
            name: 'Blocked Fraud',
            value: stats.duplicates_today || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            bg: 'bg-slate-500/10',
            gradient: 'from-slate-600 to-slate-800',
            textColor: 'text-slate-600',
            label: 'Duplicate attempts'
        },
        {
            name: 'Bot Protection',
            value: stats.security_terminates_today || 0,
            icon: (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            bg: 'bg-indigo-500/10',
            gradient: 'from-indigo-600 to-blue-800',
            textColor: 'text-indigo-600',
            label: 'VPN/Proxy blocked'
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {cards.map((card, i) => (
                <div
                    key={card.name}
                    className={`relative bg-white p-5 shadow-sm rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default apple-reveal opacity-0`}
                    style={{ animationDelay: `${i * 60}ms` }}
                >
                    {/* Hover Gradient Background (Subtle) */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`rounded-2xl p-2.5 ${card.bg} ${card.textColor} group-hover:scale-110 transition-transform duration-300`}>
                                {card.icon}
                            </div>
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-200 group-hover:bg-current transition-colors duration-300" style={{ color: card.textColor.replace('text-', '') }} />
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 group-hover:text-gray-500 transition-colors">
                                {card.name}
                            </p>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter transition-all group-hover:scale-105 origin-left">
                                {card.value}
                            </h3>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                {card.label}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
