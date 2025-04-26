"use server";

import { ActionState } from '@/middleware';
import { redirect } from 'next/navigation'
import { removeSession, setSession } from '@/lib/auth/session';
import { db } from "@/lib/db/drizzle"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyPassword } from "@/lib/utils/password"
import { createUser } from "@/lib/db/queries/user"
import { User } from "@/lib/db/schema"
import { sendWelcomeEmail } from "@/components/utils/send_email"

export async function signUp(prevState: ActionState, formData: FormData) {
    const firstName = formData.get("first_name")
    const lastName = formData.get("last_name")
    const email = formData.get("email")

    if (!email || !firstName || !lastName || typeof email !== "string" || typeof firstName !== "string" || typeof lastName !== "string") {
        return { error: "Missing required fields" }
    }

    let user: { user: User, password: string }

    try {
        user = await createUser(email, firstName, lastName)
    } catch (error: any) {
        return { error: error.message }
    }

    try {
        await sendWelcomeEmail(user.user, user.password)
    } catch (error: any) {
        return { error: error.message }
    }

    return { success: true }
}

export async function login(prevState: ActionState, formData: FormData) {
    const trial = formData.get("password");
    const password = process.env.PIN;

    if (password === undefined) {
        return { error: "PIN is not set, you can't connect." };
    }

    if (trial !== password) {
        return { error: "Invalid PIN." };
    }

    await setSession();

    const redirectTo = formData.get("redirectTo");
    return { success: true, redirectTo: redirectTo ? redirectTo.toString() : '/my' };
}

export async function logout() {
    removeSession();

    redirect('/login');
}

/**
 * Verify user credentials
 * @param id User's id
 * @param password Plain text password
 * @returns The user if credentials are valid, null otherwise
 */
export async function verifyCredentials(prevState: ActionState, formData: FormData) {
    const id = formData.get("identifier")
    const password = formData.get("password")

    if (!id || !password || typeof id !== "string" || typeof password !== "string") {
        return { error: "Missing required fields" }
    }

    const userInfos = await db.select().from(user).where(eq(user.id, id))

    if (!userInfos || userInfos.length === 0) {
        return { error: "User not found" }
    }

    const isValid = await verifyPassword(password, userInfos[0].password)

    if (!isValid) {
        return { error: "Invalid credentials" }
    }

    const userData = userInfos[0]

    await setSession({
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        userId: userData.id
    })

    const redirectTo = formData.get("redirectTo");
    return { success: true, redirectTo: redirectTo ? redirectTo.toString() : '/my' };
} 