"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { SettingsSidebar } from '@/components/big/settings/settings-sidebar'
import { MobileSidebarSwipeGesture } from "@/components/ui/mobile-sidebar-swipe-gesture"
import { MobileSidebarToggle } from "@/components/ui/mobile-sidebar-toggle"

function SettingsLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SettingsSidebar />
            <main className="w-full p-4">
                {children}
            </main>
            <MobileSidebarSwipeGesture />
            <MobileSidebarToggle />
        </>
    )
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <SettingsLayoutContent>{children}</SettingsLayoutContent>
        </SidebarProvider>
    )
}
