"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/components/ui/sidebar"

/**
 * A swipe gesture handler for opening sidebars on mobile devices.
 * Detects right swipe gestures from anywhere on the screen to open the sidebar.
 */
export function MobileSidebarSwipeGesture() {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const { openMobile, toggleSidebar } = useSidebar()
    
    // Only show on pages that have sidebars
    const hasSidebar = pathname.startsWith("/my/tools") || pathname.startsWith("/my/settings")
    
    React.useEffect(() => {
        // Don't add listeners on desktop or pages without sidebars
        if (!isMobile || !hasSidebar) {
            return
        }

        let startX = 0
        let startY = 0
        let startTime = 0

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0]
            startX = touch.clientX
            startY = touch.clientY
            startTime = Date.now()
        }

        const handleTouchEnd = (e: TouchEvent) => {
            const touch = e.changedTouches[0]
            const endX = touch.clientX
            const endY = touch.clientY
            const endTime = Date.now()

            const deltaX = endX - startX
            const deltaY = endY - startY
            const deltaTime = endTime - startTime

            // Only trigger if:
            // 1. Swipe moved right at least 100px
            // 2. Vertical movement is less than horizontal (not vertical scroll)
            // 3. Swipe was fast enough (less than 500ms)
            // 4. Sidebar is currently closed
            if (
                deltaX >= 100 && // Moved right at least 100px
                Math.abs(deltaY) < Math.abs(deltaX) && // More horizontal than vertical
                deltaTime < 500 && // Fast enough
                !openMobile // Only open when closed
            ) {
                // Open the sidebar using the sidebar context
                toggleSidebar()
            }
        }

        // Add touch listeners to the document
        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        document.addEventListener('touchend', handleTouchEnd, { passive: true })

        return () => {
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isMobile, hasSidebar, openMobile, toggleSidebar])

    // This component doesn't render anything, it just adds event listeners
    return null
}
