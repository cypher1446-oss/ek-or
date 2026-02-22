'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { Project, Client } from '@/lib/types'
import { dashboardService } from '@/lib/dashboardService'

const notConfiguredError = { message: 'Database not configured' }

export async function createClientAction(name: string): Promise<{ data: Client | null; error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { data: null, error: notConfiguredError }
    const { data, error } = await supabase
        .from('clients')
        .insert([{ name }])
        .select()
        .single()
    return { data, error }
}

export async function flushResponsesAction(): Promise<{ success: boolean; error: any }> {
    const { error } = await dashboardService.flushResponses()
    if (error) return { success: false, error }
    return { success: true, error: null }
}

export async function deleteClientAction(id: string): Promise<{ error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { error: notConfiguredError }
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
    return { error }
}

export async function createProjectAction(formData: any, countryUrls: any[] = []): Promise<{ data: Project | null; error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { data: null, error: notConfiguredError }
    const { data, error } = await supabase
        .from('projects')
        .insert([{
            ...formData,
            project_name: formData.project_name || formData.project_code, // Ensure project_name is never null
            is_multi_country: countryUrls.length > 0,
            country_urls: countryUrls,
            status: 'active'
        }])
        .select()
        .single()
    return { data, error }
}

export async function updateProjectStatusAction(id: string, status: 'active' | 'paused'): Promise<{ error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { error: notConfiguredError }
    const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', id)
    return { error }
}

export async function updateProjectAction(id: string, data: any): Promise<{ error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { error: notConfiguredError }
    const { error } = await supabase
        .from('projects')
        .update({
            ...data,
            project_name: data.project_name || data.project_code, // Ensure project_name is never null if provided
            // Ensure status isn't accidentally overwritten if not provided
            // and mapping is_multi_country based on links presence if passed
        })
        .eq('id', id)
    return { error }
}

export async function updateCountryActiveAction(
    projectId: string,
    countryCode: string,
    active: boolean
): Promise<{ error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { error: notConfiguredError }

    // Fetch current country_urls
    const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('country_urls')
        .eq('id', projectId)
        .single()

    if (fetchError || !project) return { error: fetchError || 'Project not found' }

    const updatedUrls = (project.country_urls as any[]).map((c: any) =>
        c.country_code === countryCode ? { ...c, active } : c
    )

    const { error } = await supabase
        .from('projects')
        .update({ country_urls: updatedUrls })
        .eq('id', projectId)

    return { error }
}

export async function deleteProjectAction(id: string): Promise<{ error: any }> {
    const supabase = await createAdminClient()
    if (!supabase) return { error: { message: 'Database not configured' } }

    console.log(`[deleteProjectAction] Deleting project id=${id}`)

    const { error } = await supabase
        .from('projects')
        .update({
            deleted_at: new Date().toISOString(),
            status: 'deleted'
        })
        .eq('id', id)

    if (error) {
        console.error('[deleteProjectAction] Error:', error)
        // If it's a constraint violation for 'deleted' status, try falling back to 'paused'
        if (error.code === '23514') {
            const { error: fallbackError } = await supabase
                .from('projects')
                .update({
                    deleted_at: new Date().toISOString(),
                    status: 'paused'
                })
                .eq('id', id)
            if (fallbackError) return { error: fallbackError }
        } else {
            return { error }
        }
    }

    return { error: null }
}
