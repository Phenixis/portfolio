"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Angry, Frown, Laugh, Meh, Smile, SmilePlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { useDailyMoods } from "@/hooks/use-daily-moods"
import { DailyMoodColors } from "@/components/ui/calendar"
import { useSWRConfig } from "swr"
import { DailyMood } from "@/lib/db/schema"

export default function DailyMoodModal({ date }: { date?: Date }) {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    // Use the passed date or fallback to today
    const targetDate = date || new Date()
    const normalizedDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0)
    const nextDay = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), normalizedDate.getDate() + 1, 0, 0, 0)
    const { mutate } = useSWRConfig()

    const { data: dailyMoods, mutate: mutateDailyMoods } = useDailyMoods({
        startDate: normalizedDate,
        endDate: nextDay,
    })

    // Get current mood for the target date
    const currentMood = dailyMoods && dailyMoods.length > 0 ? dailyMoods[0].mood : null

    // Function to get mood icon based on mood value
    const getMoodIcon = (mood: number | null) => {
        switch (mood) {
            case 0:
                return <Angry className="min-w-[24px] max-w-[24px] min-h-[24px] text-red-700" />
            case 1:
                return <Frown className="min-w-[24px] max-w-[24px] min-h-[24px] text-blue-400" />
            case 2:
                return <Meh className="min-w-[24px] max-w-[24px] min-h-[24px] text-amber-300" />
            case 3:
                return <Smile className="min-w-[24px] max-w-[24px] min-h-[24px] text-green-400" />
            case 4:
                return <Laugh className="min-w-[24px] max-w-[24px] min-h-[24px] text-green-800" />
            default:
                return <SmilePlus className="min-w-[24px] max-w-[24px] min-h-[24px]" />
        }
    }

    const handleMoodSelection = (mood: number) => {
        // Prevent mood selection for future dates
        if (isFutureDate()) {
            toast.error("Cannot set mood for future dates")
            return
        }

        setOpen(false)
        const method = dailyMoods.length == 0 ? "POST" : dailyMoods[0].mood == mood ? "DELETE" : "PUT"
        
        // Generate monthly query key for calendar optimistic updates (using same logic as useFilteredData)
        const monthStart = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1)
        const monthEnd = new Date(normalizedDate.getFullYear(), normalizedDate.getMonth() + 1, 0)
        const monthlyParams = new URLSearchParams()
        monthlyParams.append('startDate', monthStart.toISOString())
        monthlyParams.append('endDate', monthEnd.toISOString())
        const monthlyQueryKey = `/api/mood?${monthlyParams.toString()}`

        console.log('Optimistic update keys:', {
            dailyQueryKey: 'useDailyMoods specific key',
            monthlyQueryKey,
            globalKey: '/api/mood'
        })

        // Optimistic update for current query (specific date range)
        mutateDailyMoods((prevData: DailyMood[] | undefined) => {
            if (method === "POST") {
                const newMood: DailyMood = { 
                    mood: mood, 
                    date: normalizedDate, 
                    created_at: new Date(), 
                    comment: "", 
                    id: Date.now(), // Temporary ID for optimistic update
                    user_id: user?.id || "", 
                    updated_at: new Date(), 
                    deleted_at: null 
                }
                return [newMood, ...(prevData || [])]
            }
            if (prevData !== undefined && Array.isArray(prevData)) {
                if (method === "PUT") {
                    return prevData.map((item: DailyMood) => {
                        // Compare dates properly for optimistic update
                        const itemDate = new Date(item.date)
                        const targetDate = new Date(normalizedDate)
                        if (itemDate.toDateString() === targetDate.toDateString()) {
                            return { ...item, mood: mood, updated_at: new Date() }
                        }
                        return item
                    })
                } else if (method === "DELETE") {
                    return prevData.filter((item: DailyMood) => {
                        const itemDate = new Date(item.date)
                        const targetDate = new Date(normalizedDate)
                        return itemDate.toDateString() !== targetDate.toDateString()
                    })
                }
            }
            return prevData
        }, { revalidate: false })

        // Optimistic update for calendar monthly query (for calendar component)
        mutate(monthlyQueryKey, (prevData: DailyMood[] | undefined) => {
            if (method === "POST") {
                const newMood: DailyMood = { 
                    mood: mood, 
                    date: normalizedDate, 
                    created_at: new Date(), 
                    comment: "", 
                    id: Date.now(), // Temporary ID for optimistic update
                    user_id: user?.id || "", 
                    updated_at: new Date(), 
                    deleted_at: null 
                }
                return [newMood, ...(prevData || [])]
            }
            if (prevData !== undefined && Array.isArray(prevData)) {
                if (method === "PUT") {
                    return prevData.map((item: DailyMood) => {
                        const itemDate = new Date(item.date)
                        const targetDate = new Date(normalizedDate)
                        if (itemDate.toDateString() === targetDate.toDateString()) {
                            return { ...item, mood: mood, updated_at: new Date() }
                        }
                        return item
                    })
                } else if (method === "DELETE") {
                    return prevData.filter((item: DailyMood) => {
                        const itemDate = new Date(item.date)
                        const targetDate = new Date(normalizedDate)
                        return itemDate.toDateString() !== targetDate.toDateString()
                    })
                }
            }
            return prevData
        }, { revalidate: false })

        // Optimistic update for global cache (for calendar component)
        mutate("/api/mood", (prevData: DailyMood[] | undefined) => {
            if (method === "POST") {
                const newMood: DailyMood = { 
                    mood: mood, 
                    date: normalizedDate, 
                    created_at: new Date(), 
                    comment: "", 
                    id: Date.now(), // Temporary ID for optimistic update
                    user_id: user?.id || "", 
                    updated_at: new Date(), 
                    deleted_at: null 
                }
                return [newMood, ...(prevData || [])]
            }
            if (prevData !== undefined && Array.isArray(prevData)) {
                if (method === "PUT") {
                    return prevData.map((item: DailyMood) => {
                        const itemDate = new Date(item.date)
                        const targetDate = new Date(normalizedDate)
                        if (itemDate.toDateString() === targetDate.toDateString()) {
                            return { ...item, mood: mood, updated_at: new Date() }
                        }
                        return item
                    })
                } else if (method === "DELETE") {
                    return prevData.filter((item: DailyMood) => {
                        const itemDate = new Date(item.date)
                        const targetDate = new Date(normalizedDate)
                        return itemDate.toDateString() !== targetDate.toDateString()
                    })
                }
            }
            return prevData
        }, { revalidate: false })

        // Make API call
        fetch("/api/mood", {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.api_key || ""}`,
            },
            body: JSON.stringify({
                mood: mood,
                date: normalizedDate.toISOString(),
            }),
        })
            .then(response => {
                if (!response.ok) {
                    // Rollback optimistic updates on error
                    mutateDailyMoods()
                    mutate("/api/mood")
                    mutate(monthlyQueryKey)
                    
                    response.json().then(data => {
                        const errorMessage = data?.error || "Failed to save mood";
                        toast.error(errorMessage);
                    }).catch(() => {
                        toast.error(`Failed to ${method === "POST" ? "save" : method === "PUT" ? "update" : "delete"} mood`);
                    })
                } else {
                    toast.success(`Mood ${method === "POST" ? "saved" : method === "PUT" ? "updated" : "deleted"} successfully`)
                    // Revalidate to get the actual server data
                    mutateDailyMoods()
                    mutate("/api/mood")
                    mutate(monthlyQueryKey)
                }
            })
            .catch(() => {
                // Rollback optimistic updates on network error
                mutateDailyMoods()
                mutate("/api/mood")
                mutate(monthlyQueryKey)
                toast.error(`Failed to ${method === "POST" ? "save" : method === "PUT" ? "update" : "delete"} mood`);
            })
    }

    // Helper function to determine if the date is today
    const isToday = () => {
        const today = new Date()
        return normalizedDate.toDateString() === today.toDateString()
    }

    // Helper function to determine if the date is in the future
    const isFutureDate = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Normalize today to start of day
        return normalizedDate > today
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen} modal>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`h-10 px-2 flex items-center border-none w-fit text-xs ${currentMood !== null ? DailyMoodColors[currentMood] : ""} ${isFutureDate() ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isFutureDate()}
                >
                    {getMoodIcon(currentMood)}
                    <p className="hidden">
                        {isFutureDate() 
                            ? `Cannot set mood for future date: ${normalizedDate.toLocaleDateString()}`
                            : isToday() 
                                ? "What's your mood today?" 
                                : `Mood for ${normalizedDate.toLocaleDateString()}`
                        }
                    </p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-0 w-fit flex flex-row space-x-4 p-2" side="top">
                <Button
                    variant="ghost"
                    size="icon"
                    tooltip="Angry"
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 0 ? 0 : -1]} ${isFutureDate() ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleMoodSelection(0)}
                    disabled={isFutureDate()}
                >
                    <Angry className="size-[30px] text-red-700" />
                    <p className="text-xs md:hidden">
                        Angry
                    </p>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    tooltip="Sad"
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 1 ? 1 : -1]} ${isFutureDate() ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleMoodSelection(1)}
                    disabled={isFutureDate()}
                >
                    <Frown className="size-[30px] text-blue-400" />
                    <p className="text-xs md:hidden">
                        Sad
                    </p>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    tooltip="Meh"
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 2 ? 2 : -1]} ${isFutureDate() ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleMoodSelection(2)}
                    disabled={isFutureDate()}
                >
                    <Meh className="size-[30px] text-amber-300" />
                    <p className="text-xs md:hidden">
                        Meh
                    </p>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    tooltip="Happy"
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 3 ? 3 : -1]} ${isFutureDate() ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleMoodSelection(3)}
                    disabled={isFutureDate()}
                >
                    <Smile className="size-[30px] text-green-400" />
                    <p className="text-xs md:hidden">
                        Happy
                    </p>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    tooltip="Amazing"
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 4 ? 4 : -1]} ${isFutureDate() ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleMoodSelection(4)}
                    disabled={isFutureDate()}
                >
                    <Laugh className="size-[30px] text-green-800" />
                    <p className="text-xs md:hidden">
                        Amazing
                    </p>
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}