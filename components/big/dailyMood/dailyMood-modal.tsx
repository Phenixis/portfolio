"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Angry, Frown, Laugh, Meh, Smile, SmilePlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"

export default function DailyMoodModal({

}: {

    }) {
    const { user } = useUser()
    const [open, setOpen] = useState(false)

    const handleMoodSelection = (mood: number) => {
        setOpen(false)

        fetch("/api/mood", {
            method: "POST",
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
                        toast.error("Failed to save mood");
                    })
                } else {
                    toast.success("Mood saved successfully")
                }
            })
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
                {
                    process.env.NEXT_PUBLIC_ENVIRONMENT == "development" ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                tooltip="Angry"
                                className="p-0"
                                onClick={() => handleMoodSelection(0)}
                            >
                                <Angry className="size-[30px] text-red-700" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                tooltip="Sad"
                                className="p-0"
                                onClick={() => handleMoodSelection(1)}
                            >
                                <Frown className="size-[30px] text-blue-400" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                tooltip="Meh"
                                className="p-0"
                                onClick={() => handleMoodSelection(2)}
                            >
                                <Meh className="size-[30px] text-amber-300" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                tooltip="Happy"
                                className="p-0"
                                onClick={() => handleMoodSelection(3)}
                            >
                                <Smile className="size-[30px] text-green-400" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                tooltip="Very Happy"
                                className="p-0"
                                onClick={() => handleMoodSelection(4)}
                            >
                                <Laugh className="size-[30px] text-green-800" />
                            </Button>
                        </>
                    ) : (
                        <p>
                            Feature in development.<br />Tell me what you think about it <a
                                href="mailto:max@maximeduhamel.com?subject=Feature%20in%20development%3A%20Daily%20Moods"
                                className="text-blue-500 underline"
                            >
                                by email
                            </a>.
                        </p>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}