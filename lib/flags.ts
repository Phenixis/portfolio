import { flag } from "flags/next"
import { shouldDarkModeBeEnabled } from "@/lib/utils/dark-mode"

export interface DarkModeCookie {
    has_jarvis_asked_dark_mode: boolean
    dark_mode: boolean
    auto_dark_mode: boolean
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    override: boolean
}

export const defaultValueCookie = {
    has_jarvis_asked_dark_mode: false,
    dark_mode: false,
    auto_dark_mode: true,
    startHour: 19, // 7pm
    startMinute: 0,
    endHour: 6, // 6am
    endMinute: 0,
    override: false,
} as DarkModeCookie

export const darkMode = flag<boolean, DarkModeCookie>({
    key: "dark-mode",
    identify({ headers, cookies }) {
        // Get the current user from the session
        const darkModeCookie = cookies.get("dark_mode")?.value
        if (!darkModeCookie) {
            return defaultValueCookie
        }
        const preferences = JSON.parse(darkModeCookie) as DarkModeCookie

        const { dark_mode, override } = shouldDarkModeBeEnabled(preferences)

        return {
            ...preferences,
            dark_mode: dark_mode,
            override: override,
        }
    },
    decide({ entities }) {
        return entities?.dark_mode ?? false
    }
})
