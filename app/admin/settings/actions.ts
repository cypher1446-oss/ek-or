'use server'

import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase-server'
import bcrypt from 'bcrypt'

const MASTER_KEY = process.env.ADMIN_MASTER_KEY || 'super-secret-key-change-me'

export async function updateAdminCredentials(formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string
    const secretKey = formData.get('secretKey') as string
    const newEmail = (formData.get('newEmail') as string)?.trim()
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword) {
        return { success: false, error: 'Current password is required for security verification.' }
    }

    if (secretKey !== MASTER_KEY) {
        return { success: false, error: 'Invalid Secret Authorization Key.' }
    }

    if (newPassword && newPassword !== confirmPassword) {
        return { success: false, error: 'New password and confirmation do not match.' }
    }

    const supabase = await createAdminClient()
    if (!supabase) {
        return { success: false, error: 'Database service unavailable.' }
    }

    try {
        // Since we don't store email in cookies, and we assume single admin setup:
        // Let's get the current admin. In this system's context, there's usually only one.
        // If there were multiple, we'd need a more robust session strategy.
        const { data: admins, error: fetchError } = await supabase
            .from('admins')
            .select('*')
            .limit(1)

        if (fetchError || !admins || admins.length === 0) {
            return { success: false, error: 'Admin account not found.' }
        }

        const admin = admins[0]

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, admin.password_hash)
        if (!passwordMatch) {
            return { success: false, error: 'Current password is incorrect.' }
        }

        const updates: any = {}
        if (newEmail && newEmail !== admin.email) {
            updates.email = newEmail
        }
        if (newPassword) {
            updates.password_hash = await bcrypt.hash(newPassword, 10)
        }

        if (Object.keys(updates).length === 0) {
            return { success: false, error: 'No changes provided.' }
        }

        const { error: updateError } = await supabase
            .from('admins')
            .update(updates)
            .eq('id', admin.id)

        if (updateError) throw updateError

        return { success: true, message: 'Admin credentials updated successfully.' }
    } catch (err) {
        console.error('Settings update error:', err)
        return { success: false, error: 'Failed to update credentials.' }
    }
}
