"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"
import { useHabits } from "@/hooks/use-habits"
import { useHabitRegularity } from "@/hooks/use-habit-entries"
import { useDailyHabitsProgress } from "@/hooks/use-daily-habits-progress"
import { useCreateHabitModal } from "@/contexts/modal-commands-context"
import HabitCircleCompact from "./habit-circle-compact"
import HabitActionDialog from "./habit-action-dialog"
import DailyHabitsProgressCircle from "./daily-habits-progress-circle"
import { Habit } from "@/lib/db/schema"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface HabitWidgetProps {
    className?: string
}

// Component to wrap habit circle with regularity calculation
function HabitCircleWithRegularity({ habit, onHabitClick }: {
    habit: Habit,
    onHabitClick: (habit: Habit) => void
}) {
    const regularityPercentage = useHabitRegularity(
        habit.id,
        habit.frequency,
        habit.target_count
    )

    return (
        <HabitCircleCompact
            habit={habit}
            regularityPercentage={regularityPercentage}
            onClick={() => onHabitClick(habit)}
        />
    )
}

export default function HabitWidget({ className }: HabitWidgetProps) {
    const { habits, isLoading, isError } = useHabits()
    const createHabitModal = useCreateHabitModal()
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)

    // Get daily habits progress
    const dailyProgress = useDailyHabitsProgress()

    // Filter only active habits for dashboard
    interface ActiveHabit extends Habit {
        is_active: boolean
    }

    const activeHabits: ActiveHabit[] = habits.filter(
        (habit: Habit): habit is ActiveHabit => habit.is_active
    )

    const handleHabitClick = (habit: Habit) => {
        setSelectedHabit(habit)
        setIsActionDialogOpen(true)
    }

    const handleCreateHabit = () => {
        createHabitModal.openModal()
    }

    if (isError) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp size={20} />
                        Your Habits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground">
                        Failed to load habits
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <TooltipProvider>
            <Card className={cn("md:max-w-xl", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={20} />
                            Your Habits
                            {/* Daily Progress Circle */}
                            {dailyProgress.total > 0 && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <DailyHabitsProgressCircle
                                            percentage={dailyProgress.percentage}
                                            total={dailyProgress.total}
                                            size="xs"
                                            className="ml-2"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <div className="text-center">
                                            <p className="font-medium">Daily Progress</p>
                                            <p className="text-sm text-muted-foreground">
                                                {dailyProgress.completed} of {dailyProgress.total} daily habits completed
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {dailyProgress.percentage}% complete
                                            </p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCreateHabit}
                            className="text-foreground"
                        >
                            <Plus size={16} />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="grid grid-cols-10 gap-1.5">
                            {[...Array(30)].map((_, i) => (
                                <div key={i} className="w-8 h-8 bg-muted rounded-md animate-pulse"></div>
                            ))}
                        </div>
                    ) : activeHabits.length > 0 ? (
                        <div className="grid grid-cols-10 gap-1.5">
                            {activeHabits.slice(0, 30).map((habit) => (
                                <HabitCircleWithRegularity
                                    key={habit.id}
                                    habit={habit}
                                    onHabitClick={handleHabitClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-muted-foreground mb-4">
                                No active habits yet
                            </div>
                            <Button
                                onClick={handleCreateHabit}
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Create Your First Habit
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <HabitActionDialog
                habit={selectedHabit}
                isOpen={isActionDialogOpen}
                onOpenChange={setIsActionDialogOpen}
            />
        </TooltipProvider>
    )
}
