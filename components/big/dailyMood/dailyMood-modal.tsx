"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Angry, Frown, Laugh, Meh, Smile, SmilePlus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { useDailyMoods } from "@/hooks/use-daily-moods"
import { DailyMoodColors } from "@/components/ui/calendar"
import { useSWRConfig } from "swr"
import { isArray } from "util"
import { DailyMood } from "@/lib/db/schema"

export default function DailyMoodModal({

}: {

    }) {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0)
    const { mutate } = useSWRConfig()

    const { data: dailyMoods, isLoading: isLoadingDailyMoods, isError: isErrorDailyMoods } = useDailyMoods({
        startDate: today,
        endDate: tomorrow,
    })

    const handleMoodSelection = (mood: number) => {
        setOpen(false)
        const method = dailyMoods.length == 0 ? "POST" : dailyMoods[0].mood == mood ? "DELETE" : "PUT"

        mutate("/api/mood", (prevData: any) => {
            if (method === "POST") {
                return [{ mood: mood, date: today, created_at: new Date(), comment: "", id: -1, user_id: user?.id, updated_at: new Date(), deleted_at: null } as DailyMood, ...(prevData !== undefined && Array.isArray(prevData) ? prevData : [])]
            }
            if (prevData !== undefined && Array.isArray(prevData)) {
                if (method === "PUT") {
                    return prevData.map((item: any) => item.date === today.toISOString() ? { ...item, mood: mood } : item)
                } else if (method === "DELETE") {
                    return prevData.filter((item: any) => item.date !== today.toISOString())
                }
            }
            return prevData
        }
            , {
                revalidate: false,
            })

        fetch("/api/mood", {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.api_key || ""}`,
            },
            body: JSON.stringify({
                mood: mood,
                date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).toISOString(),
            }),
        })
            .then(response => {
                if (!response.ok) {
                    response.json().then(data => {
                        const errorMessage = data?.error || "Failed to save mood";
                        toast.error(errorMessage);
                    }).catch(() => {
                        toast.error(`Failed to ${method === "POST" ? "save" : method === "PUT" ? "update" : "delete"} mood`);
                    })
                } else {
                    toast.success(`Mood ${method === "POST" ? "saved" : method === "PUT" ? "updated" : "deleted"} successfully`)
                }
            })

        mutate("/api/mood")
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen} modal>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-10 px-2 flex items-center border-none w-fit text-xs"
                >
                    <SmilePlus className="min-w-[24px] max-w-[24px] min-h-[24px]" />
                    <p className="hidden">
                        What's your mood today ?
                    </p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-0 w-fit flex flex-row space-x-4 p-2" side="top">
                <Button
                    variant="ghost"
                    size="icon"
                    tooltip="Angry"
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 0 ? 0 : -1]}`}
                    onClick={() => handleMoodSelection(0)}
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
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 1 ? 1 : -1]}`}
                    onClick={() => handleMoodSelection(1)}
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
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 2 ? 2 : -1]}`}
                    onClick={() => handleMoodSelection(2)}
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
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 3 ? 3 : -1]}`}
                    onClick={() => handleMoodSelection(3)}
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
                    className={`p-0 flex flex-col gap-0 ${DailyMoodColors[dailyMoods[0]?.mood === 4 ? 4 : -1]}`}
                    onClick={() => handleMoodSelection(4)}
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