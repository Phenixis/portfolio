import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { useDebouncedCallback } from "use-debounce"
import { cn } from "@/lib/utils"
import { NOTE_PARAMS } from "@/components/big/notes/notes-card"
import { useRouter, useSearchParams } from "next/navigation"

export default function SearchNotes({
    title,
    setTitle,
    defaultValue,
    className,
    label
}: {
    title: string
    setTitle: (title: string) => void
    defaultValue: string
    className?: string
    label?: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [titleInputValue, setTitleInputValue] = useState<string>(defaultValue)

    const debouncedSetTitle = useDebouncedCallback((value: string) => {
        setTitle(value)
    }, 200)

    useEffect(() => {
        setTitleInputValue(title)
    }, [title])

    useEffect(() => {
        debouncedSetTitle(titleInputValue)
    }, [titleInputValue, debouncedSetTitle])

    useEffect(() => {
        if (title !== "") {
            const params = new URLSearchParams(searchParams.toString())
            params.set(NOTE_PARAMS["TITLE"], title)
            router.push(`?${params.toString()}`)
        } else {
            const params = new URLSearchParams(searchParams.toString())
            params.delete(NOTE_PARAMS["TITLE"])
            router.push(`?${params.toString()}`)
        }
    }, [title])

    return (
        <div className={cn("w-full", className)}>
            <Label className="text-nowrap">
                {label || "Search notes by title"}
            </Label>
            <Input
                value={titleInputValue}
                onChange={(e) => setTitleInputValue(e.target.value)}
            />
        </div>
    )
}