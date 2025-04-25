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
import { db } from "@/lib/db/drizzle"
import { user } from "@/lib/db/schema"

/**
 * Generates a unique 8-digit number ID for users
 * @returns A promise that resolves to a unique 8-digit number
 */
export async function generateUniqueUserId(): Promise<number> {
    while (true) {
        // Generate a random 8-digit number
        const id = Math.floor(10000000 + Math.random() * 90000000)
        
        // Check if the ID already exists
        const existingUser = await db.select({
            id: user.id
        })
        .from(user)
        .where(eq(user.id, id));
        
        if (!existingUser || existingUser.length === 0) {
            return id
        }
    }
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
            api_key: user.api_key
        }).from(user).where(eq(user.api_key, apiKey))

        if (!existingUser || existingUser.length === 0) {
            return apiKey
        }
    }
}