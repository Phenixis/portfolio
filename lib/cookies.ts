"use server";

import { cookies } from "next/headers"
import { DarkModeCookie, defaultValueCookie } from "@/lib/flags"

export async function getDarkModeCookie() {

    const cookie = (await cookies()).get("dark_mode")?.value
    if (!cookie) {
        (await cookies()).set("dark_mode", JSON.stringify(defaultValueCookie))
        return defaultValueCookie
    } else {
        try {
            return JSON.parse(cookie) as DarkModeCookie
        } catch (error) {
            (await cookies()).set("dark_mode", JSON.stringify(defaultValueCookie))
            return defaultValueCookie
        }
    }
}