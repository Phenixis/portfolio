"use server"

import { SidebarProvider } from "@/components/ui/sidebar"
import { ToolsSidebar } from '@/components/big/tools-sidebar'

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider defaultOpen={false}>
            <ToolsSidebar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}