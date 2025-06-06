"use client"

import { Habit } from "@/lib/db/schema"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitCircleProps {
    habit: Habit
    regularityPercentage: number // 0-100
    size?: 'xs' | 'sm' | 'md' | 'lg'
    onClick?: () => void
    className?: string
}

// Color mapping for consistent styling
const getHabitColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, border: string, text: string, ring: string }> = {
        red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-500', ring: 'ring-red-500' },
        orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-500', ring: 'ring-orange-500' },
        amber: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500', ring: 'ring-amber-500' },
        yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-500', ring: 'ring-yellow-500' },
        lime: { bg: 'bg-lime-500', border: 'border-lime-500', text: 'text-lime-500', ring: 'ring-lime-500' },
        green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-500', ring: 'ring-green-500' },
        emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500', ring: 'ring-emerald-500' },
        teal: { bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-500', ring: 'ring-teal-500' },
        cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-500', ring: 'ring-cyan-500' },
        sky: { bg: 'bg-sky-500', border: 'border-sky-500', text: 'text-sky-500', ring: 'ring-sky-500' },
        blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-500', ring: 'ring-blue-500' },
        indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-500', ring: 'ring-indigo-500' },
        violet: { bg: 'bg-violet-500', border: 'border-violet-500', text: 'text-violet-500', ring: 'ring-violet-500' },
        purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500', ring: 'ring-purple-500' },
        fuchsia: { bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', text: 'text-fuchsia-500', ring: 'ring-fuchsia-500' },
        pink: { bg: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500', ring: 'ring-pink-500' },
        rose: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-500', ring: 'ring-rose-500' },
        gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500', ring: 'ring-gray-500' },
        slate: { bg: 'bg-slate-500', border: 'border-slate-500', text: 'text-slate-500', ring: 'ring-slate-500' },
        zinc: { bg: 'bg-zinc-500', border: 'border-zinc-500', text: 'text-zinc-500', ring: 'ring-zinc-500' },
    }
    return colorMap[color] || colorMap.blue
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
