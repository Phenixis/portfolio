"use client"

import { Habit } from "@/lib/db/schema"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface HabitCircleCompactProps {
    habit: Habit
    regularityPercentage: number // 0-100
    onClick?: () => void
    className?: string
}

// Color mapping for consistent styling
const getHabitColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, text: string }> = {
        red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500' },
        orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500' },
        amber: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500' },
        yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-500' },
        lime: { bg: 'bg-lime-500', border: 'border-lime-500', text: 'text-lime-500' },
        green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-500' },
        emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500' },
        teal: { bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-500' },
        cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-500' },
        sky: { bg: 'bg-sky-500', border: 'border-sky-500', text: 'text-sky-500' },
        blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500' },
        indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-500' },
        violet: { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-500' },
        purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500' },
        fuchsia: { bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', text: 'text-fuchsia-500' },
        pink: { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500' },
        rose: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500' },
        gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500' },
        slate: { bg: 'bg-slate-500', border: 'border-slate-500', text: 'text-slate-500' },
        zinc: { bg: 'bg-zinc-500', border: 'border-zinc-500', text: 'text-zinc-500' },
    }
    return colorMap[color] || colorMap.blue
}

// Helper function to render icon dynamically
const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, (match) => match.charAt(1).toUpperCase())]
    if (IconComponent) {
        return <IconComponent className={className} />
    }
    // Fallback to star icon if the requested icon is not found
    return <LucideIcons.Star className={className} />
}

export default function HabitCircleCompact({ 
    habit, 
    regularityPercentage, 
    onClick,
    className 
}: HabitCircleCompactProps) {
    const colorClasses = getHabitColorClasses(habit.color)
    
    // Calculate the progress indicator style
    const progressWidth = `${regularityPercentage}%`

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div 
                    className={cn(
                        "relative w-8 h-8 rounded-md overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-110",
                        className
                    )}
                    onClick={onClick}
                >
                    {/* Background */}
                    <div className="absolute inset-0 bg-muted" />
                    
                    {/* Progress indicator background */}
                    <div 
                        className={cn(
                            "absolute bottom-0 left-0 transition-all duration-300",
                            colorClasses.bg,
                            "opacity-20"
                        )}
                        style={{
                            width: progressWidth,
                            height: '100%'
                        }}
                    />
                    
                    {/* Main colored background when active */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-200",
                        habit.is_active ? colorClasses.bg : "bg-muted",
                        habit.is_active ? "text-white" : "text-muted-foreground"
                    )}>
                        {renderIcon(habit.icon, "w-4 h-4")}
                    </div>

                    {/* Progress border indicator */}
                    <div 
                        className={cn(
                            "absolute bottom-0 left-0 h-0.5 transition-all duration-300",
                            colorClasses.bg
                        )}
                        style={{
                            width: progressWidth
                        }}
                    />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <div className="text-sm">
                    <div className="font-medium">{habit.title}</div>
                    <div className="text-muted-foreground">{regularityPercentage}% completed</div>
                </div>
            </TooltipContent>
        </Tooltip>
    )
}
