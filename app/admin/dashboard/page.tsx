import { Suspense } from 'react'
import { dashboardService } from '@/lib/dashboardService'
import DashboardStats from '@/components/DashboardStats'
import TrafficChart from '@/components/TrafficChart'
import DashboardFilters from '@/components/DashboardFilters'
import RedirectCenter from '@/components/RedirectCenter'
import LiveActivityFeed from '@/components/LiveActivityFeed'
import RedirectShortcut from '@/components/RedirectShortcut'
import AutoRefresh from '@/components/AutoRefresh'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ clientId?: string }>
}) {
    const { clientId } = await searchParams
    const [kpis, healthMetrics, responses, clients, projects] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getProjectHealthMetrics(),
        dashboardService.getResponses(),
        dashboardService.getClients(),
        dashboardService.getProjects()
    ])

    return (
        <div className="min-h-screen bg-[#f8f9fb] px-4 py-8 md:px-10 font-inter selection:bg-indigo-100 selection:text-indigo-900">
            <AutoRefresh interval={5000} />

            {/* Main Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 apple-slide-up opacity-0">
                <div>
                    <h1 className="text-4xl font-black text-[#1a2b3c] tracking-tighter uppercase mb-1">
                        Intelligence Command
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Global Infrastructure Monitoring
                        </span>
                        <div className="h-1 w-12 bg-indigo-600/20 rounded-full" />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* System Status Pill */}
                    <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-emerald-100/50">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Operational</span>
                    </div>

                    <a
                        href="/admin/redirects"
                        className="group flex items-center space-x-3 bg-[#1a2b3c] hover:bg-indigo-600 px-6 py-2.5 rounded-2xl shadow-lg shadow-indigo-900/10 border border-white/5 transition-all duration-300 active:scale-95"
                    >
                        <svg className="w-4 h-4 text-indigo-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Redirect Intelligence</span>
                    </a>

                    {/* Refresh Indicator */}
                    <div className="hidden sm:flex text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100/50 px-4 py-2.5 rounded-2xl border border-gray-100">
                        Auto-Sync: 5s
                    </div>
                </div>
            </div>

            {/* KPI Section */}
            <div className="mb-12 apple-reveal opacity-0 stagger-1">
                <DashboardStats stats={kpis} />
            </div>

            {/* Controls Section */}
            <div className="mb-12 apple-reveal opacity-0 stagger-2">
                <Suspense fallback={<div className="h-16 bg-white/50 backdrop-blur-md animate-pulse rounded-[2rem]" />}>
                    <DashboardFilters clients={clients} />
                </Suspense>
            </div>

            {/* Main Visual Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

                {/* Primary Intelligence Area */}
                <div className="lg:col-span-3 space-y-8 apple-reveal opacity-0 stagger-3">
                    <TrafficChart />

                    {/* Project Performance Table */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black text-[#1a2b3c] uppercase tracking-tighter">Project Performance</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time health evaluation</p>
                            </div>
                            <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full tracking-widest cursor-default">
                                TOP 5 ACTIVE
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-[#1a2b3c]/[0.02]">
                                    <tr>
                                        <th className="px-10 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Project Mapping</th>
                                        <th className="px-10 py-5 text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Entries</th>
                                        <th className="px-10 py-5 text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Success</th>
                                        <th className="px-10 py-5 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Yield Index</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50/50">
                                    {healthMetrics.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-20 text-center">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                    </svg>
                                                    <span className="text-xs font-black uppercase tracking-widest">Scanning for data...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        healthMetrics.slice(0, 5).map((m: any, i: number) => (
                                            <tr key={m.project_id} className="hover:bg-indigo-50/30 transition-all duration-300 group/row">
                                                <td className="px-10 py-6 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-gray-900 tracking-tight group-hover/row:translate-x-1 transition-transform inline-block">
                                                            {m.project_code}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {m.project_id.slice(0, 8)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 whitespace-nowrap text-center">
                                                    <span className="text-sm font-mono font-black text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl group-hover/row:bg-white transition-all">
                                                        {m.clicks_today}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 whitespace-nowrap text-center">
                                                    <span className="text-sm font-mono font-black text-emerald-600">
                                                        {m.completes_today}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-6 whitespace-nowrap">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="flex-1 w-32 bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner p-px">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1500 ease-out shadow-sm ${m.conversion_rate > 15 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                                                    m.conversion_rate > 5 ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' :
                                                                        'bg-gradient-to-r from-rose-400 to-rose-600'
                                                                    }`}
                                                                style={{ width: `${Math.min(100, m.conversion_rate)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-black text-gray-900 w-8">{Math.round(m.conversion_rate)}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="space-y-8 apple-reveal opacity-0 stagger-4">
                    <RedirectShortcut />
                    <LiveActivityFeed responses={responses} />
                </div>
            </div>

            {/* Bottom Routing Panel */}
            <div id="redirect-center" className="pt-12 scroll-mt-6 apple-reveal opacity-0 stagger-5">
                <RedirectCenter projects={projects} />
            </div>
        </div>
    )
}
