"use client"

import DarkModeToggle from "@/components/big/darkModeToggle"
import Meteo from "@/components/big/meteo"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"
import DateDisplay from "@/components/big/date"
import Time from "@/components/big/time"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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
			}, 800)
		} else {
			// Hide logout immediately
			setShowLogout(false)
		}

		// Cleanup timeout on component unmount or when isHovering changes
		return () => {
			clearTimeout(timeoutId)
		}
	}, [isHovering])

	return (
		<header
			className={cn(
				"fixed z-50 bottom-4 flex items-center justify-center w-full transition-all duration-300",
				isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
			)}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<div className="relative w-fit max-w-[90%] p-2 px-4 gap-2 xl:gap-4 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-between border border-gray-200 dark:border-gray-800 transition-all duration-300">
				{/* DarkModeToggle with smooth animation */}
				<div
					className={cn(
						"overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-center",
						isHovering ? "w-10 max-w-[40px] opacity-100 xl:w-12 xl:max-w-[48px]" : "w-0 max-w-0 opacity-0",
					)}
				>
					<DarkModeToggle className="transition-transform duration-300" />
				</div>

				{/* Center content */}
				<div className="flex items-center justify-center gap-1 xl:gap-2 group/Time">
					<Meteo />
					<div>
						<Time
							className={"xl:text-xl duration-300 xl:transform xl:group-hover/Time:translate-y-0 xl:translate-y-3"}
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
						showLogout ? "w-[80px] max-w-[80px] opacity-100 xl:w-[88px] xl:max-w-[88px]" : "w-0 max-w-0 opacity-0",
					)}
				>
					<form action={logout}>
						<Button type="submit" className="whitespace-nowrap transition-transform duration-300">
							Logout
						</Button>
					</form>
				</div>
			</div>
		</header>
	)
}