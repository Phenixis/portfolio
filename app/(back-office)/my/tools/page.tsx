import React from 'react'

interface ToolCardProps {
    name: string
    description: string
    icon: React.ReactNode
    href: string
}

const ToolCard: React.FC<ToolCardProps> = ({ name, description, icon, href }) => {
    return (
        <a 
            href={href}
            className="block p-6 bg-card border rounded-lg shadow hover:bg-accent/10 transition-colors duration-300 cursor-pointer"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{name}</h2>
                <div className="text-3xl">{icon}</div>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </a>
    )
}

export default function ToolsPage() {
    const tools = [
        {
            name: "Matrix",
            description: "Visualize and prioritize tasks based on importance and urgency",
            icon: "⊞",
            href: "/my/tools/matrix"
        },
        // Future tools can be added here following the same structure
    ]

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Tools</h1>
                <p className="text-muted-foreground">Productivity tools to enhance your workflow</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                    <ToolCard 
                        key={index}
                        name={tool.name}
                        description={tool.description}
                        icon={tool.icon}
                        href={tool.href}
                    />
                ))}
            </div>
        </div>
    )
}