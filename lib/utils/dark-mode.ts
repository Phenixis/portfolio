import { DarkModeCookie } from "@/lib/flags"

export function shouldDarkModeBeEnabled(cookie: DarkModeCookie) : {
    dark_mode: boolean,
    override: boolean
} {
    if (!cookie.auto_dark_mode) {
        return {
            dark_mode: cookie.dark_mode,
            override: false,
        }
    }

    const now = new Date()
    let shouldItBeEnabled: boolean
    const isAfterStartTime =
        now.getHours() > cookie.startHour ||
        (now.getHours() === cookie.startHour && now.getMinutes() >= cookie.startMinute)
    const isBeforeEndTime =
        now.getHours() < cookie.endHour || (now.getHours() === cookie.endHour && now.getMinutes() < cookie.endMinute)

    if (cookie.startHour > cookie.endHour) {
        // Dark mode is enabled outside the time range (e.g., 22:00 to 06:00)
        shouldItBeEnabled = isAfterStartTime || isBeforeEndTime
    } else {
        // Dark mode is enabled within the time range (e.g., 06:00 to 18:00)
        shouldItBeEnabled = isAfterStartTime && isBeforeEndTime
    }

    if (shouldItBeEnabled && cookie.dark_mode) {
        // User already enabled dark mode, before the automatic activation time.
        // So, we keep dark mode enabled and we mark it has not overridden to get back into an automatic cycle
        return {
            dark_mode: shouldItBeEnabled,
            override: false,
        }
    } else if (!shouldItBeEnabled && !cookie.dark_mode) {
        // User already disabled dark mode, before the automatic deactivation time.
        // So, we keep dark mode disabled and we mark it has not overridden to get back into an automatic cycle
        return {
            dark_mode: shouldItBeEnabled,
            override: false,
        }
    } else {
        // User manually changed dark mode (switched to light mode during dark mode period or vice versa), so it should keep the same state
        // and we mark it as overridden because it's out of the automatic cycle
        return {
            dark_mode: cookie.dark_mode,
            override: true,
        }
    }
}