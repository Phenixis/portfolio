"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { ToolsSidebar } from '@/components/big/tools-sidebar'
import { MobileSidebarSwipeGesture } from "@/components/ui/mobile-sidebar-swipe-gesture"
import { MobileSidebarToggle } from "@/components/ui/mobile-sidebar-toggle"

function ToolsLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ToolsSidebar />
            <main className="w-full p-4">
                {children}
            </main>
            <MobileSidebarSwipeGesture />
            <MobileSidebarToggle />
        </>
    )
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <ToolsLayoutContent>{children}</ToolsLayoutContent>
        </SidebarProvider>
    )
}