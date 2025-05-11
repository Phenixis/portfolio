"use client"

import { useState, useEffect, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { DarkModeCookie } from "@/lib/flags"
import { updateDarkModeCookie } from "@/lib/cookies"
import { getUser, updateDarkModePreferences, getUserPreferences } from "@/lib/db/queries/user"

export default function DarkModeToggle({
    className,
    initialCookie,
}: {
    initialCookie: DarkModeCookie
    className?: string
}) {
    const [cookie, setCookie] = useState<DarkModeCookie>(initialCookie)
    const [isDarkMode, setIsDarkMode] = useState(cookie.dark_mode)
    const [showAutoDarkModeDialog, setShowAutoDarkModeDialog] = useState(false)
    const [hasAskedForAutoDarkMode, setHasAskedForAutoDarkMode] = useState(cookie.has_jarvis_asked_dark_mode || false)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const darkModeActivated = document.documentElement.classList.contains("dark")

        if (darkModeActivated !== isDarkMode) {
            console.log("Actual dark mode state is different :", darkModeActivated, isDarkMode)
            // setIsDarkMode(darkModeActivated)
            // setCookie((prev) => ({
            //     ...prev,
            //     dark_mode: darkModeActivated,
            // }))
        }

        // RÉCUPÉRER VALEURS DB
        getUserPreferences().then((userPreferences) => {
            if (userPreferences) {
                setCookie(userPreferences as DarkModeCookie)
                setIsDarkMode(userPreferences.dark_mode)
            }
        })

        // CHECK RECURRENT POUR CHANGEMENT D'ÉTAT
        const recurrentCheck = setInterval(() => {
            if (isUpdating) return

            // Only check if auto dark mode is enabled and not overridden
            if (!cookie.auto_dark_mode || cookie.override) return

            const shouldBeDark = shouldDarkModeBeEnabled()

            // Only proceed if the state needs to change
            if (isDarkMode === shouldBeDark) return

            if (!isDarkMode && !hasAskedForAutoDarkMode) {
                setShowAutoDarkModeDialog(true)
            } else {
                setIsUpdating(true)

                setIsDarkMode(shouldBeDark)
                document.documentElement.classList.toggle("dark", shouldBeDark)

                toggleDarkMode(!shouldBeDark)
                    .then(() => {
                        setIsUpdating(false)
                    })
                    .catch((error) => {
                        console.error("Error toggling dark mode:", error)
                        setIsUpdating(false)
                    })
            }
        }, 1000) // Check every second

        return () => {
            clearInterval(recurrentCheck)
        }
    }, []) // Empty dependency array to run only once

    const toggleDarkMode = async (previousState: boolean) => {
        const now = new Date()

        let newCookie: DarkModeCookie = {
            ...cookie,
            dark_mode: !previousState,
        }

        const isAfterStartTime =
            now.getHours() > cookie.startHour ||
            (now.getHours() === cookie.startHour && now.getMinutes() >= cookie.startMinute)
        const isBeforeEndTime =
            now.getHours() < cookie.endHour || (now.getHours() === cookie.endHour && now.getMinutes() < cookie.endMinute)
        const isInAutoDarkModeTime =
            cookie.startHour > cookie.endHour ? isAfterStartTime || isBeforeEndTime : isAfterStartTime && isBeforeEndTime // if start hour is before end hour, dark mode is enabled between these two times, otherwise dark mode is enabled outside these two times
        if (isInAutoDarkModeTime) {
            const isOverridingAutoDarkMode = previousState // if dark mode has been disabled during the auto dark mode time

            newCookie = {
                ...newCookie,
                override: isOverridingAutoDarkMode,
            }
        } else {
            newCookie = {
                ...newCookie,
                override: false,
            }
        }

        setCookie(newCookie)
        await updateDarkModeCookie(newCookie)
        const user = await getUser()
        if (user) {
            await updateDarkModePreferences({
                userId: user.id,
                darkModeCookie: newCookie,
            })
        }
    }

    const handleAutoDarkModeDialogResponse = async (response: boolean) => {
        const newCookie: DarkModeCookie = {
            ...cookie,
            dark_mode: response,
            override: false,
            has_jarvis_asked_dark_mode: true,
            auto_dark_mode: response,
        }

        setCookie(newCookie)
        await updateDarkModeCookie(newCookie)
        const user = await getUser()
        if (user) {
            await updateDarkModePreferences({
                userId: user.id,
                darkModeCookie: newCookie,
            })
        }
    }

    const shouldDarkModeBeEnabled = () => {
        const now = new Date()
        const isAfterStartTime =
            now.getHours() > cookie.startHour ||
            (now.getHours() === cookie.startHour && now.getMinutes() >= cookie.startMinute)
        const isBeforeEndTime =
            now.getHours() < cookie.endHour || (now.getHours() === cookie.endHour && now.getMinutes() < cookie.endMinute)

        if (cookie.startHour > cookie.endHour) {
            // Dark mode is enabled outside the time range (e.g., 22:00 to 06:00)
            return isAfterStartTime || isBeforeEndTime
        } else {
            // Dark mode is enabled within the time range (e.g., 18:00 to 06:00)
            return isAfterStartTime && isBeforeEndTime
        }
    }

    return (
        <div>
            <div
                onClick={async () => {
                    const previousState = isDarkMode

                    setIsDarkMode((prev) => !prev)
                    document.documentElement.classList.toggle("dark")
                    setIsUpdating(true)
                    await toggleDarkMode(previousState)
                    setIsUpdating(false)
                }}
                role="button"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={cn(
                    "lg:hover:rotate-[46deg] duration-1000 flex align-middle relative transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:lg:hover:text-neutral-500 cursor-pointer",
                    className,
                )}
            >
                {isDarkMode ? <Moon /> : <Sun />}
            </div>

            {hasAskedForAutoDarkMode !== true && (
                <Dialog open={showAutoDarkModeDialog} onOpenChange={setShowAutoDarkModeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hi sir, Jarvis Here</DialogTitle>
                            <DialogDescription>
                                It's getting late.
                                <br />
                                <br />
                                Do you want me to automatically turn on dark mode between {cookie.startHour < 10 ? "0" + cookie.startHour : cookie.startHour}:{cookie.startMinute < 10 ? "0" + cookie.startMinute : cookie.startMinute} and {cookie.endHour}:
                                {cookie.endMinute < 10 && "0"}
                                {cookie.startMinute}?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="secondary"
                                size="default"
                                onClick={() => {
                                    setShowAutoDarkModeDialog(false)
                                    setHasAskedForAutoDarkMode(true)
                                    setIsDarkMode(false)
                                    document.documentElement.classList.remove("dark")
                                    setIsUpdating(true)
                                    handleAutoDarkModeDialogResponse(false)
                                    setIsUpdating(false)
                                }}
                                className=""
                            >
                                No
                            </Button>
                            <Button
                                variant="default"
                                size="default"
                                onClick={() => {
                                    setShowAutoDarkModeDialog(false)
                                    setHasAskedForAutoDarkMode(true)
                                    setIsDarkMode(true)
                                    document.documentElement.classList.add("dark")
                                    setIsUpdating(true)
                                    handleAutoDarkModeDialogResponse(true)
                                    setIsUpdating(false)
                                }}
                                className=""
                            >
                                Yes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
