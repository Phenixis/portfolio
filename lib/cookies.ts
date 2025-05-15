"use server";

import { cookies } from "next/headers"
import { DarkModeCookie, TaskFilterCookie, defaultValueCookie, defaultTaskFilterCookie } from "@/lib/flags"

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
    const cookieStore = await cookies();
    cookieStore.set("dark_mode", JSON.stringify(cookie), {
        path: "/", // Ensure the cookie is accessible across the app
        maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
    });
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

export async function getTaskFilterCookie(): Promise<TaskFilterCookie> {
    const cookieStore = await cookies()
    const cookie = cookieStore.get("task_filter")?.value
    if (!cookie) {
        return defaultTaskFilterCookie
    } else {
        try {
            return JSON.parse(cookie) as TaskFilterCookie
        } catch (error) {
            return defaultTaskFilterCookie
        }
    }
}

export async function updateTaskFilterCookie(cookie: TaskFilterCookie): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("task_filter", JSON.stringify(cookie), {
        path: "/", // Ensure the cookie is accessible across the app
        // Setting maxAge to undefined makes this a session cookie
        // It will expire when the browser is closed
    });
}