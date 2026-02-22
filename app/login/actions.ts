'use server'

import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-server'
import bcrypt from 'bcrypt'

const DEV_BYPASS_EMAIL = 'dev@localhost'
const DEV_BYPASS_PASSWORD = 'dev'

function setAdminSessionCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
    cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })
}

export async function loginAction(formData: FormData) {
    const email = (formData.get('email') as string)?.trim() ?? ''
    const password = formData.get('password') as string

    // Dev bypass when Supabase is not configured (local development only)
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (email === DEV_BYPASS_EMAIL && password === DEV_BYPASS_PASSWORD) {
            const cookieStore = await cookies()
            setAdminSessionCookie(cookieStore)
            return { success: true }
        }
    }

    const supabase = await createAdminClient()
    if (!supabase) {
        return {
            error: 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, or sign in with dev@localhost / dev in development.'
        }
    }

    try {
        const { data: admin, error: dbError } = await supabase
            .from('admins')
            .select('password_hash')
            .eq('email', email)
            .single()

        if (dbError || !admin) {
            return { error: 'Invalid credentials' }
        }

        const passwordMatch = await bcrypt.compare(password, admin.password_hash)
        if (passwordMatch) {
            const cookieStore = await cookies()
            setAdminSessionCookie(cookieStore)
            return { success: true }
        }
    } catch (err) {
        console.error('Login error:', err)
        return { error: 'Authentication service unavailable' }
    }

    return { error: 'Invalid credentials' }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    return { success: true }
}
