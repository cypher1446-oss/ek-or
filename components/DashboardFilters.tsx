'use client'

import React from 'react'
import { Client } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DashboardFilters({ clients }: { clients: Client[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentClientId = searchParams.get('clientId') || 'all'

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value === 'all') {
            params.delete('clientId')
        } else {
            params.set('clientId', e.target.value)
        }
        router.push(`/admin/dashboard?${params.toString()}`)
    }

    return (
        <div className="bg-white/70 backdrop-blur-xl p-3 rounded-[1.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-3 items-center ring-1 ring-slate-200/50">
            <div className="w-full sm:w-72 relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-600 transition-colors">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <select
                    id="client-filter"
                    value={currentClientId}
                    onChange={handleClientChange}
                    className="block w-full pl-11 pr-10 py-3 text-xs font-black uppercase tracking-widest bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-2xl transition-all cursor-pointer appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                >
                    <option value="all">All Enterprise Clients</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-full sm:w-72 relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-40">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.105M4.5 16.5L5 15a1.5 1.5 0 011.5-1.5h2L13 20" />
                    </svg>
                </div>
                <select
                    disabled
                    className="block w-full pl-11 pr-10 py-3 text-xs font-black uppercase tracking-widest bg-gray-100/50 text-gray-400 border-transparent rounded-2xl cursor-not-allowed appearance-none"
                >
                    <option>Global Markets (All)</option>
                </select>
            </div>

            <div className="flex-1 flex justify-end w-full px-4">
                <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filters Sycned</span>
                </div>
            </div>
        </div>
    )
}
