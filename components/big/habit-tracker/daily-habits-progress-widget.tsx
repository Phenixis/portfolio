"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle2, Circle, Clock } from "lucide-react"
import { useDailyHabitsProgress } from "@/hooks/use-daily-habits-progress"
import { cn } from "@/lib/utils"
import { getHabitColorClasses } from "@/lib/types/habit-tracker"
import DailyHabitsProgressCircle from "./daily-habits-progress-circle"

interface DailyHabitsProgressWidgetProps {
    className?: string
    showDetailedList?: boolean
}
// Types for habit progress
interface Habit {
    id: string
    title: string
    color: string
}

interface HabitProgress {
    habit: Habit
    isCompleted: boolean
    currentCount: number
    targetCount: number
    progress: number
}

export default function DailyHabitsProgressWidget({ 
    className, 
    showDetailedList = true 
}: DailyHabitsProgressWidgetProps) {
    const dailyProgress = useDailyHabitsProgress()

    if (dailyProgress.total === 0) {
        return (
            <Card className={cn("", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <Target size={20} />
                        Daily Habits Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Circle className="text-muted-foreground/50 mb-4" size={48} />
                        <p className="text-muted-foreground mb-2">No daily habits set up</p>
                        <p className="text-sm text-muted-foreground/70">
                            Create your first daily habit to start tracking your progress
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const isComplete = dailyProgress.percentage === 100

    return (
        <Card className={cn("", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    Daily Habits Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Main Progress Circle */}
                <div className="flex items-center justify-center">
                    <DailyHabitsProgressCircle
                        percentage={dailyProgress.percentage}
                        total={dailyProgress.total}
                        size="lg"
                    />
                </div>

                {/* Progress Summary */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        {isComplete ? (
                            <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                            <Clock className="text-muted-foreground" size={20} />
                        )}
                        <h3 className="font-semibold text-lg">
                            {isComplete ? "All Done!" : `${dailyProgress.completed} of ${dailyProgress.total} Complete`}
                        </h3>
                    </div>
                    <p className="text-muted-foreground">
                        {isComplete 
                            ? "You've completed all your daily habits for today! 🎉"
                            : `${dailyProgress.total - dailyProgress.completed} habits remaining`
                        }
                    </p>
                </div>

                {/* Overall Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">{dailyProgress.percentage}%</span>
                    </div>
                    <Progress 
                        value={dailyProgress.percentage} 
                        className="h-2"
                    />
                </div>

                {/* Detailed Habit List */}
                {showDetailedList && dailyProgress.habits.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">Today&apos;s Habits</h4>
                        <div className="space-y-2">
                            {dailyProgress.habits.map((habitProgress: HabitProgress) => {
                                const colorClasses = getHabitColorClasses(habitProgress.habit.color)
                                return (
                                    <div key={habitProgress.habit.id} className="flex items-center justify-between p-2 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center",
                                                habitProgress.isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : colorClasses.bg + " text-white opacity-40"
                                            )}>
                                                {habitProgress.isCompleted ? (
                                                    <CheckCircle2 size={14} />
                                                ) : (
                                                    <Circle size={14} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{habitProgress.habit.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {habitProgress.currentCount} / {habitProgress.targetCount}
                                                    {habitProgress.isCompleted && " ✓"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {habitProgress.progress}%
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
