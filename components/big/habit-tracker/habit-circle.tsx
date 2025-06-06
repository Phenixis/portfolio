"use client"

import { Habit } from "@/lib/db/schema"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { getHabitColorClasses } from "@/lib/types/habit-tracker"

interface HabitCircleProps {
    habit: Habit
    regularityPercentage: number // 0-100
    size?: 'xs' | 'sm' | 'md' | 'lg'
    onClick?: () => void
    className?: string
}

const getSizeClasses = (size: 'xs' | 'sm' | 'md' | 'lg') => {
    const sizeMap = {
        xs: { container: 'w-8 h-8', icon: 'w-3 h-3', text: 'text-xs' },
        sm: { container: 'w-12 h-12', icon: 'w-5 h-5', text: 'text-xs' },
        md: { container: 'w-16 h-16', icon: 'w-6 h-6', text: 'text-sm' },
        lg: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-base' }
    }
    return sizeMap[size]
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

export default function HabitCircle({ 
    habit, 
    regularityPercentage, 
    size = 'md', 
    onClick,
    className 
}: HabitCircleProps) {
    const colorClasses = getHabitColorClasses(habit.color)
    const sizeClasses = getSizeClasses(size)
    
    // Calculate stroke dash array for progress circle
    const radius = size === 'sm' ? 18 : size === 'md' ? 24 : 32
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (regularityPercentage / 100) * circumference

    return (
        <div 
            className={cn(
                "relative flex flex-col items-center gap-2 cursor-pointer group",
                className
            )}
            onClick={onClick}
        >
            {/* Progress Circle */}
            <div className={cn("relative", sizeClasses.container)}>
                <svg 
                    className="transform -rotate-90 w-full h-full"
                    viewBox={`0 0 ${radius * 2 + 8} ${radius * 2 + 8}`}
                >
                    {/* Background circle */}
                    <circle
                        cx={radius + 4}
                        cy={radius + 4}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-muted-foreground/20"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={radius + 4}
                        cy={radius + 4}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        className={cn(colorClasses.text, "transition-all duration-300")}
                        style={{
                            strokeDasharray,
                            strokeDashoffset,
                        }}
                    />
                </svg>
                
                {/* Icon in center */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200",
                    "group-hover:scale-110",
                    habit.is_active ? colorClasses.bg : "bg-muted",
                    habit.is_active ? "text-white" : "text-muted-foreground"
                )}>
                    {renderIcon(habit.icon, sizeClasses.icon)}
                </div>
            </div>
            
            {/* Habit title */}
            <div className="text-center">
                <h4 className={cn("font-medium leading-tight", sizeClasses.text)}>
                    {habit.title}
                </h4>
                <span className={cn("text-muted-foreground", sizeClasses.text)}>
                    {regularityPercentage}%
                </span>
            </div>
        </div>
    )
}
