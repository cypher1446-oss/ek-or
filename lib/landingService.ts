import { NextRequest } from "next/server";
import { createAdminClient } from "./supabase-server";
import { getClientIp } from "./getClientIp";

export async function getLandingDataByClickId(clickid: string) {
    const supabase = await createAdminClient()
    if (!supabase) return null

    const { data: response } = await supabase
        .from('responses')
        .select('*')
        .eq('clickid', clickid)
        .maybeSingle()

    return response
}

/**
 * Simple redirect-based status updater.
 * Finds the exact record by clickid (or latest in_progress/started record for a given uid).
 * Safety rules:
 *   1. Never inserts a new row
 *   2. Never overwrites a status that is already finalized
 *   3. Returns null if no record found
 */
export async function updateResponseStatus(
    projectCode: string,
    userUid: string,
    newStatus: string,
    clickid?: string | null,
    lastLandingPage?: string | null
): Promise<{ id: string; status: string; uid: string; ip: string } | null> {
    const supabase = await createAdminClient()
    if (!supabase) return null

    let existing: any = null

    // STEP 1 — Find the record by clickid first (Case-Insensitive)
    if (clickid) {
        const cleanCid = clickid.trim()
        const { data } = await supabase
            .from('responses')
            .select('id, status, uid, ip, project_code')
            .ilike('clickid', cleanCid)
            .in('status', ['in_progress', 'started', 'click'])
            .maybeSingle()
        existing = data
    }

    // Fallback: Try with project_code + uid (Case-Insensitive UID)
    if (!existing && projectCode) {
        const cleanUid = userUid.trim()
        const { data } = await supabase
            .from('responses')
            .select('id, status, uid, ip, project_code')
            .ilike('uid', cleanUid)
            .eq('project_code', projectCode)
            .in('status', ['in_progress', 'started', 'click'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        existing = data
    }

    // Fallback: try uid-only (Case-Insensitive)
    if (!existing) {
        const cleanUid = userUid.trim()
        const { data } = await supabase
            .from('responses')
            .select('id, status, uid, ip, project_code')
            .ilike('uid', cleanUid)
            .in('status', ['in_progress', 'started'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        existing = data
    }

    if (!existing) {
        console.warn(`[updateResponseStatus] No record found for pid=${projectCode}, uid=${userUid}, clickid=${clickid}`);
        return null;
    }

    // Optional attributes to update
    const updatePayload: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
    }
    if (clickid) updatePayload.hash = clickid
    if (lastLandingPage) updatePayload.last_landing_page = lastLandingPage
    if (newStatus === 'complete') updatePayload.completed_at = new Date().toISOString()

    // STEP 2 — Update by specific id
    console.log(`[updateResponseStatus] Attempting update for id=${existing.id} to ${newStatus}`);

    const { error, data } = await supabase
        .from('responses')
        .update(updatePayload)
        .eq('id', existing.id)
        .in('status', ['in_progress', 'started', 'click'])
        .select()
        .single()

    if (error) {
        console.error(`[updateResponseStatus] Update failed for id=${existing.id}:`, error);
        return null;
    }

    if (!data) {
        console.warn(`[updateResponseStatus] Update affected 0 rows for id=${existing.id}. Status might have changed.`);
        return null;
    }

    console.log(`[updateResponseStatus] Successfully updated id=${existing.id} to ${newStatus}`);
    return data;
}

export async function getLandingPageData(
    params: { [key: string]: string | string[] | undefined },
    request: NextRequest
) {
    const cookieUid = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('last_uid='))?.split('=')[1]
    const cookiePid = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('last_pid='))?.split('=')[1]

    // Accept both pid and code — pid always wins
    const code = (params.pid as string) || (params.code as string) || cookiePid || "N/A";
    const uid = (params.uid as string) || cookieUid || "N/A";
    const clickid = (params.clickid as string) || (params.cid as string) || null;
    const ip = (params.ip as string) || getClientIp(request);

    const result = {
        pid: code,
        uid,
        clickid,
        ip,
        response: null as any,
        project: null as any
    };

    const supabase = await createAdminClient()
    if (!supabase) return result

    if (clickid) {
        const { data: resp } = await supabase
            .from('responses')
            .select('*')
            .eq('clickid', clickid)
            .maybeSingle()

        if (resp) {
            result.response = resp
            result.pid = resp.project_code || code
            result.uid = resp.uid || resp.user_uid || uid
        }
    }

    if (result.pid && result.pid !== "N/A") {
        const { data: proj } = await supabase
            .from('projects')
            .select('*')
            .eq('project_code', result.pid)
            .maybeSingle()

        if (proj) result.project = proj
    }

    return result;
}
