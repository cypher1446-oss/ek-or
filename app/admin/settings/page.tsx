'use client'

import React, { useState } from 'react'
import { updateAdminCredentials } from './actions'

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateAdminCredentials(formData)

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Updated successfully' })
                // Reset form
                ; (e.target as HTMLFormElement).reset()
        } else {
            setMessage({ type: 'error', text: result.error || 'Update failed' })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-[#f8f9fb] px-4 py-8 md:px-10 font-inter apple-fade-in">
            {/* Header */}
            <div className="mb-12 apple-slide-up opacity-0">
                <h1 className="text-4xl font-black text-[#1a2b3c] tracking-tighter uppercase mb-1">
                    System Settings
                </h1>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Admin Credentials & Access Control
                    </span>
                    <div className="h-1 w-12 bg-indigo-600/20 rounded-full" />
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden apple-reveal opacity-0 stagger-1">
                    <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black text-[#1a2b3c] uppercase tracking-tighter">Security Profile</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Update your authentication data</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {message && (
                            <div className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">New Admin Email (ID)</label>
                                <input
                                    name="newEmail"
                                    type="email"
                                    placeholder="Enter new email"
                                    className="w-full bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-4 opacity-30 cursor-not-allowed">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Role Permissions</label>
                                <div className="w-full bg-gray-100 border-transparent rounded-2xl px-6 py-4 text-xs font-bold text-gray-400">
                                    SUPER_ADMIN (LOCKED)
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">New Password</label>
                                <input
                                    name="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Confirm New Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-4 text-sm font-bold text-gray-800 transition-all placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="pt-8 mt-12 border-t border-gray-50 bg-[#fbfbfc] -mx-10 px-10 py-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="max-w-sm text-center md:text-left">
                                    <h4 className="text-[11px] font-black text-[#1a2b3c] uppercase tracking-widest mb-1">Confirm Identity</h4>
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-tighter">Enter your CURRENT password and SECRET KEY to authorize these sensitive changes.</p>
                                </div>
                                <div className="flex flex-col gap-4 w-full md:w-auto">
                                    <input
                                        name="currentPassword"
                                        type="password"
                                        required
                                        placeholder="Current Password"
                                        className="bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-4 text-sm font-bold text-[#1a2b3c] transition-all min-w-[240px]"
                                    />
                                    <input
                                        name="secretKey"
                                        type="password"
                                        required
                                        placeholder="Secret Authorization Key"
                                        className="bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-4 text-sm font-bold text-[#1a2b3c] transition-all min-w-[240px]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-10 py-4 bg-[#1a2b3c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`}
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {loading ? 'PROCESSING...' : 'UPDATE SYSTEM ACCESS'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
