import { flag } from "flags/next"

export interface DarkModeCookie {
    dark_mode: boolean
    auto_dark_mode: boolean
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    override: boolean
}

export const defaultValueCookie = {
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
        const now = new Date()

        // Get the current user from the session
        const darkModeCookie = cookies.get("dark_mode")?.value
        if (!darkModeCookie) {
            return defaultValueCookie
        }
        const preferences = JSON.parse(darkModeCookie) as DarkModeCookie

        if (!preferences.auto_dark_mode) {
            return preferences
        }

        
        let isDarkModeEnabled: boolean
        const isAfterStartTime = now.getHours() > preferences.startHour || (now.getHours() >= preferences.startHour && now.getMinutes() >= preferences.startMinute)
        const isBeforeEndTime = now.getHours() < preferences.endHour || (now.getHours() === preferences.endHour && now.getMinutes() < preferences.endMinute)
        
        if (preferences.startHour < preferences.endHour) {
            // start hour before end hour, so time must be between these two to be enable dark mode
            isDarkModeEnabled = isAfterStartTime && isBeforeEndTime
        } else {
            // start hour after end hour (overlaps midnight), so time must be before end hour or after start hour to be enable dark mode
            isDarkModeEnabled = isAfterStartTime || isBeforeEndTime
        }
        
        if (preferences.override) {
            if (!isDarkModeEnabled) {
                return {
                    ...preferences,
                    dark_mode: false,
                    override: false,
                }
            }
            return preferences
        }
        
        return {
            ...preferences,
            dark_mode: isDarkModeEnabled,
        }
    },
    decide({ entities }) {
        return entities?.dark_mode ?? false
    }
})
