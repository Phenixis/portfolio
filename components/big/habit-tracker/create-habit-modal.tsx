"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSWRConfig } from "swr"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { HABIT_FREQUENCIES, HABIT_COLORS, HABIT_ICONS, HabitFrequency, HabitColor, HabitIcon, getFrequencyLabel } from "@/lib/types/habit-tracker"
import * as LucideIcons from "lucide-react"

interface CreateHabitModalProps {
    className?: string
    children?: React.ReactNode
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function CreateHabitModal({
    className,
    children,
    isOpen,
    onOpenChange,
}: CreateHabitModalProps) {
    const { user } = useUser()
    const { mutate } = useSWRConfig()

    // State - use external control if provided
    const [internalOpen, setInternalOpen] = useState(false)
    const open = isOpen !== undefined ? isOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [frequency, setFrequency] = useState<HabitFrequency>(HABIT_FREQUENCIES.DAILY)
    const [targetCount, setTargetCount] = useState(1)
    const [selectedColor, setSelectedColor] = useState<HabitColor>(HABIT_COLORS.BLUE)
    const [selectedIcon, setSelectedIcon] = useState<HabitIcon>('star')
    const [formChanged, setFormChanged] = useState(false)

    // Track if a submission is in progress (to prevent duplicates)
    const isSubmittingRef = useRef(false)

    // Reset form when dialog opens/closes
    const resetForm = () => {
        setTitle("")
        setDescription("")
        setFrequency(HABIT_FREQUENCIES.DAILY)
        setTargetCount(1)
        setSelectedColor(HABIT_COLORS.BLUE)
        setSelectedIcon('star')
        setFormChanged(false)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            resetForm()
        }
        setOpen(newOpen)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isSubmittingRef.current) return
        isSubmittingRef.current = true

        try {
            if (!title.trim()) {
                toast.error("Please enter a habit title")
                isSubmittingRef.current = false
                return
            }

            if (!user?.id) {
                toast.error("Please log in to create habits")
                isSubmittingRef.current = false
                return
            }

            const habitData = {
                user_id: user.id,
                title: title.trim(),
                description: description.trim() || null,
                frequency,
                target_count: targetCount,
                color: selectedColor,
                icon: selectedIcon,
                is_active: true,
            }

            // Optimistic update - add to beginning of array
            mutate("/api/habits", async (currentData: any) => {
                if (currentData && Array.isArray(currentData)) {
                    const newHabit = {
                        ...habitData,
                        id: `temp-${Date.now()}`, // Use string prefix for temp ID
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        deleted_at: null,
                    }
                    return [newHabit, ...currentData]
                }
                return currentData || []
            }, { revalidate: false })

            const response = await fetch("/api/habits", {
                method: "POST",
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
                toast.success("Habit created successfully!")
                resetForm()
                setOpen(false)
                // Force revalidation to get fresh data from server
                await mutate("/api/habits")
            } else {
                throw new Error(result.error || "Failed to create habit")
            }
        } catch (error) {
            console.error("Error creating habit:", error)
            toast.error(`Failed to create habit: ${error instanceof Error ? error.message : "Unknown error"}`)
            // Force rollback optimistic update and revalidate
            await mutate("/api/habits")
        } finally {
            isSubmittingRef.current = false
        }
    }

    const verifyFormChanged = () => {
        setFormChanged(
            title.trim() !== "" ||
            description.trim() !== "" ||
            frequency !== HABIT_FREQUENCIES.DAILY ||
            targetCount !== 1 ||
            selectedColor !== HABIT_COLORS.BLUE ||
            selectedIcon !== 'star'
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children ? children : (
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn("whitespace-nowrap transition-transform duration-300", className)}
                    >
                        <Plus size={24} />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent 
                className="sm:max-w-[500px]"
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>Create New Habit</DialogTitle>
                </DialogHeader>
                <form id="habit-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title" className="required">Title</Label>
                        <Input
                            type="text"
                            id="title"
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
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                            id="description"
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
                            <Label htmlFor="frequency" className="required">Frequency</Label>
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
                            <Label htmlFor="targetCount" className="required">Target Count</Label>
                            <Input
                                type="number"
                                id="targetCount"
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
                        <div className="grid grid-cols-8 gap-2 mt-2 max-h-48 overflow-y-auto">
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

                    <DialogFooter>
                        <Button type="submit" disabled={!formChanged || isSubmittingRef.current}>
                            {isSubmittingRef.current ? "Creating..." : "Create Habit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}