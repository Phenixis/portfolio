"use client"

import { useState, useEffect } from "react"
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
import { updateDarkModePreferences } from "@/lib/db/queries/user"
import { DarkModeCookie } from "@/lib/flags"
import { updateDarkModeCookie, syncDarkModeState } from "@/lib/cookies"

interface DarkModeToggleProps {
    className?: string
    userId?: string
    darkModeEnabled?: boolean
    darkModeAutomatic?: boolean
    darkModeStartHour?: number
    darkModeEndHour?: number
}

export default function DarkModeToggle({
    className,
    cookie
}: {
    cookie: DarkModeCookie
    className?: string
}) {
    const [isDarkMode, setIsDarkMode] = useState(cookie.dark_mode)
    const [showDialog, setShowDialog] = useState(false)
    const [hasAskedForAutoDarkMode, setHasAskedForAutoDarkMode] = useState(false)

    useEffect(() => {
        const actualDarkMode = document.documentElement.classList.contains("dark")
        
        if (actualDarkMode !== isDarkMode) {
            setIsDarkMode(actualDarkMode)

            // Sync the cookie with the actual state using the Server Action
            syncDarkModeState(actualDarkMode, cookie).then(newCookie => {
                // Optionally update local state if needed
                console.log("Dark mode cookie synced:", newCookie)
            })
        }
    }, [])

    const toggleDarkMode = async () => {
        const previousState = isDarkMode
        const newState = !isDarkMode

        setIsDarkMode((prev) => !prev)
        document.documentElement.classList.toggle("dark")
        const now = new Date()

        let newCookie: DarkModeCookie = {
            ...cookie,
            dark_mode: !isDarkMode,
        }

        const isAfterStartTime = now.getHours() > cookie.startHour || (now.getHours() >= cookie.startHour && now.getMinutes() >= cookie.startMinute)
        const isBeforeEndTime = now.getHours() < cookie.endHour || (now.getHours() === cookie.endHour && now.getMinutes() < cookie.endMinute)
        const isInAutoDarkModeTime = cookie.startHour > cookie.endHour ? isAfterStartTime || isBeforeEndTime : isAfterStartTime && isBeforeEndTime // if start hour is before end hour, dark mode is enabled between these two times, otherwise dark mode is enabled outside these two times
        if (isInAutoDarkModeTime) {
            const isOverridingAutoDarkMode = previousState // if dark mode has been disabled during the auto dark mode time

            newCookie = {
                ...newCookie,
                override: isOverridingAutoDarkMode
            }
        } else {
            newCookie = {
                ...newCookie,
                override: false
            }
        }

        await updateDarkModeCookie(newCookie)
    }

    return (
        <div>
            <div
                onClick={toggleDarkMode}
                role="button"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={cn(
                    "lg:hover:rotate-[46deg] duration-1000 flex align-middle relative transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:lg:hover:text-neutral-500 cursor-pointer",
                    className,
                )}
            >
                {isDarkMode ? <Moon /> : <Sun />}
            </div>

            {/* <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hi sir, Jarvis Here</DialogTitle>
                        <DialogDescription>
                            It's getting late, I don't want to flash you, do you want me to turn on dark mode automatically after 7pm and before 6am?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" size="default" onClick={() => handleDialogResponse(false)} className="">
                            No
                        </Button>
                        <Button variant="default" size="default" onClick={() => handleDialogResponse(true)} className="">
                            Yes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </div>
    )
}
