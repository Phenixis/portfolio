import { flag } from "flags/next"

interface Entities {
    dark_mode: boolean
    auto_dark_mode: boolean
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
}

export const darkMode = flag<boolean, Entities>({
    key: "dark-mode",
    identify({ headers, cookies }) {
        const now = new Date()
        const defaultValue = {
            dark_mode: false,
            auto_dark_mode: false,
            startHour: 19, // 7pm
            startMinute: 0,
            endHour: 6, // 6am
            endMinute: 0,
        }

        // Get the current user from the session
        const darkModeCookie = cookies.get("dark_mode")?.value
        if (!darkModeCookie) {
            return defaultValue
        }
        const preferences = JSON.parse(darkModeCookie) as Entities

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

        return {
            ...preferences,
            dark_mode: isDarkModeEnabled,
        }
    },
    decide({ entities }) {
        return entities?.dark_mode ?? false
    }
})
