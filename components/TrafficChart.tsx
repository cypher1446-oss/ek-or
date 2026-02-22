'use client'

import React from 'react'

export default function TrafficChart() {
    // Simple mock data for the trend line
    const data = [30, 42, 38, 65, 52, 78, 62, 95, 82, 110, 92, 125, 115, 140]
    const max = Math.max(...data)
    const width = 600
    const height = 180

    // Calculating points for a smooth cubic bezier or just smoother polyline
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - (val / max) * height
        return `${x},${y}`
    }).join(' ')

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -mr-32 -mt-32 blur-3xl" />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Real-time Traffic Overlook</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Activity over the last 12 hours</p>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-2xl flex items-center space-x-3">
                    <div className="flex -space-x-1.5 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-100" />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter cursor-default">
                        824 Live Users
                    </span>
                </div>
            </div>

            <div className="mt-2 h-72 w-full relative z-10">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-indigo-500 overflow-visible preserve-3d">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Filling the area under the curve */}
                    <path
                        d={`M 0,${height} ${points} V ${height} Z`}
                        fill="url(#chartGradient)"
                    />

                    {/* The smooth line */}
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                        filter="url(#glow)"
                        className="transition-all duration-1000 ease-in-out"
                    />

                    {/* Data Points on Hover */}
                    {data.map((val, i) => {
                        const x = (i / (data.length - 1)) * width
                        const y = height - (val / max) * height
                        return (
                            <g key={i} className="group/dot">
                                <circle
                                    cx={x} cy={y} r="8"
                                    className="fill-indigo-500/0 hover:fill-indigo-500/10 cursor-pointer transition-colors"
                                />
                                <circle
                                    cx={x} cy={y} r="3.5"
                                    className="fill-white stroke-indigo-500 stroke-[3px] shadow-lg group-hover/dot:r-5 transition-all"
                                />
                            </g>
                        )
                    })}
                </svg>

                {/* Grid Lines (Subtle) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-current" />)}
                </div>

                <div className="flex justify-between w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                    <span>08:00 AM</span>
                    <span>12:00 PM</span>
                    <span>04:00 PM</span>
                    <span>08:00 PM</span>
                    <span>NOW</span>
                </div>
            </div>

            {/* Micro-interaction Overlay */}
            <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-3 py-1.5 rounded-full tracking-widest shadow-sm">
                    Interactive Mode Active
                </span>
            </div>
        </div>
    )
}
