"use client"

import { Habit } from "@/lib/db/schema"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getHabitColorClasses } from "@/lib/types/habit-tracker"
import { useIsHabitOverdue } from "@/hooks/use-overdue-habits"

interface HabitCircleCompactProps {
    habit: Habit
    regularityPercentage: number // 0-100
    onClick?: () => void
    className?: string
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
    const isOverdue = useIsHabitOverdue(habit.id, habit.frequency)
    
    // Calculate the progress indicator style
    const progressWidth = `${regularityPercentage}%`

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div 
                    className={cn(
                        "relative w-8 h-8 rounded-md cursor-pointer group transition-all duration-200 hover:scale-110",
                        className
                    )}
                    onClick={onClick}
                >
                    {/* Background */}
                    <div className="absolute inset-0 bg-muted rounded-md" />
                    
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
                        "absolute inset-0 flex items-center justify-center transition-all duration-200 rounded-md",
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

                    {/* Overdue indicator - red ping marker at top right */}
                    {isOverdue && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <div className="text-sm">
                    <div className="font-medium">{habit.title}</div>
                    <div className="text-muted-foreground">{regularityPercentage}% completed</div>
                    {isOverdue && (
                        <div className="text-red-500 font-medium mt-1">⚠️ Overdue today</div>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}
