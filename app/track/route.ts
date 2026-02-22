import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { getClientIp } from '@/lib/getClientIp'

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const ip = getClientIp(request);
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code') || searchParams.get('pid')
    const rawUid = searchParams.get('uid')
    const clickid = searchParams.get('clickid') || searchParams.get('cid')

    // 1. UID Validation & Normalization
    let validatedUid = (rawUid && rawUid.trim() !== '' && rawUid !== '[UID]' && rawUid !== 'N/A')
        ? rawUid
        : crypto.randomUUID()

    if (!code) {
        const errorUrl = new URL('/paused', request.url)
        errorUrl.searchParams.set('title', 'INVALID LINK')
        errorUrl.searchParams.set('desc', 'The project code is missing or invalid.')
        errorUrl.searchParams.set('status', 'error')
        return NextResponse.redirect(errorUrl)
    }

    const supabase = await createAdminClient()
    if (!supabase) {
        const fatalUrl = new URL('/paused', request.url)
        fatalUrl.searchParams.set('title', 'SYSTEM OFFLINE')
        fatalUrl.searchParams.set('desc', 'Database is not configured. Please try again later.')
        return NextResponse.redirect(fatalUrl)
    }

    try {
        // 2. Fetch project details
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('project_code', code)
            .maybeSingle()

        // 3. VALIDATION (Rule: Only valid project codes can create records)
        if (!project) {
            // If project not found, redirect to default target or paused page
            const testTarget = searchParams.get('target') || 'https://www.google.com'
            if (searchParams.has('target')) return NextResponse.redirect(new URL(testTarget))

            const errorUrl = new URL('/paused', request.url)
            errorUrl.searchParams.set('title', 'PROJECT NOT FOUND')
            errorUrl.searchParams.set('desc', 'The project code does not exist in our system.')
            return NextResponse.redirect(errorUrl)
        }

        // Project status check
        if (project.status === 'paused') {
            const pauseUrl = new URL('/paused', request.url)
            pauseUrl.searchParams.set('pid', code)
            pauseUrl.searchParams.set('ip', ip)
            pauseUrl.searchParams.set('title', 'PROJECT PAUSED')
            pauseUrl.searchParams.set('desc', 'This project is currently paused by admin.')
            return NextResponse.redirect(pauseUrl)
        }

        const userAgent = request.headers.get('user-agent') || 'Unknown'
        const countryParam = searchParams.get('country') || searchParams.get('c')
        const sessionToken = crypto.randomUUID() // Generate secure session token

        // --- Device Type Detection ---
        let deviceType = 'Desktop'
        const ua = userAgent.toLowerCase()
        if (ua.includes('tablet') || ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) {
            deviceType = 'Tablet'
        } else if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
            deviceType = 'Mobile'
        }

        // --- Geo IP detection & Mismatch Check ---
        let geoCountry = 'Unknown'
        if (ip !== '127.0.0.1' && ip !== '::1') {
            try {
                const vercelCountry = request.headers.get('x-vercel-ip-country')
                if (vercelCountry) {
                    geoCountry = vercelCountry
                } else {
                    const geoRes = await fetch(`http://ip-api.com/json/${ip}`)
                    const geoData = await geoRes.json()
                    if (geoData.status === 'success') {
                        geoCountry = geoData.countryCode
                    }
                }

                // Rule: GeoIP Mismatch
                if (countryParam && countryParam !== geoCountry) {
                    console.log(`Geo Mismatch: Param=${countryParam}, Geo=${geoCountry}`);
                    const mismatchUrl = new URL('/paused', request.url);
                    mismatchUrl.searchParams.set('pid', code);
                    mismatchUrl.searchParams.set('title', 'GEO MISMATCH');
                    mismatchUrl.searchParams.set('desc', `Your current location (${geoCountry}) does not match the target country (${countryParam}).`);
                    return NextResponse.redirect(mismatchUrl);
                }
            } catch (err) {
                console.error('Geo IP detection failed:', err)
            }
        }

        // --- IP Abuse Check (Throttle: > 3 per min per project) ---
        if (ip !== '127.0.0.1' && ip !== '::1') {
            const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
            const { count: ipCount } = await supabase
                .from('responses')
                .select('*', { count: 'exact', head: true })
                .eq('ip', ip)
                .eq('project_id', project.id)
                .gt('created_at', oneMinuteAgo);

            if (ipCount && ipCount >= 3) {
                return NextResponse.redirect(new URL('/security-terminate', request.url));
            }
        }

        // --- Duplicate Check (Same UID + Project) ---
        // Requirement: "If a record with same UID and project_id already exists... redirect to /duplicate-string"
        const { data: existingResponses, error: dupeError } = await supabase
            .from('responses')
            .select('id')
            .eq('uid', validatedUid)
            .eq('project_id', project.id)
            .limit(1);

        if (dupeError) {
            console.error('Duplicate check error:', dupeError);
        }

        if (existingResponses && existingResponses.length > 0) {
            return NextResponse.redirect(new URL('/duplicate-string', request.url));
        }

        // Check for country-specific active toggle
        if (project.is_multi_country && countryParam) {
            const countryConfig = (project.country_urls as any[] || []).find(c => c.country_code === countryParam)
            if (countryConfig && countryConfig.active === false) {
                const pauseUrl = new URL('/paused', request.url)
                pauseUrl.searchParams.set('pid', code)
                pauseUrl.searchParams.set('country', countryParam)
                pauseUrl.searchParams.set('ip', ip)
                pauseUrl.searchParams.set('title', 'COUNTRY UNAVAILABLE')
                pauseUrl.searchParams.set('desc', `Target country ${countryParam} is currently not active.`)
                return NextResponse.redirect(pauseUrl)
            }
        }

        // 4. Generate Supplier Token (if prefix exists)
        let supplierToken = validatedUid
        if (project.token_prefix) {
            const { data: tokenData, error: tokenError } = await supabase
                .rpc('generate_supplier_token', { project_id_param: project.id })
            if (!tokenError && tokenData) supplierToken = tokenData
        }

        // 5. Initial Response Entry (status: in_progress)
        // Strictly following user spec for columns
        const { error: insertError } = await supabase
            .from('responses')
            .insert([{
                project_id: project.id,
                project_code: project.project_code,
                project_name: project.project_name || project.project_code,
                uid: validatedUid,
                supplier_token: supplierToken || null,
                session_token: sessionToken,
                status: 'in_progress',
                started_at: new Date().toISOString(),
                ip: ip,
                user_agent: userAgent,
                device_type: deviceType,
                country_code: countryParam || geoCountry,
                clickid: validatedUid, // User Requirement: clickid MUST be the tracking UID
                hash: validatedUid,
                last_landing_page: 'track_entry',
                reason: 'normal_flow'
            }])

        if (insertError) {
            console.error('CRITICAL: Tracking session initialization failed:', insertError)
            // Still show a friendly error instead of JSON if it's a browser hit
            const fatalUrl = new URL('/paused', request.url)
            fatalUrl.searchParams.set('title', 'TRACKING ERROR')
            fatalUrl.searchParams.set('desc', 'Failed to initialize tracking session. Please try again or contact support.')
            return NextResponse.redirect(fatalUrl)
        }

        // 6. Pre-Screener Redirection
        if (project.has_prescreener) {
            return NextResponse.redirect(new URL(`/prescreener?session_token=${sessionToken}`, request.url))
        }

        // 7. Final Redirection (Direct to Survey)
        let finalUrl = project.base_url
        const countryParamFinal = searchParams.get('country') || searchParams.get('c')

        if (project.is_multi_country) {
            const countryConfig = (project.country_urls as any[] || []).find(c => c.country_code === countryParamFinal && c.active !== false)
            if (countryConfig) {
                finalUrl = countryConfig.target_url
            }
        }

        const tokenToUse = supplierToken || validatedUid

        // --- HMAC SIGNATURE GENERATION ---
        let signature = '';
        if (process.env.CALLBACK_SECRET && tokenToUse) {
            const crypto = await import('crypto');
            signature = crypto
                .createHmac("sha256", process.env.CALLBACK_SECRET)
                .update(tokenToUse)
                .digest("hex");
        }

        if (tokenToUse) {
            const placeholders = ['[UID]', '[identifier]', '{uid}', '{UID}', '{ResID}', '{rid}', '{ID}', '[ID]', '{id}']
            placeholders.forEach(p => {
                if (finalUrl.includes(p)) {
                    finalUrl = finalUrl.replaceAll(p, encodeURIComponent(tokenToUse))
                }
            })

            if (!finalUrl.includes(encodeURIComponent(tokenToUse)) && !finalUrl.includes(tokenToUse)) {
                const urlObj = new URL(finalUrl)
                urlObj.searchParams.set('uid', tokenToUse)
                finalUrl = urlObj.toString()
            }
        }

        // Append pid and session_token to client URL
        const finalUrlObj = new URL(finalUrl)
        finalUrlObj.searchParams.set('pid', project.project_code)
        finalUrlObj.searchParams.set('session_token', sessionToken)

        // Append signature if generated
        if (signature) {
            finalUrlObj.searchParams.set('sig', signature)
        }

        const response = NextResponse.redirect(new URL(finalUrlObj.toString()))

        // Set cookies for session recovery (expires in 24 hours)
        response.cookies.set('last_uid', validatedUid, { maxAge: 86400, path: '/' })
        response.cookies.set('last_sid', sessionToken, { maxAge: 86400, path: '/' })
        response.cookies.set('last_pid', project.project_code, { maxAge: 86400, path: '/' })

        return response

    } catch (error) {
        console.error('Track route exception:', error)
        const fatalUrl = new URL('/paused', request.url)
        fatalUrl.searchParams.set('title', 'SYSTEM ERROR')
        fatalUrl.searchParams.set('desc', 'An unexpected error occurred while starting your session.')
        return NextResponse.redirect(fatalUrl)
    }
}
