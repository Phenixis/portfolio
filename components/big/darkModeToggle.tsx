'use client';

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function DarkModeToggle({
    className
} : {
    className?: string
}) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        if (isDarkMode) {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
    }

    return (
        <div
            onClick={toggleDarkMode}
            className={cn("lg:hover:rotate-[46deg] duration-1000 flex align-middle relative transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-500 cursor-pointer", className)}
        >
            {isDarkMode ? (
                <Moon />
            ) : (
                <Sun />
            )}
        </div>
    )
}