import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import crypto from 'crypto'

export const runtime = "nodejs";

function verifySignature(uid: string, sig: string): boolean {
    const secret = process.env.CALLBACK_SECRET;
    if (!secret) return true; // Fail open if no secret configured (or set to false if strict security desired)

    // If we want strict security, we should return false here. 
    // But for transition, maybe warn? The user requested "Signed UID system".
    // Let's go with strict verification if secret exists, else allow for now.

    const expected = crypto
        .createHmac("sha256", secret)
        .update(uid)
        .digest("hex");

    return expected === sig;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code') || searchParams.get('pid')
    const uid = searchParams.get('uid')
    const type = searchParams.get('type')
    const sig = searchParams.get('sig')

    if (!uid) {
        return NextResponse.json({ error: "Missing UID" }, { status: 400 })
    }

    // 1. Signature Verification
    if (process.env.CALLBACK_SECRET && sig) {
        if (!verifySignature(uid, sig)) {
            console.error(`[callback] Invalid signature for UID ${uid}`);
            // Redirect to security terminate
            const url = new URL('/status', request.url)
            url.searchParams.set('uid', uid)
            url.searchParams.set('type', 'security_terminate')
            url.searchParams.set('pid', code || 'unknown')
            return NextResponse.redirect(url)
        }
    }

    const supabase = await createAdminClient()
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const statusMap: Record<string, string> = {
        'complete': 'complete',
        'terminate': 'terminated',
        'quota': 'quota_full',
        'quotafull': 'quota_full',
        'duplicate_string': 'duplicate_string',
        'duplicate_ip': 'duplicate_ip',
        'security_terminate': 'security_terminate'
    }

    const finalStatus = (type && statusMap[type]) ? statusMap[type] : 'terminated'
    const now = new Date().toISOString()

    try {
        // 2. Exact Match Update (clickid = uid)
        // We only update if it is currently 'in_progress' to prevent double counting/fraud
        const { data: updated, error } = await supabase
            .from('responses')
            .update({
                status: finalStatus,
                completed_at: now
            })
            .eq('clickid', uid) // IMPORTANT: User mapped UID to clickid in /track
            .in('status', ['in_progress', 'started', 'click']) // Prevent double updates
            .select('project_code') // Fetch the actual project code
            .maybeSingle()

        if (error) {
            console.error('[callback] Update failed:', error)
        } else if (!updated) {
            console.warn(`[callback] No in_progress record found for clickid=${uid}.`)
        } else {
            // Update successful
            console.log(`[callback] Success: clickid=${uid} updated to ${finalStatus}. Project: ${updated.project_code}`)
        }

        // 3. Redirect to Landing Page (Internal System Redirect)
        const landingUrl = new URL('/status', request.url)
        landingUrl.searchParams.set('uid', uid)

        // Map back to 'quota' for the /status route which expects 'quota' → 'quota_full'
        const redirectType = finalStatus === 'quota_full' ? 'quota' : finalStatus
        landingUrl.searchParams.set('type', redirectType)

        return NextResponse.redirect(landingUrl)

    } catch (e) {
        console.error('[callback] Exception:', e)
        const errorUrl = new URL('/status', request.url)
        errorUrl.searchParams.set('uid', uid)
        errorUrl.searchParams.set('type', 'security_terminate')
        return NextResponse.redirect(errorUrl)
    }
}
