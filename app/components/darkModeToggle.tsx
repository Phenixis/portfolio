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
            className="transition-all text-neutral-800 hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-500 flex align-middle relative py-1 px-2 m-1"
        >
            {isDarkMode ? (
                <Moon />
            ) : (
                <Sun />
            )}
        </button>
    )
}