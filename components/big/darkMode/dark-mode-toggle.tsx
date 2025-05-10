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
import { type DarkModeCookie } from "@/lib/flags"
import { updateDarkModeCookie, syncDarkModeState } from "@/lib/cookies"
import { getUser, updateDarkModePreferences, getUserPreferences } from "@/lib/db/queries/user"

export default function DarkModeToggle({
    className,
    initialCookie
}: {
    initialCookie: DarkModeCookie
    className?: string
}) {
    const [cookie, setCookie] = useState<DarkModeCookie>(initialCookie)
    const [isDarkMode, setIsDarkMode] = useState(cookie.dark_mode)
    const [showAutoDarkModeDialog, setShowAutoDarkModeDialog] = useState(false)
    const [hasAskedForAutoDarkMode, setHasAskedForAutoDarkMode] = useState(cookie.has_jarvis_asked_dark_mode || false)

    useEffect(() => {
        // RÉCUPÉRER VALEURS DB
        getUserPreferences().then((userPreferences) => {
            if (userPreferences) {
                setCookie(userPreferences as DarkModeCookie)
                setIsDarkMode(userPreferences.dark_mode)
            }
        })

        // CHECK RECURRENT POUR CHANGEMENT D'ÉTAT
        const recurrentCheck = setInterval(async () => {
            const timeToToggle = isTimeToToggleDarkMode()
            if (timeToToggle) {
                if (!isDarkMode && !hasAskedForAutoDarkMode) {
                    setShowAutoDarkModeDialog(true)
                } else {
                    await toggleDarkMode()
                }
            }
        }, 1000) // Check every second

        return () => {
            clearInterval(recurrentCheck)
        }
    }, [])

    const toggleDarkMode = async () => {
        const previousState = isDarkMode

        setIsDarkMode((prev) => !prev)
        document.documentElement.classList.toggle("dark")
        const now = new Date()

        let newCookie: DarkModeCookie = {
            ...cookie,
            dark_mode: !previousState,
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

        setCookie(newCookie)
        await updateDarkModeCookie(newCookie)
        const user = await getUser()
        if (user) {
            await updateDarkModePreferences({
                userId: user.id,
                darkModeCookie: newCookie
            })
        }
    }

    const handleAutoDarkModeDialogResponse = async (response: boolean) => {
        setShowAutoDarkModeDialog(false)
        setHasAskedForAutoDarkMode(true)
        setIsDarkMode(response)

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
                darkModeCookie: newCookie
            })
        }
    }

    const isTimeToToggleDarkMode = () => {
        if (!cookie.auto_dark_mode || cookie.override) {
            return false
        }

        const now = new Date()
        const isAfterStartTime = now.getHours() > cookie.startHour || (now.getHours() >= cookie.startHour && now.getMinutes() >= cookie.startMinute)
        const isBeforeEndTime = now.getHours() < cookie.endHour || (now.getHours() === cookie.endHour && now.getMinutes() < cookie.endMinute)

        if (cookie.startHour > cookie.endHour) {
            return isDarkMode != (isAfterStartTime || isBeforeEndTime)
        } else {
            return isDarkMode != (isAfterStartTime && isBeforeEndTime)
        }
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

            {hasAskedForAutoDarkMode !== true && (<Dialog open={showAutoDarkModeDialog} onOpenChange={setShowAutoDarkModeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hi sir, Jarvis Here</DialogTitle>
                        <DialogDescription>
                            It's getting late.<br />
                            <br />
                            Do you want me to automatically turn back on dark mode after {cookie.startHour}:{cookie.startMinute < 10 && "0"}{cookie.startMinute}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" size="default" onClick={() => handleAutoDarkModeDialogResponse(false)} className="">
                            No
                        </Button>
                        <Button variant="default" size="default" onClick={() => handleAutoDarkModeDialogResponse(true)} className="">
                            Yes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>)}
        </div>
    )
}
