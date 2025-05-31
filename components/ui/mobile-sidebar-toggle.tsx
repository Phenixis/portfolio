"use client"

import * as React from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileSidebarToggleProps {
    className?: string
}

/**
 * A half-visible round button that attaches to the sidebar for opening/closing on mobile devices.
 * When sidebar is closed: shows chevron right (half-visible from left edge)
 * When sidebar is open: shows chevron left (attached to sidebar edge)
 */
export function MobileSidebarToggle({ className }: MobileSidebarToggleProps) {
    const { open, openMobile, toggleSidebar } = useSidebar()
    const isMobile = useIsMobile()
    
    // Don't render on desktop
    if (!isMobile) {
        return null
    }

    const isOpen = isMobile ? openMobile : open

    const handleButtonClick = () => {
        toggleSidebar()
    }

    return (
        <button
            onClick={handleButtonClick}
            className={cn(
                // Base button styling
                "fixed z-30 h-12 w-12 rounded-full",
                // Background and colors
                "bg-primary text-primary-foreground",
                // Shadow for depth
                "shadow-lg",
                // Flex centering for icon
                "flex items-center justify-center",
                // Hover and active states
                "hover:bg-primary/90 active:bg-primary/80",
                // Smooth transitions for position and transform
                "transition-all duration-300 ease-in-out",
                // Focus styles for accessibility
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                // Position based on sidebar state
                isOpen 
                    ? "hidden"
                    : "bottom-8 left-0 -translate-x-1/2", // Half-visible from left edge
                className
            )}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            type="button"
        >
            {isOpen ? (
                <ChevronLeft className="size-5" />
            ) : (
                <ChevronRight className="size-5 ml-1" />
            )}
        </button>
    )
}
