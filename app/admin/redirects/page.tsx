import { dashboardService } from '@/lib/dashboardService'
import RedirectCenter from '@/components/RedirectCenter'
import GlobalRedirects from '@/components/GlobalRedirects'

export const dynamic = 'force-dynamic'

export default async function AdminRedirectsPage() {
    const projects = await dashboardService.getProjects()

    return (
        <div className="min-h-screen bg-[#f8f9fb] px-4 py-8 md:px-10 font-inter apple-fade-in">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6 apple-slide-up opacity-0">
                <div>
                    <h1 className="text-4xl font-black text-[#1a2b3c] tracking-tighter uppercase mb-1">
                        Redirect Intelligence
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Global Protocol Management & Routing
                        </span>
                        <div className="h-1 w-12 bg-emerald-600/20 rounded-full" />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Routing Hub Active</span>
                    </div>
                </div>
            </div>

            {/* Master System Endpoints Section */}
            <div className="apple-reveal opacity-0 stagger-1">
                <GlobalRedirects />
            </div>

            {/* Project Specific Routing */}
            <div className="mt-16 apple-reveal opacity-0 stagger-2">
                <div className="bg-white rounded-[3rem] p-4 md:p-10 shadow-sm border border-slate-100 overflow-hidden relative">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                    <RedirectCenter projects={projects} />
                </div>
            </div>
        </div>
    )
}
