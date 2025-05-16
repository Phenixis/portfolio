"use client"

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
    useSidebar
} from "@/components/ui/sidebar"
import { LayoutGrid, Grid2X2 } from "lucide-react"
import Link from "next/link"

// List of all available tools
// This array can be expanded as more tools are added
const tools = [
    {
        name: "All Tools",
        href: "/my/tools",
        icon: <LayoutGrid className="h-5 w-5" />,
        description: "View all available tools"
    },
    {
        name: "Weighted Multi-Criteria Decision Matrix",
        href: "/my/tools/WMCDM",
        icon: <Grid2X2 className="h-5 w-5" />,
        description: "Weighted Multi-Criteria Decision Matrix"
    },
    // Future tools can be added here following the same structure
]

export function ToolsSidebar() {
    const { state } = useSidebar()
    
    return (
        <Sidebar collapsible="icon" variant="floating" className="rounded-full">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tools.map((tool) => (
                                <SidebarMenuItem key={tool.name}>
                                    <SidebarMenuButton
                                        className="flex items-center space-x-2"
                                        asChild
                                    >
                                        <Link href={tool.href}>
                                            {tool.icon}
                                            <span>{tool.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarTrigger
                    className="w-full"
                />
            </SidebarFooter>
        </Sidebar>
    )
}
