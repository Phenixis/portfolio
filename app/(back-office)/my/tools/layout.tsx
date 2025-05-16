"use server"

import { cookies } from "next/headers"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ToolsSidebar } from '@/components/big/toolsSidebar'

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <ToolsSidebar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}