"use client"

import { useEffect, useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { TASK_PARAMS } from "../tasks/tasks-card"
import { useNumberOfTasks } from "@/hooks/use-number-of-tasks"
import { useDailyMoods } from "@/hooks/use-daily-moods" 

export default function Calendar({
    className,
    showNumberOfTasks = true,
    showDailyMood = true,
}: {
    className: string,
    showNumberOfTasks?: boolean
    showDailyMood?: boolean
}) {
    const searchParams = useSearchParams()
    const now = new Date()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [month, setMonth] = useState<Date>(date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth(), 1))

    // Only fetch data when showNumberOfTasks is true
    const { data, isLoading, isError } = useNumberOfTasks({
        completed: false,
        projectTitles: searchParams.get(TASK_PARAMS.PROJECTS)
            ? searchParams.get(TASK_PARAMS.PROJECTS)?.split(",")
            : undefined,
        excludedProjectTitles: searchParams.get(TASK_PARAMS.REMOVED_PROJECTS)
            ? searchParams.get(TASK_PARAMS.REMOVED_PROJECTS)?.split(",")
            : undefined,
        dueAfter: month ? new Date(month.getFullYear(), month.getMonth(), 0) : undefined,
        dueBefore: month ? new Date(month.getFullYear(), month.getMonth() + 1, 0) : undefined,
        enabled: showNumberOfTasks, // Skip data fetching when not needed
    })

    // Fetch daily moods data
    const { data: dailyMoods, isLoading: isLoadingDailyMoods, isError: isErrorDailyMoods } = useDailyMoods({
        startDate: new Date(month.getFullYear(), month.getMonth(), 1),
        endDate: new Date(month.getFullYear(), month.getMonth() + 1, 0),
        enabled: showDailyMood,
    })

    useEffect(() => {
        if (!date) {
            setDate(new Date())
        }
    }, [date])

    return (
        <div
            className={cn(
                "flex flex-row lg:flex-col justify-start items-start lg:items-center border border-gray-100 dark:border-gray-800 lg:h-screen",
                className,
            )}
        >
            <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                onDayClick={(day) => {
                    console.log(day)
                }}
                taskCounts={showNumberOfTasks ? data : []}
                dailyMoods={showDailyMood ? dailyMoods : []}
                onMonthChange={(month) => {
                    setMonth(month)
                }}
            />
            <div>
                <div className="flex items-center justify-center w-full text-2xl">
                    <div className="flex flex-col items-center justify-center w-fit text-xl p-2">{date?.getDate()}</div>
                    <div className="flex flex-col items-center justify-center w-full text-xl">
                        <div className="w-full">
                            {date?.toLocaleDateString(undefined, {
                                weekday: "short",
                            })}
                        </div>
                        <div className="w-full text-base flex flex-row gap-2">
                            <div>
                                {date?.toLocaleDateString(undefined, {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </div>
                            <div>
                                {(() => {
                                    if (!date) return ""
                                    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
                                    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
                                    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
                                    const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
                                    return (
                                        <span>
                                            W<span className="hidden lg:inline">eek </span>
                                            {weekNumber}
                                        </span>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
