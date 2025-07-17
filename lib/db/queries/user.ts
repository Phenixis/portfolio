"use server"

import {
    eq,
} from "drizzle-orm"
import { db } from "../drizzle"
import * as Schema from "../schema"
import { hashPassword } from "@/lib/utils/password"
import { getClientSession } from "@/lib/auth/session"
import { revalidateTag } from "next/cache"
import { DarkModeCookie } from "@/lib/flags"

/**
 * Generates a unique 8-digit number ID for users
 * @returns A promise that resolves to a unique 8-digit number
 */
export async function generateUniqueUserId(): Promise<string> {
    while (true) {
        // Generate a random 8-digit number
        let id = (Math.floor(10000000 + Math.random() * 90000000)).toString()

        while (id.length < 8) {
            id = "0" + id
        }

        // Check if the ID already exists
        const existingUser = await db.select({
            id: Schema.user.id
        })
            .from(Schema.user)
            .where(eq(Schema.user.id, id));

        if (!existingUser || existingUser.length === 0) {
            return id
        }
    }
}

/**
 * Generates a random 8-digit number for a user's password
 * @returns A random 8-digit number
 */
export async function generateUserPassword(): Promise<string> {
    // Generate a random 8-digit number
    let password = (Math.floor(10000000 + Math.random() * 90000000)).toString()

    while (password.length < 8) {
        password = "0" + password
    }

    return password
}

/**
 * Generates an API key for users
 * @returns A promise that resolves to a unique API key starting with "md_"
 */
export async function generateUniqueApiKey(): Promise<string> {
    while (true) {
        // Generate a random alphanumeric string of length 20
        const randomPart = Math.random().toString(36).substring(2, 12) +
            Math.random().toString(36).substring(2, 12)

        const apiKey = `md_${randomPart}`

        const existingUser = await db.select({
            api_key: Schema.user.api_key
        }).from(Schema.user).where(eq(Schema.user.api_key, apiKey))

        if (!existingUser || existingUser.length === 0) {
            return apiKey
        }
    }
}

/**
 * Create a new user with a hashed password
 * @param userData User data including plain text password
 * @returns The created user
 */
export async function createUser(
    email: string,
    first_name: string,
    last_name: string,
) {
    const existingUser = await db.select().from(Schema.user).where(eq(Schema.user.email, email))

    if (existingUser && existingUser.length > 0) {
        throw new Error("User already exists")
    }

    const password = await generateUserPassword()
    const hashedPassword = await hashPassword(password)
    const apiKey = await generateUniqueApiKey()
    const id = await generateUniqueUserId()

    const insertedUser = await db.insert(Schema.user).values({
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: hashedPassword,
        api_key: apiKey,
        id: id
    }).returning()

    if (!insertedUser || insertedUser.length === 0) {
        throw new Error("Failed to create user")
    }

    return { user: insertedUser[0], password: password }
}

export async function getUserId() {
    const session = await getClientSession();

    if (!session) {
        return null;
    }

    if (new Date(session.expires) < new Date()) {
        return null;
    }

    return session.userId;

}

export async function getUser(id?: string) {
    const userId = id || await getUserId();

    if (!userId) {
        return null
    }

    const user = await db.select()
        .from(Schema.user)
        .where(eq(Schema.user.id, userId))
        .limit(1)

    if (!user || user.length === 0) {
        throw new Error("User not found")
    }

    return user[0]
}

export async function getUserByEmail(email: string) {
    const user = await db.select()
        .from(Schema.user)
        .where(eq(Schema.user.email, email))
        .limit(1)

    return user.length > 0 ? user[0] : null
}

export async function getUserByApiKey(apiKey: string) {
    const user = await db.select()
        .from(Schema.user)
        .where(eq(Schema.user.api_key, apiKey))
        .limit(1)

    return user.length > 0 ? user[0] : null
}

export async function getUserPreferences(id?: string) {
    const userId = id || await getUserId();

    if (!userId) {
        return null
    }

    const user = await db.select({
        has_jarvis_asked_dark_mode: Schema.user.has_jarvis_asked_dark_mode,
        dark_mode: Schema.user.dark_mode_activated,
        auto_dark_mode: Schema.user.auto_dark_mode_enabled,
        startHour: Schema.user.dark_mode_start_hour,
        endHour: Schema.user.dark_mode_end_hour,
        startMinute: Schema.user.dark_mode_start_minute,
        endMinute: Schema.user.dark_mode_end_minute,
        override: Schema.user.dark_mode_override
    }).from(Schema.user)
        .where(eq(Schema.user.id, userId))
        .limit(1)

    if (!user || user.length === 0) {
        return null
    }

    return {
        userId,
        darkModeCookie: user[0] as DarkModeCookie
    }
}

