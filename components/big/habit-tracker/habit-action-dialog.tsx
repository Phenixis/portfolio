"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Calendar, Target, Minus } from "lucide-react"
import { Habit } from "@/lib/db/schema"
import type { HabitEntry } from "@/lib/db/schema"
import { getFrequencyLabel, HabitFrequency } from "@/lib/types/habit-tracker"
import { useEditHabitModal } from "@/contexts/modal-commands-context"
import { useState, useEffect, useMemo } from "react"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { useHabitEntries } from "@/hooks/use-habit-entries"
import { useSWRConfig } from "swr"
import * as LucideIcons from "lucide-react"
import Tooltip from "../tooltip"

interface HabitActionDialogProps {
    habit: Habit | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

// Helper function to render icon dynamically
const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, (match) => match.charAt(1).toUpperCase())]
    if (IconComponent) {
        return <IconComponent className={className} />
    }
    return <LucideIcons.Star className={className} />
}

const getHabitColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string }> = {
        red: { bg: 'bg-red-500', text: 'text-red-500' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500' },
        amber: { bg: 'bg-amber-500', text: 'text-amber-500' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
        lime: { bg: 'bg-lime-500', text: 'text-lime-500' },
        green: { bg: 'bg-green-500', text: 'text-green-500' },
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500' },
        teal: { bg: 'bg-teal-500', text: 'text-teal-500' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500' },
        sky: { bg: 'bg-sky-500', text: 'text-sky-500' },
        blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500' },
        violet: { bg: 'bg-violet-500', text: 'text-violet-500' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-500' },
        fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-500' },
        pink: { bg: 'bg-pink-500', text: 'text-pink-500' },
        rose: { bg: 'bg-rose-500', text: 'text-rose-500' },
        gray: { bg: 'bg-gray-500', text: 'text-gray-500' },
        slate: { bg: 'bg-slate-500', text: 'text-slate-500' },
        zinc: { bg: 'bg-zinc-500', text: 'text-zinc-500' },
    }
    return colorMap[color] || colorMap.blue
}

export default function HabitActionDialog({ habit, isOpen, onOpenChange }: HabitActionDialogProps) {
    const { user } = useUser()
    const { mutate } = useSWRConfig()
    const editHabitModal = useEditHabitModal()
    const [isAddingEntry, setIsAddingEntry] = useState(false)
    const [entryCount, setEntryCount] = useState(1)
    const [entryNotes, setEntryNotes] = useState("")

    // Get habit entries for this habit
    const { entries } = useHabitEntries(habit?.id)

    // Calculate past 7 days data
    const past7Days = useMemo(() => {
        if (!habit) return []

        const days = []
        const today = new Date()

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            const dateStr = date.toISOString().split('T')[0]
            const entry = entries.find((e: HabitEntry) => {
                const entryDate = new Date(e.date)
                entryDate.setHours(0, 0, 0, 0)
                return entryDate.toISOString().split('T')[0] === dateStr
            })

            days.push({
                date: date,
                dateStr: dateStr,
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                dayNumber: date.getDate(),
                entry: entry || null,
                count: entry?.count || 0,
                isToday: i === 0
            })
        }

        return days
    }, [entries, habit])

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (isOpen) {
            setEntryCount(1)
            setEntryNotes("")
            setIsAddingEntry(false)
        }
    }, [isOpen])

    if (!habit) return null

    const colorClasses = getHabitColorClasses(habit.color)

    const handleAddEntry = async () => {
        if (!user?.api_key || isAddingEntry) return

        setIsAddingEntry(true)

        try {
            const today = new Date()
            today.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues

            const entryData = {
                habit_id: habit.id,
                user_id: user.id,
                date: today.toISOString(),
                count: entryCount,
                notes: entryNotes.trim() || null
            }

            const response = await fetch("/api/habit-entries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.api_key}`,
                },
                body: JSON.stringify(entryData),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                toast.success("Habit entry added!")
                mutate("/api/habit-entries")
                mutate(`/api/habit-entries?habit_id=${habit.id}`) // Refresh specific habit entries
                setEntryCount(1)
                setEntryNotes("")
                onOpenChange(false)
            } else {
                throw new Error(result.error || "Failed to add habit entry")
            }
        } catch (error) {
            console.error("Error adding habit entry:", error)
            toast.error(`Failed to add entry: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setIsAddingEntry(false)
        }
    }

    const handleEditHabit = () => {
        editHabitModal.openModal(habit)
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${colorClasses.bg} flex items-center justify-center text-white`}>
                            {renderIcon(habit.icon, "w-4 h-4")}
                        </div>
                        {habit.title}
                    </DialogTitle>
                </DialogHeader>

                {/* Past 7 Days */}
                <div className="grid grid-cols-7 gap-2">
                    {past7Days.map((day) => {
                        const hasEntry = day.count > 0
                        const metTarget = day.count >= habit.target_count

                        return (
                            <div key={day.dateStr} className="flex flex-col items-center space-y-1">
                                <div className="text-xs text-muted-foreground font-medium">
                                    {day.dayName}
                                </div>
                                <Tooltip tooltip={day.entry?.notes || ""}>
                                    <div
                                        className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium border-2 transition-all
                                        ${day.isToday ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                                        ${hasEntry
                                                ? metTarget
                                                    ? `${colorClasses.bg} border-transparent text-white`
                                                    : `bg-yellow-100 border-yellow-300 text-yellow-700`
                                                : 'bg-gray-100 border-gray-200 text-gray-400'
                                            }
                                            `}
                                    >
                                        {hasEntry ? day.count : day.dayNumber}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium pt-1">
                                        {day.count}
                                    </div>
                                </Tooltip>
                            </div>
                        )
                    })}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${colorClasses.bg}`}></div>
                        <span>Target met</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-yellow-200"></div>
                        <span>Partial</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-gray-200"></div>
                        <span>No entry</span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    {/* Habit info */}
                    <Card>
                        <CardContent fullPadding>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-muted-foreground" />
                                    <span className="font-medium">Frequency:</span>
                                    <span className="text-muted-foreground">
                                        {getFrequencyLabel(habit.frequency as HabitFrequency)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target size={14} className="text-muted-foreground" />
                                    <span className="font-medium">Target:</span>
                                    <span className="text-muted-foreground">
                                        {habit.target_count} per {habit.frequency}
                                    </span>
                                </div>
                                {habit.description && (
                                    <p className="text-muted-foreground mt-2">
                                        {habit.description}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>


                    {/* Entry form */}
                    <Card>
                        <CardContent fullPadding>
                            <div className="space-y-4">
                                <h3 className="font-medium">Add Today&apos;s Entry</h3>

                                {/* Count input */}
                                <div className="space-y-2">
                                    <Label htmlFor="entry-count">Count</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEntryCount(Math.max(1, entryCount - 1))}
                                            disabled={entryCount <= 1}
                                        >
                                            <Minus size={14} />
                                        </Button>
                                        <Input
                                            id="entry-count"
                                            type="number"
                                            min="1"
                                            value={entryCount}
                                            onChange={(e) => setEntryCount(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-full text-center"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEntryCount(entryCount + 1)}
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Notes input */}
                                <div className="space-y-2">
                                    <Label htmlFor="entry-notes">Notes (optional)</Label>
                                    <Textarea
                                        id="entry-notes"
                                        placeholder="Add notes about today's progress..."
                                        value={entryNotes}
                                        onChange={(e) => setEntryNotes(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleEditHabit}
                            className="flex items-center gap-2"
                            size="lg"
                        >
                            <Edit size={18} />
                            Edit Habit
                        </Button>

                        <Button
                            onClick={handleAddEntry}
                            disabled={isAddingEntry}
                            className="flex items-center gap-2"
                            size="lg"
                        >
                            <Plus size={18} />
                            {isAddingEntry ? "Adding..." : `Add Entry (${entryCount}x)`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
