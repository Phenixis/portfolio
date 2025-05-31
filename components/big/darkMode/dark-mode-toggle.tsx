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
import { shouldDarkModeBeEnabled } from "@/lib/utils/dark-mode"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { useAutoDarkModeTimer } from "@/hooks/use-auto-dark-mode-timer"
import { useSWRConfig } from "swr"
import { useUser } from "@/hooks/use-user"

export default function DarkModeToggle({
    className,
    initialCookie,
}: {
    initialCookie: DarkModeCookie
    className?: string
}) {
    const user = useUser().user;
    const [cookie, setCookie] = useState<DarkModeCookie>(initialCookie)
    /* 
    14/05/25 - 07h45 : étant donné que lors du sign-up et login, le cookie dark_mode est mis à jour selon les données dans la db, j'ai fait le choix de me baser sur la variable cookie dans le code car elle a 99% d'être présente. De plus, nous la mettons à jour avec les dernières valeurs de la db dès qu'on reçoit ses valeurs. Cette variable sera mise à jour, et je me baserai sur ces mises à jour pour les fonctions, ...
    */
    const [showAutoDarkModeDialog, setShowAutoDarkModeDialog] = useState(false)

    const { mutate } = useSWRConfig()
        const { darkMode, isLoading } = useDarkMode()

    // Handle automatic dark mode timer updates
    useAutoDarkModeTimer(cookie, async (newDarkMode: boolean, newCookie: DarkModeCookie) => {
        setCookie(newCookie)
        document.documentElement.classList.toggle("dark", newDarkMode)
        await updateDarkModePreference(newCookie)
    })

    const updateDarkModePreference = async (newValue: DarkModeCookie) => {
        try {
            mutate(
                (key: unknown) => typeof key === "string" && (key === "/api/dark-mode" || key.startsWith("/api/dark-mode?")),
                async (currentData: unknown): Promise<DarkModeCookie | unknown> => {
                    if (!(typeof currentData === "object" && currentData !== null && "dark_mode" in currentData)) return currentData
                    return newValue
                },
                { revalidate: false },
            )

            await fetch("/api/dark-mode", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.api_key}`
                },
                body: JSON.stringify(newValue),
            })

            mutate((key) => typeof key === "string" && (key === "/api/dark-mode" || key.startsWith("/api/dark-mode?")))
        } catch (error: unknown) {
            console.error("Error updating dark mode preference:", error)
        }
    }

    useEffect(() => {
        if (isLoading || !darkMode) return
        const darkModeActivated = document.documentElement.classList.contains("dark")

        if (darkModeActivated !== darkMode.dark_mode) {
            document.documentElement.classList.toggle("dark", darkMode.dark_mode) // Match the actual dark mode with the database state
        }

        setCookie(darkMode)
    }, [isLoading, darkMode])

    // Remove the problematic useEffect that was causing infinite API calls
    // The dark mode state is already managed through user interactions and the useDarkMode hook

    return (
        <div>
            <div
                onClick={async () => {
                    if (cookie.auto_dark_mode && !cookie.has_jarvis_asked_dark_mode) {
                        setShowAutoDarkModeDialog(true)
                    } else {
                        const newCookie = {
                            ...cookie,
                            dark_mode: !cookie.dark_mode,
                            override: shouldDarkModeBeEnabled({
                                ...cookie,
                                dark_mode: !cookie.dark_mode,
                            }).override,
                        }
                        setCookie(newCookie)
                        document.documentElement.classList.toggle("dark", !cookie.dark_mode)
                        await updateDarkModePreference(newCookie)
                    }
                }}
                role="button"
                aria-label={cookie.dark_mode ? "Switch to light mode" : "Switch to dark mode"}
                className={cn(
                    "lg:hover:rotate-46 duration-1000 flex align-middle relative transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:lg:hover:text-neutral-500 cursor-pointer",
                    className,
                )}
            >
                {cookie.dark_mode ? <Moon /> : <Sun />}
            </div>

            {cookie.has_jarvis_asked_dark_mode !== true && (
                <Dialog open={showAutoDarkModeDialog} onOpenChange={setShowAutoDarkModeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hi sir, Jarvis Here</DialogTitle>
                            <DialogDescription>
                                It&apos;s getting late.
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
                                onClick={async () => {
                                    setShowAutoDarkModeDialog(false)
                                    const newCookie = {
                                        ...cookie,
                                        has_jarvis_asked_dark_mode: true,
                                        auto_dark_mode: false,
                                        dark_mode: false,
                                        override: false
                                    }
                                    setCookie(newCookie)
                                    document.documentElement.classList.toggle("dark", false)
                                    await updateDarkModePreference(newCookie)
                                }}
                                className=""
                            >
                                No
                            </Button>
                            <Button
                                variant="default"
                                size="default"
                                onClick={async () => {
                                    setShowAutoDarkModeDialog(false)
                                    const newCookie = {
                                        ...cookie,
                                        has_jarvis_asked_dark_mode: true,
                                        auto_dark_mode: true,
                                        dark_mode: true,
                                        override: false
                                    }
                                    setCookie(newCookie)
                                    document.documentElement.classList.toggle("dark", true)
                                    await updateDarkModePreference(newCookie)
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
