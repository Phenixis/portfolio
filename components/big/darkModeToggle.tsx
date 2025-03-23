'use client';

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
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
        <button
            onClick={toggleDarkMode}
            className="-rotate-[23deg] lg:hover:rotate-[23deg] duration-1000 flex align-middle relative py-1 px-2 m-1 transition-all text-neutral-800 lg:hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-500"
        >
            {isDarkMode ? (
                <Moon />
            ) : (
                <Sun />
            )}
        </button>
    )
}