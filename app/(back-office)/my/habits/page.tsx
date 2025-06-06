"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"
import { useCreateHabitModal } from "@/contexts/modal-commands-context"
import { useHabits } from "@/hooks/use-habits"
import { useHabitRegularity } from "@/hooks/use-habit-entries"
import { Habit } from "@/lib/db/schema"
import HabitCircle from "@/components/big/habit-tracker/habit-circle"
import HabitActionDialog from "@/components/big/habit-tracker/habit-action-dialog"
import { useState } from "react"

// Component to wrap habit circle with regularity calculation - moved outside main component
const HabitCircleWithRegularity = ({ habit, onHabitClick }: { 
    habit: Habit, 
    onHabitClick: (habit: Habit) => void 
}) => {
    const regularityPercentage = useHabitRegularity(
        habit.id, 
        habit.frequency, 
        habit.target_count
    )

    return (
        <HabitCircle
            habit={habit}
            regularityPercentage={regularityPercentage}
            size="lg"
            onClick={() => onHabitClick(habit)}
        />
    )
}

export default function HabitTrackerPage() {
    const createHabitModal = useCreateHabitModal()
    const { habits, isLoading, isError } = useHabits()
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)

    const handleHabitClick = (habit: Habit) => {
        setSelectedHabit(habit)
        setIsActionDialogOpen(true)
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Habit Tracker</h1>
                    <p className="text-muted-foreground mt-1">
                        Build better habits and track your progress
                    </p>
                </div>
                <Button
                    onClick={() => createHabitModal.openModal()}
                    className="flex items-center gap-2"
                    size="lg"
                >
                    <Plus size={18} />
                    Create Habit
                </Button>
            </div>

            {isError ? (
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <div className="text-destructive text-lg mb-2">⚠️ Error Loading Habits</div>
                            <p className="text-muted-foreground">Failed to load habits. Please try again later.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                            <div className="w-20 h-20 bg-muted rounded-full"></div>
                            <div className="h-4 w-16 bg-muted rounded"></div>
                            <div className="h-3 w-12 bg-muted rounded"></div>
                        </div>
                    ))}
                </div>
            ) : habits.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {habits.map((habit: Habit) => (
                        <HabitCircleWithRegularity
                            key={habit.id}
                            habit={habit}
                            onHabitClick={handleHabitClick}
                        />
                    ))}
                </div>
            ) : (
                <Card className="border-dashed border-2">
                    <CardContent className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                                <Target size={32} className="text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">
                                    Start building better habits by creating your first one. Track your progress and achieve your goals one habit at a time.
                                </p>
                                <Button
                                    onClick={() => createHabitModal.openModal()}
                                    className="flex items-center gap-2"
                                    size="lg"
                                >
                                    <Plus size={18} />
                                    Create Your First Habit
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <HabitActionDialog
                habit={selectedHabit}
                isOpen={isActionDialogOpen}
                onOpenChange={setIsActionDialogOpen}
            />
        </div>
    )
}