export type ProjectAnalytics = {
    project_id: string
    project_name: string
    client_name: string
    status: 'active' | 'paused'
    clicks: number
    completes: number
    terminates: number
    quota_full: number
    conversion_rate: number
}

export type KPIStats = {
    totalClicks: number
    totalCompletes: number
    avgConversion: number
    activeProjects: number
}

export type Client = {
    id: string
    name: string
    created_at: string
}

export type Project = {
    id: string
    client_id: string
    project_name: string
    project_code: string
    country: string
    base_url: string
    token_prefix?: string | null
    token_counter?: number | null
    complete_target?: number | null
    status: 'active' | 'paused'
    has_prescreener: boolean
    prescreener_url?: string | null
    is_multi_country: boolean
    country_urls: { country_code: string; target_url: string; active: boolean }[]
    created_at: string
}
