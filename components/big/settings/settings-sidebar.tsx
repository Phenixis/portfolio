import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { User, Palette, Shield } from "lucide-react"

const settingsItems = [
    {
        name: "Profile",
        href: "/my/settings/profile",
        icon: <User className="size-4" />,
        description: "Manage your personal information"
    },
    {
        name: "Appearance",
        href: "/my/settings/appearance",
        icon: <Palette className="size-4" />,
        description: "Dark mode and UI preferences"
    },
    {
        name: "Security",
        href: "/my/settings/security",
        icon: <Shield className="size-4" />,
        description: "Password and security settings"
    }
]

export function SettingsSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating" className="rounded-full">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        className="flex items-center space-x-2 text-wrap"
                                        asChild
                                        tooltip={item.description}
                                    >
                                        <Link href={item.href}>
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex-row md:hidden items-center justify-center">
                <SidebarTrigger />
                <div className="font-semibold">
                    Close Sidebar
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
