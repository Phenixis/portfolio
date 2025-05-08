"use server"

import {
    desc,
    asc,
    eq,
    isNull,
    isNotNull,
    sql,
    and,
    or,
    lte,
    inArray,
    not
} from "drizzle-orm"
import { db } from "../drizzle"
import * as Schema from "../schema"
import { revalidatePath } from "next/cache"
import { calculateUrgency } from "@/lib/utils/task"
import { alias } from "drizzle-orm/pg-core"
import { hashPassword } from "@/lib/utils/password"
import { user } from "../schema"
import { getClientSession } from "@/lib/auth/session"
import { revalidateTag } from "next/cache"


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

export async function getUser(id?: string) {
    if (!id) {
        const session = await getClientSession();

        if (!session) {
            return null;
        }

        if (new Date(session.expires) < new Date()) {
            return null;
        }

        const user = await db
            .select()
            .from(Schema.user)
            .where(and(
                (session.userId ? eq(Schema.user.id, session.userId) : eq(Schema.user.email, session.userId)),
                isNull(Schema.user.deleted_at))
            )
            .limit(1);

        if (user.length === 0) {
            return null;
        }

        return user[0];
    } else {
        const user = await db.select().from(Schema.user).where(eq(Schema.user.id, id))

        if (!user || user.length === 0) {
            throw new Error("User not found")
        }

        return user[0]
    }
}

export async function getUserPreferences(id?: string) {
    if (!id) {
        const session = await getClientSession();

        if (!session) {
            return null;
        }

        if (new Date(session.expires) < new Date()) {
            return null;
        }

        const user = await db
            .select({
                auto_dark_mode_enabled: Schema.user.auto_dark_mode_enabled,
                dark_mode_start_hour: Schema.user.dark_mode_start_hour,
                dark_mode_end_hour: Schema.user.dark_mode_end_hour,
                dark_mode_start_minute: Schema.user.dark_mode_start_minute,
                dark_mode_end_minute: Schema.user.dark_mode_end_minute,
                dark_mode_override: Schema.user.dark_mode_override,
                override_expires_at: Schema.user.override_expires_at
            })
            .from(Schema.user)
            .where(and(
                (session.userId ? eq(Schema.user.id, session.userId) : eq(Schema.user.email, session.userId)),
                isNull(Schema.user.deleted_at))
            )
            .limit(1);

        if (user.length === 0) {
            return null;
        }

        return user[0];
    } else {
        const user = await db.select({
            auto_dark_mode_enabled: Schema.user.auto_dark_mode_enabled,
            dark_mode_start_hour: Schema.user.dark_mode_start_hour,
            dark_mode_end_hour: Schema.user.dark_mode_end_hour,
            dark_mode_start_minute: Schema.user.dark_mode_start_minute,
            dark_mode_end_minute: Schema.user.dark_mode_end_minute,
            dark_mode_override: Schema.user.dark_mode_override,
            override_expires_at: Schema.user.override_expires_at
        }).from(Schema.user)
        .where(eq(Schema.user.id, id))

        if (!user || user.length === 0) {
            return null
        }

        return user[0]
    }
}

export async function getAllUsers() {
    const users = await db.select().from(Schema.user)

    return users
}

interface DarkModePreferences {
  userId: string
  darkModeEnabled?: boolean
  darkModeStartHour?: number
  darkModeEndHour?: number
  darkModeOverride?: boolean
  overrideExpiresAt?: Date | null
}

export async function updateDarkModePreferences({
  userId,
  darkModeEnabled,
  darkModeStartHour,
  darkModeEndHour,
  darkModeOverride,
  overrideExpiresAt,
}: DarkModePreferences) {
  try {
    const result = await db
        .update(Schema.user)
        .set({
            auto_dark_mode_enabled: darkModeEnabled,
            dark_mode_start_hour: darkModeStartHour,
            dark_mode_end_hour: darkModeEndHour,
            dark_mode_override: darkModeOverride,
            override_expires_at: overrideExpiresAt,
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
