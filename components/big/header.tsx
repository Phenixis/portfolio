"use client"

import DarkModeToggle from "@/components/big/dark-mode-toggle"
import Meteo from "@/components/big/meteo"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"
import DateDisplay from "@/components/big/date"
import Time from "@/components/big/time"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { DoorOpen, LogOut } from "lucide-react"

export default function Header({ }: {}) {
    const { isVisible } = useScrollDirection()
    const [isHovering, setIsHovering] = useState(false)
    const [showLogout, setShowLogout] = useState(false)

    // Handle delayed appearance of logout button
    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        if (isHovering) {
            // Set timeout to show logout after 500ms
            timeoutId = setTimeout(() => {
                setShowLogout(true)
            }, 1200)
        } else {
            // Hide logout immediately
            setShowLogout(false)
        }

        // Cleanup timeout on component unmount or when isHovering changes
        return () => {
            clearTimeout(timeoutId)
        }
    }, [isHovering])

	useEffect(() => {
		if (window.innerWidth < 1024) {
			setIsHovering(true)
		}
	}, [])

    // Updated handlers to check screen width
    function handleMouseEnter() {
        if (window.innerWidth >= 1024) {
            setIsHovering(true)
        }
    }

    function handleMouseLeave() {
        if (window.innerWidth >= 1024) {
            setIsHovering(false)
        }
    }

    return (
        <header
            className={cn(
                "fixed z-50 bottom-4 has-[:hover]:lg:bottom-6 flex items-center justify-center w-full transition-all duration-300 pointer-events-none", // Added pointer-events-none
                isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
            )}
        >
            <div className="relative w-fit max-w-[90%] p-1 xl:p-2 px-2 xl:px-4 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-between border border-gray-200 dark:border-gray-800 transition-all duration-300 group/Header pointer-events-auto" // Added pointer-events-auto
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* DarkModeToggle with smooth animation */}
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center",
                        isHovering ? "w-fit max-w-[24px] opacity-100 mr-2 xl:mr-4" : "w-0 max-w-0 opacity-0",
                    )}
                >
                    <DarkModeToggle className="transition-transform duration-300" />
                </div>

                {/* Center content */}
                <div className="flex items-center justify-center gap-1 xl:gap-2 group/Time duration-300 h-6 lg:group-hover/Header:h-12">
                    <Meteo />
                    <div>
                        <Time
                            className={"xl:text-base duration-300 xl:transform xl:group-hover/Time:translate-y-0 xl:translate-y-3"}
                        />
                        <DateDisplay
                            className={"text-xs xl:text-sm duration-300 xl:transform xl:group-hover/Time:opacity-100 xl:group-hover/Time:translate-y-0 xl:opacity-0 xl:-translate-y-2"}
                        />
                    </div>
                </div>

                {/* Logout form with JavaScript-controlled delay */}
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center",
                        showLogout ? "w-fit max-w-[40px] opacity-100 ml-2 xl:ml-4" : "w-0 max-w-0 opacity-0",
                    )}
                >
                    <form action={logout}>
                        <Button type="submit" variant="outline" size="icon" className="whitespace-nowrap transition-transform duration-300">
                            <LogOut size={24} />
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    )
}