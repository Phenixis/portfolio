"use server";

import { cookies } from "next/headers"
import { DarkModeCookie, defaultValueCookie } from "@/lib/flags"

export async function getDarkModeCookie() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get("dark_mode")?.value
    if (!cookie) {
        return defaultValueCookie
    } else {
        try {
            return JSON.parse(cookie) as DarkModeCookie
        } catch (error) {
            return defaultValueCookie
        }
    }
}

export async function updateDarkModeCookie(cookie: DarkModeCookie) {
    (await cookies()).set("dark_mode", JSON.stringify(cookie))
}

export async function syncDarkModeState(isDarkMode: boolean, cookie: DarkModeCookie) {
    const newCookie: DarkModeCookie = {
        ...cookie,
        dark_mode: isDarkMode,
        override: false // Reset override when syncing
    }

    await updateDarkModeCookie(newCookie)
    return newCookie
}