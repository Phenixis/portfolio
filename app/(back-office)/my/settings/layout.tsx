"use server"

import { SidebarProvider } from "@/components/ui/sidebar"
import { SettingsSidebar } from '@/components/big/settings/settings-sidebar'

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <SettingsSidebar />
            <main className="w-full p-4">
                {children}
            </main>
        </SidebarProvider>
    )
}
