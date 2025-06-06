"use client"

import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

interface DailyHabitsProgressCircleProps {
    percentage: number
    total: number
    size?: 'xs' | 'sm' | 'md' | 'lg'
    className?: string
}

const sizeClasses = {
    xs: {
        container: "size-8",
        circle: "size-6",
        text: "text-xs",
        icon: 8
    },
    sm: {
        container: "size-12",
        circle: "size-10",
        text: "text-xs",
        icon: 10
    },
    md: {
        container: "size-16",
        circle: "size-14",
        text: "text-sm",
        icon: 16
    },
    lg: {
        container: "size-22",
        circle: "size-18",
        text: "text-base",
        icon: 24
    }
}

export default function DailyHabitsProgressCircle({
    percentage,
    total,
    size = 'md',
    className
}: DailyHabitsProgressCircleProps) {
    const sizes = sizeClasses[size]
    const circumference = 2 * Math.PI * 45 // radius of 45 for the SVG circle
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    if (total === 0) {
        return (
            <div className={cn(
                "flex flex-col items-center justify-center rounded-full bg-muted/50 border-2 border-dashed border-muted-foreground/30",
                sizes.container,
                className
            )}>
                <Circle className="text-muted-foreground/50" size={sizes.icon} />
                <span className={cn("text-muted-foreground/70 font-medium mt-1", sizes.text)}>
                    No habits
                </span>
            </div>
        )
    }

    const isComplete = percentage === 100

    return (
        <div className={cn(
            "relative flex flex-col items-center justify-center",
            sizes.container,
            className
        )}>
            {/* Progress Circle */}
            <svg
                className="transform -rotate-90 absolute inset-0"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-muted/30"
                />
                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={cn(
                        "transition-all duration-500 ease-in-out",
                        isComplete 
                            ? "text-green-500" 
                            : percentage > 50 
                                ? "text-blue-500" 
                                : "text-orange-500"
                    )}
                    style={{
                        strokeDashoffset,
                        strokeDasharray: circumference,
                    }}
                />
            </svg>
        </div>
    )
}
