import type React from "react"
import { tools, type ToolCardProps } from "@/lib/tools-data"
import Link from "next/link"

const ToolCard: React.FC<ToolCardProps> = ({ name, description, icon, href }) => {
    return (
        <Link
            href={href}
            className="block p-6 bg-card border rounded-lg shadow hover:bg-accent/10 transition-colors duration-300 cursor-pointer"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{name}</h2>
                <div className="text-3xl">{icon}</div>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </Link>
    )
}

export default function ToolsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Tools</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter((tool) => tool.href !== "/my/tools").map((tool, index) => (
                    <ToolCard key={index} name={tool.name} description={tool.description} icon={tool.icon} href={tool.href} />
                ))}
            </div>
        </div>
    )
}
