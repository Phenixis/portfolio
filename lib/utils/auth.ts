import { db } from "@/lib/db/drizzle"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyPassword } from "./password"

/**
 * Verify user credentials
 * @param id User's id
 * @param password Plain text password
 * @returns The user if credentials are valid, null otherwise
 */
export async function verifyCredentials(id: string, password: string) {
    const userInfos = await db.select().from(user).where(eq(user.id, id))

    if (!userInfos || userInfos.length === 0) {
        return null
    }

    const isValid = await verifyPassword(password, userInfos[0].password)

    if (!isValid) {
        return null
    }

    return userInfos
} 