export async function getUserDraftNote(id?: string) {
    const userId = id || await getUserId();

    if (!userId) {
        return null
    }

    const draftNote = await db.select({
        note_title: Schema.user.note_draft_title,
        note_content: Schema.user.note_draft_content,
        note_project_title: Schema.user.note_draft_project_title,
    })
        .from(Schema.user)
        .where(eq(Schema.user.id, userId))
        .limit(1)

    if (!draftNote || draftNote.length === 0) {
        return null
    }

    return draftNote[0]
}

export async function getAllUsers() {
    const users = await db.select().from(Schema.user)

    return users
}

export async function updateDarkModePreferences({
    userId,
    darkModeCookie
}: {
    userId: string
    darkModeCookie: DarkModeCookie
}) {
    try {
        await db
            .update(Schema.user)
            .set({
                has_jarvis_asked_dark_mode: darkModeCookie.has_jarvis_asked_dark_mode,
                dark_mode_activated: darkModeCookie.dark_mode,
                auto_dark_mode_enabled: darkModeCookie.auto_dark_mode,
                dark_mode_start_hour: darkModeCookie.startHour,
                dark_mode_end_hour: darkModeCookie.endHour,
                dark_mode_start_minute: darkModeCookie.startMinute,
                dark_mode_end_minute: darkModeCookie.endMinute,
                dark_mode_override: darkModeCookie.override
            })
            .where(eq(Schema.user.id, userId))

        // Revalidate the flags to update the theme
        revalidateTag("flags")

        return { success: true }
    } catch (error) {
        console.error("Failed to update dark mode preferences:", error)
        return { success: false, error: "Failed to update preferences" }
    }
}

export async function updateUserDraftNote({
    userId,
    note_title,
    note_content,
    note_project_title
}: {
    userId: string
    note_title: string
    note_content: string
    note_project_title: string
}) {
    try {
        await db
            .update(Schema.user)
            .set({
                note_draft_title: note_title,
                note_draft_content: note_content,
                note_draft_project_title: note_project_title
            })
            .where(eq(Schema.user.id, userId))

        return { success: true }
    } catch (error) {
        console.error("Failed to update draft note:", error)
        return { success: false, error: "Failed to update draft" }
    }
}

export async function updateUserProfile({
    userId,
    first_name,
    last_name,
    email
}: {
    userId: string
    first_name: string
    last_name: string
    email: string
}) {
    try {
        await db
            .update(Schema.user)
            .set({
                first_name: first_name,
                last_name: last_name,
                email: email,
                updated_at: new Date(),
            })
            .where(eq(Schema.user.id, userId))

        return { success: true }
    } catch (error) {
        console.error("Failed to update user profile:", error)
        return { success: false, error: "Failed to update profile" }
    }
}

export async function updateUserPassword({
    userId,
    newPassword
}: {
    userId: string
    newPassword: string
}) {
    try {
        const hashedPassword = await hashPassword(newPassword)

        await db
            .update(Schema.user)
            .set({
                password: hashedPassword,
                updated_at: new Date(),
            })
            .where(eq(Schema.user.id, userId))

        return { success: true }
    } catch (error) {
        console.error("Failed to update user password:", error)
        return { success: false, error: "Failed to update password" }
    }
}

/**
 * Updates a user's Stripe customer ID
 * @param userId - The user's ID
 * @param stripeCustomerId - The Stripe customer ID
 * @returns A promise that resolves to the update result
 */
export async function updateUserStripeCustomerId(userId: string, stripeCustomerId: string) {
    try {
        await db
            .update(Schema.user)
            .set({
                stripe_customer_id: stripeCustomerId,
                updated_at: new Date()
            })
            .where(eq(Schema.user.id, userId))

        revalidateTag(`user-${userId}`)

        return { success: true }
    } catch (error) {
        console.error("Error updating user Stripe customer ID:", error)
        return {
            success: false,
            error: "Failed to update Stripe customer ID"
        }
    }
}