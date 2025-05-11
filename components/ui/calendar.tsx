"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type TaskCount = {
    count: number
    due: string
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    taskCounts?: TaskCount[]
}

function Calendar({ className, classNames, showOutsideDays = true, taskCounts = [], ...props }: CalendarProps) {
    // Function to get task count for a specific date
    const getTaskCountForDate = (date: Date) => {
        // Find task count for this date (comparing just the date part)
        const taskData = taskCounts.find((task) => new Date(task.due).toDateString() === date.toDateString())
        return taskData?.count || 0
    }

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-2 h-fit", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 lg:hover:opacity-100",
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-7 lg:w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-7 lg:h-9 w-7 lg:w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(buttonVariants({ variant: "ghost" }), "h-7 lg:h-9 w-7 lg:w-9 p-0 font-normal aria-selected:opacity-100 relative"),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground lg:hover:bg-primary lg:hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
                IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
                DayContent: (props) => {
                    const taskCount = getTaskCountForDate(props.date)
                    const maxDots = 5 // Maximum number of dots to display
                    const dotsToShow = Math.min(taskCount, maxDots)

                    return (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="mb-1">{props.date.getDate()}</div>
                            {taskCount > 0 && (
                                <div className="grid grid-cols-3 lg:grid-cols-5 justify-center gap-0.5 absolute bottom-1">
                                    {Array.from({ length: dotsToShow }).map((_, i) => (
                                        <div key={i} className={`h-1 w-1 rounded-full ${props.date.getDate() == new Date().getDate() ? "bg-secondary" : "bg-primary"}`} aria-hidden="true" />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                },
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
