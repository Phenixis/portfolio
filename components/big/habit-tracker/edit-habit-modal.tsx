"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSWRConfig } from "swr"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { HABIT_FREQUENCIES, HABIT_COLORS, HABIT_ICONS, HabitFrequency, HabitColor, HabitIcon, getFrequencyLabel } from "@/lib/types/habit-tracker"
import { Habit } from "@/lib/db/schema"
import * as LucideIcons from "lucide-react"

interface EditHabitModalProps {
    habit: Habit | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditHabitModal({
    habit,
    isOpen,
    onOpenChange,
}: EditHabitModalProps) {
    const { user } = useUser()
    const { mutate } = useSWRConfig()

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [frequency, setFrequency] = useState<HabitFrequency>(HABIT_FREQUENCIES.DAILY)
    const [targetCount, setTargetCount] = useState(1)
    const [selectedColor, setSelectedColor] = useState<HabitColor>(HABIT_COLORS.BLUE)
    const [selectedIcon, setSelectedIcon] = useState<HabitIcon>('star')
    const [isActive, setIsActive] = useState(true)
    const [formChanged, setFormChanged] = useState(false)

    // Track if a submission is in progress (to prevent duplicates)
    const isSubmittingRef = useRef(false)

    // Initialize form when habit changes
    useEffect(() => {
        if (habit) {
            setTitle(habit.title)
            setDescription(habit.description || "")
            setFrequency(habit.frequency as HabitFrequency)
            setTargetCount(habit.target_count)
            setSelectedColor(habit.color as HabitColor)
            setSelectedIcon(habit.icon as HabitIcon)
            setIsActive(habit.is_active)
            setFormChanged(false)
        }
    }, [habit])

    const resetFormToOriginal = () => {
        if (habit) {
            setTitle(habit.title)
            setDescription(habit.description || "")
            setFrequency(habit.frequency as HabitFrequency)
            setTargetCount(habit.target_count)
            setSelectedColor(habit.color as HabitColor)
            setSelectedIcon(habit.icon as HabitIcon)
            setIsActive(habit.is_active)
            setFormChanged(false)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resetFormToOriginal()
        }
        onOpenChange(newOpen)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isSubmittingRef.current || !habit) return
        isSubmittingRef.current = true

        try {
            if (!title.trim()) {
                toast.error("Please enter a habit title")
                isSubmittingRef.current = false
                return
            }

            if (!user?.id) {
                toast.error("Please log in to edit habits")
                isSubmittingRef.current = false
                return
            }

            const habitData = {
                title: title.trim(),
                description: description.trim() || null,
                frequency,
                target_count: targetCount,
                color: selectedColor,
                icon: selectedIcon,
                is_active: isActive,
            }

            // Optimistic update
            mutate("/api/habits", async (currentData: any) => {
                if (currentData && Array.isArray(currentData)) {
                    return currentData.map((h: Habit) => 
                        h.id === habit.id 
                            ? { ...h, ...habitData, updated_at: new Date().toISOString() }
                            : h
                    )
                }
                return currentData || []
            }, { revalidate: false })

            const response = await fetch(`/api/habits/${habit.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.api_key}`,
                },
                body: JSON.stringify(habitData),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                toast.success("Habit updated successfully!")
                onOpenChange(false)
                // Force revalidation to get fresh data from server
                await mutate("/api/habits")
            } else {
                throw new Error(result.error || "Failed to update habit")
            }
        } catch (error) {
            console.error("Error updating habit:", error)
            toast.error(`Failed to update habit: ${error instanceof Error ? error.message : "Unknown error"}`)
            // Force rollback and revalidate
            await mutate("/api/habits")
        } finally {
            isSubmittingRef.current = false
        }
    }

    const verifyFormChanged = () => {
        if (!habit) return

        setFormChanged(
            title.trim() !== habit.title ||
            (description.trim() || null) !== habit.description ||
            frequency !== habit.frequency ||
            targetCount !== habit.target_count ||
            selectedColor !== habit.color ||
            selectedIcon !== habit.icon ||
            isActive !== habit.is_active
        )
    }

    // Helper function to render icon dynamically
    const renderIcon = (iconName: HabitIcon, className?: string) => {
        const IconComponent = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, (match) => match.charAt(1).toUpperCase())]
        if (IconComponent) {
            return <IconComponent className={className} />
        }
        // Fallback to star icon if the requested icon is not found
        return <LucideIcons.Star className={className} />
    }

    if (!habit) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent 
                className="sm:max-w-[500px]"
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>Edit Habit</DialogTitle>
                </DialogHeader>
                <form id="edit-habit-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="edit-title" className="required">Title</Label>
                        <Input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                verifyFormChanged()
                            }}
                            placeholder="e.g., Drink 8 glasses of water"
                            autoFocus
                            className="text-sm lg:text-base"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="edit-description">Description (optional)</Label>
                        <Textarea
                            id="edit-description"
                            name="description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                verifyFormChanged()
                            }}
                            placeholder="Add details about your habit..."
                            rows={3}
                            className="text-xs lg:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-frequency" className="required">Frequency</Label>
                            <Select
                                name="frequency"
                                value={frequency}
                                onValueChange={(value: HabitFrequency) => {
                                    setFrequency(value)
                                    verifyFormChanged()
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(HABIT_FREQUENCIES).map((freq) => (
                                        <SelectItem key={freq} value={freq}>
                                            {getFrequencyLabel(freq)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-targetCount" className="required">Target Count</Label>
                            <Input
                                type="number"
                                id="edit-targetCount"
                                name="targetCount"
                                value={targetCount}
                                onChange={(e) => {
                                    const value = Math.max(1, parseInt(e.target.value) || 1)
                                    setTargetCount(value)
                                    verifyFormChanged()
                                }}
                                min="1"
                                max="100"
                                className="text-sm lg:text-base"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Color</Label>
                        <div className="grid grid-cols-10 gap-2 mt-2">
                            {Object.values(HABIT_COLORS).map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all duration-200",
                                        `bg-${color}-500`,
                                        selectedColor === color 
                                            ? "border-gray-900 dark:border-gray-100 scale-110" 
                                            : "border-gray-300 dark:border-gray-600 hover:scale-105"
                                    )}
                                    onClick={() => {
                                        setSelectedColor(color)
                                        verifyFormChanged()
                                    }}
                                    aria-label={`Select ${color} color`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label>Icon</Label>
                        <div className="grid grid-cols-8 gap-2 mt-2 max-h-32 overflow-y-auto">
                            {HABIT_ICONS.map((iconName) => (
                                <button
                                    key={iconName}
                                    type="button"
                                    className={cn(
                                        "p-2 rounded-lg border transition-all duration-200 flex items-center justify-center",
                                        selectedIcon === iconName
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                                    )}
                                    onClick={() => {
                                        setSelectedIcon(iconName)
                                        verifyFormChanged()
                                    }}
                                    aria-label={`Select ${iconName} icon`}
                                >
                                    {renderIcon(iconName, "w-4 h-4")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="edit-isActive"
                            checked={isActive}
                            onChange={(e) => {
                                setIsActive(e.target.checked)
                                verifyFormChanged()
                            }}
                            className="rounded border-gray-300 dark:border-gray-600"
                        />
                        <Label htmlFor="edit-isActive">Active</Label>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!formChanged || isSubmittingRef.current}>
                            {isSubmittingRef.current ? "Updating..." : "Update Habit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
