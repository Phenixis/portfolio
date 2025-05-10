"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DarkModeToggleFrontOffice({
    className
}: {
    className?: string
}) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"))
    }, [])

    const toggleDarkMode = async () => {
        setIsDarkMode((prev) => !prev)
        document.documentElement.classList.toggle("dark")
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
        </div>
    )
}
