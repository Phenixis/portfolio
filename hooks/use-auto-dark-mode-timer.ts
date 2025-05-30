"use client"

import { useEffect, useCallback } from "react"
import { DarkModeCookie } from "@/lib/flags"
import { shouldDarkModeBeEnabled } from "@/lib/utils/dark-mode"

export function useAutoDarkModeTimer(
    cookie: DarkModeCookie,
    onDarkModeChange: (newDarkMode: boolean, newCookie: DarkModeCookie) => void
) {
    const calculateNextToggleTime = useCallback(() => {
        if (!cookie.auto_dark_mode || cookie.override) return null

        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()

        // Create dates for start and end times today
        const todayStart = new Date()
        todayStart.setHours(cookie.startHour, cookie.startMinute, 0, 0)

        const todayEnd = new Date()
        todayEnd.setHours(cookie.endHour, cookie.endMinute, 0, 0)

        // If start time is greater than end time, it means dark mode spans overnight
        if (cookie.startHour > cookie.endHour) {
            // Handle overnight dark mode schedule (e.g., 22:00 to 06:00)
            // Dark mode is ON from startTime to 23:59 and from 00:00 to endTime
            const tomorrowEnd = new Date(todayEnd)
            tomorrowEnd.setDate(tomorrowEnd.getDate() + 1)

            if (currentHour >= cookie.startHour) {
                // We're after start time today, next toggle is end time tomorrow
                return tomorrowEnd
            } else if (currentHour < cookie.endHour) {
                // We're before end time today, next toggle is end time today
                return todayEnd
            } else {
                // We're between end and start time (light mode period), next toggle is start time today
                return todayStart
            }
        } else {
            // Handle normal daytime dark mode schedule (e.g., 08:00 to 18:00)
            // Dark mode is ON from startTime to endTime within the same day
            if (currentHour < cookie.startHour || 
                (currentHour === cookie.startHour && currentMinute < cookie.startMinute)) {
                // Before start time today
                return todayStart
            } else if (currentHour < cookie.endHour || 
                       (currentHour === cookie.endHour && currentMinute < cookie.endMinute)) {
                // Between start and end time today (dark mode period), next toggle is end time today
                return todayEnd
            } else {
                // After end time today, next toggle is start time tomorrow
                const tomorrowStart = new Date(todayStart)
                tomorrowStart.setDate(tomorrowStart.getDate() + 1)
                return tomorrowStart
            }
        }
    }, [cookie.auto_dark_mode, cookie.override, cookie.startHour, cookie.startMinute, cookie.endHour, cookie.endMinute])

    const checkAndUpdateDarkMode = useCallback(() => {
        if (!cookie.auto_dark_mode || cookie.override) {
            return
        }

        const { dark_mode: shouldBeEnabled } = shouldDarkModeBeEnabled(cookie)
        
        // Also check if the DOM class matches the expected state
        if (typeof document !== 'undefined') {
            const isDOMDark = document.documentElement.classList.contains('dark')
            
            // If DOM doesn't match what should be enabled, fix it immediately
            if (isDOMDark !== shouldBeEnabled) {
                document.documentElement.classList.toggle("dark", shouldBeEnabled)
            }
        }
        
        if (shouldBeEnabled !== cookie.dark_mode) {
            const newCookie: DarkModeCookie = {
                ...cookie,
                dark_mode: shouldBeEnabled,
                override: false
            }
            
            onDarkModeChange(shouldBeEnabled, newCookie)
        }
    }, [cookie, onDarkModeChange])

    useEffect(() => {
        if (!cookie.auto_dark_mode || cookie.override) return

        let timeoutId: NodeJS.Timeout

        const scheduleNextCheck = () => {
            const nextToggleTime = calculateNextToggleTime()
            
            if (!nextToggleTime) return

            const now = new Date()
            const msUntilToggle = nextToggleTime.getTime() - now.getTime()

            // Add a small buffer (1 second) to ensure we're past the exact time
            const msWithBuffer = Math.max(msUntilToggle + 1000, 1000)

            timeoutId = setTimeout(() => {
                checkAndUpdateDarkMode()
                // Schedule the next check after this one
                scheduleNextCheck()
            }, msWithBuffer)
        }

        // Initial check and immediate correction if needed
        checkAndUpdateDarkMode()
        
        // Schedule the first automatic toggle
        scheduleNextCheck()

        // Also check every 30 seconds as a fallback
        const intervalId = setInterval(() => {
            checkAndUpdateDarkMode()
        }, 30000)

        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            clearInterval(intervalId)
        }
    }, [cookie.auto_dark_mode, cookie.override, cookie.startHour, cookie.startMinute, cookie.endHour, cookie.endMinute, cookie.dark_mode, calculateNextToggleTime, checkAndUpdateDarkMode])
}
